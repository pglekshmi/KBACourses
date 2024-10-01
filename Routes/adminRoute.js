import { Router } from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import authenticate from "../Middleware/auth.js";
dotenv.config();


const adminRoute = Router();
const user = new Map();
const course = new Map();
const secret_key = process.env.Secret_Key;

adminRoute.get('/', function (req, res) {
    res.send("Hello World");
})

adminRoute.post('/signup', async (req, res) => {
    try {
        const data = req.body;
        console.log(data);
        const { FirstName, LastName, UserName, Password, UserRole } = req.body;
        console.log(UserName);
        const newPassword = await bcrypt.hash(Password, 10)

        console.log(newPassword);
        if (user.get(UserName)) {
            res.status(400).json({ message: "Username already exist" });
        }
        else {
            user.set(UserName, { FirstName, LastName, Password: newPassword, UserRole })
            console.log(user.get(UserName));
            // // console.log(result);
            res.status(201).json({ message: "Saved Data" })
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
})

adminRoute.post('/login', async (req, res) => {
    try {
        const { UserName, Password } = req.body;
        const result = user.get(UserName)
        console.log(result);


        if (!result) {
            res.status(404).json({ message: 'User not found' });
        }
        else {
            console.log(Password);
            console.log(result.Password);


            const isvalid = await bcrypt.compare(Password, result.Password);
            console.log(isvalid);

            if (isvalid) {
                console.log(result.UserRole);
                const token = jwt.sign({ UserName: UserName, UserRole: result.UserRole }, secret_key, { expiresIn: '1h' });
                console.log(token);

                res.cookie('authToken', token, {
                    httpOnly: true
                });
                res.send(token);
            }
            else {
                res.send("Invalid Password");
            }
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
})

adminRoute.post('/addCourse', authenticate, (req, res) => {
    const user = req.userrole;


    const { CourseName, CourseId, CourseType, Description, Price } = req.body;

    try {

        if (user == "admin") {
            try {
                if (course.get(CourseName)) {
                    res.status(400).json({ message: "Course already present" })
                }
                else {
                    course.set(CourseName, {
                        CourseId: CourseId,
                        CourseType: CourseType,
                        Description: Description,
                        Price: Price
                    })

                    res.status(201).json({ message: "Course Details Uploaded" });
                    console.log(course.get(CourseName));

                }
            }

            catch (error) {
                res.status(400).json({ message: "Check the Course Details" });

            }
        }

        else {
            res.status(400).json({ message: "Unauthorized Access" })
        }
    }


    catch (error) {
        res.status(401).json({ message: "Check Course details" });

    }
})

// adminRoute.get('/getCourse/:name', async (req, res) => {
adminRoute.get('/getCourse', async (req, res) => {
    try {
        // const search = req.params.name.toUpperCase();
        // console.log(search);
        const search = req.query.courseName.toUpperCase();
        console.log(search);
        const result = course.get(search)
        if (result) {

            res.send(result);
        }
        else {
            res.json({ message: "No course found,Check the name" })
        }
    }
    catch (error) {
        res.status(400).json({ message: "Check the input" })
    }
})

adminRoute.get('/viewCourse',async(req,res)=>{
    try{
        res.send(Array.from(course.entries()))
    }
    catch{
        res.status(404).json({message:"Internal error"})
    }
})

adminRoute.patch('/updateCourse',authenticate,(req,res)=>{
    const user = req.userrole;


    const { CourseName, CourseId, CourseType, Description, Price } = req.body;

    try {

        if (user == "admin") {
            try {
                let data = course.get(CourseName);
                if(data){
                    course.set(CourseName, {
                        CourseId: CourseId,
                        CourseType: CourseType,
                        Description: Description,
                        Price: Price
                    });

                }
                else {
                    res.status(400).json({ message: "No such course" })
                }
               

                    res.status(201).json({ message: "Course Details Updated" });
                    console.log(course.get(CourseName));

                }
            

            catch (error) {
                res.status(400).json({ message: "Check the Course Details" });

            }
        }

        else {
            res.status(400).json({ message: "Unauthorized Access" })
        }
    }


    catch (error) {
        res.status(401).json({ message: "Check Course details" });

    }

})

adminRoute.delete('/deleteCourse',authenticate,(req,res)=>{
    const user = req.userrole;

    if(user=="admin"){
    const {courseName}=req.body;
    console.log(courseName);
    
    course.delete(courseName);
    res.status(200).json({"message":"Course deleted"})
}
})

adminRoute.post('/logout', (req, res) => {
    res.clearCookie('authToken'); // 'authToken' is the cookie name
    res.status(200).json({ message: 'Logout successful' });
})


export { adminRoute, course };