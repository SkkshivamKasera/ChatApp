import mongoose from "mongoose";

export const Database_Connection = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_LOCAL_URI)
        console.log(`MongoDB Connected : ${conn.connection.host}`)
    }catch(error){
        console.log(error.message)
    }
}