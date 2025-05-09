const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const { PDFDocument } = require("pdf-lib");

async function convertDocxToPdf(inputPath) {
  return new Promise((resolve, reject) => {
    const outputDir = path.dirname(inputPath);

    const sofficePath = `"C:\\Program Files\\LibreOffice\\program\\soffice.exe"`;
    //komandna linija ,za konvertovanje iz docx u pdf
    const command = `${sofficePath} --headless --convert-to pdf --outdir "${outputDir}" "${inputPath}"`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        return reject(new Error(`LibreOffice error: ${stderr || stdout}`));
      }

      const outputPdfPath = inputPath.replace(/\.docx$/, ".pdf");

      try {
        const pdfBuffer = fs.readFileSync(outputPdfPath);
        resolve(pdfBuffer);
      } catch (readError) {
        reject(readError);
      }
    });
  });
}
async function convertImageToPdf(imagePath, outputPdfPath) {
  const imageBytes = fs.readFileSync(imagePath);
  const pdfDoc = await PDFDocument.create();
  console.log("Converting image:", imagePath);

  let image, dims;
  if (
    imagePath.toLowerCase().endsWith(".jpg") ||
    imagePath.toLowerCase().endsWith(".jpeg")
  ) {
    image = await pdfDoc.embedJpg(imageBytes);
    dims = image.scale(1);
  } else if (imagePath.toLowerCase().endsWith(".png")) {
    image = await pdfDoc.embedPng(imageBytes);
    dims = image.scale(1);
  } else {
    throw new Error("Unsupported image format.");
  }

  const page = pdfDoc.addPage([dims.width, dims.height]);
  page.drawImage(image, {
    x: 0,
    y: 0,
    width: dims.width,
    height: dims.height,
  });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPdfPath, pdfBytes);
}

module.exports = { convertDocxToPdf, convertImageToPdf };
