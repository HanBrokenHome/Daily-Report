import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()

export const ConnectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Berhasil connect dengan mongodb');
    }
    catch(error){
        console.log(`Gagal connect dengan mongodb karena ${error}`)
        process.exit(1);
    }
}