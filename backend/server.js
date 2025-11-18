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
    status: "SEXIEST VERSION EVER 🚀", 
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
      margins: { top: 20, bottom: 20, left: 20, right: 20 }
    });

    doc.pipe(res);

    for (const group of filteredGroups) {
      const brandName = group.groupName; // For header

      for (const product of group.products) {
        if (onlyWithPhotos && !product.imageUrl) continue;
        if (product.quantity <= minQty) continue;

        doc.addPage();

        // === SEXY BACKGROUND - Light beige like Paragon ===
        doc.rect(0, 0, doc.page.width, doc.page.height).fill("#faf8f6");

        // === SUBTLE WAVE PATTERN (top & bottom like EEKEN) ===
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

        // === BRAND NAME AT TOP (faint & elegant) ===
        doc
          .fontSize(50)
          .fillColor("#dddddd")
          .font("Helvetica-Bold")
          .text(brandName, 0, 60, {
            width: doc.page.width,
            align: "center"
          });

        if (product.imageUrl) {
          try {
            const imgResponse = await axios.get(product.imageUrl, { responseType: "arraybuffer", timeout: 15000 });
            const imgBuffer = Buffer.from(imgResponse.data);
            const img = doc.openImage(imgBuffer);

            // MAXIMUM IMAGE SIZE (90% of page height)
            const maxWidth = doc.page.width - 80;
            const maxHeight = doc.page.height - 180; // Room for text

            const scale = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
            const finalWidth = img.width * scale;
            const finalHeight = img.height * scale;

            const x = (doc.page.width - finalWidth) / 2;
            const y = 120; // Start lower to avoid wave overlap

            doc.image(imgBuffer, x, y, { width: finalWidth, height: finalHeight });

            // Product name & Qty - BIG, BOLD, CENTERED
            const textY = y + finalHeight + 30;

            doc
              .fillColor("#000000")
              .fontSize(18)
              .font("Helvetica-Bold")
              .text(product.productName, 0, textY, {
                width: doc.page.width,
                align: "center"
              });

            doc
              .fontSize(20)
              .font("Helvetica-Bold")
              .fillColor("#d40000") // Red like in catalogs
              .text(`Qty: ${product.quantity}`, 0, textY + 40, {
                width: doc.page.width,
                align: "center"
              });

          } catch (imgErr) {
            doc.fontSize(20).text("Image Load Failed", { align: "center" });
          }
        } else {
          doc.fontSize(24).text(product.productName, { align: "center" });
          doc.fontSize(20).text(`Qty: ${product.quantity}`, { align: "center" });
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
  console.log(`SBE Sexy PDF Generator live on port ${port}`);
});