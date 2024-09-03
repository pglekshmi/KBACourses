import express,{json} from 'express';
import adminRoute from './Routes/adminRoute.js';
const app=express();
app.use('/',adminRoute);
const port=8000;

app.listen(port,()=>{
    console.log(`server listening to port ${port}`);
    
})