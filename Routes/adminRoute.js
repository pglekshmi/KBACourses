import { Router } from "express";
const adminRoute = Router();
adminRoute.get('/',(req,res)=>{
    res.send("Hello World");
})

export default adminRoute;