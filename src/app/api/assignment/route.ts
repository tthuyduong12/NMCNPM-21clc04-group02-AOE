import { Assignment } from "@/models/assignment"
//import { Course } from "@/models/course"
import mongoose from "mongoose"

export async function POST(req: { json: () => any }) {
    const body = await req.json()
    mongoose.connect("mongodb+srv://learning-management:Abuo65lscK5pOUms@cluster0.nwhbe5i.mongodb.net/learning-management")
    //const assignment_id = body.Title;

    // const assignment = await Assignment.findOne({ assignment_id })

    // if (assignment_id) {
    //     new Error('Assignment is existed');
    // }
    console.log(body)
    const createdAssignment = await Assignment.create({
        title: body.title,
        deadline: body.deadline,
        content: body.content,
        skill: body.skill,
        attachedFile: body.file,
    })
    console.log(createdAssignment)
    return Response.json(createdAssignment)
}