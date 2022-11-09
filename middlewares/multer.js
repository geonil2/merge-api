const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/boards');
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const fileName = `${path.basename(
            file.originalname,
            ext
        )}_${Date.now()}${ext}`;
        cb(null, fileName);
    },
});
const limits = { fileSize: 5 * 1024 * 1024 };

const multerConfig = {
    storage,
    limits,
};

module.exports = multer(multerConfig);


