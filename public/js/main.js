// Main JavaScript functions for the Image Compressor app
document.addEventListener('DOMContentLoaded', function() {
  // Add active class to current nav item
  const currentPath = window.location.pathname;
  document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    const linkPath = link.getAttribute('href');
    if (currentPath === linkPath) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  // Handle quality slider
  const qualitySlider = document.getElementById('quality');
  const qualityValue = document.getElementById('qualityValue');
  
  if (qualitySlider && qualityValue) {
    qualitySlider.addEventListener('input', function() {
      const value = this.value;
      qualityValue.textContent = value;
      
      // Change badge color based on quality
      qualityValue.className = 'badge';
      if (value < 40) {
        qualityValue.classList.add('bg-danger');
      } else if (value < 70) {
        qualityValue.classList.add('bg-warning');
      } else {
        qualityValue.classList.add('bg-success');
      }
    });
  }
  
  // File input preview with animation
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
            preview.className = 'mt-4 text-center preview-container';
            preview.innerHTML = `
              <h6 class="mb-2">Preview:</h6>
              <div class="preview-image-container">
                <img src="${e.target.result}" alt="Preview" class="img-fluid preview-image">
              </div>
              <div class="preview-details mt-2">
                <span class="badge bg-info file-type-badge"></span>
                <span class="badge bg-secondary file-size-badge"></span>
                <span class="badge bg-dark file-dim-badge"></span>
              </div>
            `;
            
            fileInput.parentNode.parentNode.after(preview);
            
            // Apply entrance animation
            setTimeout(() => {
              preview.classList.add('preview-visible');
            }, 10);
          } else {
            preview.querySelector('img').src = e.target.result;
          }
          
          // Update file info
          const file = fileInput.files[0];
          const fileType = file.type.split('/')[1].toUpperCase();
          const fileSize = formatBytes(file.size);
          
          // Get image dimensions
          const img = new Image();
          img.onload = function() {
            preview.querySelector('.file-dim-badge').textContent = `${this.width} × ${this.height} px`;
            
            // Auto-fill width and height fields if they exist
            const widthInput = document.getElementById('width');
            const heightInput = document.getElementById('height');
            if (widthInput && heightInput) {
              widthInput.placeholder = this.width;
              heightInput.placeholder = this.height;
            }
          };
          img.src = e.target.result;
          
          preview.querySelector('.file-type-badge').textContent = fileType;
          preview.querySelector('.file-size-badge').textContent = fileSize;
        };
        
        reader.readAsDataURL(this.files[0]);
      }
    });
  }
  
  // Format dropdown change handler with enhanced UI feedback
  const formatSelect = document.getElementById('format');
  
  if (formatSelect) {
    formatSelect.addEventListener('change', function() {
      const selectedFormat = this.value;
      const qualitySlider = document.getElementById('quality');
      
      // Adjust quality slider based on format
      if (selectedFormat === 'webp' || selectedFormat === 'avif') {
        qualitySlider.max = '100';
        showToast(`${selectedFormat.toUpperCase()} format selected - best for web optimization`);
      } else if (selectedFormat === 'png') {
        qualitySlider.max = '9';
        qualitySlider.value = Math.min(9, qualitySlider.value);
        qualityValue.textContent = qualitySlider.value;
        showToast(`PNG format selected - best for images with transparency`);
      } else {
        qualitySlider.max = '100';
        showToast(`JPEG format selected - best for photographs`);
      }
      
      // Trigger input event to update UI
      qualitySlider.dispatchEvent(new Event('input'));
    });
  }
  
  // Add animation to cards
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.classList.add('card-hover');
    });
    
    card.addEventListener('mouseleave', function() {
      this.classList.remove('card-hover');
    });
  });
  
  // Add confirmation for delete actions
  document.querySelectorAll('form[action^="/delete"]').forEach(form => {
    form.addEventListener('submit', function(e) {
      if (!confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
        e.preventDefault();
      }
    });
  });
});

// Helper function to format bytes
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Show toast notification
function showToast(message) {
  // Create toast element if it doesn't exist
  let toastContainer = document.getElementById('toast-container');
  
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    document.body.appendChild(toastContainer);
  }
  
  // Create toast
  const toastId = 'toast-' + Date.now();
  const toastHtml = `
    <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header">
        <strong class="me-auto">Image Compressor</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        ${message}
      </div>
    </div>
  `;
  
  toastContainer.insertAdjacentHTML('beforeend', toastHtml);
  
  // Initialize and show toast
  const toastElement = document.getElementById(toastId);
  const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
  toast.show();
  
  // Remove toast after it's hidden
  toastElement.addEventListener('hidden.bs.toast', function() {
    this.remove();
  });
} 