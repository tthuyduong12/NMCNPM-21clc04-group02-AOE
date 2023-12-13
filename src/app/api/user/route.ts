import { User } from "@/models/user"
import mongoose from "mongoose"

export async function POST(req: { json: () => any }) {
    const body = await req.json()
    mongoose.connect("mongodb+srv://learning-management:Abuo65lscK5pOUms@cluster0.nwhbe5i.mongodb.net/learning-management")
    const pass = body.password;
    if ((!pass?.length || pass.length < 5)) {
        new Error('password must be at least 5 characters');
    }
    const createdUser = await User.create({
        phone: body.phone,
        password: body.password,
        type: body.type, // Đảm bảo giữ nguyên giá trị từ request body
    })
    return Response.json(createdUser)
}

export async function GET() {
    mongoose.connect("mongodb+srv://learning-management:Abuo65lscK5pOUms@cluster0.nwhbe5i.mongodb.net/learning-management");

    const teachers = await User.find({ type: 'Teacher' });
    const students = await User.find({ type: 'Student' });
    return Response.json({ teachers, students })
}




