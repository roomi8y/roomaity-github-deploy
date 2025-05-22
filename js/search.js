// Search and filtering functionality for Roomaity platform
document.addEventListener('DOMContentLoaded', function() {
    // Initialize search form
    const searchForm = document.getElementById('searchForm');
    const searchResultsContainer = document.getElementById('searchResults');
    const filtersContainer = document.getElementById('filtersContainer');
    const mobileFiltersToggle = document.getElementById('mobileFiltersToggle');
    const clearFiltersButton = document.getElementById('clearFilters');
    
    if (searchForm) {
        // Initialize location dropdown with Saudi cities
        const citySelect = document.getElementById('city');
        if (citySelect) {
            const saudiCities = [
                'الرياض', 'جدة', 'مكة', 'المدينة', 'الدمام', 'الخبر', 'الظهران', 
                'تبوك', 'أبها', 'بريدة', 'نجران', 'الهفوف', 'الطائف', 'جازان'
            ];
            
            // Add empty option
            const emptyOption = document.createElement('option');
            emptyOption.value = '';
            emptyOption.textContent = document.documentElement.lang === 'ar' ? 'جميع المدن' : 'All Cities';
            citySelect.appendChild(emptyOption);
            
            // Add city options
            saudiCities.forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                citySelect.appendChild(option);
            });
        }
        
        // Handle mobile filters toggle
        if (mobileFiltersToggle && filtersContainer) {
            mobileFiltersToggle.addEventListener('click', function() {
                filtersContainer.classList.toggle('show-filters');
                
                // Update button text
                if (filtersContainer.classList.contains('show-filters')) {
                    mobileFiltersToggle.innerHTML = `
                        <i class="fas fa-times"></i> ${document.documentElement.lang === 'ar' ? 'إخفاء الفلاتر' : 'Hide Filters'}
                    `;
                } else {
                    mobileFiltersToggle.innerHTML = `
                        <i class="fas fa-filter"></i> ${document.documentElement.lang === 'ar' ? 'عرض الفلاتر' : 'Show Filters'}
                    `;
                }
            });
        }
        
        // Handle clear filters button
        if (clearFiltersButton) {
            clearFiltersButton.addEventListener('click', function() {
                // Reset all form fields
                searchForm.reset();
                
                // Reset price range slider if exists
                const priceRange = document.getElementById('priceRange');
                const priceDisplay = document.getElementById('priceDisplay');
                
                if (priceRange && priceDisplay) {
                    priceRange.value = priceRange.max;
                    priceDisplay.textContent = formatPrice(priceRange.value);
                }
                
                // Trigger search with cleared filters
                searchRooms();
            });
        }
        
        // Handle price range slider
        const priceRange = document.getElementById('priceRange');
        const priceDisplay = document.getElementById('priceDisplay');
        
        if (priceRange && priceDisplay) {
            // Initialize price display
            priceDisplay.textContent = formatPrice(priceRange.value);
            
            // Update price display when slider changes
            priceRange.addEventListener('input', function() {
                priceDisplay.textContent = formatPrice(this.value);
            });
        }
        
        // Handle form submission
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            searchRooms();
        });
        
        // Trigger search on page load
        searchRooms();
    }
    
    // Function to search rooms based on filters
    function searchRooms() {
        if (!searchResultsContainer) return;
        
        // Show loading state
        searchResultsContainer.innerHTML = `
            <div class="loading-state">
                <i class="fas fa-spinner fa-spin fa-3x"></i>
                <p>${document.documentElement.lang === 'ar' ? 'جاري البحث...' : 'Searching...'}</p>
            </div>
        `;
        
        // Get filter values
        const city = document.getElementById('city')?.value || '';
        const roomType = document.getElementById('roomType')?.value || '';
        const priceMax = document.getElementById('priceRange')?.value || 10000;
        const genderPreference = document.querySelector('input[name="genderPreference"]:checked')?.value || '';
        
        // Get amenities filters
        const selectedAmenities = [];
        document.querySelectorAll('input[name="amenities"]:checked').forEach(checkbox => {
            selectedAmenities.push(checkbox.value);
        });
        
        // Get sort option
        const sortBy = document.getElementById('sortBy')?.value || 'newest';
        
        // Get listings from localStorage
        let listings = JSON.parse(localStorage.getItem('roomaity_listings') || '[]');
        
        // Filter listings based on criteria
        if (city) {
            listings = listings.filter(listing => listing.city === city);
        }
        
        if (roomType) {
            listings = listings.filter(listing => listing.roomType === roomType);
        }
        
        if (priceMax) {
            listings = listings.filter(listing => parseInt(listing.price) <= parseInt(priceMax));
        }
        
        if (genderPreference) {
            listings = listings.filter(listing => listing.genderPreference === genderPreference);
        }
        
        if (selectedAmenities.length > 0) {
            listings = listings.filter(listing => {
                // Check if listing has all selected amenities
                return selectedAmenities.every(amenity => 
                    listing.amenities && listing.amenities.includes(amenity)
                );
            });
        }
        
        // Sort listings
        switch (sortBy) {
            case 'newest':
                listings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'oldest':
                listings.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case 'price_low':
                listings.sort((a, b) => parseInt(a.price) - parseInt(b.price));
                break;
            case 'price_high':
                listings.sort((a, b) => parseInt(b.price) - parseInt(a.price));
                break;
        }
        
        // Check if we need to filter by gender based on user preference
        const genderPreferenceFromStorage = localStorage.getItem('roomaityGenderPreference');
        if (genderPreferenceFromStorage) {
            listings = listings.filter(listing => 
                listing.genderPreference === genderPreferenceFromStorage || 
                listing.genderPreference === 'any'
            );
        }
        
        // Render search results
        renderSearchResults(listings);
    }
    
    // Function to render search results
    function renderSearchResults(listings) {
        if (!searchResultsContainer) return;
        
        if (listings.length === 0) {
            searchResultsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-home fa-3x"></i>
                    <h3>${document.documentElement.lang === 'ar' ? 'لم يتم العثور على نتائج' : 'No Results Found'}</h3>
                    <p>${document.documentElement.lang === 'ar' 
                        ? 'جرب تعديل معايير البحث للعثور على المزيد من الغرف' 
                        : 'Try adjusting your search criteria to find more rooms'}</p>
                </div>
            `;
            return;
        }
        
        // Clear previous results
        searchResultsContainer.innerHTML = '';
        
        // Create results count element
        const resultsCount = document.createElement('div');
        resultsCount.className = 'results-count';
        resultsCount.textContent = document.documentElement.lang === 'ar' 
            ? `تم العثور على ${listings.length} نتيجة` 
            : `Found ${listings.length} results`;
        searchResultsContainer.appendChild(resultsCount);
        
        // Create results grid
        const resultsGrid = document.createElement('div');
        resultsGrid.className = 'results-grid';
        
        // Add listing cards to grid
        listings.forEach(listing => {
            // Format price
            const formattedPrice = formatPrice(listing.price);
            
            // Create listing card
            const listingCard = document.createElement('div');
            listingCard.className = 'listing-card';
            
            // Determine gender class for styling
            const genderClass = listing.genderPreference === 'male' ? 'male-listing' : 'female-listing';
            
            listingCard.innerHTML = `
                <div class="listing-image ${genderClass}">
                    <img src="${listing.imageUrls?.[0] || 'images/placeholder-room.jpg'}" alt="${listing.title}">
                    <div class="listing-price">${formattedPrice} / ${document.documentElement.lang === 'ar' ? 'شهر' : 'month'}</div>
                    <div class="gender-badge ${genderClass}">
                        <i class="fas fa-${listing.genderPreference === 'male' ? 'male' : 'female'}"></i>
                        ${document.documentElement.lang === 'ar' 
                            ? (listing.genderPreference === 'male' ? 'للرجال فقط' : 'للنساء فقط')
                            : (listing.genderPreference === 'male' ? 'Men Only' : 'Women Only')}
                    </div>
                </div>
                <div class="listing-content">
                    <h3 class="listing-title">${listing.title}</h3>
                    <p class="listing-location"><i class="fas fa-map-marker-alt"></i> ${listing.city}, ${listing.neighborhood}</p>
                    <div class="listing-details">
                        <span class="listing-type">
                            <i class="fas fa-home"></i> ${getRoomTypeLabel(listing.roomType)}
                        </span>
                        <span class="listing-date">
                            <i class="far fa-calendar-alt"></i> ${formatAvailableDate(listing.availableFrom)}
                        </span>
                    </div>
                    <div class="listing-amenities">
                        ${renderAmenities(listing.amenities)}
                    </div>
                    <div class="listing-actions">
                        <a href="${document.documentElement.lang === 'ar' 
                            ? 'listing-details-ar.html' 
                            : 'listing-details.html'}?id=${listing.id}" class="btn btn-primary btn-sm">
                            ${document.documentElement.lang === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                        </a>
                        <a href="${document.documentElement.lang === 'ar' 
                            ? 'profile-ar.html' 
                            : 'profile.html'}?id=${listing.userId}" class="btn btn-outline-primary btn-sm">
                            <i class="fas fa-user"></i> ${document.documentElement.lang === 'ar' ? 'عرض الملف' : 'View Profile'}
                        </a>
                    </div>
                </div>
            `;
            
            resultsGrid.appendChild(listingCard);
        });
        
        searchResultsContainer.appendChild(resultsGrid);
    }
    
    // Helper function to format price
    function formatPrice(price) {
        return new Intl.NumberFormat(
            document.documentElement.lang === 'ar' ? 'ar-SA' : 'en-US', 
            { style: 'currency', currency: 'SAR' }
        ).format(price);
    }
    
    // Helper function to get room type label
    function getRoomTypeLabel(roomType) {
        if (document.documentElement.lang === 'ar') {
            switch (roomType) {
                case 'private': return 'غرفة خاصة';
                case 'shared': return 'غرفة مشتركة';
                case 'apartment': return 'شقة كاملة';
                default: return 'غير محدد';
            }
        } else {
            switch (roomType) {
                case 'private': return 'Private Room';
                case 'shared': return 'Shared Room';
                case 'apartment': return 'Entire Apartment';
                default: return 'Not specified';
            }
        }
    }
    
    // Helper function to format available date
    function formatAvailableDate(dateString) {
        if (!dateString) return document.documentElement.lang === 'ar' ? 'متاح الآن' : 'Available Now';
        
        const date = new Date(dateString);
        return date.toLocaleDateString(
            document.documentElement.lang === 'ar' ? 'ar-SA' : 'en-US', 
            { year: 'numeric', month: 'long', day: 'numeric' }
        );
    }
    
    // Helper function to render amenities icons
    function renderAmenities(amenities) {
        if (!amenities || amenities.length === 0) return '';
        
        const amenityIcons = {
            wifi: 'fa-wifi',
            ac: 'fa-snowflake',
            parking: 'fa-car',
            kitchen: 'fa-utensils',
            washer: 'fa-tshirt',
            tv: 'fa-tv',
            gym: 'fa-dumbbell',
            pool: 'fa-swimming-pool'
        };
        
        // Limit to first 4 amenities for display
        const displayAmenities = amenities.slice(0, 4);
        
        return displayAmenities.map(amenity => 
            `<span class="amenity-icon" title="${getAmenityLabel(amenity)}">
                <i class="fas ${amenityIcons[amenity] || 'fa-check'}"></i>
            </span>`
        ).join('');
    }
    
    // Helper function to get amenity label
    function getAmenityLabel(amenity) {
        if (document.documentElement.lang === 'ar') {
            switch (amenity) {
                case 'wifi': return 'واي فاي';
                case 'ac': return 'تكييف';
                case 'parking': return 'موقف سيارات';
                case 'kitchen': return 'مطبخ';
                case 'washer': return 'غسالة';
                case 'tv': return 'تلفزيون';
                case 'gym': return 'صالة رياضية';
                case 'pool': return 'مسبح';
                default: return amenity;
            }
        } else {
            switch (amenity) {
                case 'wifi': return 'WiFi';
                case 'ac': return 'Air Conditioning';
                case 'parking': return 'Parking';
                case 'kitchen': return 'Kitchen';
                case 'washer': return 'Washer';
                case 'tv': return 'TV';
                case 'gym': return 'Gym';
                case 'pool': return 'Pool';
                default: return amenity;
            }
        }
    }
    
    // Initialize roommate search functionality
    const roommateSearchForm = document.getElementById('roommateSearchForm');
    const roommateResultsContainer = document.getElementById('roommateResults');
    
    if (roommateSearchForm && roommateResultsContainer) {
        // Handle form submission
        roommateSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            searchRoommates();
        });
        
        // Trigger search on page load
        searchRoommates();
    }
    
    // Function to search roommates
    function searchRoommates() {
        if (!roommateResultsContainer) return;
        
        // Show loading state
        roommateResultsContainer.innerHTML = `
            <div class="loading-state">
                <i class="fas fa-spinner fa-spin fa-3x"></i>
                <p>${document.documentElement.lang === 'ar' ? 'جاري البحث...' : 'Searching...'}</p>
            </div>
        `;
        
        // Get filter values
        const city = document.getElementById('roommateCity')?.value || '';
        const gender = document.querySelector('input[name="roommateGender"]:checked')?.value || '';
        const ageRange = document.getElementById('ageRange')?.value || '';
        const occupation = document.getElementById('occupation')?.value || '';
        
        // Get lifestyle filters
        const cleanliness = document.getElementById('cleanliness')?.value || '';
        const noise = document.getElementById('noise')?.value || '';
        const smoking = document.querySelector('input[name="smoking"]:checked')?.value || '';
        
        // For demo purposes, generate mock roommate profiles
        const mockRoommates = generateMockRoommates();
        
        // Filter roommates based on criteria
        let filteredRoommates = [...mockRoommates];
        
        if (city) {
            filteredRoommates = filteredRoommates.filter(roommate => roommate.city === city);
        }
        
        if (gender) {
            filteredRoommates = filteredRoommates.filter(roommate => roommate.gender === gender);
        }
        
        if (ageRange) {
            const [minAge, maxAge] = ageRange.split('-').map(Number);
            filteredRoommates = filteredRoommates.filter(roommate => 
                roommate.age >= minAge && roommate.age <= maxAge
            );
        }
        
        if (occupation) {
            filteredRoommates = filteredRoommates.filter(roommate => 
                roommate.occupation.toLowerCase().includes(occupation.toLowerCase())
            );
        }
        
        if (cleanliness) {
            const cleanlinessValue = parseInt(cleanliness);
            filteredRoommates = filteredRoommates.filter(roommate => 
                roommate.lifestyle.cleanliness >= cleanlinessValue
            );
        }
        
        if (noise) {
            const noiseValue = parseInt(noise);
            filteredRoommates = filteredRoommates.filter(roommate => 
                roommate.lifestyle.noise <= noiseValue
            );
        }
        
        if (smoking === 'yes') {
            filteredRoommates = filteredRoommates.filter(roommate => 
                roommate.lifestyle.smoking === true
            );
        } else if (smoking === 'no') {
            filteredRoommates = filteredRoommates.filter(roommate => 
                roommate.lifestyle.smoking === false
            );
        }
        
        // Check if we need to filter by gender based on user preference
        const genderPreferenceFromStorage = localStorage.getItem('roomaityGenderPreference');
        if (genderPreferenceFromStorage) {
            filteredRoommates = filteredRoommates.filter(roommate => 
                roommate.gender === genderPreferenceFromStorage
            );
        }
        
        // Render roommate search results
        renderRoommateResults(filteredRoommates);
    }
    
    // Function to render roommate search results
    function renderRoommateResults(roommates) {
        if (!roommateResultsContainer) return;
        
        if (roommates.length === 0) {
            roommateResultsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-user-friends fa-3x"></i>
                    <h3>${document.documentElement.lang === 'ar' ? 'لم يتم العثور على نتائج' : 'No Results Found'}</h3>
                    <p>${document.documentElement.lang === 'ar' 
                        ? 'جرب تعديل معايير البحث للعثور على المزيد من شركاء السكن' 
                        : 'Try adjusting your search criteria to find more roommates'}</p>
                </div>
            `;
            return;
        }
        
        // Clear previous results
        roommateResultsContainer.innerHTML = '';
        
        // Create results count element
        const resultsCount = document.createElement('div');
        resultsCount.className = 'results-count';
        resultsCount.textContent = document.documentElement.lang === 'ar' 
            ? `تم العثور على ${roommates.length} نتيجة` 
            : `Found ${roommates.length} results`;
        roommateResultsContainer.appendChild(resultsCount);
        
        // Create results grid
        const resultsGrid = document.createElement('div');
        resultsGrid.className = 'results-grid roommate-grid';
        
        // Add roommate cards to grid
        roommates.forEach(roommate => {
            // Create roommate card
            const roommateCard = document.createElement('div');
            roommateCard.className = 'roommate-card';
            
            // Determine gender class for styling
            const genderClass = roommate.gender === 'male' ? 'male-roommate' : 'female-roommate';
            
            roommateCard.innerHTML = `
                <div class="roommate-header ${genderClass}">
                    <div class="roommate-avatar">
                        <img src="${roommate.profileImageUrl}" alt="${roommate.name}">
                    </div>
                    <div class="roommate-info">
                        <h3 class="roommate-name">${roommate.name}</h3>
                        <p class="roommate-details">
                            <span class="roommate-age">${roommate.age} ${document.documentElement.lang === 'ar' ? 'سنة' : 'years'}</span>
                            <span class="roommate-gender">
                                <i class="fas fa-${roommate.gender === 'male' ? 'male' : 'female'}"></i>
                                ${document.documentElement.lang === 'ar' 
                                    ? (roommate.gender === 'male' ? 'ذكر' : 'أنثى')
                                    : (roommate.gender === 'male' ? 'Male' : 'Female')}
                            </span>
                        </p>
                        <p class="roommate-location"><i class="fas fa-map-marker-alt"></i> ${roommate.city}</p>
                    </div>
                </div>
                <div class="roommate-content">
                    <div class="roommate-occupation">
                        <i class="fas fa-briefcase"></i> ${roommate.occupation}
                    </div>
                    <p class="roommate-bio">${roommate.bio}</p>
                    <div class="roommate-lifestyle">
                        <div class="lifestyle-item">
                            <span class="lifestyle-label">${document.documentElement.lang === 'ar' ? 'النظافة' : 'Cleanliness'}</span>
                            <div class="rating-stars">
                                ${generateRatingStars(roommate.lifestyle.cleanliness)}
                            </div>
                        </div>
                        <div class="lifestyle-item">
                            <span class="lifestyle-label">${document.documentElement.lang === 'ar' ? 'الهدوء' : 'Quietness'}</span>
                            <div class="rating-stars">
                                ${generateRatingStars(5 - roommate.lifestyle.noise)}
                            </div>
                        </div>
                        <div class="lifestyle-item">
                            <span class="lifestyle-label">${document.documentElement.lang === 'ar' ? 'التدخين' : 'Smoking'}</span>
                            <span class="lifestyle-value ${roommate.lifestyle.smoking ? 'text-warning' : 'text-success'}">
                                <i class="fas ${roommate.lifestyle.smoking ? 'fa-smoking' : 'fa-smoking-ban'}"></i>
                                ${document.documentElement.lang === 'ar' 
                                    ? (roommate.lifestyle.smoking ? 'مدخن' : 'غير مدخن')
                                    : (roommate.lifestyle.smoking ? 'Smoker' : 'Non-smoker')}
                            </span>
                        </div>
                    </div>
                    <div class="roommate-actions">
                        <a href="${document.documentElement.lang === 'ar' 
                            ? 'profile-ar.html' 
                            : 'profile.html'}?id=${roommate.id}" class="btn btn-primary btn-sm">
                            ${document.documentElement.lang === 'ar' ? 'عرض الملف الشخصي' : 'View Profile'}
                        </a>
                        <a href="${document.documentElement.lang === 'ar' 
                            ? 'messages-ar.html' 
                            : 'messages.html'}?to=${roommate.id}" class="btn btn-outline-primary btn-sm">
                            <i class="fas fa-comment"></i> ${document.documentElement.lang === 'ar' ? 'مراسلة' : 'Message'}
                        </a>
                    </div>
                </div>
            `;
            
            resultsGrid.appendChild(roommateCard);
        });
        
        roommateResultsContainer.appendChild(resultsGrid);
    }
    
    // Helper function to generate rating stars
    function generateRatingStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="fas fa-star"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        return stars;
    }
    
    // Function to generate mock roommate profiles for demo
    function generateMockRoommates() {
        const mockRoommates = [
            {
                id: 'ahmed@example.com',
                name: 'أحمد محمد',
                gender: 'male',
                age: 25,
                city: 'الرياض',
                occupation: 'مهندس برمجيات',
                bio: 'مهندس برمجيات يبحث عن شريك سكن هادئ ونظيف. أحب القراءة والرياضة وقضاء الوقت مع الأصدقاء.',
                profileImageUrl: 'images/profiles/male-1.jpg',
                lifestyle: {
                    cleanliness: 4,
                    noise: 2,
                    sleepSchedule: 'early_bird',
                    smoking: false
                }
            },
            {
                id: 'sara@example.com',
                name: 'سارة أحمد',
                gender: 'female',
                age: 23,
                city: 'جدة',
                occupation: 'طالبة طب',
                bio: 'طالبة طب في السنة الرابعة. أبحث عن شريكة سكن مرتبة وهادئة. أحب الطبخ والقراءة.',
                profileImageUrl: 'images/profiles/female-1.jpg',
                lifestyle: {
                    cleanliness: 5,
                    noise: 1,
                    sleepSchedule: 'night_owl',
                    smoking: false
                }
            },
            {
                id: 'khalid@example.com',
                name: 'خالد العتيبي',
                gender: 'male',
                age: 28,
                city: 'الرياض',
                occupation: 'محاسب',
                bio: 'محاسب يعمل في شركة كبيرة. أبحث عن شريك سكن محترم ومنظم. أحب كرة القدم والسفر.',
                profileImageUrl: 'images/profiles/male-2.jpg',
                lifestyle: {
                    cleanliness: 3,
                    noise: 3,
                    sleepSchedule: 'flexible',
                    smoking: true
                }
            },
            {
                id: 'nora@example.com',
                name: 'نورة الشمري',
                gender: 'female',
                age: 26,
                city: 'الدمام',
                occupation: 'مصممة جرافيك',
                bio: 'مصممة جرافيك تعمل عن بعد. أبحث عن شريكة سكن مرحة ومنظمة. أحب الفن والتصوير.',
                profileImageUrl: 'images/profiles/female-2.jpg',
                lifestyle: {
                    cleanliness: 4,
                    noise: 2,
                    sleepSchedule: 'flexible',
                    smoking: false
                }
            },
            {
                id: 'faisal@example.com',
                name: 'فيصل القحطاني',
                gender: 'male',
                age: 30,
                city: 'جدة',
                occupation: 'مدرس',
                bio: 'مدرس لغة إنجليزية. أبحث عن شريك سكن هادئ ومحترم. أحب القراءة والسباحة.',
                profileImageUrl: 'images/profiles/male-3.jpg',
                lifestyle: {
                    cleanliness: 5,
                    noise: 1,
                    sleepSchedule: 'early_bird',
                    smoking: false
                }
            },
            {
                id: 'hanan@example.com',
                name: 'حنان العنزي',
                gender: 'female',
                age: 24,
                city: 'الرياض',
                occupation: 'مهندسة معمارية',
                bio: 'مهندسة معمارية حديثة التخرج. أبحث عن شريكة سكن مرتبة وودودة. أحب التصميم والرسم.',
                profileImageUrl: 'images/profiles/female-3.jpg',
                lifestyle: {
                    cleanliness: 4,
                    noise: 3,
                    sleepSchedule: 'night_owl',
                    smoking: false
                }
            },
            {
                id: 'abdullah@example.com',
                name: 'عبدالله الدوسري',
                gender: 'male',
                age: 27,
                city: 'الدمام',
                occupation: 'مهندس بترول',
                bio: 'مهندس بترول يعمل في أرامكو. أبحث عن شريك سكن منظم ومحترم. أحب الرياضة والسفر.',
                profileImageUrl: 'images/profiles/male-4.jpg',
                lifestyle: {
                    cleanliness: 3,
                    noise: 2,
                    sleepSchedule: 'flexible',
                    smoking: true
                }
            },
            {
                id: 'amal@example.com',
                name: 'أمل السعيد',
                gender: 'female',
                age: 29,
                city: 'جدة',
                occupation: 'طبيبة',
                bio: 'طبيبة أسنان. أبحث عن شريكة سكن هادئة ومنظمة. أحب القراءة والطبخ والسفر.',
                profileImageUrl: 'images/profiles/female-4.jpg',
                lifestyle: {
                    cleanliness: 5,
                    noise: 1,
                    sleepSchedule: 'early_bird',
                    smoking: false
                }
            }
        ];
        
        return mockRoommates;
    }
});
