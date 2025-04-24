const express = require("express");
const documentController = require("../controllers/DocumentController");
const router = express.Router();
const upload = require("../multer/upload");
const verifyToken = require("../security/VerifyToken");

// router.post("/upload", documentController.uploadDocument);
// router.post(
//   "/upload",
//   upload.single("file"),
//   documentController.uploadDocument
// );
router.post(
  "/upload",
  verifyToken,
  upload.single("file"),
  (req, res, next) => {
    // console.log("multer finished:", req.file);
    next();
  },
  documentController.uploadDocument
);

module.exports = router;
