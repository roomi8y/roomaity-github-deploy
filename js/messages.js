// Messages page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Message form submission
    const messageForm = document.getElementById('messageForm');
    const messageInput = document.getElementById('messageInput');
    const messageThreadBody = document.querySelector('.message-thread-body');
    
    if (messageForm && messageInput && messageThreadBody) {
        messageForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const messageText = messageInput.value.trim();
            if (messageText) {
                // Create new message element
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message sent';
                
                const now = new Date();
                const hours = now.getHours().toString().padStart(2, '0');
                const minutes = now.getMinutes().toString().padStart(2, '0');
                const timeString = `${hours}:${minutes}`;
                
                messageDiv.innerHTML = `
                    <div class="message-content">
                        <p>${messageText}</p>
                    </div>
                    <div class="message-meta">
                        <small class="text-muted">${timeString} <i class="fas fa-check"></i></small>
                    </div>
                `;
                
                // Add message to thread
                messageThreadBody.appendChild(messageDiv);
                
                // Clear input
                messageInput.value = '';
                
                // Scroll to bottom
                messageThreadBody.scrollTop = messageThreadBody.scrollHeight;
                
                // Simulate reply after delay (for demo purposes)
                setTimeout(simulateReply, 2000);
            }
        });
        
        // Initial scroll to bottom
        messageThreadBody.scrollTop = messageThreadBody.scrollHeight;
    }
    
    // Conversation list item click
    const conversationItems = document.querySelectorAll('.conversation-list .list-group-item');
    conversationItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            conversationItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Remove unread badge
            const badge = this.querySelector('.badge');
            if (badge) {
                badge.style.display = 'none';
            }
            
            // In a real implementation, this would load the conversation thread
            // For now, we'll just show a loading indicator and then reset
            const messageThreadBody = document.querySelector('.message-thread-body');
            if (messageThreadBody) {
                messageThreadBody.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div></div>';
                
                // Simulate loading delay
                setTimeout(() => {
                    // Reset to original content for demo purposes
                    loadConversation(this.getAttribute('data-conversation-id'));
                }, 1000);
            }
        });
    });
    
    // Conversation search
    const conversationSearch = document.getElementById('conversationSearch');
    if (conversationSearch) {
        conversationSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            conversationItems.forEach(item => {
                const name = item.querySelector('h6').textContent.toLowerCase();
                const preview = item.querySelector('.conversation-preview').textContent.toLowerCase();
                
                if (name.includes(searchTerm) || preview.includes(searchTerm)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
    
    // Attachment button
    const attachButton = document.getElementById('attachButton');
    if (attachButton) {
        attachButton.addEventListener('click', function() {
            // In a real implementation, this would open a file picker
            alert('File attachment feature will be implemented in the next version.');
        });
    }
    
    // View profile button
    const viewProfileBtn = document.getElementById('viewProfileBtn');
    if (viewProfileBtn) {
        viewProfileBtn.addEventListener('click', function() {
            // In a real implementation, this would navigate to the user's profile
            window.location.href = 'profile.html?id=user1';
        });
    }
    
    // Dropdown toggle (for mobile)
    const threadOptionsDropdown = document.getElementById('threadOptionsDropdown');
    if (threadOptionsDropdown) {
        threadOptionsDropdown.addEventListener('click', function() {
            const dropdownMenu = this.nextElementSibling;
            dropdownMenu.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.matches('#threadOptionsDropdown') && !e.target.closest('.dropdown-menu')) {
                const dropdowns = document.querySelectorAll('.dropdown-menu');
                dropdowns.forEach(dropdown => {
                    if (dropdown.classList.contains('show')) {
                        dropdown.classList.remove('show');
                    }
                });
            }
        });
    }
    
    // Simulate reply (for demo purposes)
    function simulateReply() {
        const replies = [
            "That sounds good!",
            "When would you like to schedule a viewing?",
            "Is tomorrow at 4 PM good for you?",
            "Do you have any other questions about the room?",
            "The room is still available if you're interested."
        ];
        
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message received';
        
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const timeString = `${hours}:${minutes}`;
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${randomReply}</p>
            </div>
            <div class="message-meta">
                <small class="text-muted">${timeString}</small>
            </div>
        `;
        
        // Add message to thread
        messageThreadBody.appendChild(messageDiv);
        
        // Scroll to bottom
        messageThreadBody.scrollTop = messageThreadBody.scrollHeight;
        
        // Update sent message status to read
        const sentMessages = document.querySelectorAll('.message.sent');
        if (sentMessages.length > 0) {
            const lastSent = sentMessages[sentMessages.length - 1];
            const icon = lastSent.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-check-double';
            }
        }
    }
    
    // Load conversation (for demo purposes)
    function loadConversation(conversationId) {
        // In a real implementation, this would fetch the conversation from the API
        // For now, we'll just reset to the original content
        
        const messageThreadBody = document.querySelector('.message-thread-body');
        const conversationHeader = document.querySelector('.card-header');
        
        if (messageThreadBody && conversationHeader) {
            // Update header based on conversation
            const selectedConversation = document.querySelector(`.conversation-list .list-group-item[data-conversation-id="${conversationId}"]`);
            if (selectedConversation) {
                const name = selectedConversation.querySelector('h6').textContent;
                const avatar = selectedConversation.querySelector('.avatar').src;
                const status = selectedConversation.querySelector('.status-indicator').classList.contains('online') ? 'Online' : 'Offline';
                
                const headerContent = conversationHeader.querySelector('.d-flex.align-items-center');
                if (headerContent) {
                    headerContent.querySelector('img').src = avatar;
                    headerContent.querySelector('h5').textContent = name;
                    headerContent.querySelector('small').textContent = status;
                }
            }
            
            // Reset message thread for demo purposes
            messageThreadBody.innerHTML = `
                <!-- Message Date Separator -->
                <div class="message-date-separator">
                    <span>Today</span>
                </div>
                
                <!-- Sample messages for demo -->
                <div class="message received">
                    <div class="message-content">
                        <p>Hello! I'm interested in your listing.</p>
                    </div>
                    <div class="message-meta">
                        <small class="text-muted">10:15 AM</small>
                    </div>
                </div>
                
                <div class="message sent">
                    <div class="message-content">
                        <p>Hi! Thanks for your interest. The room is still available.</p>
                    </div>
                    <div class="message-meta">
                        <small class="text-muted">10:18 AM <i class="fas fa-check-double"></i></small>
                    </div>
                </div>
            `;
            
            // Scroll to bottom
            messageThreadBody.scrollTop = messageThreadBody.scrollHeight;
        }
    }
});
