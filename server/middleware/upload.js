import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../routes/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "lms_uploads",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

export default upload;