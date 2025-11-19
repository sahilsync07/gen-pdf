const express = require("express");
const PDFDocument = require("pdfkit");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
  res.json({ 
    message: "Sri Brundabana Enterprises PDF Generator", 
    status: "FINAL PERFECT VERSION - EXACTLY ONE PAGE PER PRODUCT", 
  });
});

app.post("/generate-pdf", async (req, res) => {
  const { brands, onlyWithPhotos, minQty } = req.body;

  if (!brands || brands.length === 0) {
    return res.status(400).send("No brands selected");
  }

  try {
    const jsonUrl = "https://raw.githubusercontent.com/sahilsync07/sbe/main/frontend/public/assets/stock-data.json";
    const response = await axios.get(jsonUrl);
    const data = response.data;

    const filteredGroups = data.filter((group) => brands.includes(group.groupName));

    const today = new Date().toISOString().split("T")[0];
    const safeBrands = brands.map(b => b.toString().replace(/[\/\\?%*:|"<>]/g, "_")).sort().join("-");
    const filename = safeBrands ? `${safeBrands}_${today}.pdf` : `Products_${today}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    const doc = new PDFDocument({
      size: "A4",
      autoFirstPage: false,
      margins: { top: 0, bottom: 0, left: 0, right: 0 }
    });

    doc.pipe(res);

    for (const group of filteredGroups) {
      let isFirstProductInBrand = true;

      for (const product of group.products) {
        if (onlyWithPhotos && !product.imageUrl) continue;
        if (product.quantity <= minQty) continue;

        doc.addPage();

        // Light beige background (no overflow)
        doc.rect(0, 0, doc.page.width, doc.page.height).fill("#faf8f6");
        // Subtle waves (kept - they look premium)
        doc
          .moveTo(0, 0)
          .lineTo(200, 80)
          .quadraticCurveTo(300, 0, 600, 100)
          .strokeColor("#e0e0e0")
          .lineWidth(3)
          .stroke();

        doc
          .moveTo(0, doc.page.height)
          .lineTo(250, doc.page.height - 100)
          .quadraticCurveTo(350, doc.page.height, 600, doc.page.height - 50)
          .strokeColor("#e0e0e0")
          .lineWidth(3)
          .stroke();

        // Brand name only on first product page - smaller & higher to avoid overflow
        if (isFirstProductInBrand) {
          doc
            .fillOpacity(0.2)
            .fontSize(28)
            .font("Helvetica-Bold")
            .fillColor("#000000")
            .text(group.groupName, 0, 20, {
              width: doc.page.width,
              align: "center"
            });
          doc.fillOpacity(1.0);
          isFirstProductInBrand = false;
        }

        if (product.imageUrl) {
          try {
            const imgResponse = await axios.get(product.imageUrl, { responseType: "arraybuffer", timeout: 15000 });
            const imgBuffer = Buffer.from(imgResponse.data);
            const img = doc.openImage(imgBuffer);

            // Max size with safety for text & heading
            const maxWidth = doc.page.width - 40;
            const maxHeight = doc.page.height - 150; // Safe for heading + text

            const scale = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
            const finalWidth = img.width * scale;
            const finalHeight = img.height * scale;

            const x = (doc.page.width - finalWidth) / 2;
            const y = 60; // Start after heading, no overlap

            doc.image(imgBuffer, x, y, { width: finalWidth, height: finalHeight });

            const textY = y + finalHeight + 25; // Safe spacing

            // Centered text - fits one page
            doc
              .fillColor("#000000")
              .fontSize(16)
              .font("Helvetica-Bold")
              .text(product.productName, 0, textY, {
                width: doc.page.width,
                align: "center"
              });

            doc
              .fontSize(18)
              .font("Helvetica-Bold")
              .fillColor("#d40000")
              .text(`Qty: ${product.quantity}`, 0, textY + 30, {
                width: doc.page.width,
                align: "center"
              });

          } catch (imgErr) {
            console.error(`Image failed: ${product.productName}`);
            doc.fontSize(16).text("Image Load Failed", { align: "center" });
          }
        } else {
          doc.fontSize(20).text(product.productName, { align: "center" });
          doc.fontSize(18).text(`Qty: ${product.quantity}`, { align: "center" });
        }
      }
    }

    doc.end();
  } catch (err) {
    console.error("Error:", err);
    if (!res.headersSent) res.status(500).send("Try again");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`SBE PDF Generator live on port ${port}`);
});