import mongoose from "mongoose";
import 'dotenv/config'


// Retrieve the database URL from environment variables
let dbURl = process.env.DBURL;
// Replace placeholder with the actual password from environment variables
dbURl = dbURl.replace("<password>", process.env.PASSWORD);

// Function to connect to MongoDB
export default function connectMongoDB() {
    mongoose.connect(dbURl)
        .then(() => {
            // Log success message if connection is successful
            console.log("MongoDB Connection Succeeded🔥");
        })
        .catch(err => {
            // Log error message if connection fails
            console.error("Connection error 😥", err);
            // Exit the process with failure code
            process.exit();
        });
}