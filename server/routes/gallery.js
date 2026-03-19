import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import upload, {
  uploadImages,
  getGalleryImages,
  deleteGalleryImage,
  receiptUpload,
  uploadReceiptImages,
} from "../controllers/galleryController.js"

const router = express.Router()

router.post('/upload', authMiddleware, upload.array("images", 10), uploadImages)
router.post(
  '/upload/receipt',
  authMiddleware,
  receiptUpload.array("images", 10),
  uploadReceiptImages
)
router.get('/', authMiddleware, getGalleryImages)
router.delete('/:filename', authMiddleware, deleteGalleryImage)
export default router