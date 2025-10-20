const { jsPDF } = window.jspdf;
const imageInput = document.getElementById("imageInput");
const previewImg = document.getElementById("previewImg");
const createPdfBtn = document.getElementById("createPdfBtn");

let selectedFile = null;

// Preview the image after selection
imageInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    selectedFile = file;
    const url = URL.createObjectURL(file);
    previewImg.src = url;
    previewImg.style.display = "block";
    createPdfBtn.disabled = false;
  }
});

// Convert to PDF
createPdfBtn.addEventListener("click", async () => {
  if (!selectedFile) return;

  try {
    const imgData = await fileToBase64(selectedFile);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const img = new Image();
    img.src = imgData;
    img.onload = () => {
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const ratio = Math.min(pageWidth / img.width, pageHeight / img.height);
      const imgWidth = img.width * ratio;
      const imgHeight = img.height * ratio;
      const x = (pageWidth - imgWidth) / 2;
      const y = (pageHeight - imgHeight) / 2;

      pdf.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight);

      // ✅ Open in a new tab for Safari preview
      const blob = pdf.output('blob');
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    };
  } catch (error) {
    console.error("PDF generation failed:", error);
    alert("Something went wrong while creating the PDF.");
  }
});

// Convert file to base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
