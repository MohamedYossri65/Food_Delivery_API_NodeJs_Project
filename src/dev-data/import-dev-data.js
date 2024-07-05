//the methode to run this script :  node ./src/dev-data/import-dev-data.js --delete or --import


import mongoose from "mongoose";
import 'dotenv/config'

import foodModel from '../../database/models/foodModel.js';
import categoryModel from '../../database/models/categoryModel.js';
import userModel from './../../database/models/userModel.js';
import fs from 'fs';
import reviewModel from "../../database/models/reviewModel.js";



// Retrieve the database URL from environment variables
let dbURl = process.env.DBURL;
// Replace placeholder with the actual password from environment variables
dbURl = dbURl.replace("<password>", process.env.PASSWORD);

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

// READ JSON FILE
const foods = JSON.parse(fs.readFileSync(`./src/dev-data/food.json`, 'utf-8'));
// const resturants = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`./src/dev-data/user.json`, 'utf-8'));
const categories = JSON.parse(
    fs.readFileSync(`./src/dev-data/category.json`, 'utf-8' ));


// IMPORT DATA INTO DB
const importData = async () => {
    try {
        // await foodModel.create(foods);
        await userModel.create(users, { validateBeforeSave: false });
        // await resturantModel.create(resturants);
        // await categoryModel.create(categories);
        console.log('Data successfully loaded!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
    try {
        // await foodModel.deleteMany();
        await userModel.deleteMany();
        // await reviewModel.deleteMany();
        // await categoryModel.deleteMany();
        console.log('Data successfully deleted!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

if (process.argv[2] === '--import') {
    importData();
}

if (process.argv[2] === '--delete') {
    deleteData();
}