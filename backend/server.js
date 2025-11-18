const express = require("express");
const PDFDocument = require("pdfkit");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
  res.json({ 
    message: "Sri Brundabana Enterprises PDF Generator API", 
    status: "PERFECT & FINAL VERSION", 
    tip: "Your catalogs now look like ₹50 lakh brand catalogs"
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
      margins: { top: 40, bottom: 40, left: 30, right: 30 }
    });

    doc.pipe(res);

    for (const group of filteredGroups) {
      for (const product of group.products) {
        if (onlyWithPhotos && !product.imageUrl) continue;
        if (product.quantity <= minQty) continue;

        doc.addPage();

        if (product.imageUrl) {
          try {
            const imgResponse = await axios.get(product.imageUrl, { responseType: "arraybuffer", timeout: 15000 });
            const imgBuffer = Buffer.from(imgResponse.data);
            const img = doc.openImage(imgBuffer);

            // Max available width & height (leaving space for text)
            const maxWidth = doc.page.width - 80;
            const maxHeight = doc.page.height - 200;

            // Calculate scale to fit while preserving aspect ratio
            const scale = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
            const finalWidth = img.width * scale;
            const finalHeight = img.height * scale;

            // Center the image perfectly
            const x = (doc.page.width - finalWidth) / 2;
            const y = 60;

            doc.image(imgBuffer, x, y, { width: finalWidth, height: finalHeight });

            // Text area below image — perfectly centered
            const textY = y + finalHeight + 20;

            doc
              .fillColor("black")
              .font("Helvetica-Bold")
              .fontSize(14)
              .text(product.productName, 50, textY, {
                width: doc.page.width - 100,
                align: "center"
              });

            doc
              .font("Helvetica")
              .fontSize(16)
              .text(`Qty: ${product.quantity}`, 50, textY + 35, {
                width: doc.page.width - 100,
                align: "center"
              });

          } catch (imgErr) {
            console.error(`Image failed: ${product.productName}`);
            doc.fontSize(18).text("Image Not Available", { align: "center" });
          }
        } else {
          doc.fontSize(24).text(product.productName, { align: "center", width: doc.page.width });
          doc.fontSize(18).text(`Quantity: ${product.quantity}`, { align: "center", width: doc.page.width });
        }
      }
    }

    doc.end();
  } catch (err) {
    console.error("PDF Error:", err);
    if (!res.headersSent) res.status(500).send("Server busy – try again in 30s");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`SBE PDF Generator running on port ${port} — FINAL PERFECT VERSION`);
});