document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const specialtyCards = document.querySelectorAll('.specialty-card');
    const currentSpecialtyText = document.getElementById('current-specialty');
    const chatArea = document.getElementById('chat-area');
    const symptomInput = document.getElementById('symptom-input');
    const sendBtn = document.getElementById('send-btn');
    
    // Modal Elements
    const openModalBtn = document.getElementById('open-modal-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalOverlay = document.getElementById('appointment-modal');
    const appointmentForm = document.getElementById('appointment-form');
    const emergencyBanner = document.querySelector('.emergency-banner');

    // Emergency Keywords
    const emergencyKeywords = ['arritmia', 'dolor de pecho', 'sangrado', 'emergencia', 'infarto', 'ahogo', 'desmayo'];

    // State
    let currentSpecialty = 'Medicina General';
    let isTyping = false;

    // Specialty Selection
    specialtyCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove active class from all
            specialtyCards.forEach(c => c.classList.remove('active'));
            // Add to clicked
            card.classList.add('active');
            
            // Update state and UI
            currentSpecialty = card.getAttribute('data-specialty');
            currentSpecialtyText.textContent = currentSpecialty;

            // Add a system message when changing specialty
            addSystemMessage(`Te has conectado con la unidad de ${currentSpecialty}.`);
        });
    });

    // Chat Logic
    const appendMessage = (text, type = 'doctor-message') => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${type}`;

        let avatarIcon = '👨‍⚕️';
        if (type === 'user-message') avatarIcon = '👤';
        if (type === 'alert-message') avatarIcon = '⚠️';

        msgDiv.innerHTML = `
            ${type !== 'user-message' ? `<div class="avatar">${avatarIcon}</div>` : ''}
            <div class="bubble">${text}</div>
            ${type === 'user-message' ? `<div class="avatar">${avatarIcon}</div>` : ''}
        `;

        chatArea.appendChild(msgDiv);
        scrollToBottom();
    };

    const addSystemMessage = (text) => {
        const div = document.createElement('div');
        div.style.textAlign = 'center';
        div.style.fontSize = '12px';
        div.style.color = 'var(--text-secondary)';
        div.style.margin = '10px 0';
        div.textContent = text;
        chatArea.appendChild(div);
        scrollToBottom();
    };

    const showTypingIndicator = () => {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.textContent = 'El especialista está escribiendo...';
        chatArea.appendChild(typingDiv);
        scrollToBottom();
    };

    const removeTypingIndicator = () => {
        const typingDiv = document.getElementById('typing-indicator');
        if (typingDiv) {
            typingDiv.remove();
        }
    };

    const scrollToBottom = () => {
        chatArea.scrollTop = chatArea.scrollHeight;
    };

    const checkForEmergency = (text) => {
        const lowerText = text.toLowerCase();
        return emergencyKeywords.some(keyword => lowerText.includes(keyword));
    };

    const handleSend = () => {
        const text = symptomInput.value.trim();
        if (!text || isTyping) return;

        // User message
        appendMessage(text, 'user-message');
        symptomInput.value = '';
        isTyping = true;

        // Check for emergency keywords
        const isEmergency = checkForEmergency(text);

        // Simulate doctor typing
        showTypingIndicator();

        setTimeout(() => {
            removeTypingIndicator();
            isTyping = false;

            if (isEmergency) {
                appendMessage(
                    '<strong>ALERTA MÉDICA:</strong> Según los síntomas que describes, necesitas atención médica inmediata. Por favor, acude al hospital más cercano o solicita una cita presencial urgente ahora mismo.', 
                    'alert-message'
                );
                // Highlight the emergency banner
                emergencyBanner.classList.add('highlight-emergency');
                
                // Remove animation class after it completes
                setTimeout(() => {
                    emergencyBanner.classList.remove('highlight-emergency');
                }, 3000);

                // Open modal automatically after a short delay
                setTimeout(() => {
                    openModal();
                }, 1500);
            } else {
                appendMessage(
                    `Entiendo tus síntomas. Desde ${currentSpecialty} te recomendamos mantener reposo e hidratación. ¿Desde hace cuántos días presentas este malestar?`
                );
            }
        }, 1500); // 1.5 seconds delay
    };

    // Event Listeners for Chat
    sendBtn.addEventListener('click', handleSend);
    symptomInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    });

    // Lógica Modal
    const modalFormView = document.getElementById('modal-form-view');
    const modalSuccessView = document.getElementById('modal-success-view');
    const closeSuccessBtn = document.getElementById('close-success-btn');

    const resetModalView = () => {
        modalFormView.style.display = 'block';
        modalSuccessView.style.display = 'none';
        appointmentForm.reset();
    };

    const openModal = () => {
        resetModalView();
        modalOverlay.classList.add('active');
        document.getElementById('name').focus();
    };

    const closeModal = () => {
        modalOverlay.classList.remove('active');
        setTimeout(resetModalView, 300);
    };

    openModalBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    if (closeSuccessBtn) closeSuccessBtn.addEventListener('click', closeModal);
    
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    appointmentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        modalFormView.style.display = 'none';
        modalSuccessView.style.display = 'block';
    });
});
