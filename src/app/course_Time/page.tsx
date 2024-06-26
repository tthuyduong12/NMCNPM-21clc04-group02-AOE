'use client'
import SideBar from "@/components/layout/sideBar"
import Header from "@/components/layout/header"
import Link from "next/link"
import Icalendar from "@/components/icons/icon_cal"
import Ibook from "@/components/icons/icon_book"
import { useState, useEffect } from "react"
import moment from "moment"
import IcirclePlus from "@/components/icons/circlePlus"
import Ieye from "@/components/icons/eye"
import Pagination from '@mui/material/Pagination';

export default function CourseTime() {
    const [course, setCourse] = useState('')
    const [sessions, setSessions] = useState([])
    const type = localStorage.getItem("userType")
    useEffect(() => {
        fetch('/api/course', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: localStorage.getItem("course_id"), method: 'getSessionList' }),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setSessions(data)
            })
            .catch(error => console.error('Error:', error));

        fetch('/api/course', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: localStorage.getItem("course_id"), method: 'getInfo' }),
        })
            .then(response => response.json())
            .then(data => {
                setCourse(data)
                console.log(data);
            })
            .catch(error => console.error('Error:', error));

    }, []);

    const [currentPage, setCurrentPage] = useState(1);
    const sessionPerPage = 6; // Adjust as needed
    const currentSeesion = sessions.slice((currentPage - 1) * sessionPerPage, currentPage * sessionPerPage);

    return (
        <>
            <Header />
            <div className="flex">
                <SideBar />
                <div className="ml-14 w-2/3">
                    <div className="mb-4 mt-4 font-poppins font-bold text-5xl border-b border-black">
                        Courses List
                    </div>
                    <div className="mt-4 bg-white rounded-lg">
                        <div className="p-2 ml-2 font-poppins text-xs">{course.name}</div>
                    </div>
                    <div className="bg-sky-100 mt-2">
                        <div className="ml-6">
                            <div className="flex items-center p-4">
                                <button className="flex items-center justify-center border border-stone-300 bg-blue-300 p-2 rounded-lg">
                                    <Icalendar />
                                    <p className="ml-2">Timetable</p>
                                </button>
                                <Link href={'/assignments'}>
                                    <button className="flex items-center justify-center bg-zinc-100 border border-stone-300 hover:bg-blue-300 p-2 rounded-lg ml-8
                                        transition-colors duration-300">
                                        <Ibook />
                                        <div className="ml-2">Assignments</div>
                                    </button>
                                </Link>
                            </div>

                            <div className="flex p-4 justify-between">
                                <div className=" font-poppins text-blue-500 bg-white border p-1 text-sm rounded-lg px-3 py-2">
                                    Overall: 24 sessions
                                </div>

                                <div className=" font-poppins text-blue-500 bg-white border p-1 text-sm rounded-lg px-3 py-2">
                                    Teacher: {course.teacher_name}
                                </div>

                                <div className=" font-poppins text-blue-500 bg-white border p-1 text-sm rounded-lg px-3 py-2">
                                    Room: {course.room}
                                </div>

                                <div className=" font-poppins text-blue-500 bg-white border p-1 text-sm rounded-lg px-3 py-2">
                                    Start date: {moment.utc(course.startDate).format('DD/MM/YYYY')}
                                </div>

                                <div className=" font-poppins text-blue-500 bg-white border p-1 text-sm rounded-lg px-3 py-2">
                                    {course.schedule}
                                </div>
                            </div>
                            <div className="ml-4 h-96 grid grid-cols-3">
                                {
                                    currentSeesion.map((session, i) => (
                                        <>
                                            <div className="inline-block bg-white mb-4 mr-8 rounded-lg py-3 pl-4 pr-2">
                                                <div className="font-bold text-blue-400 mb-3">
                                                    OFFLINE
                                                </div>
                                                <div className="flex gap-10 items-center mb-3 justify-between mr-4">
                                                    <div className="font-semibold font-poppins">
                                                        {session.name}
                                                    </div>

                                                    <div className="font-bold font-poppins text-sm">
                                                        {course.time}
                                                    </div>
                                                </div>
                                                {(i % 3 == 0) &&
                                                    <div className="font-bold">Skill: Reading & Listening</div>
                                                }
                                                {(i % 3 == 2) &&
                                                    <div className="font-bold">Skill: Writing</div>
                                                }
                                                {(i % 3 == 1) &&
                                                    <div className="font-bold">Skill: Speaking</div>
                                                }
                                                {(type == 'Teacher') && (session.attendList === null) &&
                                                    <Link onClick={() => { localStorage.setItem("session_id", session._id), localStorage.setItem("session_name", session.name) }}
                                                        href='/attendance_add'
                                                        className="bg-gray-300 border-2 border-gray-300 font-bold p-2 mt-3 flex gap-3 text-blue-400 rounded-lg
                                                         hover:bg-gray-100 hover:border-2 hover:border-gray-300 transition-colors duration-300">
                                                        <IcirclePlus className="w-5 fill-blue-400" />
                                                        Create Attendance List
                                                    </Link>
                                                }
                                                {(type == 'Teacher') && (session.attendList !== null) &&
                                                    <Link onClick={() => { localStorage.setItem("session_id", session._id), localStorage.setItem("session_name", session.name) }}
                                                        href='/attendance_view'
                                                        className="bg-gray-300 border-2 border-gray-300 font-bold p-2 mt-3 flex gap-3 text-blue-400 rounded-lg
                                                        hover:bg-gray-100 hover:border-2 hover:border-gray-300 transition-colors duration-300">
                                                        <Ieye className="w-5 fill-blue-400" />
                                                        View Attendance List
                                                    </Link>
                                                }
                                            </div>
                                        </>
                                    ))
                                }
                            </div>
                            <div className="flex justify-center mt-4">
                                <Pagination
                                    count={Math.ceil(sessions.length / sessionPerPage)}
                                    shape="rounded"
                                    onChange={(event, newPage) => setCurrentPage(newPage)}
                                    className=""
                                    color="primary"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}