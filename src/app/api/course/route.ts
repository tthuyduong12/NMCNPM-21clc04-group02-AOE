import { Course } from "@/models/course"
import { Session } from "@/models/session";
import { User } from "@/models/user"
import { Assignment } from "@/models/assignment"
import { Submission } from "@/models/submission"
import { Attendance } from "@/models/attendance";

import { connectToDatabase } from '../../../connection';

export async function POST(req: { json: () => any }) {
    try {
        const body = await req.json();
        connectToDatabase();
        if(body.method === 'add'){
            const createdCourse = await Course.create({
                name: body.title,
                schedule: body.schedule,
                room: body.room,
                startDate: body.sDate,
                module: body.module,
                teacher_id: body.teacher,
                student_id: body.student_added
            });
            for (var i = 0; i < 24; i++) {
                await Session.create({
                    course_id: createdCourse._id,
                    name: 'Session ' + String(i + 1)
                })
            }
            return Response.json(createdCourse);
        }
        else if (body.method === 'getList'){
            var courses;
            if (body.userType == "Teacher") {
                courses = await Course.find({ teacher_id: body.id })
            }
            else if (body.userType == "Admin") {
                courses = await Course.find({})
            }
            else {
                courses = await Course.find()
                courses = courses
                .filter(course => course.student_id.includes(body.id))
                .filter(course => course !== null);
            }
            var data = []
            var teacherName
            for (var i = 0; i < courses.length; i++) {
                teacherName = await User.findOne({phone: courses[i].teacher_id}, {name: 1, _id: 0})
                data.push(teacherName.name)
            }

            var combinedCourses = courses.map((course,i) => {
            return {
                course_id: course._id,
                name: course.name,
                startDate: course.startDate,
                module: course.module,
                room: course.room,
                schedule: course.schedule,
                teacher_id: course.teacher_id,
                student_id: course.student_id,
                teacher_name: data[i], 
            };
            });
            combinedCourses.reverse()
            return Response.json(combinedCourses);
        }
        else if (body.method === 'getStudentList'){
            var course;
            course = await Course.findOne({ _id: body.listStuCourseID })

            const studentList = course.student_id;

            const listStudent = []
            for (var i = 0; i < studentList.length; i++) {
                const temp = await User.findOne({ phone: studentList[i] })
                listStudent.push(temp)
            }
            return Response.json(listStudent);
        }
        else{
            const listAssignment = await Assignment.find({course_id : body.course_id},{_id: 1})
            for(var i = 0; i < listAssignment.length;i++){
                await Submission.deleteMany({assignment_id : listAssignment[i]._id})
            }
            const deleteAssignment = await Assignment.deleteMany({course_id : body.course_id})
            const deleteSession = await Session.deleteMany({course_id : body.course_id})
            const deleteAttendance = await Attendance.deleteMany({course_id : body.course_id})
            const deleteCourse = await Course.deleteOne({_id : body.course_id})
            Response.json({deleteAssignment, deleteSession,deleteAttendance, deleteCourse })
        }
    } catch (error) {
        return new Response(
            JSON.stringify(
                { ok: false, message: 'Course fetching failed' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
        });
    }
} 
