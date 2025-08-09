$(document).ready(function() {
    let currentStep = 1;
    let selectedTheme = null;
    let formData = {};
    let uploadedImages = [];

    console.log('Wizard initialized');

    // Theme selection handler
    $('.theme-card').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        $('.theme-card').removeClass('selected');
        $(this).addClass('selected').addClass('real-time-update');
        
        selectedTheme = $(this).attr('data-theme');
        $('#nextBtn1').prop('disabled', false);
        
        console.log('Theme selected:', selectedTheme);
        
        setTimeout(() => {
            $(this).removeClass('real-time-update');
        }, 1000);
    });

    // Custom checkbox functionality
    $('.checkbox').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        $(this).toggleClass('checked');
        
        if (this.id === 'skuCheckbox') {
            if ($(this).hasClass('checked')) {
                $('#skuGroup').slideDown(300);
            } else {
                $('#skuGroup').slideUp(300);
                $('#skuCode').val('');
            }
        }
        
        console.log('Checkbox toggled:', this.id, $(this).hasClass('checked'));
    });

    // File upload handling
    $('#uploadArea').on('click', function(e) {
        if (e.target.type !== 'file') {
            e.preventDefault();
            $('#imageInput').trigger('click');
        }
    });

    $('#imageInput').on('change', function(e) {
        const files = Array.from(this.files);
        
        if (files.length > 0) {
            $('#uploadText').text(`${files.length} file(s) selected`);
            $('#uploadArea').addClass('real-time-update');
            
            uploadedImages = files;
            
            // Show first image in preview
            if (files[0] && files[0].type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    $('#previewImageSection').html(`
                        <img src="${e.target.result}" alt="Product Preview" class="preview-image">
                    `).addClass('real-time-update');
                    
                    setTimeout(() => {
                        $('#previewImageSection').removeClass('real-time-update');
                    }, 1000);
                };
                reader.readAsDataURL(files[0]);
            }
            
            setTimeout(() => {
                $('#uploadArea').removeClass('real-time-update');
            }, 2000);
            
            console.log('Files uploaded:', files.length);
        }
    });

    // Real-time form updates
    $('#productName').on('input', function() {
        const name = $(this).val().trim() || 'Product title';
        $('#previewTitle').text(name).addClass('real-time-update');
        setTimeout(() => $('#previewTitle').removeClass('real-time-update'), 1000);
        validateStep3();
    });

    $('#productDesc').on('input', function() {
        const desc = $(this).val().trim() || 'Esse minim eiusmod amet et incididunt magna consectetur laborum. Ipsum et cillum do exercitation nostrud nostrud ex.';
        $('#previewDesc').text(desc).addClass('real-time-update');
        setTimeout(() => $('#previewDesc').removeClass('real-time-update'), 1000);
        validateStep3();
    });

    $('#listPrice, #discount, #netPrice').on('input', function() {
        updatePriceDisplay();
        validateStep3();
    });

    function updatePriceDisplay() {
        const listPrice = parseFloat($('#listPrice').val()) || 100;
        const discount = parseFloat($('#discount').val()) || 10;
        const netPrice = parseFloat($('#netPrice').val()) || 80;
        
        let salePrice;
        if ($('#discount').val()) {
            salePrice = listPrice - (listPrice * discount / 100);
        } else {
            salePrice = netPrice;
        }
        
        $('#previewOriginal').text(`RS ${listPrice}`).addClass('real-time-update');
        $('#previewSale').text(`RS ${Math.round(salePrice)}`).addClass('real-time-update');
        
        setTimeout(() => {
            $('#previewOriginal, #previewSale').removeClass('real-time-update');
        }, 1000);
    }

    // Step 2 validation
    $('#productType').on('input', function() {
        const isValid = $(this).val().trim() !== '';
        $('#nextBtn2').prop('disabled', !isValid);
    });

    // Step 3 validation
    function validateStep3() {
        const name = $('#productName').val().trim();
        const desc = $('#productDesc').val().trim();
        const isValid = name && desc;
        $('#completeBtn').prop('disabled', !isValid);
        return isValid;
    }

    // Navigation event handlers
    $('#nextBtn1').on('click', function(e) {
        e.preventDefault();
        if (selectedTheme) {
            nextStep();
        } else {
            alert('Please select a theme first');
        }
    });

    $('#nextBtn2').on('click', function(e) {
        e.preventDefault();
        if ($('#productType').val().trim()) {
            nextStep();
        } else {
            alert('Please enter a product type');
        }
    });

    $('#backBtn2').on('click', function(e) {
        e.preventDefault();
        prevStep();
    });

    $('#backBtn3').on('click', function(e) {
        e.preventDefault();
        prevStep();
    });

    $('#completeBtn').on('click', function(e) {
        e.preventDefault();
        if (validateStep3()) {
            completeSetup();
        } else {
            alert('Please complete all required fields');
        }
    });

    function nextStep() {
        console.log('Moving to next step from:', currentStep);
        
        if (currentStep < 3) {
            // Hide current step
            $(`.step-content[data-step="${currentStep}"]`).removeClass('active');
            $(`.step-item[data-step="${currentStep}"]`).removeClass('active').addClass('completed');
            
            // Show next step
            currentStep++;
            $(`.step-content[data-step="${currentStep}"]`).addClass('active');
            $(`.step-item[data-step="${currentStep}"]`).addClass('active');
            
            console.log('Moved to step:', currentStep);
            
            // Scroll to top
            $('.wizard-main').scrollTop(0);
        }
    }

    function prevStep() {
        console.log('Moving to previous step from:', currentStep);
        
        if (currentStep > 1) {
            // Hide current step
            $(`.step-content[data-step="${currentStep}"]`).removeClass('active');
            $(`.step-item[data-step="${currentStep}"]`).removeClass('active');
            
            // Show previous step
            currentStep--;
            $(`.step-content[data-step="${currentStep}"]`).addClass('active');
            $(`.step-item[data-step="${currentStep}"]`).removeClass('completed').addClass('active');
            
            console.log('Moved back to step:', currentStep);
            
            // Scroll to top
            $('.wizard-main').scrollTop(0);
        }
    }

    function completeSetup() {
        // Collect all form data
        formData = {
            theme: selectedTheme,
            productType: $('#productType').val(),
            category: $('#category').val(),
            subCategory: $('#subCategory').val(),
            productName: $('#productName').val(),
            productDesc: $('#productDesc').val(),
            hasSKU: $('#skuCheckbox').hasClass('checked'),
            skuCode: $('#skuCode').val(),
            hasHSN: $('#hsnCheckbox').hasClass('checked'),
            gstInclusive: $('#gstCheckbox').hasClass('checked'),
            netPrice: $('#netPrice').val(),
            listPrice: $('#listPrice').val(),
            discount: $('#discount').val(),
            gstRate: $('#gstRate').val(),
            shipping: $('#shipping').val(),
            stock: $('#stock').val(),
            images: uploadedImages.length,
            uploadedFiles: uploadedImages.map(file => file.name)
        };

        console.log('Setup Complete! Form Data:', formData);
        
        // Show success animation
        $('.wizard-content').addClass('real-time-update');
        
        setTimeout(() => {
            alert('Shop setup completed successfully!\n\nData collected:\n' + 
                  'Theme: ' + formData.theme + '\n' +
                  'Product Type: ' + formData.productType + '\n' +
                  'Product Name: ' + formData.productName + '\n' +
                  'Images: ' + formData.images + ' files\n\n' +
                  'Check console for complete data.');
            
            $('.wizard-content').removeClass('real-time-update');
            
            // Reset option
            if (confirm('Reset form for demo?')) {
                resetForm();
            }
        }, 1000);
    }

    function resetForm() {
        currentStep = 1;
        selectedTheme = null;
        formData = {};
        uploadedImages = [];
        
        // Reset all forms
        $('input, textarea').val('');
        $('.theme-card').removeClass('selected');
        $('.checkbox').removeClass('checked');
        $('.step-content').removeClass('active');
        $('.step-item').removeClass('active completed');
        
        // Reset to first step
        $(`.step-content[data-step="1"]`).addClass('active');
        $(`.step-item[data-step="1"]`).addClass('active');
        
        // Reset buttons
        $('#nextBtn1, #nextBtn2, #completeBtn').prop('disabled', true);
        
        // Reset uploads
        $('#uploadText').text('Click to upload images');
        $('#previewImageSection').html(`
            <div class="preview-placeholder">
                <i class="fas fa-image"></i>
                <span>Product Image</span>
            </div>
        `);
        $('#skuGroup').hide();
        
        updatePriceDisplay();
        
        console.log('Form reset complete');
    }

    // Initialize price display
    updatePriceDisplay();
    
    console.log('All event handlers attached successfully');
});
