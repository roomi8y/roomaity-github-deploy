// Roomaity (روميتي) - Main JavaScript File

document.addEventListener('DOMContentLoaded', function() {
    // Navigation toggle for mobile
    const navbarToggler = document.getElementById('navbarToggler');
    const navbarMenu = document.getElementById('navbarMenu');
    
    if (navbarToggler && navbarMenu) {
        navbarToggler.addEventListener('click', function() {
            navbarMenu.classList.toggle('show');
        });
    }
    
    // Language switcher
    const languageToggle = document.getElementById('languageToggle');
    
    if (languageToggle) {
        languageToggle.addEventListener('click', function() {
            const currentLang = document.documentElement.getAttribute('lang');
            const currentDir = document.documentElement.getAttribute('dir');
            
            if (currentLang === 'en') {
                // Switch to Arabic
                document.documentElement.setAttribute('lang', 'ar');
                document.documentElement.setAttribute('dir', 'rtl');
                languageToggle.innerHTML = '<i class="fas fa-globe"></i> English';
                translateToArabic();
            } else {
                // Switch to English
                document.documentElement.setAttribute('lang', 'en');
                document.documentElement.setAttribute('dir', 'ltr');
                languageToggle.innerHTML = '<i class="fas fa-globe"></i> العربية';
                translateToEnglish();
            }
        });
    }
    
    // Gender tabs functionality
    const tabButtons = document.querySelectorAll('[data-toggle="pill"]');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const target = document.querySelector(this.dataset.target);
            const parent = this.closest('[role="tablist"]').parentNode;
            
            // Hide all tab panes
            parent.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('show', 'active');
            });
            
            // Deactivate all tabs
            parent.querySelectorAll('[role="tab"]').forEach(tab => {
                tab.classList.remove('active');
                tab.setAttribute('aria-selected', 'false');
            });
            
            // Activate current tab and pane
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');
            target.classList.add('show', 'active');
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Form validation
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
                
                // Highlight invalid fields
                const invalidFields = form.querySelectorAll(':invalid');
                invalidFields.forEach(field => {
                    field.classList.add('is-invalid');
                    
                    field.addEventListener('input', function() {
                        if (this.checkValidity()) {
                            this.classList.remove('is-invalid');
                        }
                    });
                });
            }
            
            form.classList.add('was-validated');
        });
    });
    
    // Placeholder functions for translation
    function translateToArabic() {
        // This would be replaced with actual translations from a JSON file or API
        const translations = {
            'Find Your Perfect Roommate in Saudi Arabia': 'ابحث عن شريك السكن المثالي في المملكة العربية السعودية',
            'Connect with compatible roommates': 'تواصل مع شركاء سكن متوافقين',
            'Male Section': 'قسم الرجال',
            'Female Section': 'قسم النساء',
            'Select City': 'اختر المدينة',
            'Price Range': 'نطاق السعر',
            'Find Rooms': 'ابحث عن غرف',
            'Why Choose Roomaity?': 'لماذا تختار روميتي؟',
            'Safe & Secure': 'آمن ومضمون',
            'Culturally Appropriate': 'مناسب ثقافياً',
            'Smart Matching': 'تطابق ذكي',
            'How It Works': 'كيف يعمل',
            'Create Profile': 'إنشاء ملف شخصي',
            'List or Search': 'أضف أو ابحث',
            'Connect': 'تواصل',
            'Move In': 'انتقل للسكن',
            'Featured Listings': 'القوائم المميزة',
            'Male Listings': 'قوائم الرجال',
            'Female Listings': 'قوائم النساء',
            'For Males': 'للرجال',
            'For Females': 'للنساء',
            'View Details': 'عرض التفاصيل',
            'View All Male Listings': 'عرض جميع قوائم الرجال',
            'View All Female Listings': 'عرض جميع قوائم النساء',
            'Find Your Ideal Roommate': 'ابحث عن شريك السكن المثالي',
            'Male Roommates': 'شركاء سكن (رجال)',
            'Female Roommates': 'شريكات سكن (نساء)',
            'View Profile': 'عرض الملف الشخصي',
            'What Our Users Say': 'ماذا يقول مستخدمونا',
            'Ready to Find Your Perfect Roommate?': 'هل أنت مستعد للعثور على شريك السكن المثالي؟',
            'Sign Up Now': 'سجل الآن',
            'Quick Links': 'روابط سريعة',
            'Resources': 'موارد',
            'Contact Us': 'اتصل بنا',
            'Home': 'الرئيسية',
            'Login': 'تسجيل الدخول',
            'All rights reserved.': 'جميع الحقوق محفوظة.'
        };
        
        // Replace text content with Arabic translations
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[key]) {
                element.textContent = translations[key];
            }
        });
        
        // Add data-translate attributes to elements that need translation
        if (!document.querySelector('[data-translate]')) {
            addTranslateAttributes();
        }
    }
    
    function translateToEnglish() {
        // Restore original English text
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            element.textContent = key;
        });
    }
    
    function addTranslateAttributes() {
        // Add data-translate attributes to elements that need translation
        const elementsToTranslate = document.querySelectorAll('h1, h2, h3, h4, h5, p, a, button, label, option');
        
        elementsToTranslate.forEach(element => {
            if (element.textContent.trim()) {
                element.setAttribute('data-translate', element.textContent.trim());
            }
        });
    }
    
    // Initialize any carousels or sliders
    initializeCarousels();
    
    function initializeCarousels() {
        // This would be replaced with actual carousel initialization code
        // For example, if using a library like Swiper or Slick
        console.log('Carousels initialized');
    }
    
    // Add animation on scroll
    const animatedElements = document.querySelectorAll('.feature-card, .step-card, .listing-card, .testimonial-card');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        animatedElements.forEach(element => {
            element.classList.add('animated');
        });
    }
});
