import multer from "multer";

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/temp"); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        // Optionally add a unique suffix to the file name to avoid overwrites
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
    },
});

// Multer instance with any() to handle multiple file inputs dynamically
const upload = multer({ storage }).any();

// Middleware to handle dynamic fields
const handleDynamicFields = (req, res, next) => {
    req.dynamicFields = {};
    const files = req.files;

    // Process each file field
    for (const file of files) {
        // Extract index from the field name (e.g., productImages[0])
        const index = file.fieldname.match(/\d+/)
            ? file.fieldname.match(/\d+/)[0]
            : "default";

        // Initialize the array for this index if it doesn't exist
        if (!req.dynamicFields[index]) {
            req.dynamicFields[index] = [];
        }

        // Add the file to the corresponding index array
        req.dynamicFields[index].push(file);
    }

    next();
};

export { handleDynamicFields, upload };
