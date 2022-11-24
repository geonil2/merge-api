const multer = require('multer');
const path = require('path');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

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

aws.config.update({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: 'ap-northeast-2',
});

const s3 = new aws.S3();
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'merge-config-image',
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            cb(null, `boards/${Date.now()}_${file.originalname}`);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = process.env.NODE_ENV === 'production' ? upload : multer(multerConfig);


