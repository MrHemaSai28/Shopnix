$(document).ready(function() {
    let currentStep = 1;
    let selectedTheme = null;
    let formData = {};

    // Theme selection
    $('.theme-card').on('click', function() {
        $('.theme-card').removeClass('selected');
        $(this).addClass('selected');
        selectedTheme = $(this).data('theme');
        $('#nextBtn1').prop('disabled', false);
    });

    // Checkbox functionality
    $('.checkbox').on('click', function() {
        $(this).toggleClass('checked');
        if (this.id === 'skuCheckbox') {
            if ($(this).hasClass('checked')) {
                $('#skuGroup').show();
            } else {
                $('#skuGroup').hide();
            }
        }
    });

    // File upload
    // === Begin PATCH for image upload (keep the rest of your code same) ===

$('#uploadArea').on('click keydown', function (e) {
    if (e.type === "click" || (e.type === "keydown" && (e.key === "Enter" || e.key === " "))) {
        $('#imageInput').click();
    }
});


$('#imageInput').on('change', function () {
    const files = this.files;
    const preview = $('#imagePreviewContainer');
    preview.empty();

    if (files && files.length > 0) {
        $('#uploadArea').addClass('real-time-update');
        $('#uploadText').text(`${files.length} file(s) selected`);
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const img = $('<img>');
                    img.attr('src', e.target.result);
                    img.css({
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '2px solid #eee'
                    });
                    preview.append(img);
                };
                reader.readAsDataURL(file);
            }
        });
        setTimeout(() => $('#uploadArea').removeClass('real-time-update'), 2000);
    } else {
        $('#uploadText').text('Click to upload images');
    }
});

// === End PATCH ===


    // Real-time form updates
    $('#productName').on('input', function() {
        const name = $(this).val() || 'Product title';
        $('#previewTitle').text(name).addClass('real-time-update');
        setTimeout(() => $('#previewTitle').removeClass('real-time-update'), 1000);
        validateStep3();
    });

    $('#productDesc').on('input', function() {
        const desc = $(this).val() || 'Example product description.';
        $('#previewDesc').text(desc).addClass('real-time-update');
        setTimeout(() => $('#previewDesc').removeClass('real-time-update'), 1000);
        validateStep3();
    });

    $('#listPrice, #discount').on('input', function() {
        updatePriceDisplay();
        validateStep3();
    });

    function updatePriceDisplay() {
        const listPrice = parseFloat($('#listPrice').val()) || 100;
        const discount = parseFloat($('#discount').val()) || 10;
        const salePrice = listPrice - (listPrice * discount / 100);
        $('#previewOriginal').text(`RS ${listPrice}`).addClass('real-time-update');
        $('#previewSale').text(`RS ${Math.round(salePrice)}`).addClass('real-time-update');
        setTimeout(() => {
            $('#previewOriginal, #previewSale').removeClass('real-time-update');
        }, 1000);
    }

    $('#productType').on('input', function() {
        $('#nextBtn2').prop('disabled', $(this).val().trim() === '');
    });

    function validateStep3() {
        const name = $('#productName').val().trim();
        const desc = $('#productDesc').val().trim();
        $('#completeBtn').prop('disabled', !(name && desc));
    }

    $('#nextBtn1').on('click', function() {
        if (selectedTheme) {
            nextStep();
        }
    });

    $('#nextBtn2').on('click', function() {
        if ($('#productType').val().trim()) {
            nextStep();
        }
    });

    $('#backBtn2, #backBtn3').on('click', function() {
        prevStep();
    });

    $('#completeBtn').on('click', function() {
        if (validateForm()) {
            completeSetup();
        }
    });

    function nextStep() {
        if (currentStep < 3) {
            $(`.step-content[data-step="${currentStep}"]`).removeClass('active');
            $(`.step-item[data-step="${currentStep}"]`).removeClass('active').addClass('completed');
            currentStep++;
            $(`.step-content[data-step="${currentStep}"]`).addClass('active');
            $(`.step-item[data-step="${currentStep}"]`).addClass('active');
        }
    }

    function prevStep() {
        if (currentStep > 1) {
            $(`.step-content[data-step="${currentStep}"]`).removeClass('active');
            $(`.step-item[data-step="${currentStep}"]`).removeClass('active');
            currentStep--;
            $(`.step-content[data-step="${currentStep}"]`).addClass('active');
            $(`.step-item[data-step="${currentStep}"]`).removeClass('completed').addClass('active');
        }
    }

    function validateForm() {
        return $('#productName').val().trim() && $('#productDesc').val().trim();
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
            stock: $('#stock').val()
        };
        console.log('Setup Complete!', formData);
        alert('Shop setup completed successfully!');
        location.reload();
    }

    // Initialize price display
    updatePriceDisplay();
});
