"use client"
import SideBar from "@/components/layout/sideBar"
import Header from "@/components/layout/header"
import Link from "next/link"
import React from "react"
import { SyntheticEvent, useEffect, useState } from "react"

export default function Do_Assignment() {
    const [assignment, SetAssignment] = useState([])
    const [answer, SetAnswer] = useState('')

    //get CourseID
    //lay info assignment where ass.idCourse = Course.idCourse
    //luu info submission voi id ass


    useEffect(() => {
        fetch('/api/assignment_info', {
            method: 'POST',
            body: JSON.stringify({id: localStorage.getItem("assignment_id")}),
            headers: { 'Content-Type': 'application/json'},
        })
            .then(res => res.json())
            .then(data => {
                SetAssignment(data)
            })
    }, []);

    async function handleFormSubmit(ev: SyntheticEvent) {
        ev.preventDefault()
        const response =  await fetch('/api/submission', {
            method: 'POST',
            body: JSON.stringify({answer, id_student: localStorage.getItem("userName"), id_assignment: localStorage.getItem("assignment_id")}),
            headers: { 'Content-Type': 'application/json'},
        })
    }


    return (
        <>
            <Header />
            <div className="flex">
                <SideBar />
                <div className="ml-14 w-2/3">
                    <div className="mb-4 mt-4 font-poppins font-bold text-5xl border-b border-black">
                        Assignments
                    </div>
                    <div className="mt-4 bg-white rounded-lg">
                        <div className="p-2 ml-2 font-poppins text-xs">[INTER_CLASSName] aoe - Q.5 ClassNameRoom IELTS 5.5 6.5 | 25/09/2023 Writing, Speaking, Writing Task 1, Writing Task 2</div>
                    </div>

                    <div className="bg-white mt-2 pb-8 rounded">
                        <div className="flex items-center justify-end py-2 border-b border-stone-300 mx-4">
                            <Link href={''}>
                                <button onClick={handleFormSubmit} className="flex items-center bg-lime-300 rounded-lg px-3 py-1 font-poppins text-sm">
                                    Submit
                                </button>
                            </Link>
                        </div>

                        {assignment.map(info => (
                        <div className="grid grid-cols-2 mt-4 py-4 mx-4 gap-6">
                            <div className="rounded-lg border border-stone-300 pl-6 py-8 pr-4">
                                {info.content}
                            </div>

                            <div className="bg-orange-100 bg-opacity-40 rounded-lg shadow-lg border flex-col justify-start items-center inline-flex p-4">
                                <textarea onChange={(ev) => { SetAnswer(ev.target.value) }} className="w-full rounded-lg border border-zinc-400 p-3 focus:outline-none h-96" id="myText" placeholder="Type..." ></textarea>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}