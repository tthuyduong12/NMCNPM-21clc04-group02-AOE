'use client'

import SideBar from "@/components/layout/sideBar"
import Header from "@/components/layout/header"
import Select from "react-select";
import Iplus from "@/components/icons/icon_plus";
import Idelete from "@/components/icons/delete";
import Link from "next/link"
import { useState, useEffect, SyntheticEvent } from "react"
import { GET } from '@/app/api/user/route';
import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useRouter } from 'next/navigation'
import dayjs, { Dayjs } from 'dayjs';
import { error } from "console";

export default function Course_Add() {
    const [title, setTitle] = useState('')
    const [module, setModule] = useState('')
    const [teacher, setTeacher] = useState('')
    const [sDate, setSDate] = React.useState<Dayjs | null>(dayjs('2023-12-30'));
    const [schedule, setSchedule] = useState('')
    const [room, setRoom] = useState('')
    const [student, setStudent] = useState()
    const [error, setError] = useState(false)
    var [student_added, setStudentAdded] = useState([])
    const router = useRouter();
    const handleDelete = (index) => {
        // Tạo một bản sao mới của mảng và loại bỏ phần tử tại chỉ mục index
        const updatedArray = [...student_added.slice(0, index), ...student_added.slice(index + 1)];

        // Cập nhật state với mảng mới
        setStudentAdded(updatedArray);
    };
    const handleChangeModule = (ev) => {
        setModule(ev.value);
    };
    const handleChangeTeacher = (ev) => {
        setTeacher(ev.value);
    };

    const handleChangeSchedule = (ev) => {
        setSchedule(ev.value);
    };
    const handleChangeStudentID = (ev) => {
        setStudent(ev.value)
        var temp = ev.value
        if (!student_added.includes(temp)) {
            student_added.push(temp)
        }
        //  console.log(student_added)
    }
    //console.log(student_added)
    async function handleFormSubmit(ev: SyntheticEvent) {
        ev.preventDefault()
        const response = await fetch('/api/course', {
            method: 'POST',
            body: JSON.stringify({ title, schedule, room, module, teacher, sDate, student_added }),
            headers: { 'Content-Type': 'application/json' },
        })
        if (!response.ok)
            setError(true)
        else {

            router.push('/assignments')
        }
    }
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    useEffect(() => {
        fetch('/api/user')
            .then(res => res.json())
            .then(data => {
                setTeachers(data.teachers)
                setStudents(data.students)
            })
    }, []);
    const optionTeachers = teachers.map(
        function (teacher) {
            return {
                value: teacher.phone,
                label: teacher.phone + " - " + teacher.name
            }
        }
    );
    const optionStudents = students.map(
        function (student) {
            return {
                value: student.phone,
                label: student.phone + " - " + student.name
            }
        }
    );
    return (
        <>
            <Header />
            <div className="flex">
                <SideBar />
                <div className="ml-14 w-2/3">
                    <div className="flex justify-between mb-4 mt-4 font-poppins font-bold text-5xl border-b border-black pb-2">
                        <div>
                            Create Course
                        </div>
                        <button className="gap-2 flex items-center justify-end bg-lime-300 rounded-lg text-center text-black text-base font-poppins leading-tight tracking-tight hover:bg-lime-400 px-4">
                            <Iplus />
                            <p className="flex items-center" onClick={handleFormSubmit}>Create course</p>
                        </button>
                    </div>

                    <div className="bg-white mt-2 rounded">
                        <div className="px-12 py-8">
                            <div className="items-center">
                                <div className="text-base font-medium">Course Name</div>
                                <input className="px-2 py-2 rounded-md border border-zinc-300 focus:outline-none mt-2 w-full" type="text" id="myTitle" placeholder="Type name of the course"
                                    onChange={ev => setTitle(ev.target.value)} />
                            </div>

                            <div className="mt-8 grid grid-cols-2">
                                <div>
                                    <p className="text-black text-base font-medium leading-tight tracking-tight">Choose a schedule</p>
                                    <Select options={optionSchedule} onChange={handleChangeSchedule}
                                        className="w-3/4 mt-2" placeholder="Select schedule" />
                                </div>
                                <div>
                                    <p className="text-black text-base font-medium leading-tight tracking-tight">Choose a module</p>
                                    <Select options={optionModule} onChange={handleChangeModule}
                                        className="w-3/4 mt-2" placeholder="Select module" />
                                </div>
                                <div>
                                    <p className="text-black text-base font-medium leading-tight tracking-tight mt-4">Choose a teacher</p>
                                    <Select options={optionTeachers} onChange={handleChangeTeacher} className="w-3/4 mt-2" placeholder="Select teacher" />
                                </div>
                                <div className="items-center mt-3 w-3/4">
                                    <div className="text-base font-medium">Room</div>
                                    <input className="px-2 py-2 rounded-md border border-zinc-300 focus:outline-none mt-2 w-full" type="text" id="myTitle" placeholder="Type name of the course"
                                        onChange={ev => setRoom(ev.target.value)} />
                                </div>
                            </div>
                            <div></div>
                            <div className="mt-7 grid grid-cols-2">
                                <div className="">
                                    <p className="text-black text-base font-medium leading-tight tracking-tight">Student</p>
                                    <Select options={optionStudents} onChange={handleChangeStudentID}
                                        className="w-[333px] mt-2" placeholder="Telephone number of student" />
                                </div>
                                <div>
                                    <div className="font-semibold">Start Date</div>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DatePicker']}>
                                            <DatePicker value={sDate} onChange={(newValue) => setSDate(newValue)}
                                                className="w-3/4"
                                            />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </div>

                            </div>



                            <div className="inline-block px-4 mt-8 rounded-lg border border-stone-300 h-40 w-full gap-3">
                                {
                                    student_added.map((c: string, i) => (
                                        <>
                                            <div className="inline-block items-center gap-2 mt-3 ml-3 p-3 bg-gray-300 font-semibold py-2">
                                                {i + 1}: {c}
                                                <button className="ml-2" onClick={() => handleDelete(i)}>
                                                    < Idelete />
                                                </button>
                                            </div>
                                        </>
                                    )
                                    )}
                            </div>
                            {(error) &&
                                <div className="mt-5 max-w-xs text-red-800 font-semibold 
                                bg-red-300 rounded-lg p-3 mr-5">
                                    Some information is missed or wrong
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const optionModule = [
    { value: "IELTS", label: "IELTS" },
    { value: "TOEIC", label: "TOEIC" },
    { value: "TOEFL", label: "TOEFL" },
];

const optionSchedule = [
    { value: "Mon-Wed-Fri", label: "Mon-Wed-Fri" },
    { value: "Tue-Thu-Sat", label: "Tue-Thu-Sat" },
];