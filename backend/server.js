const express = require("express");
const PDFDocument = require("pdfkit");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Simple root route for health check
app.get("/", (req, res) => {
  res.json({ 
    message: "Sri Brundabana Enterprises PDF Generator API", 
    status: "Live & Ready", 
    endpoint: "/generate-pdf (POST only)",
    docs: "Use from your Vue app to generate product catalogs"
  });
});

app.post("/generate-pdf", async (req, res) => {
  const { brands, onlyWithPhotos, minQty } = req.body;

  if (!brands || brands.length === 0) {
    return res.status(400).send("No brands selected");
  }

  try {
    const jsonUrl =
      "https://raw.githubusercontent.com/sahilsync07/sbe/main/frontend/public/assets/stock-data.json";
    const response = await axios.get(jsonUrl);
    const data = response.data;

    const filteredGroups = data.filter((group) =>
      brands.includes(group.groupName)
    );

    // Generate safe filename
    const today = new Date().toISOString().split("T")[0];
    const safeBrands = brands
      .map((b) => b.toString().replace(/[\/\\?%*:|"<>]/g, "_"))
      .sort()
      .join("-");
    const filename = safeBrands ? `${safeBrands}_${today}.pdf` : `Products_${today}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    const doc = new PDFDocument({
      autoFirstPage: false,
      margins: { top: 0, bottom: 0, left: 0, right: 0 },
    });

    doc.pipe(res);

    for (const group of filteredGroups) {
      for (const product of group.products) {
        if (onlyWithPhotos && !product.imageUrl) continue;
        if (product.quantity <= minQty) continue;

        let imageAdded = false;

        if (product.imageUrl) {
          try {
            const imgResponse = await axios.get(product.imageUrl, {
              responseType: "arraybuffer",
              timeout: 15000,
            });
            const imgBuffer = Buffer.from(imgResponse.data);

            doc.addPage(); // One clean page per product

            const img = doc.openImage(imgBuffer);
            const originalWidth = img.width;
            const originalHeight = img.height;

            // Max allowed width (same as before — works perfectly for 4:3)
            const maxDisplayWidth = 540;

            // Calculate height using original ratio
            let displayWidth = maxDisplayWidth;
            let displayHeight = (originalHeight / originalWidth) * maxDisplayWidth;

            // If image is too tall (more than ~A4 height), reduce width to make it shorter
            if (displayHeight > 700) {
              displayHeight = 700;
              displayWidth = (originalWidth / originalHeight) * 700;
            }

            // Place at top-left with safe margin — simple and reliable
            doc.image(imgBuffer, 30, 50, {
              width: displayWidth,
              height: displayHeight,
            });

            // White text bar at bottom of image
            const textY = 50 + displayHeight + 10;
            doc.rect(20, textY - 5, 560, 50).fill("white");
            doc
              .fillColor("black")
              .fontSize(16)
              .font("Helvetica-Bold")
              .text(`${product.productName}`, 40, textY, { width: 520 })
              .fontSize(14)
              .font("Helvetica")
              .text(`Qty: ${product.quantity}`, 40, textY + 22);

            imageAdded = true;
          } catch (imgErr) {
            console.error(`Image failed: ${product.productName}`, imgErr.message);
          }
        }

        if (!imageAdded) {
          doc.addPage();
          doc
            .fontSize(24)
            .fillColor("black")
            .text(`${product.productName}`, 50, 100);
          doc
            .fontSize(18)
            .text(`Quantity: ${product.quantity}`, 50, 150);
        }
      }
    }

    doc.end();
  } catch (err) {
    console.error("PDF Generation Error:", err);
    if (!res.headersSent) {
      res.status(500).send("Server error – please try again in 30 seconds");
    }
  }
});

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`PDF Server running on port ${port}`);
});