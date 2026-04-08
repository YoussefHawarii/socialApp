import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid";
import path from "path";
import fs from "fs";
// diskStorage save file in file system
// multer

export const fileValidation = {
  images: ["image/jpeg", "image/png"],
  files: ["application/pdf"],
};

export const upload = (fileType, folder) => {
  const storage = diskStorage({
    destination: (req, file, cb) => {
      //create folder if not exist
      const folderPath = path.resolve(".", `${folder}/${req.user._id}`);
      fs.mkdirSync(folderPath, { recursive: true });
      //save file in folder with the name of the user id to avoid overwriting files with the same name and to make it easier to find the file of a specific user
      const folderName = `${folder}/${req.user._id}`;
      cb(null, folderName);
    },
    filename: (req, file, cb) => {
      //!test   console.log({ file });
      //save file
      // concatenate a randomID with the original name of the file to make sure that the file name is unique and avoid overwriting files with the same name
      //* i can use Date.now() instead of nanoid to generate a unique file name but nanoid is more secure and generates a shorter id than Date.now()
      cb(null, nanoid() + "-" + file.originalname);
    },
  });

  const fileFilter = (req, file, cb) => {
    //accept only images
    if (!fileType.includes(file.mimetype)) return cb(new Error(`Invalid format we only accept ${JSON.stringify(fileType)}`, { cause: 400 }), false);

    return cb(null, true);
  };
  //multer function to upload file
  const multerUpload = multer({ storage, fileFilter });
  return multerUpload;
};
