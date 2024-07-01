
import categoryModel from "../../database/models/categoryModel.js";
import reviewModel from "../../database/models/reviewModel.js";
import ApiFeatures from "../utils/ApiFeatures.js";
import AppError from "../utils/AppError.js";
import catchAsyncError from "../utils/catchAsyncError.js";


// Function to add a document to the database
const addOne = (model, document) => {
    return catchAsyncError(async (req, res, next) => {
        // Check if a document with the same name and description already exists
        let options = {
            $and: [
                { name: req.body.name },
                { description: req.body.description }
            ]
        }
        if (model === reviewModel) {
            options = {
                $and: [
                    { user: req.body.user },
                    { name: req.body.name }
                ]
            }
        }else if(model === categoryModel){
            options = {
                $and: [
                    { resturants:req.body.resturants },
                    { name: req.body.name}
                ]
            }
        }

        let isFound = await model.findOne(options);
        // If found, return a conflict error
        if (isFound) return next(new AppError(`this ${document} is already entered before!!`, 409));

        // Create and save the new document
        const result = new model(req.body);
        await result.save();

        // Respond with success message and the created document
        res.json({
            status: 'success',
            message: `${document} added successfully`,
            data: result
        });
    });
}

// Function to get all documents from the database
const getAllDocuments = (model, document ,params) => {
    return catchAsyncError(async (req, res, next) => {
        let filter = {};
        if (req.params.categoryId && params) {
            filter = {category :req.params.categoryId}
            console.log(filter);
        }
        // Apply query features like filter, pagination, sorting, limiting fields, and search
        let features = new ApiFeatures(model.find(filter), req.query)
            .filter()
            .paginate()
            .sorting()
            .limitingFields()
            .search();

        // Set default page to 1 if not provided or invalid
        let page = req.query.page;
        if (page < 0 || !page) {
            page = 1;
        }
        const result = await features.mongooseQuery;

        // Respond with success message and the fetched documents
        res.status(200).json({
            status: "success",
            page: page,
            result: result.length,
            message: `${document} found`,
            data: result
        });
    });
}

// Function to get a single document by ID from the database
const getOne = (model, document ) => {
    return catchAsyncError(async (req, res, next) => {
        // Find document by ID
        let query = model.findById(req.params.id);
        const result = await query;
        // If not found, return a not found error
        if (!result) return next(new AppError(`${document} not found`, 404));

        // Respond with success message and the fetched document
        res.status(200).json({
            status: "success",
            message: `${document} found`,
            data: result
        });
    });
}

// Function to delete a document by ID from the database
const deleteOne = (model, document) => {
    return catchAsyncError(async (req, res, next) => {
        // Find and delete document by ID
        const result = await model.findByIdAndDelete(req.params.id);
        // If not found, return a not found error
        if (!result) return next(new AppError(`${document} not found`, 404));

        // Respond with success message and the deleted document
        res.status(200).json({
            status: "success",
            message: `${document} deleted successfully`,
            data: result
        });
    });
}

// Function to update a document by ID in the database
const updateOne = (model, document) => {
    return catchAsyncError(async (req, res, next) => {
        // Find and update document by ID, return the updated document
        const result = await model.findByIdAndUpdate(req.params.id, req.body, { new: true });
        // If not found, return a not found error
        if (!result) return next(new AppError(`${document} not found`, 404));

        // Respond with success message and the updated document
        res.status(200).json({
            status: "success",
            message: `${document} updated successfully`,
            data: result
        });
    });
}

// Export all CRUD functions
export { addOne, getAllDocuments, getOne, deleteOne, updateOne };
