// Authentication functionality for Roomaity platform
document.addEventListener('DOMContentLoaded', function() {
    // Form validation for login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            let isValid = true;
            
            // Reset error messages
            document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
            
            // Email validation
            if (!email || !validateEmail(email)) {
                document.getElementById('emailError').textContent = 
                    document.documentElement.lang === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email';
                isValid = false;
            }
            
            // Password validation
            if (!password) {
                document.getElementById('passwordError').textContent = 
                    document.documentElement.lang === 'ar' ? 'يرجى إدخال كلمة المرور' : 'Please enter your password';
                isValid = false;
            }
            
            if (isValid) {
                // Simulate login API call
                simulateLogin(email, password);
            }
        });
    }
    
    // Form validation for registration
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const gender = document.querySelector('input[name="gender"]:checked')?.value;
            const terms = document.getElementById('terms').checked;
            let isValid = true;
            
            // Reset error messages
            document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
            
            // Full name validation
            if (!fullName) {
                document.getElementById('fullNameError').textContent = 
                    document.documentElement.lang === 'ar' ? 'يرجى إدخال الاسم الكامل' : 'Please enter your full name';
                isValid = false;
            }
            
            // Email validation
            if (!email || !validateEmail(email)) {
                document.getElementById('emailError').textContent = 
                    document.documentElement.lang === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email';
                isValid = false;
            }
            
            // Password validation
            if (!password || password.length < 8) {
                document.getElementById('passwordError').textContent = 
                    document.documentElement.lang === 'ar' ? 'يجب أن تكون كلمة المرور 8 أحرف على الأقل' : 'Password must be at least 8 characters';
                isValid = false;
            }
            
            // Confirm password validation
            if (password !== confirmPassword) {
                document.getElementById('confirmPasswordError').textContent = 
                    document.documentElement.lang === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match';
                isValid = false;
            }
            
            // Gender validation
            if (!gender) {
                document.getElementById('genderError').textContent = 
                    document.documentElement.lang === 'ar' ? 'يرجى اختيار الجنس' : 'Please select your gender';
                isValid = false;
            }
            
            // Terms validation
            if (!terms) {
                document.getElementById('termsError').textContent = 
                    document.documentElement.lang === 'ar' ? 'يجب الموافقة على الشروط والأحكام' : 'You must agree to the terms and conditions';
                isValid = false;
            }
            
            if (isValid) {
                // Simulate registration API call
                simulateRegistration(fullName, email, password, gender);
            }
        });
    }
    
    // Password reset functionality
    const resetForm = document.getElementById('resetForm');
    if (resetForm) {
        resetForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            let isValid = true;
            
            // Reset error messages
            document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
            
            // Email validation
            if (!email || !validateEmail(email)) {
                document.getElementById('emailError').textContent = 
                    document.documentElement.lang === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email';
                isValid = false;
            }
            
            if (isValid) {
                // Simulate password reset API call
                simulatePasswordReset(email);
            }
        });
    }
    
    // Helper functions
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function simulateLogin(email, password) {
        // Show loading state
        const submitButton = document.querySelector('#loginForm button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = document.documentElement.lang === 'ar' ? 'جاري تسجيل الدخول...' : 'Logging in...';
        
        // Simulate API call delay
        setTimeout(function() {
            // For demo purposes, accept any login
            localStorage.setItem('roomaity_user', JSON.stringify({
                email: email,
                name: email.split('@')[0],
                isLoggedIn: true,
                gender: email.toLowerCase().includes('sara') ? 'female' : 'male'
            }));
            
            // Redirect to dashboard
            window.location.href = document.documentElement.lang === 'ar' ? 'index-ar.html' : 'index.html';
        }, 1500);
    }
    
    function simulateRegistration(fullName, email, password, gender) {
        // Show loading state
        const submitButton = document.querySelector('#registerForm button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = document.documentElement.lang === 'ar' ? 'جاري إنشاء الحساب...' : 'Creating account...';
        
        // Simulate API call delay
        setTimeout(function() {
            // For demo purposes, always succeed
            localStorage.setItem('roomaity_user', JSON.stringify({
                email: email,
                name: fullName,
                isLoggedIn: true,
                gender: gender
            }));
            
            // Set gender preference based on user gender
            localStorage.setItem('roomaityGenderPreference', gender);
            
            // Simulate email verification process initiation
            localStorage.setItem('roomaity_user_email_verified', 'false');
            localStorage.setItem('roomaity_pending_verification_email', email); 
            // Log for developer confirmation (optional, can be removed later)
            console.log('Email verification pending for: ' + email); 
            
            // Redirect to dashboard
            window.location.href = document.documentElement.lang === 'ar' ? 'index-ar.html' : 'index.html';
        }, 1500);
    }
    
    function simulatePasswordReset(email) {
        // Show loading state
        const submitButton = document.querySelector('#resetForm button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = document.documentElement.lang === 'ar' ? 'جاري إرسال الرابط...' : 'Sending reset link...';
        
        // Simulate API call delay
        setTimeout(function() {
            // Show success message
            const resetForm = document.getElementById('resetForm');
            resetForm.innerHTML = `
                <div class="alert alert-success">
                    ${document.documentElement.lang === 'ar' 
                        ? 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد الخاص بك.' 
                        : 'Password reset link has been sent to your email. Please check your inbox.'}
                </div>
                <a href="${document.documentElement.lang === 'ar' ? 'login-ar.html' : 'login.html'}" class="btn btn-primary btn-block">
                    ${document.documentElement.lang === 'ar' ? 'العودة إلى تسجيل الدخول' : 'Back to Login'}
                </a>
            `;
        }, 1500);
    }
    
    // Check if user is logged in
    function checkLoginStatus() {
        const user = JSON.parse(localStorage.getItem('roomaity_user') || '{"isLoggedIn": false}');
        
        if (user.isLoggedIn) {
            // Update UI for logged in user
            const loginButtons = document.querySelectorAll('.login-button, .register-button');
            const userMenus = document.querySelectorAll('.user-menu');
            
            loginButtons.forEach(button => button.style.display = 'none');
            userMenus.forEach(menu => {
                menu.style.display = 'block';
                const userNameElement = menu.querySelector('.user-name');
                if (userNameElement) {
                    userNameElement.textContent = user.name;
                }
            });
            
            // Set gender preference based on user gender if not already set
            if (!localStorage.getItem('roomaityGenderPreference')) {
                localStorage.setItem('roomaityGenderPreference', user.gender || 'male');
            }
        }
    }
    
    // Handle logout
    const logoutButtons = document.querySelectorAll('.logout-button');
    logoutButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear user data
            localStorage.removeItem('roomaity_user');
            
            // Redirect to home
            window.location.href = document.documentElement.lang === 'ar' ? 'index-ar.html' : 'index.html';
        });
    });
    
    // Initialize
    checkLoginStatus();
});
