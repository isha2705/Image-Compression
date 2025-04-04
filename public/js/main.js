// Show image preview when file is selected
document.addEventListener('DOMContentLoaded', function() {
  // Handle quality slider
  const qualitySlider = document.getElementById('quality');
  const qualityValue = document.getElementById('qualityValue');
  
  if (qualitySlider && qualityValue) {
    qualitySlider.addEventListener('input', function() {
      qualityValue.textContent = this.value;
    });
  }
  
  // File input preview
  const fileInput = document.getElementById('image');
  
  if (fileInput) {
    fileInput.addEventListener('change', function() {
      if (this.files && this.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
          // Create preview if it doesn't exist
          let preview = document.getElementById('imagePreview');
          
          if (!preview) {
            preview = document.createElement('div');
            preview.id = 'imagePreview';
            preview.className = 'mt-3 text-center';
            preview.innerHTML = `
              <p class="mb-2">Preview:</p>
              <img src="${e.target.result}" alt="Preview" class="img-fluid mb-2" style="max-height: 200px; border-radius: 5px;">
            `;
            
            fileInput.parentNode.appendChild(preview);
          } else {
            preview.querySelector('img').src = e.target.result;
          }
        };
        
        reader.readAsDataURL(this.files[0]);
      }
    });
  }
  
  // Format dropdown change handler
  const formatSelect = document.getElementById('format');
  
  if (formatSelect) {
    formatSelect.addEventListener('change', function() {
      const selectedFormat = this.value;
      const qualitySlider = document.getElementById('quality');
      
      // Adjust quality slider based on format
      if (selectedFormat === 'webp' || selectedFormat === 'avif') {
        qualitySlider.max = '100';
      } else if (selectedFormat === 'png') {
        qualitySlider.max = '9';
        qualitySlider.value = Math.min(9, qualitySlider.value);
        qualityValue.textContent = qualitySlider.value;
      } else {
        qualitySlider.max = '100';
      }
    });
  }
}); 