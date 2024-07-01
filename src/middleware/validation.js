



const validation = (schema) => {
    return (req, res, next) => {
        let inputs = { ...req.body, ...req.params, ...req.query };
        const { error } = schema.validate(inputs, { abortEarly: false });
        if (error?.details) {
            res.status(400).json({error :error.details.map((detail) => detail.message) ,statusCode :400});
            
        } else {
            next();
        }
    };
};

export default validation