import multer, { diskStorage } from "multer";

export const uploadCloud = (fileType) => {
  const storage = diskStorage({}); // data automatically save in temp folder

  const fileFilter = (req, file, cb) => {
    //accept only images
    if (!fileType.includes(file.mimetype)) return cb(new Error(`Invalid format we only accept ${JSON.stringify(fileType)}`, { cause: 400 }), false);

    return cb(null, true);
  };

  //multer function to upload file
  const multerUpload = multer({ storage, fileFilter });
  return multerUpload;
};
