const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({path:'./server.env'});

const connectDB = async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL,{
            
        });
        console.log(`MongoDb database connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit();
    }
};

module.exports = connectDB;