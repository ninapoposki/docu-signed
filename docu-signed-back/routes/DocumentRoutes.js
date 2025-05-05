const express = require("express");
const documentController = require("../controllers/DocumentController");
const router = express.Router();
const upload = require("../multer/upload");
const verifyToken = require("../security/VerifyToken");
const documentHistoryController = require("../controllers/DocumentHistoryController");
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

//document history
router.post("/upload-history", documentHistoryController.createHistory);
router.post("/finalize-signature", documentController.finalizeSignature);

router.get(
  "/document-history/:documentId",
  documentHistoryController.getHistoryForDocument
);
router.get("/:id", documentController.getDocumentById);

router.post("/send-for-signature", documentController.sendForSignature);
router.post("/send-final-email", documentHistoryController.sendFinalDocument);

module.exports = router;
