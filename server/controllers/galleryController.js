import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../routes/cloudinary.js";

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

// Gallery storage
const galleryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "lms_gallery",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

// Receipt storage
const receiptStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "lms_receipt",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({
  storage: galleryStorage,
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
      url: file.path,
      public_id: file.filename,
    }));

    return res.status(201).json({
      success: true,
      message: "Images uploaded successfully",
      images,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      success: false,
      error: "Image upload failed",
    });
  }
};

export const uploadReceiptImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "No images uploaded" });
    }

    const images = req.files.map((file) => ({
      filename: file.filename,
      url: file.path,
      public_id: file.filename,
    }));

    return res.status(201).json({
      success: true,
      message: "Receipt images uploaded successfully",
      images,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      success: false,
      error: "Receipt image upload failed",
    });
  }
};

export const getGalleryImages = async (req, res) => {
  try {
    // Fetch all images from Cloudinary lms_gallery folder
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: "lms_gallery",
      max_results: 500,
    });

    const images = result.resources.map((resource) => ({
      url: resource.secure_url,
      public_id: resource.public_id,
      filename: resource.public_id.split("/").pop(),
    }));

    return res.status(200).json({
      success: true,
      images,
    });
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch gallery images",
    });
  }
};

export const deleteGalleryImage = async (req, res) => {
  try {
    const { filename } = req.params;

    // Decode the URL-encoded public_id
    const publicId = decodeURIComponent(filename);

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    return res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to delete image",
    });
  }
};


export const receiptUpload = multer({
  storage: receiptStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export default upload;
