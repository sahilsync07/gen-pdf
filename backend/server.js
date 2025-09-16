const express = require("express");
const PDFDocument = require("pdfkit");
const axios = require("axios");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post("/generate-pdf", async (req, res) => {
  const { brands, onlyWithPhotos, minQty } = req.body;
  try {
    const jsonUrl =
      "https://raw.githubusercontent.com/sahilsync07/sbe/main/frontend/public/assets/stock-data.json";
    const response = await axios.get(jsonUrl);
    const data = response.data;

    const filteredGroups = data.filter((group) =>
      brands.includes(group.groupName)
    );
    const doc = new PDFDocument({
      autoFirstPage: false,
      margins: { top: 0, bottom: 0, left: 0, right: 0 }, // Reduced margins
    });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=products.pdf");
    doc.pipe(res);

    for (const group of filteredGroups) {
      for (const product of group.products) {
        if ((onlyWithPhotos && !product.imageUrl) || product.quantity <= minQty)
          continue;
        if (product.imageUrl) {
          try {
            const imgResponse = await axios.get(product.imageUrl, {
              responseType: "arraybuffer",
            });
            const imgBuffer = Buffer.from(imgResponse.data, "binary");
            doc.addPage();
            const img = doc.openImage(imgBuffer);
            const imgWidth = 500; // Max width with reduced margins
            const imgHeight = img.height * (imgWidth / img.width); // Maintain aspect ratio
            const maxHeight = doc.page.height - 60; // Space for white bar
            const finalHeight = imgHeight > maxHeight ? maxHeight : imgHeight;
            doc.image(imgBuffer, 10, 10, {
              width: imgWidth,
              height: finalHeight,
            });

            // White bar
            doc.rect(10, finalHeight + 10, imgWidth, 40).fill("white");
            doc
              .fillColor("black")
              .fontSize(12)
              .text(
                `${product.productName} - Qty: ${product.quantity}`,
                20,
                finalHeight + 20
              );
          } catch (imgErr) {
            console.error(
              `Error fetching image for ${product.productName}: ${imgErr}`
            );
          }
        } else {
          doc.addPage();
          doc
            .fontSize(25)
            .text(`${product.productName} - Qty: ${product.quantity}`, 20, 20);
        }
      }
    }
    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating PDF");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
