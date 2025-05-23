// Messaging system functionality for Roomaity platform
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in before allowing access to messaging
    function checkAuthRequired() {
        const authRequiredPages = ['messages'];
        const currentPage = window.location.pathname.split('/').pop().split('.')[0];
        
        if (authRequiredPages.some(page => currentPage.includes(page))) {
            const user = JSON.parse(localStorage.getItem('roomaity_user') || '{"isLoggedIn": false}');
            
            if (!user.isLoggedIn) {
                const returnUrl = encodeURIComponent(window.location.href);
                window.location.href = document.documentElement.lang === 'ar' 
                    ? `login-ar.html?return=${returnUrl}` 
                    : `login.html?return=${returnUrl}`;
                return false;
            }
        }
        return true;
    }
    
    // New specific global variables
    const maleTabButton = document.getElementById('male-tab');
    const femaleTabButton = document.getElementById('female-tab');
    
    const maleConversationsListContainer = document.querySelector('#male-content .conversation-list');
    const femaleConversationsListContainer = document.querySelector('#female-content .conversation-list');
    
    const maleMessageThreadCard = document.querySelector('#male-content .message-thread');
    const femaleMessageThreadCard = document.querySelector('#female-content .message-thread');
    
    const maleMessageThreadBody = document.querySelector('#male-content .message-thread-body');
    const femaleMessageThreadBody = document.querySelector('#female-content .message-thread-body');
    
    const maleMessageForm = document.getElementById('messageForm'); 
    const femaleMessageForm = document.getElementById('messageFormFemale');
    
    const maleMessageInput = document.getElementById('messageInput'); 
    const femaleMessageInput = document.getElementById('messageInputFemale');

    const maleConversationHeaderName = document.querySelector('#male-content .contact-name');
    const maleConversationHeaderAvatar = document.querySelector('#male-content .contact-avatar img');
    const maleConversationHeaderStatus = document.querySelector('#male-content .contact-status');

    const femaleConversationHeaderName = document.querySelector('#female-content .contact-name');
    const femaleConversationHeaderAvatar = document.querySelector('#female-content .contact-avatar img');
    const femaleConversationHeaderStatus = document.querySelector('#female-content .contact-status');
    
    let currentActiveGenderTab = 'male'; 
    let conversations = []; 
    let currentUser = null; 

    if (checkAuthRequired()) {
        currentUser = JSON.parse(localStorage.getItem('roomaity_user'));
        conversations = JSON.parse(localStorage.getItem('roomaity_conversations') || '[]');

        // Initial UI setup based on default tab
        if (currentActiveGenderTab === 'male') {
            if(femaleMessageThreadCard) femaleMessageThreadCard.style.display = 'none';
            if(maleMessageThreadCard) maleMessageThreadCard.style.display = 'flex';
        } else { // female
            if(maleMessageThreadCard) maleMessageThreadCard.style.display = 'none';
            if(femaleMessageThreadCard) femaleMessageThreadCard.style.display = 'flex';
        }
        displayPlaceholderInThread(currentActiveGenderTab);


        if (maleTabButton) {
            maleTabButton.addEventListener('click', function() {
                currentActiveGenderTab = 'male';
                if(femaleMessageThreadCard) femaleMessageThreadCard.style.display = 'none';
                if(maleMessageThreadCard) maleMessageThreadCard.style.display = 'flex';
                renderConversationsList();
                // Show placeholder only if the tab is active and no conversation is selected for that tab
                const currentForm = maleMessageForm; 
                if (!currentForm.getAttribute('data-conversation-id') && maleMessageThreadCard.style.display !== 'none') {
                    displayPlaceholderInThread('male');
                }
            });
        }
        if (femaleTabButton) {
            femaleTabButton.addEventListener('click', function() {
                currentActiveGenderTab = 'female';
                if(maleMessageThreadCard) maleMessageThreadCard.style.display = 'none';
                if(femaleMessageThreadCard) femaleMessageThreadCard.style.display = 'flex';
                renderConversationsList();
                const currentForm = femaleMessageForm; 
                if (!currentForm.getAttribute('data-conversation-id') && femaleMessageThreadCard.style.display !== 'none') {
                    displayPlaceholderInThread('female');
                }
            });
        }

        const urlParams = new URLSearchParams(window.location.search);
        const newRecipientId = urlParams.get('to');
        
        if (newRecipientId) {
            handleNewRecipient(newRecipientId);
        } else {
             renderConversationsList(); // Initial render for default tab if no new recipient
        }
        
        if (maleMessageForm) {
            maleMessageForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const messageText = maleMessageInput.value.trim();
                const activeConversationId = maleMessageForm.getAttribute('data-conversation-id');
                if (messageText && activeConversationId) {
                    sendMessage(activeConversationId, messageText);
                    maleMessageInput.value = '';
                }
            });
        }
        if (femaleMessageForm) {
            femaleMessageForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const messageText = femaleMessageInput.value.trim();
                const activeConversationId = femaleMessageForm.getAttribute('data-conversation-id');
                if (messageText && activeConversationId) {
                    sendMessage(activeConversationId, messageText);
                    femaleMessageInput.value = '';
                }
            });
        }

        const maleSearchInput = document.getElementById('conversationSearch');
        const femaleSearchInput = document.getElementById('conversationSearchFemale');

        if(maleSearchInput) {
            maleSearchInput.addEventListener('input', function(e) {
                filterConversationList(e.target.value, 'male');
            });
        }
        if(femaleSearchInput) {
            femaleSearchInput.addEventListener('input', function(e) {
                filterConversationList(e.target.value, 'female');
            });
        }
        setupPlaceholderUIActions();
    }

    function displayPlaceholderInThread(genderTab) {
        const threadBody = genderTab === 'male' ? maleMessageThreadBody : femaleMessageThreadBody;
        const headerName = genderTab === 'male' ? maleConversationHeaderName : femaleConversationHeaderName;
        const headerAvatar = genderTab === 'male' ? maleConversationHeaderAvatar : femaleConversationHeaderAvatar;
        const headerStatus = genderTab === 'male' ? maleConversationHeaderStatus : femaleConversationHeaderStatus;
        const messageForm = genderTab === 'male' ? maleMessageForm : femaleMessageForm;

        if (threadBody) {
            threadBody.innerHTML = `<div class="no-conversation-selected text-center p-5">
                                        <i class="fas fa-comments fa-3x text-muted"></i>
                                        <p class="mt-3 text-muted">${document.documentElement.lang === 'ar' ? 'الرجاء تحديد محادثة لعرض الرسائل.' : 'Please select a conversation to view messages.'}</p>
                                    </div>`;
        }
        if(headerName) headerName.textContent = document.documentElement.lang === 'ar' ? 'اختر محادثة' : 'Select Conversation';
        if(headerAvatar) headerAvatar.src = 'images/profiles/profile-default.jpg'; 
        if(headerStatus) headerStatus.textContent = '';
        if(messageForm) messageForm.removeAttribute('data-conversation-id');
    }

    function handleNewRecipient(newRecipientId) {
        let existingConversation = conversations.find(c => 
            (c.user1Id === currentUser.email && c.user2Id === newRecipientId) ||
            (c.user1Id === newRecipientId && c.user2Id === currentUser.email)
        );
        
        if (!existingConversation) {
            const mockRecipient = { // Simulate fetching recipient details
                id: newRecipientId,
                name: newRecipientId.split('@')[0], 
                gender: newRecipientId.toLowerCase().includes('sara') || newRecipientId.toLowerCase().includes('fatima') || newRecipientId.toLowerCase().includes('female') ? 'female' : 'male', 
                profileImageUrl: 'images/profiles/profile-default.jpg'
            };
            
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
            
            currentActiveGenderTab = mockRecipient.gender; 
            // Manually activate the correct tab UI and content
            if (currentActiveGenderTab === 'female') {
                if (femaleTabButton) femaleTabButton.classList.add('active');
                if (maleTabButton) maleTabButton.classList.remove('active');
                const femaleContent = document.getElementById('female-content');
                if (femaleContent) femaleContent.classList.add('show', 'active');
                const maleContent = document.getElementById('male-content');
                if (maleContent) maleContent.classList.remove('show', 'active');
                if(maleMessageThreadCard) maleMessageThreadCard.style.display = 'none';
                if(femaleMessageThreadCard) femaleMessageThreadCard.style.display = 'flex';
            } else { // Male or default
                if (maleTabButton) maleTabButton.classList.add('active');
                if (femaleTabButton) femaleTabButton.classList.remove('active');
                const maleContent = document.getElementById('male-content');
                if (maleContent) maleContent.classList.add('show', 'active');
                const femaleContent = document.getElementById('female-content');
                if (femaleContent) femaleContent.classList.remove('show', 'active');
                if(femaleMessageThreadCard) femaleMessageThreadCard.style.display = 'none';
                if(maleMessageThreadCard) maleMessageThreadCard.style.display = 'flex';
            }
            renderConversationsList(); 
            selectConversation(newConversation.id);
        } else {
            const otherUserGender = existingConversation.user1Id === currentUser.email ? existingConversation.user2Gender : existingConversation.user1Gender;
            currentActiveGenderTab = otherUserGender;
             if (currentActiveGenderTab === 'female') {
                if (femaleTabButton) femaleTabButton.classList.add('active');
                if (maleTabButton) maleTabButton.classList.remove('active');
                const femaleContent = document.getElementById('female-content');
                if (femaleContent) femaleContent.classList.add('show', 'active');
                const maleContent = document.getElementById('male-content');
                if (maleContent) maleContent.classList.remove('show', 'active');
                if(maleMessageThreadCard) maleMessageThreadCard.style.display = 'none';
                if(femaleMessageThreadCard) femaleMessageThreadCard.style.display = 'flex';
            } else { // Male or default
                if (maleTabButton) maleTabButton.classList.add('active');
                if (femaleTabButton) femaleTabButton.classList.remove('active');
                const maleContent = document.getElementById('male-content');
                if (maleContent) maleContent.classList.add('show', 'active');
                const femaleContent = document.getElementById('female-content');
                if (femaleContent) femaleContent.classList.remove('show', 'active');
                if(femaleMessageThreadCard) femaleMessageThreadCard.style.display = 'none';
                if(maleMessageThreadCard) maleMessageThreadCard.style.display = 'flex';
            }
            renderConversationsList();
            selectConversation(existingConversation.id);
        }
    }
        
    function renderConversationsList() {
        const activeConversationsListContainer = currentActiveGenderTab === 'male' ? maleConversationsListContainer : femaleConversationsListContainer;
        if (!activeConversationsListContainer) return;

        const filteredConversations = conversations.filter(conv => {
            const isParticipant = conv.user1Id === currentUser.email || conv.user2Id === currentUser.email;
            if (!isParticipant) return false;
            const otherUserGender = conv.user1Id === currentUser.email ? conv.user2Gender : conv.user1Gender;
            return otherUserGender === currentActiveGenderTab;
        });
        
        filteredConversations.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
        
        if (filteredConversations.length === 0) {
            activeConversationsListContainer.innerHTML = `
                <div class="empty-state p-3 text-center">
                    <i class="fas fa-comments fa-2x mb-2 text-muted"></i>
                    <p class="text-muted">${document.documentElement.lang === 'ar' ? 'لا توجد محادثات هنا.' : 'No conversations here.'}</p>
                </div>`;
            return;
        }
        
        activeConversationsListContainer.innerHTML = ''; 
        
        filteredConversations.forEach(conversation => {
            const isUser1 = conversation.user1Id === currentUser.email;
            const otherUserName = isUser1 ? conversation.user2Name : conversation.user1Name;
            const otherUserImage = isUser1 ? conversation.user2ImageUrl : conversation.user1ImageUrl;
            
            const lastMessageTime = new Date(conversation.lastMessageTime);
            const now = new Date();
            let timeDisplay;
            
            if (lastMessageTime.toDateString() === now.toDateString()) {
                timeDisplay = lastMessageTime.toLocaleTimeString(document.documentElement.lang === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' });
            } else if (lastMessageTime.getTime() > now.getTime() - 86400000 * 7) { // Within the last 7 days
                timeDisplay = lastMessageTime.toLocaleDateString(document.documentElement.lang === 'ar' ? 'ar-SA' : 'en-US', { weekday: 'short' });
            } else {
                timeDisplay = lastMessageTime.toLocaleDateString(document.documentElement.lang === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' });
            }
            
            const conversationItem = document.createElement('div');
            conversationItem.className = 'conversation-item list-group-item list-group-item-action'; 
            conversationItem.setAttribute('data-conversation-id', conversation.id);
            
            let unreadCount = 0; 
            if (conversation.messages && currentUser) {
                // Count messages sent by the other user that the current user hasn't read
                unreadCount = conversation.messages.filter(m => m.senderId !== currentUser.email && (!m.readBy || !m.readBy.includes(currentUser.email))).length;
            }

            conversationItem.innerHTML = `
                <div class="d-flex w-100 justify-content-start align-items-center">
                    <img src="${otherUserImage || 'images/profiles/profile-default.jpg'}" alt="${otherUserName}" class="rounded-circle mr-3" width="50" height="50">
                    <div class="flex-grow-1">
                        <div class="d-flex w-100 justify-content-between">
                            <h6 class="mb-1 contact-name">${otherUserName}</h6>
                            <small class="text-muted conversation-time">${timeDisplay}</small>
                        </div>
                        <small class="text-muted conversation-preview">${conversation.lastMessage.substring(0,30) || (document.documentElement.lang === 'ar' ? 'ابدأ محادثة...' : 'Start a conversation...')}</small>
                    </div>
                    ${unreadCount > 0 ? `<span class="badge badge-danger badge-pill ml-2">${unreadCount}</span>` : ''}
                </div>`;
            
            conversationItem.addEventListener('click', function() {
                selectConversation(conversation.id);
            });
            
            activeConversationsListContainer.appendChild(conversationItem);
        });
    }
        
    function selectConversation(conversationId) {
        document.querySelectorAll('.conversation-item').forEach(item => {
            item.classList.remove('active', 'bg-light');
        });
        
        const activeListContainer = currentActiveGenderTab === 'male' ? maleConversationsListContainer : femaleConversationsListContainer;
        const selectedItem = activeListContainer.querySelector(`.conversation-item[data-conversation-id="${conversationId}"]`);
        if (selectedItem) {
            selectedItem.classList.add('active', 'bg-light');
        }
        
        const conversation = conversations.find(c => c.id === conversationId);
        if (!conversation) return;
        
        const activeMessageThreadCard = currentActiveGenderTab === 'male' ? maleMessageThreadCard : femaleMessageThreadCard;
        const activeMessageForm = currentActiveGenderTab === 'male' ? maleMessageForm : femaleMessageForm;
        const activeConversationHeaderName = currentActiveGenderTab === 'male' ? maleConversationHeaderName : femaleConversationHeaderName;
        const activeConversationHeaderAvatar = currentActiveGenderTab === 'male' ? maleConversationHeaderAvatar : femaleConversationHeaderAvatar;
        const activeConversationHeaderStatus = currentActiveGenderTab === 'male' ? maleConversationHeaderStatus : femaleConversationHeaderStatus;

        if (activeMessageThreadCard) activeMessageThreadCard.style.display = 'flex'; 
        
        if (activeMessageForm) {
            activeMessageForm.setAttribute('data-conversation-id', conversationId);
        }
        
        const isUser1 = conversation.user1Id === currentUser.email;
        const otherUserName = isUser1 ? conversation.user2Name : conversation.user1Name;
        const otherUserImage = isUser1 ? conversation.user2ImageUrl : conversation.user1ImageUrl;
        
        if(activeConversationHeaderName) activeConversationHeaderName.textContent = otherUserName;
        if(activeConversationHeaderAvatar) activeConversationHeaderAvatar.src = otherUserImage || 'images/profiles/profile-default.jpg';
        if(activeConversationHeaderStatus) activeConversationHeaderStatus.textContent = document.documentElement.lang === 'ar' ? 'متصل' : 'Online'; 
        
        renderMessages(conversation);

        // Mark messages as read
        if (currentUser && conversation.messages) {
            let changed = false;
            conversation.messages.forEach(msg => {
                if (msg.senderId !== currentUser.email) { 
                    if (!msg.readBy) msg.readBy = [];
                    if (!msg.readBy.includes(currentUser.email)) {
                        msg.readBy.push(currentUser.email);
                        changed = true;
                    }
                }
            });
            if (changed) {
                localStorage.setItem('roomaity_conversations', JSON.stringify(conversations));
                renderConversationsList(); 
            }
        }
    }
        
    function renderMessages(conversation) {
        const activeMessageThreadBody = currentActiveGenderTab === 'male' ? maleMessageThreadBody : femaleMessageThreadBody;
        if (!activeMessageThreadBody) return;
        
        if (!conversation || !conversation.messages || conversation.messages.length === 0) {
            activeMessageThreadBody.innerHTML = `
                <div class="no-messages-prompt text-center p-4">
                    <i class="fas fa-envelope-open fa-3x mb-3 text-muted"></i>
                    <p class="text-muted">${document.documentElement.lang === 'ar' 
                        ? 'ابدأ محادثة مع ' + (conversation ? (conversation.user1Id === currentUser.email ? conversation.user2Name : conversation.user1Name) : 'شخص ما')
                        : 'Start a conversation with ' + (conversation ? (conversation.user1Id === currentUser.email ? conversation.user2Name : conversation.user1Name) : 'someone')}</p>
                </div>`;
            return;
        }
        
        activeMessageThreadBody.innerHTML = '';
            
            let currentDate = null;
            
            conversation.messages.forEach(message => {
                const messageDate = new Date(message.timestamp);
                const messageDay = messageDate.toDateString();
                
                if (messageDay !== currentDate) {
                    currentDate = messageDay;
                    const dateSeparator = document.createElement('div');
                    dateSeparator.className = 'date-separator my-3 text-center text-muted small';
                    const now = new Date();
                    // Create a new date object for yesterday to avoid modifying 'now'
                    const yesterday = new Date(); 
                    yesterday.setDate(now.getDate() - 1);
                    let dateDisplay;
                    if (messageDay === now.toDateString()) {
                        dateDisplay = document.documentElement.lang === 'ar' ? 'اليوم' : 'Today';
                    } else if (messageDay === yesterday.toDateString()) { 
                        dateDisplay = document.documentElement.lang === 'ar' ? 'الأمس' : 'Yesterday';
                    } else {
                        dateDisplay = messageDate.toLocaleDateString( document.documentElement.lang === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                    }
                    dateSeparator.textContent = dateDisplay;
                    activeMessageThreadBody.appendChild(dateSeparator);
                }
                
                const messageElement = document.createElement('div');
                messageElement.className = `message d-flex mb-2 ${message.senderId === currentUser.email ? 'justify-content-end' : 'justify-content-start'}`;
                const messageTime = messageDate.toLocaleTimeString( document.documentElement.lang === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' });
                
                // Visual cue for read status (basic)
                let readStatusIcon = '';
                if (message.senderId === currentUser.email) {
                    // Check if the 'other user' has read it. For simplicity, assume if 'readBy' has more than 1 entry, the other user read it.
                    const otherUser = conversation.user1Id === currentUser.email ? conversation.user2Id : conversation.user1Id;
                    const isReadByOther = message.readBy && message.readBy.includes(otherUser); 
                    readStatusIcon = isReadByOther ? '<i class="fas fa-check-double text-info"></i>' : '<i class="fas fa-check"></i>';
                }


                messageElement.innerHTML = `
                    <div class="message-bubble p-2 rounded ${message.senderId === currentUser.email ? 'bg-primary text-white' : 'bg-light text-dark'} shadow-sm">
                        <p class="mb-0 message-text">${message.text}</p>
                        <small class="message-time ${message.senderId === currentUser.email ? 'text-light-emphasis' : 'text-muted'} d-block text-right mt-1">
                            ${messageTime} ${readStatusIcon}
                        </small>
                    </div>`;
                activeMessageThreadBody.appendChild(messageElement);
            });
            activeMessageThreadBody.scrollTop = activeMessageThreadBody.scrollHeight;
        }
        
        function sendMessage(conversationId, messageText) {
            const conversationIndex = conversations.findIndex(c => c.id === conversationId);
            if (conversationIndex === -1) return;
            
            const conversation = conversations[conversationIndex];
            
            const newMessage = {
                id: Date.now().toString(),
                senderId: currentUser.email,
                text: messageText,
                timestamp: new Date().toISOString(),
                readBy: [currentUser.email] 
            };
            
            if (!conversation.messages) conversation.messages = [];
            conversation.messages.push(newMessage);
            conversation.lastMessage = messageText;
            conversation.lastMessageTime = newMessage.timestamp;
            
            localStorage.setItem('roomaity_conversations', JSON.stringify(conversations));
            
            const activeMessageFormForSend = currentActiveGenderTab === 'male' ? maleMessageForm : femaleMessageForm;
            if (activeMessageFormForSend.getAttribute('data-conversation-id') === conversationId) {
                 renderMessages(conversation);
            }
            renderConversationsList(); 
            
            setTimeout(() => { 
                simulateReply(conversationId);
            }, 1000 + Math.random() * 1000);
        }
        
        function simulateReply(conversationId) {
            const conversationIndex = conversations.findIndex(c => c.id === conversationId);
            if (conversationIndex === -1) return;
            const conversation = conversations[conversationIndex];
            const otherUserId = conversation.user1Id === currentUser.email ? conversation.user2Id : conversation.user1Id;
            
            const replies = [
                document.documentElement.lang === 'ar' ? "تمام" : "Okay",
                document.documentElement.lang === 'ar' ? "يبدو جيدا!" : "Sounds good!",
                document.documentElement.lang === 'ar' ? "أراك لاحقاً." : "See you then.",
                document.documentElement.lang === 'ar' ? "عظيم!" : "Great!",
                document.documentElement.lang === 'ar' ? "شكراً!" : "Thanks!"
            ];
            const randomReply = replies[Math.floor(Math.random() * replies.length)];
            
            const newMessage = {
                id: Date.now().toString(),
                senderId: otherUserId,
                text: randomReply,
                timestamp: new Date().toISOString(),
                readBy: [] 
            };
            
            if (!conversation.messages) conversation.messages = [];
            conversation.messages.push(newMessage);
            conversation.lastMessage = randomReply;
            conversation.lastMessageTime = newMessage.timestamp;
            
            localStorage.setItem('roomaity_conversations', JSON.stringify(conversations));
            
            const activeMessageFormForReply = currentActiveGenderTab === 'male' ? maleMessageForm : femaleMessageForm;
            const activeConvId = activeMessageFormForReply.getAttribute('data-conversation-id');

            if (activeConvId === conversationId) {
                renderMessages(conversation);
            }
            renderConversationsList(); 
        } 
    } 

    function filterConversationList(searchTerm, genderTab) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const listContainer = genderTab === 'male' ? maleConversationsListContainer : femaleConversationsListContainer;
        if (!listContainer) return;

        const items = listContainer.querySelectorAll('.conversation-item');
        items.forEach(item => {
            const nameElement = item.querySelector('.contact-name');
            const previewElement = item.querySelector('.conversation-preview');
            const name = nameElement ? nameElement.textContent.toLowerCase() : '';
            const preview = previewElement ? previewElement.textContent.toLowerCase() : '';

            if (name.includes(lowerSearchTerm) || preview.includes(lowerSearchTerm)) {
                item.style.display = 'flex'; 
            } else {
                item.style.display = 'none';
            }
        });
    }

    function setupPlaceholderUIActions() {
        const attachButtons = [document.getElementById('attachFileButton'), document.getElementById('attachFileButtonFemale')];
        const viewProfileButtons = [document.getElementById('viewProfileButton'), document.getElementById('viewProfileButtonFemale')];
        const deleteConvButtons = [document.getElementById('deleteConversationBtn'), document.getElementById('deleteConversationBtnFemale')];
        const reportUserButtons = [document.getElementById('reportUserBtn'), document.getElementById('reportUserBtnFemale')];

        attachButtons.forEach(btn => {
            if (btn) btn.addEventListener('click', () => alert(document.documentElement.lang === 'ar' ? 'سيتم تفعيل إرفاق الملفات قريباً!' : 'File attachment feature coming soon!'));
        });

        viewProfileButtons.forEach(btn => {
            if (btn) btn.addEventListener('click', function() {
                const currentForm = this.closest('.message-thread').querySelector('form'); 
                const conversationId = currentForm ? currentForm.getAttribute('data-conversation-id') : null;
                if (conversationId) {
                    const conversation = conversations.find(c => c.id === conversationId);
                    if (conversation && currentUser) {
                        const otherUserId = conversation.user1Id === currentUser.email ? conversation.user2Id : conversation.user1Id;
                        window.location.href = `profile.html?userId=${encodeURIComponent(otherUserId)}`;
                    }
                } else {
                    alert(document.documentElement.lang === 'ar' ? 'الرجاء تحديد محادثة أولاً.' : 'Please select a conversation first.');
                }
            });
        });
        
        deleteConvButtons.forEach(btn => {
            if(btn) btn.addEventListener('click', (e) => {
                e.preventDefault();
                alert(document.documentElement.lang === 'ar' ? 'سيتم تفعيل حذف المحادثة قريباً!' : 'Delete conversation feature coming soon!');
            });
        });

        reportUserButtons.forEach(btn => {
            if(btn) btn.addEventListener('click', (e) => {
                e.preventDefault();
                alert(document.documentElement.lang === 'ar' ? 'سيتم تفعيل الإبلاغ عن المستخدم قريباً!' : 'Report user feature coming soon!');
            });
        });
    }
});
