import cors from "cors"
import express from 'express'
import bootstrap from './src/app.controller.js'
import dotenv from "dotenv";
dotenv.config();

const app = express()
const port = process.env.PORT || 3000
await bootstrap(app,express,cors)
app.listen(port,(error)=>{
    if(error){
        console.log("error connect server");
    }else{
        console.log("app is listen at port",port);
    }
})