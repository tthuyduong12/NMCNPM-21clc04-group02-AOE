/* eslint-disable react/jsx-key */
'use client'

import SideBar from "@/components/layout/sideBar"
import Header from "@/components/layout/header"
import Link from "next/link"
import Ieye from "@/components/icons/eye"
import IfileDelete from "@/components/icons/icon_file_delete"
import { ReactElement, useState, useEffect, useRef } from "react"
import Select from "react-select";
import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import ItripleBar from "@/components/icons/icon_triple_bars"
import SpeedDialAction from "@mui/material/SpeedDialAction";
import { useRouter } from "next/navigation";
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index'
import Ixmark from "@/components/icons/icon_xmark"
import Iplus from "@/components/icons/icon_plus";

export default function Exercise_bank() {
    const [selectedButton, setSelectedButton] = useState<number | null>(1);
    const [resetKey, setResetKey] = useState(0);

    const [exercises, setExercises] = useState([])
    const [exerciseList, setExerciseList] = useState([])

    const [currentEx3, setCurrentEx] = useState([])
    const [currentExList3, setCurrentExList] = useState([])

    const [currentFilteredEx, setCurrentFilteredEx] = useState([])
    const [currentFilteredExList, setCurrentFilteredExList] = useState([])

    var [length, setLength] = useState(Number)
    const router = useRouter()
    const [currentPage, setCurrentPage] = useState(1);

    const exPerPage = 6;
    var currentEx: any[]
    currentEx = exercises.slice((currentPage - 1) * exPerPage, currentPage * exPerPage);
    var currentEx2: any[]
    var filteredEx: any[]


    var currentExList: any[]
    currentExList = exerciseList.slice((currentPage - 1) * exPerPage, currentPage * exPerPage);
    var currentExList2: any[]
    var filteredExList: any[]

    const handleButtonClick = (buttonNumber: number) => {
        setSelectedButton(buttonNumber);
        setCurrentPage(1)
        if(buttonNumber === 2){
            setLength(currentFilteredExList.length)
        }
        else{
            setLength(currentFilteredEx.length)
        }
    };


    const handleChangeRemoveF = (ev) => {
        if (selectedButton === 2) {
            setLength(exerciseList.length)
        }
        else {
            setLength(exercises.length)

        }
        localStorage.setItem('skill_filter', '')
        localStorage.setItem('module_filter', '')
        setCurrentFilteredEx(exercises)
        setCurrentFilteredExList(exerciseList)

        setResetKey((prevKey) => prevKey + 1);
        setCurrentPage(1)
    };

    const handleSkillFilter = (ev) => {
        console.log(ev)
        setCurrentPage(1)

        localStorage.setItem('skill_filter', ev.value)
        if (localStorage.getItem('module_filter') === 'IELTS' || localStorage.getItem('module_filter') === 'TOEFL' || localStorage.getItem('module_filter') === 'TOEIC') {
            filteredEx = exercises
                .filter(ex => ex.skill == localStorage.getItem('skill_filter'))
                .filter(ex => ex.module == localStorage.getItem('module_filter'))

            filteredExList = exerciseList
                .filter(ex => ex.skill == localStorage.getItem('skill_filter'))
                .filter(ex => ex.module == localStorage.getItem('module_filter'))
        }
        else {
            filteredEx = exercises
                .filter(ex => ex.skill == localStorage.getItem('skill_filter'))

            filteredExList = exerciseList
                .filter(ex => ex.skill === localStorage.getItem('skill_filter'))
        }

        currentExList2 = filteredExList.slice(0, exPerPage);
        setCurrentFilteredExList(filteredExList)
        setCurrentExList(currentExList2)

        currentEx2 = filteredEx.slice(0, exPerPage);
        setCurrentFilteredEx(filteredEx)
        setCurrentEx(currentEx2)

        if (selectedButton === 2) {
            setLength(filteredExList.length)
        }
        else {
            setLength(filteredEx.length)
        }
    }

    const handleModuleFilter = (ev) => {
        console.log(exerciseList)
        setCurrentPage(1)

        localStorage.setItem('module_filter', ev.value)
        console.log(localStorage.getItem('module_filter'))
        if (localStorage.getItem('skill_filter') === 'Listening' || localStorage.getItem('skill_filter') === 'Speaking' || localStorage.getItem('skill_filter') === 'Reading' || localStorage.getItem('skill_filter') === 'Writing') {
            filteredEx = exercises
                .filter(ex => ex.skill == localStorage.getItem('skill_filter'))
                .filter(ex => ex.module == localStorage.getItem('module_filter'))

            filteredExList = exerciseList
                .filter(ex => ex.skill == localStorage.getItem('skill_filter'))
                .filter(ex => ex.module == localStorage.getItem('module_filter'))
        }
        else {
            filteredEx = exercises
                .filter(ex => ex.module === localStorage.getItem('module_filter'))

            filteredExList = exerciseList
                .filter(ex => ex.module === localStorage.getItem('module_filter'))
        }

        currentExList2 = filteredExList.slice(0, exPerPage);
        setCurrentFilteredExList(filteredExList)
        setCurrentExList(currentExList2)

        currentEx2 = filteredEx.slice(0, exPerPage);
        setCurrentFilteredEx(filteredEx)
        setCurrentEx(currentEx2)

        if (selectedButton === 2) {
            setLength(filteredExList.length)
        }
        else {
            setLength(filteredEx.length)
        }

    }

    const handlePageChange = (index: number) => {
        setCurrentPage(index)
        if (selectedButton === 2) {
            currentExList2 = currentFilteredExList.slice((index - 1) * exPerPage, index * exPerPage);
            setCurrentExList(currentExList2)
        }
        else {
            currentEx2 = currentFilteredEx.slice((index - 1) * exPerPage, index * exPerPage),
            setCurrentEx(currentEx2)
        }
    }

    async function handleDelete(ev: SyntheticEvent) {
        ev.preventDefault()
        const response = await fetch('/api/exercise', {
            method: 'POST',
            body: JSON.stringify({ ex_id: localStorage.getItem('exerciseID'), method: 'delete' }),
            headers: { 'Content-Type': 'application/json' },
        })
        window.location.reload(true);
    }

    useEffect(() => {
        localStorage.setItem('sidebar', 1)
        localStorage.setItem('module_filter', '')
        localStorage.setItem('skill_filter', '')

        fetch('/api/exercise')
            .then(res => res.json())
            .then(data => {
                setExercises(data)
                setCurrentFilteredEx(data)
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });

        if (localStorage.getItem('userType') === 'Student') {
            fetch('/api/exercise', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: localStorage.getItem("userName"), method: 'getDoneList' }),
            })
                .then(res => res.json())
                .then(data => {
                    setExerciseList(data)
                    setCurrentFilteredExList(data)
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }
        

    }, []);


    const handleActionClick = (link) => {
        router.push(link);
    };


    const actions = [
        { icon: <Ieye />, name: "View Exercise", link: '/ex_in_exbank' },
        { icon: <IfileDelete />, name: "Delete Exercise" },
    ];

    const popupRef = useRef();

    return (
        <>
            <Header />
            <div className="flex">
                <SideBar />
                <div className="ml-14 w-2/3 pb-12">
                <div className="mb-4 mt-4 font-poppins font-bold text-5xl border-b border-black flex items-center justify-between">
                    <span>Exercises Bank</span>
                        {localStorage.getItem('userType') !== 'Student' ?
                            <Link href={'./exbank_add'}>
                                <button className="bg-lime-300 hover:bg-lime-400 mb-3 px-4 py-2 text-black text-base font-medium rounded-lg leading-tight tracking-tight">
                                Add exercise
                                </button>
                            </Link> : null}
                </div>
                    <div className="bg-white rounded pb-3">
                        <div className="flex gap-32 justify-center px-11 py-7">
                            <Select key={`module-select-${resetKey}`}
                                options={optionModule}
                                onChange={handleModuleFilter}
                                className="w-1/4 text-center border-2 border-zinc-300 rounded-md" placeholder="Module" />

                            <Select key={`skill-select-${resetKey}`}
                                options={optionSkill}
                                onChange={handleSkillFilter}
                                className="w-1/4 text-center border-2 border-zinc-300 rounded-md" placeholder="Skill" />
                            
                            <button onClick={handleChangeRemoveF}
                                className="text-red-700 rounded-lg text-base font-medium border-2 border-red-600 px-4 py-[2px]
                             hover:bg-red-200 transition-colors duration-300">
                                Remove filter
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pl-4 pt-3">
                        <div className="flex items-center gap-4">
                            {localStorage.getItem('userType') === 'Student' ?
                                <button
                                    onClick={() => handleButtonClick(1)}
                                    className={`hover:bg-sky-500 text-black hover:text-white text-base font-medium px-4 py-2 
                                    rounded-lg border border-zinc-300 transition-colors duration-300 ${selectedButton === 1 ? 'bg-sky-500' : 'bg-white'}`}>
                                    All
                                </button> : null}
                            {localStorage.getItem('userType') === 'Student' ?
                                <button
                                    onClick={() => handleButtonClick(2)}
                                    className={`hover:bg-sky-500 text-black hover:text-white text-base font-medium px-4 py-2
                                    rounded-lg border border-zinc-300 transition-colors duration-300 ${selectedButton === 2 ? 'bg-sky-500' : 'bg-white'}`}>
                                    Your Exercises
                                </button> : null}
                        </div>
                       
                    </div>

                    <div className="mt-1 -mr-3">
                        {
                            (selectedButton === 2 ?
                                <div>
                                    {((localStorage.getItem('module_filter') === 'IELTS') || (localStorage.getItem('module_filter') === 'TOEFL') || (localStorage.getItem('module_filter') === 'TOEIC') || (localStorage.getItem('skill_filter') === 'Listening') || (localStorage.getItem('skill_filter') === 'Speaking') || (localStorage.getItem('skill_filter') === 'Writing') || (localStorage.getItem('skill_filter') === 'Reading')) ?
                                        <div className="h-[460px]">
                                            <div className="grid grid-cols-3">
                                                {currentExList3.map(exercise => (
                                                    <div className="inline-block bg-white mr-4 pl-10 pr-10 py-4 mb-4 rounded-xl">
                                                        <div className="font-semibold mb-4 h-[48px]">
                                                            {exercise.title}
                                                        </div>
                                                        <div className="flex text-gray-400 text-sm font-medium pb-3 border-b-2 border-gray-400">
                                                            <div className="p-2 border-2 border-gray-300 rounded-lg mr-10">
                                                                {exercise.module}
                                                            </div>
                                                            <div className="p-2 border-2 border-gray-300 rounded-lg">
                                                                {exercise.skill}
                                                            </div>
                                                        </div>
                                                        <Link onClick={() => localStorage.setItem('exerciseID', exercise._id)}
                                                            href='/ex_in_exbank'
                                                            className="flex p-2 mt-3 w-full items-center gap-4 border-2 bg-gray-300 rounded-lg hover:bg-gray-50
                                                        transition-colors duration-300">
                                                            <Ieye className="fill-blue-400 w-6" />
                                                            <div className="text-blue-400">View Exercise</div>
                                                        </Link>
                                                    </div>
                                                ))}
                                            </div>
                                        </div> :
                                        <div className="h-[460px]">
                                            <div className="grid grid-cols-3">
                                                {currentExList.map(exercise => (
                                                    <div className="inline-block bg-white mr-4 pl-10 pr-10 py-4 mb-4 rounded-xl">
                                                        <div className="font-semibold mb-4 h-[48px]">
                                                            {exercise.title}
                                                        </div>
                                                        <div className="flex text-gray-400 text-sm font-medium pb-3 border-b-2 border-gray-400">
                                                            <div className="p-2 border-2 border-gray-300 rounded-lg mr-10">
                                                                {exercise.module}
                                                            </div>
                                                            <div className="p-2 border-2 border-gray-300 rounded-lg">
                                                                {exercise.skill}
                                                            </div>
                                                        </div>
                                                        <Link onClick={() => localStorage.setItem('exerciseID', exercise._id)}
                                                            href='/ex_in_exbank'
                                                            className="flex p-2 mt-3 w-full items-center gap-4 border-2 bg-gray-300 rounded-lg hover:bg-gray-50
                                                    transition-colors duration-300">
                                                            <Ieye className="fill-blue-400 w-6" />
                                                            <div className="text-blue-400">View Exercise</div>
                                                        </Link>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>}
                                    <div className="flex justify-end">
                                        <Pagination
                                            count={Math.ceil(length / exPerPage)}
                                            shape="rounded"
                                            page={currentPage}
                                            onChange={(event, newPage) => handlePageChange(newPage)}
                                            className=""
                                            color="primary"
                                        />
                                    </div>
                                </div> :
                                ((localStorage.getItem('module_filter') === 'IELTS') || (localStorage.getItem('module_filter') === 'TOEFL') || (localStorage.getItem('module_filter') === 'TOEIC') || (localStorage.getItem('skill_filter') === 'Listening') || (localStorage.getItem('skill_filter') === 'Speaking') || (localStorage.getItem('skill_filter') === 'Writing') || (localStorage.getItem('skill_filter') === 'Reading')) ?
                                <>
                                    <div className="h-[460px]">
                                        <div className="grid grid-cols-3">
                                            {currentEx3.map((exercise) => (
                                                <div className="inline-block bg-white mr-4 pl-10 pr-10 py-4 mb-4 rounded-xl">
                                                    <div className="font-semibold mb-4 h-[48px]">
                                                        {exercise.title}
                                                    </div>
                                                    <div className="flex text-gray-400 text-sm font-medium pb-3 border-b-2 border-gray-400 ">
                                                        <div className="p-2 border-2 border-gray-300 rounded-lg mr-10">
                                                            {exercise.module}
                                                        </div>
                                                        <div className="p-2 border-2 border-gray-300 rounded-lg">
                                                            {exercise.skill}
                                                        </div>
                                                    </div>
                                                    {localStorage.getItem('userType') !== 'Admin' ?
                                                        <Link onClick={() => localStorage.setItem('exerciseID', exercise._id)}
                                                            href='/ex_in_exbank'
                                                            className="flex p-2 mt-3 w-full items-center gap-4 border-2 bg-gray-300 rounded-lg hover:bg-gray-50
                                                        transition-colors duration-300">
                                                            <Ieye className="fill-blue-400 w-6" />
                                                            <div className="text-blue-400">View Exercise</div>
                                                        </Link>
                                                        :
                                                        <Box sx={{ mt: 1, transform: "translateZ(0px)", flexGrow: 1 }}>
                                                            <SpeedDial
                                                                ariaLabel="SpeedDial basic example"
                                                                sx={{ transform: "translateZ(0px)", flexGrow: 1 }}
                                                                icon={<ItripleBar />}
                                                                direction="right"
                                                            >
                                                                {actions.map((action) => (
                                                                    <SpeedDialAction
                                                                        key={action.name}
                                                                        icon={action.icon}
                                                                        tooltipTitle={action.name}
                                                                        onClick={() => {
                                                                            localStorage.setItem('exerciseID', exercise._id);
                                                                            if (action.name === 'View Exercise') {
                                                                                handleActionClick(action.link)
                                                                            } else {
                                                                                popupRef.current.open();
                                                                            }
                                                                        }}
                                                                        FabProps={{ size: "small" }}
                                                                    />
                                                                ))}
                                                            </SpeedDial>
                                                            <Popup
                                                                ref={popupRef}>
                                                                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-44 bg-gray-200 p-4 border-2 border-gray-500 rounded-lg">
                                                                    <div className="mt-4">
                                                                        <p className="text-center text-lg font-semibold">Do you want to delete permanently ?</p>
                                                                        <div className="flex items-center justify-between mt-10 gap-2 text-lg font-medium">
                                                                            <button className="w-1/2 border-2 border-black bg-lime-400 hover:bg-lime-500 rounded-md py-2" onClick={ev => { localStorage.setItem('exerciseID', exercise._id), handleDelete(ev) }}>
                                                                                Yes
                                                                            </button>

                                                                            <button className="w-1/2 border-2 border-black bg-red-400 hover:bg-red-500 rounded-md py-2"
                                                                                onClick={() => { popupRef.current.close() }}>
                                                                                No
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Popup>
                                                        </Box>}
                                                </div>
                                            )
                                            )}
                                        </div>
                                        
                                    </div> 
                                    <div className="flex justify-end">
                                    <Pagination
                                        count={Math.ceil(length / exPerPage)}
                                        shape="rounded"
                                        page={currentPage}
                                        onChange={(event, newPage) => handlePageChange(newPage)}
                                        className=""
                                        color="primary"
                                    />
                                </div></>:
                                    <>
                                    <div className="h-[460px]">
                                        <div className="grid grid-cols-3">
                                            {currentEx.map((exercise) => (
                                                <div className="inline-block bg-white mr-4 pl-10 pr-10 py-4 mb-4 rounded-xl">
                                                    <div className="font-semibold mb-4 h-[48px]">
                                                        {exercise.title}
                                                    </div>
                                                    <div className="flex text-gray-400 text-sm font-medium pb-3 border-b-2 border-gray-400 ">
                                                        <div className="p-2 border-2 border-gray-300 rounded-lg mr-10">
                                                            {exercise.module}
                                                        </div>
                                                        <div className="p-2 border-2 border-gray-300 rounded-lg">
                                                            {exercise.skill}
                                                        </div>
                                                    </div>
                                                    {localStorage.getItem('userType') !== 'Admin' ?
                                                        <Link onClick={() => localStorage.setItem('exerciseID', exercise._id)}
                                                            href='/ex_in_exbank'
                                                            className="flex p-2 mt-3 w-full items-center gap-4 border-2 bg-gray-300 rounded-lg hover:bg-gray-50
                                                     transition-colors duration-300">
                                                            <Ieye className="fill-blue-400 w-6" />
                                                            <div className="text-blue-400">View Exercise</div>
                                                        </Link>
                                                        :
                                                        <Box sx={{ mt: 1, transform: "translateZ(0px)", flexGrow: 1 }}>
                                                            <SpeedDial
                                                                ariaLabel="SpeedDial basic example"
                                                                sx={{ transform: "translateZ(0px)", flexGrow: 1 }}
                                                                icon={<ItripleBar />}
                                                                direction="right"
                                                            >
                                                                {actions.map((action) => (
                                                                    <SpeedDialAction
                                                                        key={action.name}
                                                                        icon={action.icon}
                                                                        tooltipTitle={action.name}
                                                                        onClick={() => {
                                                                            localStorage.setItem('exerciseID', exercise._id)
                                                                            if (action.name === 'View Exercise') {
                                                                                handleActionClick(action.link)
                                                                            } else {
                                                                                popupRef.current.open();
                                                                            }
                                                                        }}
                                                                        FabProps={{ size: "small" }}
                                                                    />
                                                                ))}
                                                            </SpeedDial>
                                                            <Popup
                                                                ref={popupRef}>
                                                                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-44 bg-gray-200 p-4 border-2 border-gray-500 rounded-lg">
                                                                    <div className="mt-4">
                                                                        <p className="text-center text-lg font-semibold">Do you want to delete permanently ?</p>
                                                                        <div className="flex items-center justify-between mt-10 gap-2 text-lg font-medium">
                                                                            <button className="w-1/2 border-2 border-black bg-lime-400 hover:bg-lime-500 rounded-md py-2" onClick={ev => { localStorage.setItem('exerciseID', exercise._id), handleDelete(ev) }}>
                                                                                Yes
                                                                            </button>

                                                                            <button className="w-1/2 border-2 border-black bg-red-400 hover:bg-red-500 rounded-md py-2"
                                                                                onClick={() => { popupRef.current.close() }}>
                                                                                No
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Popup>
                                                        </Box>}
                                                </div>
                                            )
                                            )}
                                        </div>
                                        
                                    </div>
                                    <div className="flex justify-end">
                                    <Pagination
                                        count={Math.ceil(exercises.length / exPerPage)}
                                        shape="rounded"
                                        page={currentPage}
                                        onChange={(event, newPage) => setCurrentPage(newPage)}
                                        className=""
                                        color="primary"
                                    />
                                </div></>)
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

const optionModule = [
    { value: "IELTS", label: "IELTS" },
    { value: "TOEIC", label: "TOEIC" },
    { value: "TOEFL", label: "TOEFL" }
];

const optionSkill = [
    { value: "Speaking", label: "Speaking" },
    { value: "Listening", label: "Listening" },
    { value: "Writing", label: "Writing" },
    { value: "Reading", label: "Reading" }
];