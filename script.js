document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const status = document.querySelector('#conversion-status');
  
    form.addEventListener('submit', function(event) {
      event.preventDefault();
  
      // Show loading message
      status.innerHTML = 'Converting...';
  
      // Read PDF file
      const fileInput = document.querySelector('input[type="file"]');
      const file = fileInput.files[0];
      const reader = new FileReader();
  
      reader.onload = function() {
        // Convert PDF to Word document
        const pdfData = new Uint8Array(reader.result);
  
        // Load PDF file
        PDFJS.getDocument(pdfData).then(function(pdf) {
          // Get text of first page
          pdf.getPage(1).then(function(page) {
            page.getTextContent().then(function(textContent) {
              const text = textContent.items.map(function(item) {
                return item.str;
              }).join('');
  
              // Convert text to Word document
              const doc = new Docxgen();
  
              doc.setData({
                text: text
              });
              doc.render();
  
              const out = doc.getZip().generate({type: 'blob'});
  
              saveAs(out, 'converted.docx');
  
              // Show download link when conversion is complete
              const link = document.createElement('a');
              link.href = 'converted.docx';
              link.download = 'converted.docx';
              link.innerHTML = 'Download Word Document';
  
              // Automatically click link to start download
              link.click();
            });
          });
        });
      };
  
      reader.readAsArrayBuffer(file);
    });
  });
  
  