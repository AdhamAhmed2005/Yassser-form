const rechargeAmounts = {
	50: 60,
	100: 115,
	200: 230,
	300: 345,
	400: 460,
	500: 575,
	1000: 1150,
	"13000 flex": 240,
	"26000 flex": 300,
	"unlimited(businnes)": 250,
};
let picked = 0;

document.addEventListener("DOMContentLoaded", () => {
	const serviceBtns = document.querySelectorAll(".service-btn");
	const balance = document.getElementById("balance");
	const packages = document.getElementById("packages");
	const cashAmount = document.getElementById("cashAmount");
	const pCashAmount = document.getElementById("pCashAmount");
	const phone = document.getElementById("phone");
	const passwordField = document.getElementById("passwordField");
	const password = document.getElementById("password");
	const cashInfo = document.getElementById("cashInfo");
	const cashSender = document.getElementById("cashSender");
	const uploadContainer = document.getElementById("uploadContainer");
	const screenshot = document.getElementById("screenshot");
	const imagePreview = document.getElementById("imagePreview");
	const previewImg = document.getElementById("previewImg");
	const deleteImage = document.getElementById("deleteImage");
	const submitBtn = document.getElementById("submitBtn");
	const successContainer = document.getElementById("successContainer");
	const paymentMethod = document.getElementById("paymentMethod");
	const greenContainer = document.querySelector(".green-container");
	const divs = [cashAmount, pCashAmount];

	function validateInput(input, validationId, validationMessage) {
		const validationElement = document.getElementById(validationId);
		if (!input.value.trim()) {
			validationElement.textContent = "هذا الحقل مطلوب";
			input.style.borderColor = "#e60000";
			return false;
		}
		validationElement.textContent = validationMessage || "";
		input.style.borderColor = validationMessage ? "#e60000" : "#d1d5db";
		return !validationMessage;
	}

	function validatePhone() {
		const value = phone.value;
		const isValid = /^01[0-2]\d{8}$/.test(value);
		return validateInput(
			phone,
			"phoneValidation",
			isValid ? "" : "يجب أن يتكون من 11 رقم"
		);
	}

	function validateBalance() {
		const activeSelect = picked === 0 ? balance : packages;
		return validateInput(activeSelect, "balanceValidation", "");
	}

	function validatePassword() {
		if (passwordField.style.display === "block") {
			const isValid = password.value.length >= 6;
			return validateInput(
				password,
				"passwordValidation",
				isValid ? "" : "كلمة المرور يجب أن تكون 6 أحرف على الأقل"
			);
		}
		return true;
	}

	function validateCashSender() {
		const value = cashSender.value;
		const isValid = /^01[0-2]\d{8}$/.test(value);
		return validateInput(
			cashSender,
			"cashSenderValidation",
			isValid ? "" : "يجب أن يتكون من 11 رقم"
		);
	}

	function validateScreenshot() {
		const isUploaded = screenshot.files.length > 0;
		const validationElement = document.getElementById("screenshotValidation");
		if (!isUploaded) {
			validationElement.textContent = "يجب رفع صورة الإيصال";
			imagePreview.style.border = "2px solid #e60000";
			return false;
		}
		validationElement.textContent = "";
		imagePreview.style.border = "none";
		return true;
	}

	function toggleSelectElements() {
		if (picked === 0) {
			balance.style.display = "block";
			packages.style.display = "none";
			paymentMethod.value = "recharge";
		} else {
			balance.style.display = "none";
			packages.style.display = "block";
			paymentMethod.value = "packages";
		}
	}

	serviceBtns.forEach((btn) => {
		btn.addEventListener("click", () => {
			serviceBtns.forEach((b) => b.classList.remove("active"));
			btn.classList.add("active");

			const service = btn.dataset.service;
			picked = service === "recharge" ? 0 : 1;
			passwordField.style.display = service === "packages" ? "block" : "none";
			divs.forEach((div) => (div.style.display = "none"));
			const targetDiv = service === "recharge" ? cashAmount : pCashAmount;
			const activeSelect = service === "recharge" ? balance : recharge;
			if (activeSelect.value in rechargeAmounts) {
				targetDiv.style.display = "block";
				greenContainer.style.display = "flex";
			}
			toggleSelectElements();
		});
	});

	phone.addEventListener("input", validatePhone);

	[balance, packages].forEach((select) => {
		select.addEventListener("change", () => {
			validateBalance();
			const amount = select.value;
			if (amount in rechargeAmounts) {
				const sendAmountId = picked === 0 ? "sendAmount1" : "sendAmount2";
				const receiveAmountId =
					picked === 0 ? "receiveAmount1" : "receiveAmount2";
				const targetDiv = picked === 0 ? cashAmount : pCashAmount;
				document.getElementById(sendAmountId).textContent =
					rechargeAmounts[amount];
				document.getElementById(receiveAmountId).textContent = amount;
				divs.forEach((div) => (div.style.display = "none"));
				targetDiv.style.display = "block";
				greenContainer.style.display = "flex";
			} else {
				divs.forEach((div) => (div.style.display = "none"));
				greenContainer.style.display = "none";
			}
		});
	});

	cashSender.addEventListener("input", validateCashSender);

	uploadContainer.addEventListener("click", () => {
		screenshot.click();
	});

	screenshot.addEventListener("change", (e) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			const validationElement = document.getElementById("screenshotValidation");
			const validTypes = ["image/png", "image/jpeg", "image/jpg"];
			if (!validTypes.includes(file.type)) {
				validationElement.textContent = "يجب أن تكون الصورة بصيغة PNG أو JPEG";
				screenshot.value = "";
				return;
			}
			if (file.size > 5 * 1024 * 1024) {
				validationElement.textContent =
					"حجم الصورة يجب أن يكون أقل من 5 ميجابايت";
				screenshot.value = "";
				return;
			}
			const reader = new FileReader();
			reader.onload = (e) => {
				previewImg.src = e.target.result;
				uploadContainer.style.display = "none";
				imagePreview.style.display = "block";
				validationElement.textContent = "";
				validateScreenshot();
			};
			reader.readAsDataURL(file);
		}
	});

	deleteImage.addEventListener("click", () => {
		screenshot.value = "";
		imagePreview.style.display = "none";
		uploadContainer.style.display = "block";
		document.getElementById("screenshotValidation").textContent =
			"يجب رفع صورة الإيصال";
	});

	// Password toggle
	const passwordToggle = document.createElement("span");
	passwordToggle.textContent = "Show";
	passwordToggle.classList.add("password-toggle");
	passwordField.style.position = "relative";
	password.style.paddingLeft = "50px";
	password.style.paddingRight = "10px";
	password.style.height = "40px";
	password.style.lineHeight = "40px";
	passwordToggle.style.position = "absolute";
	passwordToggle.style.left = "15px";
	passwordToggle.style.right = "auto";
	passwordToggle.style.top = "60%";
	passwordToggle.style.transform = "translateY(-60%)";
	passwordToggle.style.cursor = "pointer";
	passwordToggle.style.userSelect = "none";
	passwordField.appendChild(passwordToggle);

	passwordToggle.addEventListener("click", () => {
		if (password.type === "password") {
			password.type = "text";
			passwordToggle.textContent = "Hide";
		} else {
			password.type = "password";
			passwordToggle.textContent = "Show";
		}
	});

	password.style.width = "100%";
	password.style.boxSizing = "border-box";

	submitBtn.addEventListener("click", (e) => {
		e.preventDefault();

		const isPhoneValid = validatePhone();
		const isBalanceValid = validateBalance();
		const isPasswordValid = validatePassword();
		const isCashSenderValid = validateCashSender();
		const isScreenshotValid = validateScreenshot();

		if (
			isPhoneValid &&
			isBalanceValid &&
			isPasswordValid &&
			isCashSenderValid &&
			isScreenshotValid
		) {
			successContainer.style.display = "block";
			document.getElementById("rechargeForm").submit();
			successContainer.style.display = "block";
		}
	});
});
