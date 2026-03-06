/**
 * Voice Message Handler - ...Сообщения...
 * ...Сообщения...、...
 */

if (typeof window.VoiceMessageHandler === 'undefined') {

class VoiceMessageHandler {
    constructor() {
        this.activeVoiceMessage = null;
        this.streamingTimeouts = [];
        this.init();
    }

    init() {
        console.log('[Voice Message] ...Сообщения...');
        this.bindEvents();
        this.setupExistingVoiceMessages();
        this.addVoiceWaveformCSS();
    }

    /**
     * ...CSS
     */
    addVoiceWaveformCSS() {
        const styleId = 'voice-waveform-styles';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .voice-waveform {
                display: flex;
                align-items: center;
                gap: 2px;
                height: 20px;
            }

            .wave-bar {
                width: 3px;
                background: #007bff;
                border-radius: 1.5px;
                animation: wave-pulse 1.5s ease-in-out infinite;
                min-height: 4px;
                max-height: 18px;
            }

            .wave-bar:nth-child(1) {
                animation-delay: 0s;
                animation-duration: 1.2s;
            }

            .wave-bar:nth-child(2) {
                animation-delay: 0.1s;
                animation-duration: 1.4s;
            }

            .wave-bar:nth-child(3) {
                animation-delay: 0.2s;
                animation-duration: 1.1s;
            }

            .wave-bar:nth-child(4) {
                animation-delay: 0.3s;
                animation-duration: 1.6s;
            }

            .wave-bar:nth-child(5) {
                animation-delay: 0.4s;
                animation-duration: 1.3s;
            }

            .wave-bar:nth-child(6) {
                animation-delay: 0.5s;
                animation-duration: 1.5s;
            }

            .wave-bar:nth-child(7) {
                animation-delay: 0.6s;
                animation-duration: 1.7s;
            }

            @keyframes wave-pulse {
                0%, 100% {
                    height: 4px;
                    opacity: 0.6;
                }
                50% {
                    height: 18px;
                    opacity: 1;
                }
            }

            /* Статус */
            .playing .wave-bar {
                animation-duration: 0.8s !important;
            }

            .playing .wave-bar:nth-child(1) { animation-delay: 0s; }
            .playing .wave-bar:nth-child(2) { animation-delay: 0.1s; }
            .playing .wave-bar:nth-child(3) { animation-delay: 0.2s; }
            .playing .wave-bar:nth-child(4) { animation-delay: 0.3s; }
            .playing .wave-bar:nth-child(5) { animation-delay: 0.4s; }
            .playing .wave-bar:nth-child(6) { animation-delay: 0.5s; }
            .playing .wave-bar:nth-child(7) { animation-delay: 0.6s; }
        `;
        document.head.appendChild(style);
        console.log('[Voice Message] ...CSS...');
    }

    /**
     * ...
     */
    bindEvents() {
        // Сообщения（）
        document.addEventListener('click', (event) => {
            const target = event.target;
            if (target && target.closest) {
                const voiceContent = target.closest('.message-received[title="..."] .message-content, .message-sent[title="..."] .message-content');
                if (voiceContent) {
                    this.handleVoiceMessageClick(voiceContent);
                }
            }
        });

        document.addEventListener('click', (event) => {
            const target = event.target;
            if (target && target.closest && target.closest('.voice-play-btn')) {
                event.stopPropagation(); // ...message-content
                this.handleVoicePlayClick(target.closest('.voice-play-btn'));
            }
        });
    }

    /**
     * Настройки...Сообщения
     */
    setupExistingVoiceMessages() {
        const voiceMessages = document.querySelectorAll('.message-received[title="..."], .message-sent[title="..."]');
        voiceMessages.forEach(message => {
            this.setupVoiceMessage(message);
        });
    }

    /**
     * Настройки...Сообщения
     */
    setupVoiceMessage(messageElement) {
        const messageContent = messageElement.querySelector('.message-content');
        const messageText = messageElement.querySelector('.message-text');

        if (!messageContent) return;

        if (messageText) {
            messageText.classList.remove('visible', 'streaming');
        }

        // （）
        this.addVoiceControls(messageContent);
    }

    /**
     * ...
     */
    addVoiceControls(messageContent) {
        if (messageContent.querySelector('.voice-content')) {
            return;
        }

        const voiceContent = document.createElement('div');
        voiceContent.className = 'voice-content';

        const voiceControl = document.createElement('div');
        voiceControl.className = 'voice-control';

        const playBtn = document.createElement('button');
        playBtn.className = 'voice-play-btn';
        playBtn.innerHTML = '';
        playBtn.title = '...';

        const duration = document.createElement('div');
        duration.className = 'voice-duration';
        duration.textContent = this.getReasonableDuration(messageContent);

        const waveform = document.createElement('div');
        waveform.className = 'voice-waveform';
        for (let i = 0; i < 7; i++) {
            const bar = document.createElement('div');
            bar.className = 'wave-bar';
            waveform.appendChild(bar);
        }

        // Статус
        const status = document.createElement('div');
        status.className = 'voice-status';

        voiceControl.appendChild(playBtn);
        voiceControl.appendChild(duration);
        voiceControl.appendChild(waveform);

        voiceContent.appendChild(voiceControl);
        voiceContent.appendChild(status);

        // message-meta
        const messageMeta = messageContent.querySelector('.message-meta');
        if (messageMeta && messageMeta.nextSibling) {
            messageContent.insertBefore(voiceContent, messageMeta.nextSibling);
        } else {
            messageContent.appendChild(voiceContent);
        }
    }

    /**
     * ...
     */
    getReasonableDuration(messageContent) {
        // Отменить
        const messageText = messageContent.querySelector('.message-text');
        let textContent = '';

        if (messageText) {
            textContent = messageText.textContent || messageText.innerText || '';
        }

        // Если，
        if (!textContent.trim()) {
            textContent = '...';
        }

        // （、、）
        const charCount = textContent.trim().length;

        // ：2.5-3.5
        // ： / ，
        const baseSecondsPerChar = 0.3; // ...3...
        const randomFactor = 0.7 + Math.random() * 0.6; // 0.7-1.3...

        let totalSeconds = Math.ceil(charCount * baseSecondsPerChar * randomFactor);

        // 1，90
        totalSeconds = Math.max(1, Math.min(90, totalSeconds));

        // :
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        console.log(`[Voice Message] ..."${textContent}"(${charCount}...) -> ...${minutes}:${seconds.toString().padStart(2, '0')}`);

        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    /**
     * ...Сообщения...
     */
    handleVoiceMessageClick(messageContent) {
        const messageElement = messageContent.closest('.message-received[title="..."], .message-sent[title="..."]');
        const messageText = messageElement.querySelector('.message-text');

        if (!messageText) return;

        // Если，
        if (messageText.classList.contains('visible')) {
            this.hideVoiceText(messageText);
        } else {
            this.showVoiceTextWithStreaming(messageText);
        }
    }

    /**
     * ...
     */
    handleVoicePlayClick(playBtn) {
        const voiceContent = playBtn.closest('.voice-content');
        const messageContent = playBtn.closest('.message-content');

        if (voiceContent.classList.contains('playing')) {
            this.stopVoicePlay(voiceContent, messageContent);
        } else {
            this.startVoicePlay(voiceContent, messageContent, playBtn);
        }
    }

    /**
     * ...
     */
    startVoicePlay(voiceContent, messageContent, playBtn) {
        if (this.activeVoiceMessage && this.activeVoiceMessage !== voiceContent) {
            this.stopVoicePlay(this.activeVoiceMessage.voiceContent, this.activeVoiceMessage.messageContent);
        }

        this.activeVoiceMessage = { voiceContent, messageContent };

        // Статус
        voiceContent.classList.add('playing');
        messageContent.classList.add('playing');
        playBtn.innerHTML = '';
        playBtn.title = '...';

        // （3-8）
        const playDuration = 3000 + Math.random() * 5000;
        setTimeout(() => {
            if (voiceContent.classList.contains('playing')) {
                this.stopVoicePlay(voiceContent, messageContent);
            }
        }, playDuration);
    }

    /**
     * ...
     */
    stopVoicePlay(voiceContent, messageContent) {
        voiceContent.classList.remove('playing');
        messageContent.classList.remove('playing');

        const playBtn = voiceContent.querySelector('.voice-play-btn');
        if (playBtn) {
            playBtn.innerHTML = '';
            playBtn.title = '...';
        }

        if (this.activeVoiceMessage && this.activeVoiceMessage.voiceContent === voiceContent) {
            this.activeVoiceMessage = null;
        }
    }

    /**
     * ...
     */
    showVoiceTextWithStreaming(messageText) {
        this.clearStreamingTimeouts();

        const originalText = messageText.textContent || messageText.innerText || '...';

        messageText.style.display = 'block';
        messageText.classList.add('visible', 'streaming');
        messageText.textContent = '';

        console.log('[Voice Message] ...:', originalText);

        let currentIndex = 0;
        const streamText = () => {
            if (currentIndex < originalText.length) {
                messageText.textContent = originalText.substring(0, currentIndex + 1);
                currentIndex++;

                // ，
                const delay = 50 + Math.random() * 100;
                const timeout = setTimeout(streamText, delay);
                this.streamingTimeouts.push(timeout);
            } else {
                messageText.classList.remove('streaming');
                console.log('[Voice Message] ...');
            }
        };

        const timeout = setTimeout(streamText, 300);
        this.streamingTimeouts.push(timeout);
    }

    /**
     * ...
     */
    hideVoiceText(messageText) {
        this.clearStreamingTimeouts();

        messageText.classList.remove('visible', 'streaming');

        setTimeout(() => {
            if (!messageText.classList.contains('visible')) {
                messageText.style.display = 'none';
            }
        }, 300);

        console.log('[Voice Message] ...');
    }

    /**
     * ...
     */
    clearStreamingTimeouts() {
        this.streamingTimeouts.forEach(timeout => clearTimeout(timeout));
        this.streamingTimeouts = [];
    }

    /**
     * ...Сообщения
     */
    handleNewVoiceMessage(messageElement) {
        if (messageElement.matches('.message-received[title="..."], .message-sent[title="..."]')) {
            this.setupVoiceMessage(messageElement);
            console.log('[Voice Message] Настройки...Сообщения');
        }
    }

    /**
     * ...Статус
     */
    getPlayingStatus() {
        return {
            isPlaying: !!this.activeVoiceMessage,
            currentMessage: this.activeVoiceMessage
        };
    }

    /**
     * ...
     */
    stopAllPlaying() {
        if (this.activeVoiceMessage) {
            this.stopVoicePlay(this.activeVoiceMessage.voiceContent, this.activeVoiceMessage.messageContent);
        }
        this.clearStreamingTimeouts();
    }

    /**
     * ...
     */
    debug() {
        console.log('[Voice Message] ...:', {
            activeVoiceMessage: !!this.activeVoiceMessage,
            streamingTimeouts: this.streamingTimeouts.length,
            voiceMessages: document.querySelectorAll('.message-received[title="..."], .message-sent[title="..."]').length
        });
    }
}

window.VoiceMessageHandler = VoiceMessageHandler;

// Если，
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.voiceMessageHandler = new VoiceMessageHandler();
        console.log('[Voice Message] ...');
    });
} else {
    window.voiceMessageHandler = new VoiceMessageHandler();
    console.log('[Voice Message] ...');
}

// Сообщения
if (window.MutationObserver) {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const element = node;
                    // Сообщения
                    if (element.matches && element.matches('.message-received[title="..."], .message-sent[title="..."]')) {
                        window.voiceMessageHandler?.handleNewVoiceMessage(element);
                    }

                    // Сообщения
                    const voiceMessages = element.querySelectorAll && element.querySelectorAll('.message-received[title="..."], .message-sent[title="..."]');
                    if (voiceMessages && voiceMessages.length > 0) {
                        voiceMessages.forEach(msg => {
                            window.voiceMessageHandler?.handleNewVoiceMessage(msg);
                        });
                    }
                }
            });
        });
    });

    // Сообщения
    const messagesContainer = document.querySelector('.messages-container') || document.body;
    observer.observe(messagesContainer, {
        childList: true,
        subtree: true
    });

    console.log('[Voice Message] MutationObserver ...');
}

} // ... if (typeof window.VoiceMessageHandler === 'undefined') ...
