import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import upload, { deleteGalleryImage } from "../controllers/galleryController.js"
import { uploadImages,getGalleryImages } from "../controllers/galleryController.js"
const router = express.Router()

router.post('/upload',authMiddleware,upload.array("images",10),uploadImages)
router.get('/',authMiddleware,getGalleryImages)
router.delete('/:filename',authMiddleware,deleteGalleryImage)
export default router