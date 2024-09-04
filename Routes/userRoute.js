import { Router } from "express";
import authenticate from "../Middleware/auth.js";
import { course } from "./adminRoute.js";
const userRoute=Router();
const cart=new Map();
userRoute.post('/addCart', authenticate, async (req, res) => {

    const UserRole = req.userrole;
    const UserName = req.username;
    console.log(UserRole, "hi user");
    console.log(UserName, "name");

    try {
        if (UserRole == 'user'||UserRole=='admin') {
            const { CourseName } = req.body;
            console.log(CourseName);

            const courseDetails = course.get(CourseName);
            console.log(courseDetails);

            const cartDetails = {
                CourseName,
                Price: courseDetails.Price,
            }
            let cartArray = [];
            cartArray.push(cartDetails);
            console.log(cartArray);

            try {
                const data = cart.get(UserName);
                if (data) {
                    data.push(cartDetails);
                    console.log(cart.get(UserName));
                    res.status(201).json({ message: "Item added to cart" })
                }
                else {
                    cart.set(UserName, cartArray);


                    console.log(cart.get(UserName));

                    res.status(201).json({ message: "Item added to cart" })
                }
            }

            catch (error) {
                res.status(400).json({ message: "Check the input" })
            }

        }
        else {
            res.status(400).json({ message: "Unauthorized Access" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Check the bookName" });
    }


})

userRoute.get('/viewCart', authenticate, async (req, res) => {
    const UserRole = req.userrole;
    const UserName = req.username;
    console.log(UserName);

    const result = cart.get(UserName);
    res.send(result);
})

userRoute.get('/buyCart', authenticate, async (req, res) => {
    try{
    const UserRole = req.userrole;
    const UserName = req.username;
    console.log(UserRole, "hi user");
    console.log(UserName, "name");
   
    const data = cart.get(UserName);
    console.log(data);
    let total = 0;
    let Price, Quantity,BookName;
    data.forEach(x=>{
        BookName=x.BookName;
        Price=x.Price;
        Quantity=x.Quantity;
        total+=(Price*Quantity);
        const data=book.get(BookName);
        data.Copies-=Quantity;
        console.log(data);
        
        book.set(BookName,data);
    })
    
    console.log(total);
    res.send(total.toString())
}
    catch{
        res.status(500).json({message:"Check Details"});
    }
   


})

export default userRoute;