const { PDFDocument, rgb } = require("pdf-lib");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const CloudConvert = require("cloudconvert");
const { convertDocxToPdf } = require("./ConvertDocxToPdf");

async function generateSignedDocument({
  filePath,
  fileType,
  signatureFields,
  outputPath,
}) {
  const displayWidth = 600;
  const displayHeight = 600;

  if (fileType.includes("pdf")) {
    const existingPdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();

    signatureFields.forEach((field) => {
      const page = pages[field.page - 1];
      const pageWidth = page.getWidth();
      const pageHeight = page.getHeight();

      const scale = pageWidth / displayWidth;

      const realLeft = field.left * scale;
      const realTop = field.top * scale;
      const realWidth = parseInt(field.width) * scale;
      const realHeight = parseInt(field.height) * scale;

      const [r, g, b] = hexToRgb(field.color || "#000000");

      page.drawLine({
        start: { x: realLeft, y: pageHeight - realTop - realHeight },
        end: { x: realLeft + realWidth, y: pageHeight - realTop - realHeight },
        thickness: 2,
        color: rgb(r / 255, g / 255, b / 255),
      });
    });

    const modifiedPdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPath, modifiedPdfBytes);
  } else if (
    fileType.includes("jpeg") ||
    fileType.includes("png") ||
    fileType.includes("image")
  ) {
    const image = sharp(filePath);
    const metadata = await image.metadata();

    const scaleX = metadata.width / displayWidth;
    const scaleY = metadata.height / displayHeight;
    const composites = signatureFields.map((field) => {
      const [r, g, b] = hexToRgb(field.color || "#000000");

      return {
        input: {
          create: {
            width: Math.round(parseInt(field.width) * scaleX),
            height: 3,
            channels: 4,
            background: { r, g, b, alpha: 1 },
          },
        },
        top: Math.round(field.top * scaleY),
        left: Math.round(field.left * scaleX),
      };
    });

    await image.composite(composites).toFile(outputPath);
  } else if (fileType.includes("wordprocessingml.document")) {
    const pdfBuffer = await convertDocxToPdf(filePath);
    const pdfPath = filePath.replace(/\.docx$/, ".converted.pdf");
    fs.writeFileSync(pdfPath, pdfBuffer);

    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const page = pdfDoc.getPages()[0];
    const pageHeight = page.getHeight(); // 792

    // Obrni top vrednosti jer frontend meri od vrha, a PDF od dna
    const adjustedFields = signatureFields.map((field) => ({
      ...field,
      top: pageHeight - field.top, // 🔥 ovo rešava problem!
    }));

    console.log("PDF dimenzije:", page.getWidth(), pageHeight);
    console.log("Preračunata top vrednost:", adjustedFields[0].top);

    await generateSignedDocument({
      filePath: pdfPath,
      fileType: "application/pdf",
      signatureFields: adjustedFields,
      outputPath,
    });
  } else {
    throw new Error("Unsupported file type for signing.");
  }
}

function hexToRgb(hex) {
  hex = hex.replace("#", "");
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}
// async function generateSignatures({ filePath, signatureFields, outputPath }) {
//   const ext = path.extname(filePath).toLowerCase();

//   if (ext === ".pdf") {
//     const existingPdfBytes = fs.readFileSync(filePath);
//     const pdfDoc = await PDFDocument.load(existingPdfBytes);
//     const pages = pdfDoc.getPages();
//     const displayWidth = 600;

//     for (const field of signatureFields) {
//       const page = pages[field.page - 1];
//       const pageWidth = page.getWidth();
//       const pageHeight = page.getHeight();

//       const scale = pageWidth / displayWidth;
//       const realLeft = field.x * scale;
//       const realTop = field.y * scale;
//       const realWidth = parseInt(field.width) * scale;
//       const realHeight = parseInt(field.height) * scale;

//       const imageBytes = Buffer.from(field.img.split(",")[1], "base64");
//       const pngImage = await pdfDoc.embedPng(imageBytes);

//       page.drawImage(pngImage, {
//         x: realLeft,
//         y: pageHeight - realTop - realHeight,
//         width: realWidth,
//         height: realHeight,
//       });
//     }

//     const modifiedPdfBytes = await pdfDoc.save();
//     fs.writeFileSync(outputPath, modifiedPdfBytes);
//   } else {
//     const image = sharp(filePath);
//     const metadata = await image.metadata();
//     const displayWidth = 600;
//     const displayHeight = 600;

//     const scaleX = metadata.width / displayWidth;
//     const scaleY = metadata.height / displayHeight;

//     const composites = signatureFields.map((field) => ({
//       input: Buffer.from(field.img.split(",")[1], "base64"),
//       top: Math.round(field.y * scaleY),
//       left: Math.round(field.x * scaleX),
//     }));

//     await image.composite(composites).toFile(outputPath);
//   }
async function generateSignatures({ filePath, signatureFields, outputPath }) {
  const ext = filePath.split(".").pop().toLowerCase();

  if (["jpg", "jpeg", "png"].includes(ext)) {
    // Za slike
    const image = sharp(filePath);
    const metadata = await image.metadata();
    // const scaleX = metadata.width / 600;
    const displayWidth = 600;
    const scaleX = (metadata.width || displayWidth) / displayWidth;

    const scaleY = metadata.height / 600;

    // const composites = signatureFields.map((field) => ({
    //   input: Buffer.from(field.img.split(",")[1], "base64"),
    //   top: Math.round(field.y * scaleY),
    //   left: Math.round(field.x * scaleX),
    // }));
    const composites = await Promise.all(
      signatureFields.map(async (field) => {
        const buffer = Buffer.from(field.img.split(",")[1], "base64");

        const resizedBuffer = await sharp(buffer)
          .resize({
            width: Math.round(field.width * scaleX),
            height: Math.round(field.height * scaleY),
            fit: "contain",
          })
          .toBuffer();

        return {
          input: resizedBuffer,
          top: Math.round(field.y * scaleY),
          left: Math.round(field.x * scaleX) - 190,
        };
      })
    );

    await image.composite(composites).toFile(outputPath);
  } else if (ext === "pdf") {
    // Za PDF
    const existingPdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();

    for (const field of signatureFields) {
      const imgBuffer = Buffer.from(field.img.split(",")[1], "base64");
      const embeddedImage = await pdfDoc.embedPng(imgBuffer);
      const page = pages[field.page - 1];
      const pageWidth = page.getWidth();
      const scale = pageWidth / 600;
      const offsetX = -90; // eksperimentalno
      const offsetY = 0;
      page.drawImage(embeddedImage, {
        x: field.x * scale + offsetX,
        y: page.getHeight() - (field.y + field.height) * scale,
        width: field.width * scale,
        height: field.height * scale,
      });
    }

    const modifiedPdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPath, modifiedPdfBytes);
  } else {
    throw new Error("Unsupported file type.");
  }
}

module.exports = {
  generateSignedDocument,
  generateSignatures,
};
