import multer from "multer";

const upload = multer({
    dest: 'uploads/', // specify the destination directory for uploaded files
    limits: { fileSize: 500 * 1024 * 1024 } // limit file size to 500MB
});

export default upload;