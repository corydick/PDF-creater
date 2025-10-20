const imageInput = document.getElementById('imageInput');
const previewImg = document.getElementById('previewImg');
const createPdfBtn = document.getElementById('createPdfBtn');
let imageFile = null;

imageInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    imageFile = file;
    const url = URL.createObjectURL(file);
    previewImg.src = url;
    previewImg.style.display = 'block';
    createPdfBtn.disabled = false;
  }
});

createPdfBtn.addEventListener('click', async () => {
  if (!imageFile) return;

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const imgData = await fileToBase64(imageFile);

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

    const pdfBlob = pdf.output('blob');
    const pdfURL = URL.createObjectURL(pdfBlob);
    window.open(pdfURL, '_blank');
  };
});

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
