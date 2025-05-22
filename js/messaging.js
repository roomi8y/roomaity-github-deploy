// Messaging system functionality for Roomaity platform
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in before allowing access to messaging
    function checkAuthRequired() {
        const authRequiredPages = ['messages'];
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
    
    // Initialize messaging interface
    const conversationsList = document.getElementById('conversationsList');
    const messageContainer = document.getElementById('messageContainer');
    const messageForm = document.getElementById('messageForm');
    const messageInput = document.getElementById('messageInput');
    const noConversationSelected = document.getElementById('noConversationSelected');
    const conversationHeader = document.getElementById('conversationHeader');
    
    if (conversationsList && messageContainer && checkAuthRequired()) {
        // Get current user
        const currentUser = JSON.parse(localStorage.getItem('roomaity_user'));
        
        // Get URL parameters to check if we're starting a new conversation
        const urlParams = new URLSearchParams(window.location.search);
        const newRecipientId = urlParams.get('to');
        
        // Load conversations from localStorage or initialize empty array
        let conversations = JSON.parse(localStorage.getItem('roomaity_conversations') || '[]');
        
        // If we have a new recipient from URL, check if conversation exists or create new one
        if (newRecipientId) {
            // For demo purposes, create a mock recipient if not in conversations
            let existingConversation = conversations.find(c => 
                (c.user1Id === currentUser.email && c.user2Id === newRecipientId) ||
                (c.user1Id === newRecipientId && c.user2Id === currentUser.email)
            );
            
            if (!existingConversation) {
                // Create mock recipient data
                const mockRecipient = {
                    id: newRecipientId,
                    name: newRecipientId.split('@')[0], // Use part of email as name
                    gender: newRecipientId.toLowerCase().includes('sara') ? 'female' : 'male',
                    profileImageUrl: 'images/profiles/profile-default.jpg'
                };
                
                // Create new conversation
                const newConversation = {
                    id: Date.now().toString(),
                    user1Id: currentUser.email,
                    user2Id: newRecipientId,
                    user1Name: currentUser.name,
                    user2Name: mockRecipient.name,
                    user1Gender: currentUser.gender,
                    user2Gender: mockRecipient.gender,
                    user1ImageUrl: currentUser.profileImageUrl || 'images/profiles/profile-default.jpg',
                    user2ImageUrl: mockRecipient.profileImageUrl,
                    lastMessage: '',
                    lastMessageTime: new Date().toISOString(),
                    messages: []
                };
                
                conversations.push(newConversation);
                localStorage.setItem('roomaity_conversations', JSON.stringify(conversations));
                
                // Select the new conversation
                selectConversation(newConversation.id);
            } else {
                // Select existing conversation
                selectConversation(existingConversation.id);
            }
        }
        
        // Render conversations list
        renderConversationsList();
        
        // Handle message form submission
        if (messageForm) {
            messageForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const messageText = messageInput.value.trim();
                if (!messageText) return;
                
                const activeConversationId = messageForm.getAttribute('data-conversation-id');
                if (!activeConversationId) return;
                
                sendMessage(activeConversationId, messageText);
                messageInput.value = '';
            });
        }
        
        // Function to render conversations list
        function renderConversationsList() {
            if (!conversationsList) return;
            
            // Sort conversations by last message time (newest first)
            conversations.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
            
            if (conversations.length === 0) {
                conversationsList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-comments fa-3x"></i>
                        <h3>${document.documentElement.lang === 'ar' ? 'لا توجد محادثات' : 'No Conversations'}</h3>
                        <p>${document.documentElement.lang === 'ar' 
                            ? 'ابدأ محادثة مع شريك سكن محتمل' 
                            : 'Start a conversation with a potential roommate'}</p>
                        <a href="${document.documentElement.lang === 'ar' ? 'search-ar.html' : 'search.html'}" class="btn btn-primary">
                            ${document.documentElement.lang === 'ar' ? 'ابحث عن شركاء سكن' : 'Find Roommates'}
                        </a>
                    </div>
                `;
                return;
            }
            
            conversationsList.innerHTML = '';
            
            conversations.forEach(conversation => {
                // Determine if current user is user1 or user2
                const isUser1 = conversation.user1Id === currentUser.email;
                const otherUserName = isUser1 ? conversation.user2Name : conversation.user1Name;
                const otherUserImage = isUser1 ? conversation.user2ImageUrl : conversation.user1ImageUrl;
                const otherUserGender = isUser1 ? conversation.user2Gender : conversation.user1Gender;
                
                // Format last message time
                const lastMessageTime = new Date(conversation.lastMessageTime);
                const now = new Date();
                let timeDisplay;
                
                if (lastMessageTime.toDateString() === now.toDateString()) {
                    // Today - show time
                    timeDisplay = lastMessageTime.toLocaleTimeString(
                        document.documentElement.lang === 'ar' ? 'ar-SA' : 'en-US', 
                        { hour: '2-digit', minute: '2-digit' }
                    );
                } else if (lastMessageTime.getTime() > now.getTime() - 86400000 * 7) {
                    // Within last week - show day name
                    timeDisplay = lastMessageTime.toLocaleDateString(
                        document.documentElement.lang === 'ar' ? 'ar-SA' : 'en-US', 
                        { weekday: 'long' }
                    );
                } else {
                    // Older - show date
                    timeDisplay = lastMessageTime.toLocaleDateString(
                        document.documentElement.lang === 'ar' ? 'ar-SA' : 'en-US', 
                        { year: 'numeric', month: 'short', day: 'numeric' }
                    );
                }
                
                // Create conversation item
                const conversationItem = document.createElement('div');
                conversationItem.className = 'conversation-item';
                conversationItem.setAttribute('data-conversation-id', conversation.id);
                
                conversationItem.innerHTML = `
                    <div class="conversation-avatar">
                        <img src="${otherUserImage || 'images/profiles/profile-default.jpg'}" alt="${otherUserName}">
                        <span class="gender-indicator gender-${otherUserGender}">
                            <i class="fas fa-${otherUserGender === 'male' ? 'male' : 'female'}"></i>
                        </span>
                    </div>
                    <div class="conversation-content">
                        <div class="conversation-header">
                            <h3 class="conversation-name">${otherUserName}</h3>
                            <span class="conversation-time">${timeDisplay}</span>
                        </div>
                        <p class="conversation-preview">${conversation.lastMessage || 
                            (document.documentElement.lang === 'ar' ? 'ابدأ محادثة...' : 'Start a conversation...')}</p>
                    </div>
                `;
                
                // Add click event to select conversation
                conversationItem.addEventListener('click', function() {
                    selectConversation(conversation.id);
                });
                
                conversationsList.appendChild(conversationItem);
            });
        }
        
        // Function to select and display a conversation
        function selectConversation(conversationId) {
            // Remove active class from all conversation items
            document.querySelectorAll('.conversation-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active class to selected conversation
            const selectedItem = document.querySelector(`.conversation-item[data-conversation-id="${conversationId}"]`);
            if (selectedItem) {
                selectedItem.classList.add('active');
            }
            
            // Find the conversation in our data
            const conversation = conversations.find(c => c.id === conversationId);
            if (!conversation) return;
            
            // Show message container and hide "no conversation selected" message
            if (noConversationSelected) {
                noConversationSelected.style.display = 'none';
            }
            if (messageContainer) {
                messageContainer.style.display = 'flex';
            }
            
            // Set conversation ID on message form
            if (messageForm) {
                messageForm.setAttribute('data-conversation-id', conversationId);
            }
            
            // Determine if current user is user1 or user2
            const currentUser = JSON.parse(localStorage.getItem('roomaity_user'));
            const isUser1 = conversation.user1Id === currentUser.email;
            const otherUserName = isUser1 ? conversation.user2Name : conversation.user1Name;
            const otherUserImage = isUser1 ? conversation.user2ImageUrl : conversation.user1ImageUrl;
            
            // Update conversation header
            if (conversationHeader) {
                conversationHeader.innerHTML = `
                    <div class="conversation-avatar">
                        <img src="${otherUserImage || 'images/profiles/profile-default.jpg'}" alt="${otherUserName}">
                    </div>
                    <div class="conversation-info">
                        <h3 class="conversation-name">${otherUserName}</h3>
                        <p class="conversation-status">${document.documentElement.lang === 'ar' ? 'متصل' : 'Online'}</p>
                    </div>
                `;
            }
            
            // Render messages
            renderMessages(conversation);
        }
        
        // Function to render messages for a conversation
        function renderMessages(conversation) {
            const messagesContainer = document.getElementById('messagesContainer');
            if (!messagesContainer) return;
            
            if (!conversation.messages || conversation.messages.length === 0) {
                messagesContainer.innerHTML = `
                    <div class="empty-messages">
                        <i class="fas fa-comments fa-3x"></i>
                        <p>${document.documentElement.lang === 'ar' 
                            ? 'ابدأ محادثة مع ' + (conversation.user1Id === currentUser.email ? conversation.user2Name : conversation.user1Name)
                            : 'Start a conversation with ' + (conversation.user1Id === currentUser.email ? conversation.user2Name : conversation.user1Name)}</p>
                    </div>
                `;
                return;
            }
            
            messagesContainer.innerHTML = '';
            
            // Group messages by date
            let currentDate = null;
            
            conversation.messages.forEach(message => {
                const messageDate = new Date(message.timestamp);
                const messageDay = messageDate.toDateString();
                
                // Add date separator if this is a new day
                if (messageDay !== currentDate) {
                    currentDate = messageDay;
                    
                    const dateSeparator = document.createElement('div');
                    dateSeparator.className = 'date-separator';
                    
                    // Format date based on how recent it is
                    const now = new Date();
                    let dateDisplay;
                    
                    if (messageDay === now.toDateString()) {
                        dateDisplay = document.documentElement.lang === 'ar' ? 'اليوم' : 'Today';
                    } else if (messageDate.getTime() > now.getTime() - 86400000) {
                        dateDisplay = document.documentElement.lang === 'ar' ? 'الأمس' : 'Yesterday';
                    } else {
                        dateDisplay = messageDate.toLocaleDateString(
                            document.documentElement.lang === 'ar' ? 'ar-SA' : 'en-US', 
                            { year: 'numeric', month: 'long', day: 'numeric' }
                        );
                    }
                    
                    dateSeparator.textContent = dateDisplay;
                    messagesContainer.appendChild(dateSeparator);
                }
                
                // Create message element
                const messageElement = document.createElement('div');
                messageElement.className = `message ${message.senderId === currentUser.email ? 'message-sent' : 'message-received'}`;
                
                // Format message time
                const messageTime = messageDate.toLocaleTimeString(
                    document.documentElement.lang === 'ar' ? 'ar-SA' : 'en-US', 
                    { hour: '2-digit', minute: '2-digit' }
                );
                
                messageElement.innerHTML = `
                    <div class="message-content">
                        <p>${message.text}</p>
                        <span class="message-time">${messageTime}</span>
                    </div>
                `;
                
                messagesContainer.appendChild(messageElement);
            });
            
            // Scroll to bottom of messages
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
        
        // Function to send a message
        function sendMessage(conversationId, messageText) {
            // Find the conversation
            const conversationIndex = conversations.findIndex(c => c.id === conversationId);
            if (conversationIndex === -1) return;
            
            const conversation = conversations[conversationIndex];
            const currentUser = JSON.parse(localStorage.getItem('roomaity_user'));
            
            // Create new message
            const newMessage = {
                id: Date.now().toString(),
                senderId: currentUser.email,
                text: messageText,
                timestamp: new Date().toISOString(),
                read: false
            };
            
            // Add message to conversation
            if (!conversation.messages) {
                conversation.messages = [];
            }
            
            conversation.messages.push(newMessage);
            
            // Update last message and time
            conversation.lastMessage = messageText;
            conversation.lastMessageTime = newMessage.timestamp;
            
            // Update conversations in localStorage
            localStorage.setItem('roomaity_conversations', JSON.stringify(conversations));
            
            // Re-render messages and conversations list
            renderMessages(conversation);
            renderConversationsList();
            
            // Simulate receiving a reply after a delay (for demo purposes)
            setTimeout(() => {
                simulateReply(conversationId);
            }, 1000 + Math.random() * 2000);
        }
        
        // Function to simulate receiving a reply (for demo purposes)
        function simulateReply(conversationId) {
            // Find the conversation
            const conversationIndex = conversations.findIndex(c => c.id === conversationId);
            if (conversationIndex === -1) return;
            
            const conversation = conversations[conversationIndex];
            const currentUser = JSON.parse(localStorage.getItem('roomaity_user'));
            
            // Determine other user
            const otherUserId = conversation.user1Id === currentUser.email ? conversation.user2Id : conversation.user1Id;
            
            // Generate a random reply
            const replies = [
                document.documentElement.lang === 'ar' ? 'شكراً للتواصل!' : 'Thanks for reaching out!',
                document.documentElement.lang === 'ar' ? 'أنا مهتم بالغرفة. هل هي لا تزال متاحة؟' : 'I am interested in the room. Is it still available?',
                document.documentElement.lang === 'ar' ? 'متى يمكنني رؤية الغرفة؟' : 'When can I see the room?',
                document.documentElement.lang === 'ar' ? 'هل المرافق مشمولة في الإيجار؟' : 'Are utilities included in the rent?',
                document.documentElement.lang === 'ar' ? 'أخبرني المزيد عن المنطقة.' : 'Tell me more about the neighborhood.',
                document.documentElement.lang === 'ar' ? 'هل هناك مواقف سيارات؟' : 'Is there parking available?',
                document.documentElement.lang === 'ar' ? 'ما هي قواعد المنزل؟' : 'What are the house rules?',
                document.documentElement.lang === 'ar' ? 'هل يمكنني إحضار ضيوف؟' : 'Can I have guests over?'
            ];
            
            const randomReply = replies[Math.floor(Math.random() * replies.length)];
            
            // Create new message
            const newMessage = {
                id: Date.now().toString(),
                senderId: otherUserId,
                text: randomReply,
                timestamp: new Date().toISOString(),
                read: false
            };
            
            // Add message to conversation
            if (!conversation.messages) {
                conversation.messages = [];
            }
            
            conversation.messages.push(newMessage);
            
            // Update last message and time
            conversation.lastMessage = randomReply;
            conversation.lastMessageTime = newMessage.timestamp;
            
            // Update conversations in localStorage
            localStorage.setItem('roomaity_conversations', JSON.stringify(conversations));
            
            // Re-render messages and conversations list if this conversation is active
            const activeConversationId = messageForm.getAttribute('data-conversation-id');
            if (activeConversationId === conversationId) {
                renderMessages(conversation);
            }
            
            renderConversationsList();
        }
    }
    
    // Initialize on page load
    checkAuthRequired();
});
