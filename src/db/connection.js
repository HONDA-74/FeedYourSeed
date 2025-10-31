import mongoose from "mongoose";
export const connectDB = async () =>{
    console.log(process.env.DB_URL);
    await mongoose.connect(process.env.DB_URL)
    .then(()=>{
        console.log("DataBase connected successfully. ");
    })
    .catch((error)=>{
        console.log("error connecting Database : " , error.message );
    })
}