import categoryModel from "../../database/models/categoryModel.js";
import reviewModel from "../../database/models/reviewModel.js";
import ApiFeatures from "../utils/ApiFeatures.js";
import AppError from "../utils/AppError.js";
import catchAsyncError from "../utils/catchAsyncError.js";

// Function to handle options for different models based on request data
const handleOptions = (model, req) => {
    let options = {
        $and: [
            { name: req.body.name },
            { description: req.body.description }
        ]
    };

    // Customize options based on model type
    if (model === reviewModel) {
        req.body.user = req.user._id;
        options = {
            $and: [
                { user: req.body.user },
                { name: req.body.name }
            ]
        };
    } else if (model === categoryModel) {
        options = {
            $and: [
                { resturants: req.body.resturants },
                { name: req.body.name }
            ]
        };
    }
    return options;
};

// Function to add a document to the database
const addOne = (model, document) => {
    return catchAsyncError(async (req, res, next) => {
        // Determine options based on model and request data
        const options = handleOptions(model, req);

        // Handle file upload for category images
        if (req.file && document === 'category') {
            req.body.image = req.file.filename;
        }

        // Check if a document with the same criteria already exists
        let isFound = await model.findOne(options);
        if (isFound) return next(new AppError(`This ${document} is already entered before!`, 409));

        // Create and save the new document
        if(document == 'food'){
            req.body.resturant = req.user._id;
        }
        const result = new model(req.body);
        await result.save();

        // Respond with success message and the created document
        res.json({
            status: 'success',
            message: `${document} added successfully`,
            data: result
        });
    });
};

// Function to get all documents from the database
const getAllDocuments = (model, document, params) => {
    return catchAsyncError(async (req, res, next) => {
        let filter = {};

        // Apply filters based on URL parameters
        if (req.params.categoryId && params) {
            filter = { category: req.params.categoryId };
        } else if (req.params.userId && params) {
            filter = { restaurant: req.params.userId };
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
};

// Function to get a single document by ID from the database
const getOne = (model, document) => {
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
};

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
};

// Function to update a document by ID in the database
const updateOne = (model, document) => {
    return catchAsyncError(async (req, res, next) => {
        // Determine document ID to update
        let id = req.params.id ? req.params.id : req.user._id;

        // Handle file upload for category images
        if (req.file && document === 'category') {
            req.body.image = req.file.filename;
        }

        // Find and update document by ID, return the updated document
        const result = await model.findByIdAndUpdate(id, req.body, { new: true });

        // If not found, return a not found error
        if (!result) return next(new AppError(`${document} not found`, 404));

        // Respond with success message and the updated document
        res.status(200).json({
            status: "success",
            message: `${document} updated successfully`,
            data: result
        });
    });
};

// Export all CRUD functions
export { addOne, getAllDocuments, getOne, deleteOne, updateOne };
