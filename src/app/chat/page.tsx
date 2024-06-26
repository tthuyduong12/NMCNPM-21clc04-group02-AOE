/* eslint-disable @next/next/no-img-element */
'use client'
import SideBar from "@/components/layout/sideBar"
import Header from "@/components/layout/header"
import Iuser from "@/components/icons/icon_user"
import React, { SyntheticEvent, useEffect, useState, ReactElement, useRef } from "react"
import Image from "next/image"
import Select from "react-select";
import Ixmark from "@/components/icons/icon_xmark"
import moment from 'moment';
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index'
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import IcircleXmark from "@/components/icons/icon_circle_xmark"
import Fab from "@mui/material/Fab";
import CheckIcon from "@mui/icons-material/Check";
import { green, red } from "@mui/material/colors";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Isend from "@/components/icons/icon_send"
import ReactAudioPlayer from "react-audio-player"
import IfileCirclePlus from "@/components/icons/icon_fileCirclePlus"

export default function Chat() {
    const [message, setMessage] = useState('')
    const [receiver, setReceiver] = useState('')
    const [content, setContent] = useState('')
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [date, setDate] = useState(Date.now());
    const [file, setFile] = useState('');
    const [fileType, setFileType] = useState('');

    const [message_sent, SetMessageSent] = useState([]);
    const [message_received, SetMessageReceived] = useState([]);
    const [image, setImage] = useState("")
    const [error, setError] = useState(false)


    const handleChangeReceiver = (ev) => {
        setReceiver(ev.value);
    };

    const handleDeleteImage = () => {
        setFile("")
        setImage('')
    }

    useEffect(() => {
        localStorage.setItem('sidebar', 3)
        fetch('/api/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: localStorage.getItem("userName"), method: 'getList' }),
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                SetMessageSent(data.combinedSentMessages)
                SetMessageReceived(data.combinedReceivedMessages)
            })
            .catch(error => console.error('Error:', error));

        fetch('/api/user')
            .then(res => res.json())
            .then(data => {
                setTeachers(data.teachers)
                setStudents(data.students)
            })
    }, []);

    const allUsers = [...teachers, ...students];
    const filteredUsers = allUsers.filter(user => user.phone !== localStorage.getItem("userName"));

    const optionReceivers = filteredUsers.map(
        function (user) {
            return {
                value: user.phone,
                label: user.phone + " - " + user.name
            }
        }
    );


    const handleChangeFile = (event) => {
        const selectedFile = event.target.files[0];
        console.log(selectedFile)
        setImage(selectedFile)
        setFile(URL.createObjectURL(selectedFile))
        setFileType(selectedFile.name)
    }

    async function handleFormSubmit(ev: SyntheticEvent) {
        ev.preventDefault()

        let fileSave = ''
        const data = new FormData()
        data.append("file", image)
        data.append("folder", "audio")
        data.append("resource_type", "auto")
        data.append("upload_preset", "introSE")
        data.append("cloud_name", "dzdmbflvk")

        await fetch("https://api.cloudinary.com/v1_1/dzdmbflvk/image/upload", {
            method: "post",
            body: data
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                console.log(data);
                fileSave = data.url
            }).catch((err) => {
                console.log(err);
            })

        const response = await fetch('/api/message', {
            method: 'POST',
            body: JSON.stringify({ sender: localStorage.getItem('userName'), receiver, content, file: fileSave, method: 'add' }),
            headers: { 'Content-Type': 'application/json' },
        })
        if (!response.ok) {
            setError(true)
        }
        setTimeout(() => {
            window.location.reload(true);
        }, 2000);
    }
    // //window.location.reload(true);


    const [contentChat, setContentChat] = useState<ReactElement | null>(null);
    const [selectedButton, setSelectedButton] = useState<number | null>(1);
    const [showLargeImage, setShowLargeImage] = useState(false);

    const handleClick = () => {
        setShowLargeImage(!showLargeImage);
    };

    const popupRef = useRef();
    const handleButtonClick = (buttonNumber: number) => {
        setSelectedButton(buttonNumber);
    };

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    //Function for add
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const timer = React.useRef<number>();

    const buttonSx = {
        ...((success && !error) && {
            bgcolor: green[500],
            "&:hover": {
                bgcolor: green[700],
            },
        }),
        ...((success && error) && {
            bgcolor: red[500],
            "&:hover": {
                bgcolor: red[700],
            },
        }),

    };

    React.useEffect(() => {
        setError(false)
        setSuccess(false)
        return () => {
            clearTimeout(timer.current);
        };
    }, []);

    const handleButtonSend = (ev) => {
        if (!loading) {
            setSuccess(false);
            setLoading(true);
            timer.current = window.setTimeout(() => {
                setSuccess(true);
                setLoading(false);
            }, 1500);
        }
    };

    const audioTail = ['mp3', 'wav']
    const imgTail = ['jpg', 'png', 'jpeg']

    return (
        <>
            <Header />
            <div className="flex">
                <SideBar />
                <div className="ml-14 w-2/3">
                    <div className="mb-4 mt-4 font-poppins font-bold text-5xl border-b border-black pb-2">
                        Chat
                    </div>
                    <div className="bg-white rounded pb-10">
                        <div className="mt-6 grid grid-cols-2">
                            {/* left side */}
                            <div className="border-r-2 border-black mt-6 ml-9">
                                <button
                                    onClick={() => handleButtonClick(1)}
                                    className={`hover:bg-sky-200 text-black hover:text-white text-base font-medium px-4 py-2 rounded-lg border border-zinc-300 ${selectedButton === 1 ? 'bg-sky-400' : ''}`}>
                                    Chat received
                                </button>

                                <button
                                    onClick={() => handleButtonClick(2)}
                                    className={`ml-6 hover:bg-sky-200 text-black hover:text-white text-base font-medium px-4 py-2 rounded-lg border border-zinc-300 ${selectedButton === 2 ? 'bg-sky-400' : ''}`}>
                                    Chat sent
                                </button>

                                <div className="mt-6 h-[450px] overflow-y-auto">
                                    {selectedButton === 2 ?
                                        <>
                                            {message_sent.map((mes_send, i) => (
                                                <div key={i}>
                                                    <div className="bg-zinc-300 rounded-lg mr-8 mt-3 grid grid-cols-2 pb-1">
                                                        <div>
                                                            <div className="flex items-center pl-7 pt-4">
                                                                {((mes_send.receiver_avatar === null) || (mes_send.receiver_avatar === undefined) || (mes_send.receiver_avatar === '')) ?
                                                                    <Iuser className="w-10 fill-zinc-400 mr-2" /> :
                                                                    <img
                                                                        className="w-[3em] h-[3em] rounded-full border border-black"
                                                                        src={mes_send.receiver_avatar}
                                                                        alt="" />}
                                                                <p className="text-black text-sm font-semibold font-['Poppins'] ml-4">{mes_send.receiver_name}</p>
                                                            </div>

                                                            <div className="ml-6 mt-2 font-semibold text-sm text-gray-400">
                                                                Send date: {moment.utc(mes_send.sentDate).format('DD/MM/YYYY')}
                                                            </div>
                                                        </div>
                                                        
                                                            <Popup ref={popupRef} trigger={<div className="text-zinc-500 w-fit h-fit text-sm font-semibold pl-7 mt-10 hover:underline cursor-pointer">
                                                                {(mes_send.content.length <= 20 ?
                                                                    <div>
                                                                        <Grid item>
                                                                            <Tooltip disableFocusListener disableTouchListener title="Click to read full">
                                                                                <div>{mes_send.content}</div>
                                                                            </Tooltip>
                                                                        </Grid>
                                                                    </div> :
                                                                    <div>
                                                                        <Grid item>
                                                                            <Tooltip disableFocusListener disableTouchListener title="Click to read full">
                                                                                <div>{mes_send.content.substring(0, 20)}...</div>
                                                                            </Tooltip>
                                                                        </Grid>
                                                                    </div>)}
                                                            </div>}
                                                                position="right top"
                                                                contentStyle={{ right: '20px', margin: '0 0 0 10px' }}>
                                                                <div className="bg-zinc-200 w-60 h-60 rounded-lg px-2 py-2">
                                                                    <div className="bg-white rounded-lg pl-2 py-2 h-full overflow-y-auto"
                                                                        style={{ wordWrap: 'break-word' }}>
                                                                        {mes_send.content}
                                                                        {((mes_send.attachedFile === null) || (mes_send.attachedFile === "") || (mes_send.attachedFile === undefined)) ? null :
                                                                            <div className="mt-6">
                                                                                <img
                                                                                    src={mes_send.attachedFile}
                                                                                    alt="Cannot load"
                                                                                    onClick={handleClick}
                                                                                    style={{
                                                                                        width: showLargeImage ? '70%' : 'auto',
                                                                                        height: showLargeImage ? '70vh' : 'auto',
                                                                                        objectFit: 'contain',
                                                                                        position: showLargeImage ? 'fixed' : 'static',
                                                                                        margin: 'auto',
                                                                                        display: 'flex',
                                                                                        left: '50%',
                                                                                        top: '50%',
                                                                                        transform: showLargeImage ? 'translate(-50%, -50%)' : 'none',
                                                                                        zIndex: showLargeImage ? 2 : 'auto',
                                                                                        transition: '0.5s',
                                                                                    }}
                                                                                />
                                                                                {showLargeImage && (
                                                                                    <div
                                                                                        style={{
                                                                                            position: 'fixed',
                                                                                            top: 0,
                                                                                            left: 0,
                                                                                            width: '100%',
                                                                                            height: '100%',
                                                                                            background: 'rgba(0, 0, 0, 0.7)', // Điều này tạo ra một lớp đen với độ mờ là 0.7
                                                                                            zIndex: 1, // Đặt z-index để nó hiển thị phía trên ảnh, nhưng đằng sau nó
                                                                                        }}
                                                                                    />
                                                                                )}
                                                                            </div>
                                                                            }
                                                                    </div>
                                                                </div>
                                                            </Popup>
                                                        
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                        :
                                        <>
                                            {message_received.map((mes_receive, i) => (
                                                <div key={i}>
                                                    <div className="bg-zinc-300 rounded-lg mr-8 mt-3 grid grid-cols-2 pb-1">
                                                        <div>
                                                            <div className="flex items-center pl-7 pt-4">
                                                                {((mes_receive.sender_avatar === null) || (mes_receive.sender_avatar === undefined) || (mes_receive.sender_avatar === '')) ?
                                                                    <Iuser className="w-10 fill-zinc-400 mr-2" /> :
                                                                    <img
                                                                        className="w-[3em] h-[3em] rounded-full border border-black"
                                                                        src={mes_receive.sender_avatar}
                                                                        alt="" />}
                                                                <p className="text-black text-sm font-semibold font-['Poppins'] ml-4">{mes_receive.sender_name}</p>
                                                            </div>

                                                            <div className="ml-6 mt-2 font-semibold text-sm text-gray-400">
                                                                Send date: {moment.utc(mes_receive.sentDate).format('DD/MM/YYYY')}
                                                            </div>
                                                        </div>
                                                        

                                                            <Popup trigger={<div className="text-zinc-500 w-fit h-fit text-sm font-semibold pl-7 mt-10 hover:underline cursor-pointer">
                                                                {(mes_receive.content.length <= 20 ?
                                                                    <div>
                                                                        <Grid item>
                                                                            <Tooltip disableFocusListener disableTouchListener title="Click to read full">
                                                                                <div>{mes_receive.content}</div>
                                                                            </Tooltip>
                                                                        </Grid>

                                                                    </div> :
                                                                    <div>
                                                                        <Grid item>
                                                                            <Tooltip disableFocusListener disableTouchListener title="Click to read full">
                                                                                <div>{mes_receive.content.substring(0, 20)}...</div>
                                                                            </Tooltip>
                                                                        </Grid>
                                                                    </div>)}
                                                            </div>}
                                                                position="right top"
                                                                contentStyle={{ right: '20px', margin: '0 0 0 10px' }}>
                                                                <div className="bg-zinc-200 w-60 h-60 rounded-lg px-2 py-2">
                                                                    <div className="bg-white rounded-lg pl-2 py-2 h-full overflow-y-auto"
                                                                        style={{ wordWrap: 'break-word' }}>
                                                                        {mes_receive.content}
                                                                        {((mes_receive.attachedFile !== null) && (mes_receive.attachedFile !== "") && (mes_receive.attachedFile !== undefined)) ?
                                                                            <div className="mt-6">
                                                                                <img
                                                                                    src={mes_receive.attachedFile}
                                                                                    alt="Cannot load"
                                                                                    onClick={handleClick}
                                                                                    style={{
                                                                                        width: showLargeImage ? '70%' : 'auto',
                                                                                        height: showLargeImage ? '70vh' : 'auto',
                                                                                        objectFit: 'contain',
                                                                                        position: showLargeImage ? 'fixed' : 'static',
                                                                                        margin: 'auto',
                                                                                        display: 'flex',
                                                                                        left: '50%',
                                                                                        top: '50%',
                                                                                        transform: showLargeImage ? 'translate(-50%, -50%)' : 'none',
                                                                                        zIndex: showLargeImage ? 2 : 'auto',
                                                                                        transition: '0.5s',
                                                                                    }}
                                                                                />
                                                                                {showLargeImage && (
                                                                                    <div
                                                                                        style={{
                                                                                            position: 'fixed',
                                                                                            top: 0,
                                                                                            left: 0,
                                                                                            width: '100%',
                                                                                            height: '100%',
                                                                                            background: 'rgba(0, 0, 0, 0.7)', // Điều này tạo ra một lớp đen với độ mờ là 0.7
                                                                                            zIndex: 1, // Đặt z-index để nó hiển thị phía trên ảnh, nhưng đằng sau nó
                                                                                        }}
                                                                                    />
                                                                                )}
                                                                            </div>
                                                                            : null}
                                                                    </div>
                                                                </div>
                                                            </Popup>
                                                        
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                    }
                                </div>
                            </div>

                            {/* Right side */}
                            <div className="bg-zinc-100 rounded-lg border border-neutral-400 mt-6 mr-7 ml-8">
                                <div className="flex items-center justify-center">
                                    <p className="mt-8 text-black text-2xl font-bold leading-tight tracking-tight">Send message</p>
                                </div>
                                <div className="mt-6 ml-7">
                                    <p className="text-black text-base font-medium leading-tight tracking-tight">Choose receiver (*)</p>
                                    {/* Dropdown list */}
                                    <Select options={optionReceivers} onChange={handleChangeReceiver}
                                        className="w-[380px] mt-2 mr-3" placeholder="Select receiver" />
                                </div>

                                <div className="mt-12 ml-6 mr-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-black text-base font-medium">Content (*)</p>

                                        <Button onChange={handleChangeFile} component="label" startIcon={<IfileCirclePlus className="w-[1em] fill-black"/>} >
                                            <div className="font-semibold text-xs text-black">Add File</div>
                                            <VisuallyHiddenInput type="file" accept="auto" />
                                        </Button>
                                    </div>
                                    <textarea className="w-full rounded-lg border border-zinc-400 p-3 focus:outline-none mt-2"
                                        placeholder="Type content..." onChange={ev => setContent(ev.target.value)}></textarea>
                                </div>
                                {(file !== '') ?
                                    <>
                                        <div className="flex items-center justify-end mr-6">
                                            <button onClick={handleDeleteImage}>
                                                <IcircleXmark className="w-[1.5em]" />
                                            </button>
                                        </div>
                                        {imgTail.includes(fileType.substring(fileType.lastIndexOf('.') + 1)) ?
                                            <div className="bg-white w-[380px] h-[200px] rounded-md border border-zinc-400 ml-7 pl-2 py-1 overflow-y-auto">
                                            <Image
                                                src={file}
                                                width={380}
                                                height={200} alt={""} />
                                        </div> : ((audioTail.includes(fileType.substring(fileType.lastIndexOf('.') + 1))) ?
                                            <div>
                                            <div>File listening</div>
                                            <ReactAudioPlayer
                                                src={file}
                                                controls
                                                className="w-full"
                                            />
                                        </div> : 
                                        <div className="border border-zinc-300 px-2 py-2">
                                        <a style={{ wordWrap: 'break-word' }} href={file}>{file}</a>
                                    </div>)}
                                        
                                    </> : null}

                                <div className="flex mt-8 mr-4 justify-end pb-8">
                                    <Grid item>
                                        <Tooltip disableFocusListener disableTouchListener title="Click to send">
                                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                                <Box sx={{ m: 1, position: "relative" }}>
                                                    <Fab
                                                        aria-label="save"
                                                        color="primary"
                                                        sx={buttonSx}
                                                        onClick={(ev) => { handleButtonSend(ev); handleFormSubmit(ev) }}
                                                    >
                                                        {success ? (!error ? <CheckIcon /> : <Ixmark /> )  : <Isend />}
                                                    </Fab>
                                                    {loading && (
                                                        <CircularProgress
                                                            size={68}
                                                            sx={{
                                                                color: green[500],
                                                                position: "absolute",
                                                                top: -6,
                                                                left: -6,
                                                                zIndex: 1,
                                                            }}
                                                        />
                                                    )}
                                                </Box>
                                            </Box>
                                        </Tooltip>
                                    </Grid>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

function setError(arg0: boolean) {
    throw new Error("Function not implemented.")
}
