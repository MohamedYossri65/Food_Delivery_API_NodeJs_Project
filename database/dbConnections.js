import mongoose from "mongoose";
import 'dotenv/config'

let dbURl = process.env.DBURL;
dbURl = dbURl.replace("<password>" ,process.env.PASSWORD);

export default function connectMongoDB() {
    mongoose.connect(dbURl)
    .then(
        () => {
            console.log("MongoDB Connection Succeeded🔥");
        }
    ).catch(err => {
        console.error("Connection error 😥", err);
        process.exit();
    });
}