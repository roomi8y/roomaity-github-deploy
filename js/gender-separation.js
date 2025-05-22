// Enhanced gender separation functionality with improved switching
document.addEventListener('DOMContentLoaded', function() {
    console.log('Enhanced gender separation script loaded');
    
    // Get the gender tabs and content
    const maleTabs = document.querySelectorAll('[data-gender="male"], [data-select-gender="male"]');
    const femaleTabs = document.querySelectorAll('[data-gender="female"], [data-select-gender="female"]');
    const maleContent = document.querySelectorAll('.male-content');
    
    // Get the filter sections
    const filterSection = document.querySelector('.filter-section');
    
    // Check if female content exists on page load
    let femaleContent = document.querySelectorAll('.female-content');
    
    // Pre-create female content if it doesn't exist
    if (femaleContent.length === 0 && maleContent.length > 0) {
        console.log('No female content found, creating it');
        createFemaleContent();
        // Re-query female content after creation
        femaleContent = document.querySelectorAll('.female-content');
    }
    
    // Function to show male content and hide female content
    function showMaleContent() {
        console.log('Showing male content');
        
        // Show male tabs and content
        maleTabs.forEach(tab => {
            tab.classList.add('active');
            tab.classList.remove('btn-outline-primary');
            tab.classList.add('btn-primary');
        });
        
        maleContent.forEach(content => {
            content.style.display = 'block';
        });
        
        // Hide female tabs and content
        femaleTabs.forEach(tab => {
            tab.classList.remove('active');
            tab.classList.remove('btn-primary');
            tab.classList.add('btn-outline-primary');
        });
        
        // Re-query female content to ensure we have the latest elements
        const currentFemaleContent = document.querySelectorAll('.female-content');
        currentFemaleContent.forEach(content => {
            content.style.display = 'none';
        });
        
        // Update UI to reflect male selection
        document.querySelectorAll('.gender-indicator').forEach(indicator => {
            indicator.textContent = 'شريك سكن (رجال)';
        });
        
        // Update page title to reflect male selection
        const titleElement = document.querySelector('h1.hero-title');
        if (titleElement) {
            titleElement.innerHTML = 'ابحث عن <span class="text-primary">شريك سكن</span> (رجال)';
        }
        
        // Store preference in localStorage
        localStorage.setItem('roomaityGenderPreference', 'male');
    }
    
    // Function to show female content and hide male content
    function showFemaleContent() {
        console.log('Showing female content');
        
        // Re-check if female content exists
        const currentFemaleContent = document.querySelectorAll('.female-content');
        
        // Create female content if it still doesn't exist
        if (currentFemaleContent.length === 0) {
            console.log('Female content still not found, creating it now');
            createFemaleContent();
        }
        
        // Show female tabs and content
        femaleTabs.forEach(tab => {
            tab.classList.add('active');
            tab.classList.remove('btn-outline-primary');
            tab.classList.add('btn-primary');
        });
        
        // Re-query to ensure we have the latest elements
        document.querySelectorAll('.female-content').forEach(content => {
            content.style.display = 'block';
        });
        
        // Hide male tabs and content
        maleTabs.forEach(tab => {
            tab.classList.remove('active');
            tab.classList.remove('btn-primary');
            tab.classList.add('btn-outline-primary');
        });
        
        maleContent.forEach(content => {
            content.style.display = 'none';
        });
        
        // Update UI to reflect female selection
        document.querySelectorAll('.gender-indicator').forEach(indicator => {
            indicator.textContent = 'شريكة سكن (نساء)';
        });
        
        // Update page title to reflect female selection
        const titleElement = document.querySelector('h1.hero-title');
        if (titleElement) {
            titleElement.innerHTML = 'ابحث عن <span class="text-primary">شريكة سكن</span> (نساء)';
        }
        
        // Store preference in localStorage
        localStorage.setItem('roomaityGenderPreference', 'female');
    }
    
    // Function to create female content if it doesn't exist
    function createFemaleContent() {
        console.log('Creating female content');
        
        // Make sure we have male content to reference
        const maleContentEl = document.querySelector('.male-content');
        if (!maleContentEl) {
            console.error('Cannot create female content: No male content found');
            return;
        }
        
        const maleContentParent = maleContentEl.parentNode;
        
        // Create female content container
        const femaleContentDiv = document.createElement('div');
        femaleContentDiv.className = 'female-content';
        femaleContentDiv.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <p class="search-result-count">تم العثور على 12 شريكة سكن محتملة</p>
                <div class="sort-options">
                    <label class="sort-label">ترتيب حسب:</label>
                    <select class="sort-select">
                        <option value="relevance">الأكثر صلة</option>
                        <option value="price_low">السعر: من الأقل إلى الأعلى</option>
                        <option value="price_high">السعر: من الأعلى إلى الأقل</option>
                        <option value="date_new">الأحدث</option>
                    </select>
                </div>
            </div>
            
            <div class="row">
                <!-- Roommate Card 1 -->
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card">
                        <img src="images/illustrations/female-profile1.jpg" class="card-img-top" alt="سارة">
                        <div class="card-body">
                            <h5 class="card-title">سارة، 26</h5>
                            <p class="card-location"><i class="fas fa-map-marker-alt"></i> الرياض</p>
                            <p class="card-text">موظفة تبحث عن شريكة سكن هادئة. غير مدخنة، نظيفة ومنظمة.</p>
                            <div class="card-amenities">
                                <span class="card-amenity"><i class="fas fa-ban"></i> ممنوع التدخين</span>
                                <span class="card-amenity"><i class="fas fa-briefcase"></i> موظفة</span>
                            </div>
                            <a href="profile-details-ar.html" class="btn btn-outline-primary btn-block mt-3">عرض الملف الشخصي</a>
                        </div>
                    </div>
                </div>
                
                <!-- Roommate Card 2 -->
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card">
                        <img src="images/illustrations/female-profile2.jpg" class="card-img-top" alt="نورة">
                        <div class="card-body">
                            <h5 class="card-title">نورة، 23</h5>
                            <p class="card-location"><i class="fas fa-map-marker-alt"></i> جدة</p>
                            <p class="card-text">طالبة في جامعة الملك عبد العزيز. تبحث عن شريكة سكن قرب الحرم الجامعي.</p>
                            <div class="card-amenities">
                                <span class="card-amenity"><i class="fas fa-graduation-cap"></i> طالبة</span>
                                <span class="card-amenity"><i class="fas fa-book"></i> دراسة هادئة</span>
                            </div>
                            <a href="profile-details-ar.html" class="btn btn-outline-primary btn-block mt-3">عرض الملف الشخصي</a>
                        </div>
                    </div>
                </div>
                
                <!-- Roommate Card 3 -->
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card">
                        <img src="images/illustrations/female-profile3.jpg" class="card-img-top" alt="منى">
                        <div class="card-body">
                            <h5 class="card-title">منى، 29</h5>
                            <p class="card-location"><i class="fas fa-map-marker-alt"></i> الدمام</p>
                            <p class="card-text">مهندسة تعمل في شركة تقنية. نظيفة، محترمة، وهادئة.</p>
                            <div class="card-amenities">
                                <span class="card-amenity"><i class="fas fa-hard-hat"></i> مهندسة</span>
                                <span class="card-amenity"><i class="fas fa-volume-down"></i> هادئة</span>
                            </div>
                            <a href="profile-details-ar.html" class="btn btn-outline-primary btn-block mt-3">عرض الملف الشخصي</a>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Pagination -->
            <nav aria-label="Page navigation">
                <ul class="pagination justify-content-center">
                    <li class="page-item disabled">
                        <a class="page-link" href="#" tabindex="-1" aria-disabled="true">السابق</a>
                    </li>
                    <li class="page-item active"><a class="page-link" href="#">1</a></li>
                    <li class="page-item"><a class="page-link" href="#">2</a></li>
                    <li class="page-item"><a class="page-link" href="#">3</a></li>
                    <li class="page-item">
                        <a class="page-link" href="#">التالي</a>
                    </li>
                </ul>
            </nav>
        `;
        
        // Initially hide the female content
        femaleContentDiv.style.display = 'none';
        
        // Add the female content to the page
        maleContentParent.appendChild(femaleContentDiv);
        
        console.log('Female content created successfully');
    }
    
    // Function to ensure only one set of filters is shown
    function setupFilters() {
        // Get all filter sections
        const filterSections = document.querySelectorAll('.filter-section, .filter-container, .filter-sidebar');
        
        if (filterSections.length > 1) {
            console.log('Multiple filter sections found, keeping only one');
            
            // Keep only the first filter section
            for (let i = 1; i < filterSections.length; i++) {
                filterSections[i].remove();
            }
        }
        
        // Make sure the remaining filter section is visible
        if (filterSections.length > 0) {
            filterSections[0].style.display = 'block';
        }
    }
    
    // Function to handle gender switching with animation
    function switchGenderWithAnimation(gender) {
        // Add transition class for smooth animation
        document.querySelector('.search-container').classList.add('transition-fade');
        
        // Short timeout to allow animation to start
        setTimeout(function() {
            if (gender === 'male') {
                showMaleContent();
            } else if (gender === 'female') {
                showFemaleContent();
            }
            
            // Ensure only one set of filters is shown
            setupFilters();
            
            // Remove transition class after animation completes
            setTimeout(function() {
                document.querySelector('.search-container').classList.remove('transition-fade');
            }, 300);
        }, 50);
    }
    
    // Add click event listeners to gender selector buttons
    document.querySelectorAll('[data-select-gender]').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Gender selector clicked:', this.getAttribute('data-select-gender'));
            
            const gender = this.getAttribute('data-select-gender');
            switchGenderWithAnimation(gender);
            
            // Close any open mobile menu
            const mobileMenu = document.getElementById('navbarMenu');
            if (mobileMenu && mobileMenu.classList.contains('show')) {
                mobileMenu.classList.remove('show');
            }
        });
    });
    
    // Add CSS for transition animation
    const style = document.createElement('style');
    style.textContent = `
        .transition-fade {
            opacity: 0.7;
            transition: opacity 0.3s ease;
        }
        .search-container {
            transition: opacity 0.3s ease;
        }
    `;
    document.head.appendChild(style);
    
    // Initialize based on stored preference or default to male
    const storedPreference = localStorage.getItem('roomaityGenderPreference');
    console.log('Stored gender preference:', storedPreference);
    
    // Ensure only one set of filters is shown on page load
    setupFilters();
    
    if (storedPreference === 'female') {
        showFemaleContent();
    } else {
        showMaleContent(); // Default to male if no preference or male preference
    }
    
    // Add a global function to switch gender for use in other scripts
    window.switchGender = function(gender) {
        console.log('External gender switch requested:', gender);
        switchGenderWithAnimation(gender);
    };
});
