import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Ensure gallery folder exists
const galleryPath = "public/gallery";
if (!fs.existsSync(galleryPath)) {
  fs.mkdirSync(galleryPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, galleryPath);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      uniqueName + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/webp"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "No images uploaded" });
    }

    const images = req.files.map((file) => ({
      filename: file.filename,
      path: `/gallery/${file.filename}`,
    }));

    return res.status(201).json({
      success: true,
      message: "Images uploaded successfully",
      images,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Image upload failed",
    });
  }
};

export const getGalleryImages = async (req, res) => {
  try {
    const fs = await import("fs");
    const files = fs.readdirSync("public/gallery");

    const images = files.map((file) => ({
      url: `/gallery/${file}`,
    }));

    return res.status(200).json({
      success: true,
      images,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to fetch gallery images",
    });
  }
};

export const deleteGalleryImage = async (req, res) => {
  try {
    const { filename } = req.params;

    const filePath = path.join(
      __dirname,
      "../public/gallery",
      filename
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: "Image not found",
      });
    }

    fs.unlinkSync(filePath);

    return res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: "Failed to delete image",
    });
  }
};


export default upload;
