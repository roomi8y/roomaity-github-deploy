// Room listing and profile functionality for Roomaity platform
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in before allowing access to protected pages
    function checkAuthRequired() {
        const authRequiredPages = ['list-room', 'profile-edit', 'my-listings', 'messages'];
        const currentPage = window.location.pathname.split('/').pop().split('.')[0];
        
        // Check if current page requires authentication
        if (authRequiredPages.some(page => currentPage.includes(page))) {
            const user = JSON.parse(localStorage.getItem('roomaity_user') || '{"isLoggedIn": false}');
            
            if (!user.isLoggedIn) {
                // Redirect to login page with return URL
                const returnUrl = encodeURIComponent(window.location.href);
                window.location.href = document.documentElement.lang === 'ar' 
                    ? `login-ar.html?return=${returnUrl}` 
                    : `login.html?return=${returnUrl}`;
                return false;
            }
        }
        return true;
    }
    
    // Initialize room listing form
    const roomListingForm = document.getElementById('roomListingForm');
    if (roomListingForm && checkAuthRequired()) {
        // Initialize location dropdown with Saudi cities
        const citySelect = document.getElementById('city');
        if (citySelect) {
            const saudiCities = [
                'الرياض', 'جدة', 'مكة', 'المدينة', 'الدمام', 'الخبر', 'الظهران', 
                'تبوك', 'أبها', 'بريدة', 'نجران', 'الهفوف', 'الطائف', 'جازان'
            ];
            
            saudiCities.forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                citySelect.appendChild(option);
            });
        }
        
        // Handle amenities checkboxes
        const amenitiesContainer = document.getElementById('amenitiesContainer');
        if (amenitiesContainer) {
            const amenities = [
                { id: 'wifi', icon: 'fa-wifi', label: document.documentElement.lang === 'ar' ? 'واي فاي' : 'WiFi' },
                { id: 'ac', icon: 'fa-snowflake', label: document.documentElement.lang === 'ar' ? 'تكييف' : 'AC' },
                { id: 'parking', icon: 'fa-car', label: document.documentElement.lang === 'ar' ? 'موقف سيارات' : 'Parking' },
                { id: 'kitchen', icon: 'fa-utensils', label: document.documentElement.lang === 'ar' ? 'مطبخ' : 'Kitchen' },
                { id: 'washer', icon: 'fa-tshirt', label: document.documentElement.lang === 'ar' ? 'غسالة' : 'Washer' },
                { id: 'tv', icon: 'fa-tv', label: document.documentElement.lang === 'ar' ? 'تلفزيون' : 'TV' },
                { id: 'gym', icon: 'fa-dumbbell', label: document.documentElement.lang === 'ar' ? 'صالة رياضية' : 'Gym' },
                { id: 'pool', icon: 'fa-swimming-pool', label: document.documentElement.lang === 'ar' ? 'مسبح' : 'Pool' }
            ];
            
            amenities.forEach(amenity => {
                const amenityDiv = document.createElement('div');
                amenityDiv.className = 'amenity-option';
                
                amenityDiv.innerHTML = `
                    <input type="checkbox" id="${amenity.id}" name="amenities" value="${amenity.id}">
                    <label for="${amenity.id}"><i class="fas ${amenity.icon}"></i> ${amenity.label}</label>
                `;
                
                amenitiesContainer.appendChild(amenityDiv);
            });
        }
        
        // Handle room type selection
        const roomTypeSelect = document.getElementById('roomType');
        if (roomTypeSelect) {
            roomTypeSelect.addEventListener('change', function() {
                const sharedRoomOptions = document.getElementById('sharedRoomOptions');
                if (sharedRoomOptions) {
                    if (this.value === 'shared') {
                        sharedRoomOptions.style.display = 'block';
                    } else {
                        sharedRoomOptions.style.display = 'none';
                    }
                }
            });
        }
        
        // Handle image uploads
        const imageUpload = document.getElementById('roomImages');
        const imagePreviewContainer = document.getElementById('imagePreviewContainer');
        
        if (imageUpload && imagePreviewContainer) {
            imageUpload.addEventListener('change', function() {
                imagePreviewContainer.innerHTML = '';
                
                if (this.files) {
                    const maxFiles = 5;
                    const filesArray = Array.from(this.files).slice(0, maxFiles);
                    
                    if (this.files.length > maxFiles) {
                        const warningMessage = document.createElement('p');
                        warningMessage.className = 'text-warning';
                        warningMessage.textContent = document.documentElement.lang === 'ar' 
                            ? `تم اختيار ${this.files.length} صور. سيتم استخدام أول ${maxFiles} صور فقط.`
                            : `You selected ${this.files.length} images. Only the first ${maxFiles} will be used.`;
                        imagePreviewContainer.appendChild(warningMessage);
                    }
                    
                    filesArray.forEach((file, index) => {
                        const reader = new FileReader();
                        
                        reader.onload = function(e) {
                            const previewDiv = document.createElement('div');
                            previewDiv.className = 'image-preview';
                            
                            const img = document.createElement('img');
                            img.src = e.target.result;
                            img.alt = `Room image ${index + 1}`;
                            
                            const removeButton = document.createElement('button');
                            removeButton.type = 'button';
                            removeButton.className = 'remove-image';
                            removeButton.innerHTML = '<i class="fas fa-times"></i>';
                            removeButton.setAttribute('data-index', index);
                            
                            removeButton.addEventListener('click', function() {
                                previewDiv.remove();
                                // Note: This doesn't actually remove the file from the input
                                // In a real implementation, you would track selected files separately
                            });
                            
                            previewDiv.appendChild(img);
                            previewDiv.appendChild(removeButton);
                            imagePreviewContainer.appendChild(previewDiv);
                        };
                        
                        reader.readAsDataURL(file);
                    });
                }
            });
        }
        
        // Form validation and submission
        roomListingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Reset error messages
            document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
            
            // Get form values
            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;
            const price = document.getElementById('price').value;
            const city = document.getElementById('city').value;
            const neighborhood = document.getElementById('neighborhood').value;
            const roomType = document.getElementById('roomType').value;
            const availableFrom = document.getElementById('availableFrom').value;
            const genderPreference = document.querySelector('input[name="genderPreference"]:checked')?.value;
            
            let isValid = true;
            
            // Validate required fields
            if (!title) {
                document.getElementById('titleError').textContent = document.documentElement.lang === 'ar' 
                    ? 'يرجى إدخال عنوان للإعلان' 
                    : 'Please enter a title';
                isValid = false;
            }
            
            if (!description) {
                document.getElementById('descriptionError').textContent = document.documentElement.lang === 'ar' 
                    ? 'يرجى إدخال وصف للغرفة' 
                    : 'Please enter a description';
                isValid = false;
            }
            
            if (!price) {
                document.getElementById('priceError').textContent = document.documentElement.lang === 'ar' 
                    ? 'يرجى إدخال السعر' 
                    : 'Please enter the price';
                isValid = false;
            }
            
            if (!city) {
                document.getElementById('cityError').textContent = document.documentElement.lang === 'ar' 
                    ? 'يرجى اختيار المدينة' 
                    : 'Please select a city';
                isValid = false;
            }
            
            if (!neighborhood) {
                document.getElementById('neighborhoodError').textContent = document.documentElement.lang === 'ar' 
                    ? 'يرجى إدخال اسم الحي' 
                    : 'Please enter the neighborhood';
                isValid = false;
            }
            
            if (!availableFrom) {
                document.getElementById('availableFromError').textContent = document.documentElement.lang === 'ar' 
                    ? 'يرجى اختيار تاريخ التوفر' 
                    : 'Please select availability date';
                isValid = false;
            }
            
            if (!genderPreference) {
                document.getElementById('genderPreferenceError').textContent = document.documentElement.lang === 'ar' 
                    ? 'يرجى اختيار تفضيل الجنس' 
                    : 'Please select gender preference';
                isValid = false;
            }
            
            // Get selected amenities
            const selectedAmenities = [];
            document.querySelectorAll('input[name="amenities"]:checked').forEach(checkbox => {
                selectedAmenities.push(checkbox.value);
            });
            
            if (isValid) {
                // Simulate API call to create listing
                simulateCreateListing({
                    title,
                    description,
                    price,
                    city,
                    neighborhood,
                    roomType,
                    availableFrom,
                    genderPreference,
                    amenities: selectedAmenities,
                    // In a real implementation, you would handle image uploads separately
                    images: Array.from(document.getElementById('roomImages').files).slice(0, 5)
                });
            }
        });
    }
    
    // Initialize profile edit form
    const profileEditForm = document.getElementById('profileEditForm');
    if (profileEditForm && checkAuthRequired()) {
        // Load user data if available
        const user = JSON.parse(localStorage.getItem('roomaity_user') || '{"isLoggedIn": false}');
        
        if (user.isLoggedIn) {
            // Populate form with user data
            if (user.name) document.getElementById('fullName').value = user.name;
            if (user.email) document.getElementById('email').value = user.email;
            if (user.phone) document.getElementById('phone').value = user.phone;
            if (user.bio) document.getElementById('bio').value = user.bio;
            if (user.occupation) document.getElementById('occupation').value = user.occupation;
            
            // Set gender radio button
            if (user.gender) {
                const genderRadio = document.querySelector(`input[name="gender"][value="${user.gender}"]`);
                if (genderRadio) genderRadio.checked = true;
            }
            
            // Set lifestyle preferences if available
            if (user.lifestyle) {
                if (user.lifestyle.cleanliness) document.getElementById('cleanliness').value = user.lifestyle.cleanliness;
                if (user.lifestyle.noise) document.getElementById('noise').value = user.lifestyle.noise;
                if (user.lifestyle.sleepSchedule) document.getElementById('sleepSchedule').value = user.lifestyle.sleepSchedule;
                if (user.lifestyle.smoking === true) document.getElementById('smokingYes').checked = true;
                if (user.lifestyle.smoking === false) document.getElementById('smokingNo').checked = true;
            }
        }
        
        // Handle profile image upload
        const profileImageUpload = document.getElementById('profileImage');
        const profileImagePreview = document.getElementById('profileImagePreview');
        
        if (profileImageUpload && profileImagePreview) {
            profileImageUpload.addEventListener('change', function() {
                if (this.files && this.files[0]) {
                    const reader = new FileReader();
                    
                    reader.onload = function(e) {
                        profileImagePreview.src = e.target.result;
                        profileImagePreview.style.display = 'block';
                    };
                    
                    reader.readAsDataURL(this.files[0]);
                }
            });
        }
        
        // Form validation and submission
        profileEditForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Reset error messages
            document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
            
            // Get form values
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const bio = document.getElementById('bio').value;
            const occupation = document.getElementById('occupation').value;
            const gender = document.querySelector('input[name="gender"]:checked')?.value;
            
            // Get lifestyle preferences
            const cleanliness = document.getElementById('cleanliness').value;
            const noise = document.getElementById('noise').value;
            const sleepSchedule = document.getElementById('sleepSchedule').value;
            const smoking = document.querySelector('input[name="smoking"]:checked')?.value === 'yes';
            
            let isValid = true;
            
            // Validate required fields
            if (!fullName) {
                document.getElementById('fullNameError').textContent = document.documentElement.lang === 'ar' 
                    ? 'يرجى إدخال الاسم الكامل' 
                    : 'Please enter your full name';
                isValid = false;
            }
            
            if (!email || !validateEmail(email)) {
                document.getElementById('emailError').textContent = document.documentElement.lang === 'ar' 
                    ? 'يرجى إدخال بريد إلكتروني صحيح' 
                    : 'Please enter a valid email';
                isValid = false;
            }
            
            if (!gender) {
                document.getElementById('genderError').textContent = document.documentElement.lang === 'ar' 
                    ? 'يرجى اختيار الجنس' 
                    : 'Please select your gender';
                isValid = false;
            }
            
            if (isValid) {
                // Simulate API call to update profile
                simulateUpdateProfile({
                    fullName,
                    email,
                    phone,
                    bio,
                    occupation,
                    gender,
                    lifestyle: {
                        cleanliness,
                        noise,
                        sleepSchedule,
                        smoking
                    },
                    // In a real implementation, you would handle image upload separately
                    profileImage: profileImageUpload.files[0]
                });
            }
        });
    }
    
    // Helper functions
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function simulateCreateListing(listingData) {
        // Show loading state
        const submitButton = document.querySelector('#roomListingForm button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = document.documentElement.lang === 'ar' 
            ? 'جاري إنشاء الإعلان...' 
            : 'Creating listing...';
        
        // Simulate API call delay
        setTimeout(function() {
            // Get existing listings or initialize empty array
            const listings = JSON.parse(localStorage.getItem('roomaity_listings') || '[]');
            
            // Add new listing with ID and user info
            const user = JSON.parse(localStorage.getItem('roomaity_user') || '{}');
            const newListing = {
                id: Date.now().toString(),
                ...listingData,
                userId: user.email,
                userName: user.name,
                userGender: user.gender,
                createdAt: new Date().toISOString(),
                // For demo purposes, create image URLs from file names
                imageUrls: listingData.images.map((file, index) => `images/listings/listing-${Date.now()}-${index}.jpg`)
            };
            
            listings.push(newListing);
            localStorage.setItem('roomaity_listings', JSON.stringify(listings));
            
            // Show success message and redirect
            alert(document.documentElement.lang === 'ar' 
                ? 'تم إنشاء الإعلان بنجاح!' 
                : 'Listing created successfully!');
            
            window.location.href = document.documentElement.lang === 'ar' 
                ? 'my-listings-ar.html' 
                : 'my-listings.html';
        }, 1500);
    }
    
    function simulateUpdateProfile(profileData) {
        // Show loading state
        const submitButton = document.querySelector('#profileEditForm button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = document.documentElement.lang === 'ar' 
            ? 'جاري تحديث الملف الشخصي...' 
            : 'Updating profile...';
        
        // Simulate API call delay
        setTimeout(function() {
            // Get existing user data
            const user = JSON.parse(localStorage.getItem('roomaity_user') || '{"isLoggedIn": false}');
            
            // Update user data
            const updatedUser = {
                ...user,
                name: profileData.fullName,
                email: profileData.email,
                phone: profileData.phone,
                bio: profileData.bio,
                occupation: profileData.occupation,
                gender: profileData.gender,
                lifestyle: profileData.lifestyle,
                // For demo purposes, create profile image URL
                profileImageUrl: profileData.profileImage 
                    ? `images/profiles/profile-${Date.now()}.jpg` 
                    : user.profileImageUrl
            };
            
            localStorage.setItem('roomaity_user', JSON.stringify(updatedUser));
            
            // Show success message
            alert(document.documentElement.lang === 'ar' 
                ? 'تم تحديث الملف الشخصي بنجاح!' 
                : 'Profile updated successfully!');
            
            // Re-enable button
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }, 1500);
    }
    
    // Initialize my listings page
    const myListingsContainer = document.getElementById('myListingsContainer');
    if (myListingsContainer && checkAuthRequired()) {
        // Load user's listings
        const user = JSON.parse(localStorage.getItem('roomaity_user') || '{"isLoggedIn": false}');
        const listings = JSON.parse(localStorage.getItem('roomaity_listings') || '[]');
        
        // Filter listings by current user
        const userListings = listings.filter(listing => listing.userId === user.email);
        
        if (userListings.length > 0) {
            // Create listing cards
            userListings.forEach(listing => {
                const listingCard = document.createElement('div');
                listingCard.className = 'listing-card';
                
                // Format date
                const createdDate = new Date(listing.createdAt);
                const formattedDate = createdDate.toLocaleDateString(
                    document.documentElement.lang === 'ar' ? 'ar-SA' : 'en-US', 
                    { year: 'numeric', month: 'long', day: 'numeric' }
                );
                
                // Format price
                const formattedPrice = new Intl.NumberFormat(
                    document.documentElement.lang === 'ar' ? 'ar-SA' : 'en-US', 
                    { style: 'currency', currency: 'SAR' }
                ).format(listing.price);
                
                listingCard.innerHTML = `
                    <div class="listing-image">
                        <img src="${listing.imageUrls[0] || 'images/placeholder-room.jpg'}" alt="${listing.title}">
                    </div>
                    <div class="listing-content">
                        <h3 class="listing-title">${listing.title}</h3>
                        <p class="listing-location"><i class="fas fa-map-marker-alt"></i> ${listing.city}, ${listing.neighborhood}</p>
                        <p class="listing-price">${formattedPrice} / ${document.documentElement.lang === 'ar' ? 'شهر' : 'month'}</p>
                        <p class="listing-date"><i class="far fa-calendar-alt"></i> ${document.documentElement.lang === 'ar' ? 'تم النشر في' : 'Posted on'} ${formattedDate}</p>
                        <div class="listing-actions">
                            <a href="${document.documentElement.lang === 'ar' ? 'edit-listing-ar.html' : 'edit-listing.html'}?id=${listing.id}" class="btn btn-outline-primary btn-sm">
                                <i class="fas fa-edit"></i> ${document.documentElement.lang === 'ar' ? 'تعديل' : 'Edit'}
                            </a>
                            <button class="btn btn-outline-danger btn-sm delete-listing" data-id="${listing.id}">
                                <i class="fas fa-trash"></i> ${document.documentElement.lang === 'ar' ? 'حذف' : 'Delete'}
                            </button>
                        </div>
                    </div>
                `;
                
                myListingsContainer.appendChild(listingCard);
            });
            
            // Add event listeners to delete buttons
            document.querySelectorAll('.delete-listing').forEach(button => {
                button.addEventListener('click', function() {
                    const listingId = this.getAttribute('data-id');
                    
                    if (confirm(document.documentElement.lang === 'ar' 
                        ? 'هل أنت متأكد من رغبتك في حذف هذا الإعلان؟' 
                        : 'Are you sure you want to delete this listing?')) {
                        
                        // Get listings from storage
                        const listings = JSON.parse(localStorage.getItem('roomaity_listings') || '[]');
                        
                        // Filter out the deleted listing
                        const updatedListings = listings.filter(listing => listing.id !== listingId);
                        
                        // Save updated listings
                        localStorage.setItem('roomaity_listings', JSON.stringify(updatedListings));
                        
                        // Remove the listing card from the DOM
                        this.closest('.listing-card').remove();
                        
                        // Show empty message if no listings left
                        if (updatedListings.length === 0 || 
                            !updatedListings.some(listing => listing.userId === user.email)) {
                            myListingsContainer.innerHTML = `
                                <div class="empty-state">
                                    <i class="fas fa-home fa-3x"></i>
                                    <h3>${document.documentElement.lang === 'ar' 
                                        ? 'ليس لديك إعلانات حالياً' 
                                        : 'You have no listings yet'}</h3>
                                    <p>${document.documentElement.lang === 'ar' 
                                        ? 'أضف غرفتك الآن للعثور على شريك سكن مناسب' 
                                        : 'Add your room now to find a suitable roommate'}</p>
                                    <a href="${document.documentElement.lang === 'ar' 
                                        ? 'list-room-ar.html' 
                                        : 'list-room.html'}" class="btn btn-primary">
                                        ${document.documentElement.lang === 'ar' 
                                            ? 'أضف غرفتك' 
                                            : 'Add Your Room'}
                                    </a>
                                </div>
                            `;
                        }
                    }
                });
            });
        } else {
            // Show empty state
            myListingsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-home fa-3x"></i>
                    <h3>${document.documentElement.lang === 'ar' 
                        ? 'ليس لديك إعلانات حالياً' 
                        : 'You have no listings yet'}</h3>
                    <p>${document.documentElement.lang === 'ar' 
                        ? 'أضف غرفتك الآن للعثور على شريك سكن مناسب' 
                        : 'Add your room now to find a suitable roommate'}</p>
                    <a href="${document.documentElement.lang === 'ar' 
                        ? 'list-room-ar.html' 
                        : 'list-room.html'}" class="btn btn-primary">
                        ${document.documentElement.lang === 'ar' 
                            ? 'أضف غرفتك' 
                            : 'Add Your Room'}
                    </a>
                </div>
            `;
        }
    }
    
    // Initialize profile view page
    const profileViewContainer = document.getElementById('profileViewContainer');
    if (profileViewContainer) {
        // Get profile ID from URL if available
        const urlParams = new URLSearchParams(window.location.search);
        const profileId = urlParams.get('id');
        
        let profileData;
        
        if (profileId) {
            // In a real implementation, you would fetch profile data from API
            // For demo, we'll use mock data
            const listings = JSON.parse(localStorage.getItem('roomaity_listings') || '[]');
            const listing = listings.find(l => l.id === profileId);
            
            if (listing) {
                profileData = {
                    id: profileId,
                    name: listing.userName,
                    gender: listing.userGender,
                    occupation: 'Student', // Mock data
                    bio: 'Friendly and clean roommate looking for a shared apartment near the university.',
                    lifestyle: {
                        cleanliness: 4,
                        noise: 2,
                        sleepSchedule: 'early_bird',
                        smoking: false
                    },
                    profileImageUrl: 'images/profiles/profile-default.jpg'
                };
            }
        } else {
            // View current user's profile
            const user = JSON.parse(localStorage.getItem('roomaity_user') || '{"isLoggedIn": false}');
            
            if (user.isLoggedIn) {
                profileData = {
                    id: user.email,
                    name: user.name,
                    gender: user.gender,
                    occupation: user.occupation || 'Not specified',
                    bio: user.bio || 'No bio provided',
                    lifestyle: user.lifestyle || {
                        cleanliness: 3,
                        noise: 3,
                        sleepSchedule: 'flexible',
                        smoking: false
                    },
                    profileImageUrl: user.profileImageUrl || 'images/profiles/profile-default.jpg'
                };
            }
        }
        
        if (profileData) {
            // Render profile data
            profileViewContainer.innerHTML = `
                <div class="profile-header">
                    <div class="profile-image">
                        <img src="${profileData.profileImageUrl}" alt="${profileData.name}">
                    </div>
                    <div class="profile-info">
                        <h1 class="profile-name">${profileData.name}</h1>
                        <p class="profile-occupation">${profileData.occupation}</p>
                        <p class="profile-gender">
                            <i class="fas fa-${profileData.gender === 'male' ? 'male' : 'female'}"></i>
                            ${document.documentElement.lang === 'ar' 
                                ? (profileData.gender === 'male' ? 'ذكر' : 'أنثى')
                                : (profileData.gender === 'male' ? 'Male' : 'Female')}
                        </p>
                    </div>
                </div>
                
                <div class="profile-section">
                    <h2 class="section-title">${document.documentElement.lang === 'ar' ? 'نبذة عني' : 'About Me'}</h2>
                    <p class="profile-bio">${profileData.bio}</p>
                </div>
                
                <div class="profile-section">
                    <h2 class="section-title">${document.documentElement.lang === 'ar' ? 'نمط الحياة' : 'Lifestyle'}</h2>
                    
                    <div class="lifestyle-item">
                        <span class="lifestyle-label">${document.documentElement.lang === 'ar' ? 'مستوى النظافة' : 'Cleanliness'}</span>
                        <div class="rating-stars">
                            ${generateRatingStars(profileData.lifestyle.cleanliness)}
                        </div>
                    </div>
                    
                    <div class="lifestyle-item">
                        <span class="lifestyle-label">${document.documentElement.lang === 'ar' ? 'مستوى الضوضاء' : 'Noise Level'}</span>
                        <div class="rating-stars">
                            ${generateRatingStars(profileData.lifestyle.noise)}
                        </div>
                    </div>
                    
                    <div class="lifestyle-item">
                        <span class="lifestyle-label">${document.documentElement.lang === 'ar' ? 'جدول النوم' : 'Sleep Schedule'}</span>
                        <span class="lifestyle-value">${getSleepScheduleLabel(profileData.lifestyle.sleepSchedule)}</span>
                    </div>
                    
                    <div class="lifestyle-item">
                        <span class="lifestyle-label">${document.documentElement.lang === 'ar' ? 'التدخين' : 'Smoking'}</span>
                        <span class="lifestyle-value ${profileData.lifestyle.smoking ? 'text-warning' : 'text-success'}">
                            <i class="fas ${profileData.lifestyle.smoking ? 'fa-smoking' : 'fa-smoking-ban'}"></i>
                            ${document.documentElement.lang === 'ar' 
                                ? (profileData.lifestyle.smoking ? 'مدخن' : 'غير مدخن')
                                : (profileData.lifestyle.smoking ? 'Smoker' : 'Non-smoker')}
                        </span>
                    </div>
                </div>
                
                ${!profileId ? `
                <div class="profile-actions">
                    <a href="${document.documentElement.lang === 'ar' ? 'profile-edit-ar.html' : 'profile-edit.html'}" class="btn btn-primary">
                        <i class="fas fa-edit"></i> ${document.documentElement.lang === 'ar' ? 'تعديل الملف الشخصي' : 'Edit Profile'}
                    </a>
                </div>
                ` : `
                <div class="profile-actions">
                    <a href="${document.documentElement.lang === 'ar' ? 'messages-ar.html' : 'messages.html'}?to=${profileData.id}" class="btn btn-primary">
                        <i class="fas fa-comment"></i> ${document.documentElement.lang === 'ar' ? 'مراسلة' : 'Message'}
                    </a>
                </div>
                `}
            `;
        } else {
            // Profile not found
            profileViewContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-user-slash fa-3x"></i>
                    <h3>${document.documentElement.lang === 'ar' ? 'الملف الشخصي غير موجود' : 'Profile Not Found'}</h3>
                    <p>${document.documentElement.lang === 'ar' 
                        ? 'لم يتم العثور على الملف الشخصي المطلوب' 
                        : 'The requested profile could not be found'}</p>
                    <a href="${document.documentElement.lang === 'ar' ? 'index-ar.html' : 'index.html'}" class="btn btn-primary">
                        ${document.documentElement.lang === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
                    </a>
                </div>
            `;
        }
    }
    
    // Helper functions for profile view
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
    
    function getSleepScheduleLabel(schedule) {
        if (document.documentElement.lang === 'ar') {
            switch (schedule) {
                case 'early_bird': return 'مستيقظ مبكراً';
                case 'night_owl': return 'ساهر ليلاً';
                case 'flexible': return 'مرن';
                default: return 'غير محدد';
            }
        } else {
            switch (schedule) {
                case 'early_bird': return 'Early Bird';
                case 'night_owl': return 'Night Owl';
                case 'flexible': return 'Flexible';
                default: return 'Not specified';
            }
        }
    }
    
    // Initialize on page load
    checkAuthRequired();
});
