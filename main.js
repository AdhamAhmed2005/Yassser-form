const rechargeAmounts = {
  '50': 63,
  '100': 125,
  '200': 250,
  '300': 370,
  '400': 490,
  '500': 610,
  '1000': 1210
};

document.addEventListener('DOMContentLoaded', () => {
  const serviceBtns = document.querySelectorAll('.service-btn');
  const balance = document.getElementById('balance');
  const cashAmount = document.getElementById('cashAmount');
  const phone = document.getElementById('phone');
  const passwordField = document.getElementById('passwordField');
  const cashPayment = document.getElementById('cashPayment');
  const instaPayment = document.getElementById('instaPayment');
  const cashInfo = document.getElementById('cashInfo');
  const instaInfo = document.getElementById('instaInfo');
  const uploadContainer = document.getElementById('uploadContainer');
  const screenshot = document.getElementById('screenshot');
  const imagePreview = document.getElementById('imagePreview');
  const previewImg = document.getElementById('previewImg');
  const deleteImage = document.getElementById('deleteImage');
  const submitBtn = document.getElementById('submitBtn');
  const successContainer = document.getElementById('successContainer');

  serviceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      serviceBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const isPackages = btn.dataset.service === 'packages';
      passwordField.style.display = isPackages ? 'block' : 'none';
      const balanceLabel = balance.parentElement.querySelector('label');
      balanceLabel.textContent = isPackages ? 'شحن الباقة:' : 'اختار الرصيد:';
    });
  });

  function validateInput(input, validationId, validationMessage) {
    const validationElement = document.getElementById(validationId);
    if (!input.value) {
      validationElement.textContent = 'هذا الحقل مطلوب';
      input.style.borderColor = '#e60000';
      return false;
    }
    validationElement.textContent = validationMessage || '';
    input.style.borderColor = validationMessage ? '#e60000' : '#ddd';
    return !validationMessage;
  }

  phone.addEventListener('input', () => {
    const value = phone.value;
    const isValid = /^010\d{8}$/.test(value);
    validateInput(phone, 'phoneValidation', 
      isValid ? '' : 'يجب أن يبدأ الرقم ب 010 ويتكون من 11 رقم');
  });

  balance.addEventListener('change', () => {
    const amount = balance.value;
    validateInput(balance, 'balanceValidation');

    if (amount in rechargeAmounts) {
      document.getElementById('sendAmount').textContent = rechargeAmounts[amount];
      document.getElementById('receiveAmount').textContent = amount;
      cashAmount.style.display = 'block';
    } else {
      cashAmount.style.display = 'none';
    }
  });

  cashPayment.addEventListener('change', () => {
    cashInfo.style.display = 'block';
    instaInfo.style.display = 'none';
  });

  instaPayment.addEventListener('change', () => {
    cashInfo.style.display = 'none';
    instaInfo.style.display = 'block';
  });

  uploadContainer.addEventListener('click', () => {
    screenshot.click();
  });

  screenshot.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImg.src = e.target.result;
        uploadContainer.style.display = 'none';
        imagePreview.style.display = 'block';
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  });

  deleteImage.addEventListener('click', () => {
    screenshot.value = '';
    imagePreview.style.display = 'none';
    uploadContainer.style.display = 'block';
  });

  submitBtn.addEventListener('click', (e) => {
    const isPhoneValid = validateInput(phone, 'phoneValidation');
    const isBalanceValid = validateInput(balance, 'balanceValidation');
    const isScreenshotUploaded = screenshot.files.length > 0;

    if (!isScreenshotUploaded) {
      document.getElementById('imagePreview').style.border = '2px solid #e60000';
      alert('يجب رفع صورة الإيصال');
    } else {
      document.getElementById('imagePreview').style.border = 'none';
    }

    if (!isPhoneValid || !isBalanceValid || !isScreenshotUploaded) {
      e.preventDefault();
      return;
    }

    successContainer.style.display = 'block';
    setTimeout(() => {
      successContainer.style.display = 'none';
    }, 3000);
  });
});