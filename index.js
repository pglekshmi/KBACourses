import express,{json} from 'express';
import { adminRoute } from './Routes/adminRoute.js';
import userRoute from './Routes/userRoute.js';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();
const app=express();

app.use(json());
app.use(cors())
app.use('/',adminRoute);
app.use('/user',userRoute);
const port=process.env.port;

app.listen(port,()=>{
    console.log(`server listening to port ${port}`);
    
})