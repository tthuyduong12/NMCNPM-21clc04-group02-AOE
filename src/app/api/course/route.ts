import { Course } from "@/models/course"
import mongoose from "mongoose"


export async function POST(req: { json: () => any }) {
    try {
        const body = await req.json();
        mongoose.connect("mongodb+srv://learning-management:Abuo65lscK5pOUms@cluster0.nwhbe5i.mongodb.net/learning-management");
        const createdCourse = await Course.create({
            name: body.title,
            startDate: body.sDate,
            endDate: body.cDate,
            module: body.module,
            teacher_id: body.teacher,
            student_id: body.student_added
        });
        console.log(createdCourse);
        return Response.json(createdCourse);
    } catch (error) {
        return new Response(
            JSON.stringify(
                { ok: false, message: 'User not existed' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
        });
    }
} 