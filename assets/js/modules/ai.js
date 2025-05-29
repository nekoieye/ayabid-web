/**
 * AI 채팅 모듈 - test.html 풀스크린 스타일 호환
 * 풀스크린 채팅 인터페이스와 완전 통합
 */

window.AIAgent = {
    initialized: false,
    isOpen: false,
    chatContainer: null,
    messageContainer: null,
    inputElement: null,
    sendButton: null,
    closeButton: null,
    
    /**
     * AI 채팅 초기화 
     */
    init: function() {
        if (this.initialized) {
            console.log('AI 채팅이 이미 초기화되었습니다.');
            return;
        }
        
        console.log('AI 채팅 초기화 시작...');
        
        // test.html과 동일한 풀스크린 채팅 요소들 연결
        this.chatContainer = document.getElementById('chatInterface');
        this.messageContainer = document.getElementById('chatMessages');
        this.inputElement = document.getElementById('chatInput');
        this.sendButton = document.getElementById('chatSend');
        this.closeButton = document.getElementById('chatClose');
        
        if (!this.chatContainer || !this.messageContainer || !this.inputElement) {
            console.error('필수 채팅 요소를 찾을 수 없습니다.');
            return;
        }
        
        this.bindEvents();
        this.setupAutoResize();
        this.initialized = true;
        
        console.log('AI 채팅 초기화 완료');
    },
    
    /**
     * 이벤트 바인딩
     */
    bindEvents: function() {
        // 전송 버튼 클릭
        if (this.sendButton) {
            this.sendButton.addEventListener('click', () => {
                this.sendMessage();
            });
        }
        
        // 닫기 버튼 클릭
        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => {
                this.close();
            });
        }
        
        // Enter 키로 전송 (Shift+Enter는 줄바꿈)
        if (this.inputElement) {
            this.inputElement.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }
        
        // ESC 키로 채팅 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    },
    
    /**
     * 입력창 자동 크기 조절 설정
     */
    setupAutoResize: function() {
        if (!this.inputElement) return;
        
        this.inputElement.addEventListener('input', () => {
            this.inputElement.style.height = 'auto';
            this.inputElement.style.height = Math.min(this.inputElement.scrollHeight, 120) + 'px';
        });
    },
    
    /**
     * 채팅 열기
     */
    open: function() {
        if (!this.chatContainer) return;
        
        console.log('AI 채팅 열기');
        this.chatContainer.classList.add('active');
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
        
        // 입력창에 포커스
        setTimeout(() => {
            if (this.inputElement) {
                this.inputElement.focus();
            }
        }, 300);
        
        // 채팅 열림 이벤트 발생
        document.dispatchEvent(new CustomEvent('chatOpened'));
    },
    
    /**
     * 채팅 닫기
     */
    close: function() {
        if (!this.chatContainer) return;
        
        console.log('AI 채팅 닫기');
        this.chatContainer.classList.remove('active');
        this.isOpen = false;
        document.body.style.overflow = 'auto';
        
        // 채팅 닫힘 이벤트 발생
        document.dispatchEvent(new CustomEvent('chatClosed'));
    },
    
    /**
     * 메시지 전송
     */
    sendMessage: function() {
        if (!this.inputElement) return;
        
        const message = this.inputElement.value.trim();
        if (!message) return;
        
        console.log('메시지 전송:', message);
        
        // 사용자 메시지 추가
        this.addMessage(message, 'user');
        
        // 입력창 초기화
        this.inputElement.value = '';
        this.inputElement.style.height = 'auto';
        
        // 전송 버튼 비활성화
        this.toggleSendButton(false);
        
        // 타이핑 인디케이터 표시
        this.showTypingIndicator();
        
        // AI 응답 시뮬레이션 (실제로는 API 호출)
        this.simulateAIResponse(message);
    },
    
    /**
     * 메시지 추가
     */
    addMessage: function(text, sender = 'ai', timestamp = null) {
        if (!this.messageContainer) return;
        
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}`;
        
        const time = timestamp || new Date().toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        messageElement.innerHTML = `
            ${text}
            <div class="message-time">${time}</div>
        `;
        
        this.messageContainer.appendChild(messageElement);
        this.scrollToBottom();
        
        // 메시지 추가 애니메이션
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateY(20px)';
        
        requestAnimationFrame(() => {
            messageElement.style.transition = 'all 0.3s ease';
            messageElement.style.opacity = '1';
            messageElement.style.transform = 'translateY(0)';
        });
    },
    
    /**
     * 타이핑 인디케이터 표시
     */
    showTypingIndicator: function() {
        if (!this.messageContainer) return;
        
        const typingElement = document.createElement('div');
        typingElement.className = 'typing-indicator';
        typingElement.id = 'typingIndicator';
        typingElement.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        
        this.messageContainer.appendChild(typingElement);
        this.scrollToBottom();
    },
    
    /**
     * 타이핑 인디케이터 숨기기
     */
    hideTypingIndicator: function() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    },
    
    /**
     * AI 응답 시뮬레이션
     */
    simulateAIResponse: function(userMessage) {
        const responses = this.getContextualResponse(userMessage);
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        // 1-3초 후 응답 (실제 API 호출 시뮬레이션)
        const delay = Math.random() * 2000 + 1000;
        
        setTimeout(() => {
            this.hideTypingIndicator();
            this.addMessage(randomResponse, 'ai');
            this.toggleSendButton(true);
        }, delay);
    },
    
    /**
     * 맥락에 맞는 응답 생성
     */
    getContextualResponse: function(userMessage) {
        const message = userMessage.toLowerCase();
        
        // 키워드 기반 응답 분류
        if (message.includes('입찰') || message.includes('예측')) {
            return [
                "AyaBid의 AI 입찰 예측 시스템은 95% 이상의 정확도를 자랑합니다. 나라장터(G2B) 비공개복수예가 입찰에서 최적의 가격을 제안해드립니다.",
                "저희 시스템은 과거 입찰 데이터와 시장 동향을 실시간으로 분석하여 성공 확률이 높은 입찰가를 추천합니다.",
                "입찰 예측 서비스에 대해 더 자세히 알고 싶으시다면, 무료 데모를 신청해보세요. 실제 사례를 통해 효과를 확인하실 수 있습니다."
            ];
        } else if (message.includes('가격') || message.includes('비용') || message.includes('요금')) {
            return [
                "AyaBid는 다양한 요금제를 제공합니다. 기본 플랜부터 엔터프라이즈 플랜까지, 귀하의 필요에 맞는 서비스를 선택하실 수 있습니다.",
                "정확한 가격은 사용 규모와 기능에 따라 달라집니다. 무료 상담을 통해 맞춤형 견적을 받아보세요.",
                "현재 신규 고객 대상으로 30일 무료 체험 프로모션을 진행 중입니다. 부담 없이 체험해보세요!"
            ];
        } else if (message.includes('사용법') || message.includes('방법') || message.includes('어떻게')) {
            return [
                "AyaBid 사용법은 매우 간단합니다. 1) 입찰 정보 입력 → 2) AI 분석 → 3) 최적 가격 제안 → 4) 입찰 참여",
                "엑셀 파일을 업로드하거나 웹에서 직접 입력하는 두 가지 방법으로 이용하실 수 있습니다.",
                "첫 사용이시라면 튜토리얼 영상과 사용자 가이드를 먼저 확인해보시는 것을 추천드립니다."
            ];
        } else if (message.includes('정확도') || message.includes('성능') || message.includes('효과')) {
            return [
                "AyaBid의 AI 모델은 지난 5년간의 입찰 데이터를 학습하여 95% 이상의 예측 정확도를 달성했습니다.",
                "실제 고객사에서 평균 40% 이상의 입찰 성공률 향상을 경험하고 있습니다.",
                "지속적인 머신러닝을 통해 예측 정확도는 계속 개선되고 있으며, 실시간 시장 분석으로 최신 트렌드를 반영합니다."
            ];
        } else if (message.includes('문의') || message.includes('상담') || message.includes('연락')) {
            return [
                "언제든지 전문 상담팀에 문의하실 수 있습니다. 이메일: support@ayabid.com, 전화: 1588-0000",
                "웹사이트의 '문의하기' 섹션을 통해 상담 예약을 하시면, 전문가가 직접 연락드립니다.",
                "온라인 데모 세션도 가능합니다. 화상 회의를 통해 실시간으로 시스템을 체험해보세요."
            ];
        } else {
            return [
                "안녕하세요! AyaBid AI 어시스턴트입니다. 입찰 예측, 서비스 문의, 사용법 등 무엇이든 물어보세요! 😊",
                "AyaBid는 AI 기반 입찰 예측 솔루션입니다. 어떤 부분이 궁금하신지 더 구체적으로 말씀해주시면 자세히 안내해드릴게요.",
                "입찰 관련 질문이시라면 구체적인 상황을 알려주시면 더 정확한 답변을 드릴 수 있습니다.",
                "무료 체험이나 상담 예약을 원하시면 언제든 말씀해주세요. 전문가가 직접 도움을 드립니다!",
                "궁금한 점이 있으시면 편하게 질문해주세요. 24시간 언제든 도움을 드릴 준비가 되어 있습니다."
            ];
        }
    },
    
    /**
     * 전송 버튼 상태 토글
     */
    toggleSendButton: function(enabled) {
        if (this.sendButton) {
            this.sendButton.disabled = !enabled;
        }
    },
    
    /**
     * 메시지 컨테이너 하단으로 스크롤
     */
    scrollToBottom: function() {
        if (this.messageContainer) {
            this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
        }
    },
    
    /**
     * 채팅 기록 지우기
     */
    clearChat: function() {
        if (this.messageContainer) {
            this.messageContainer.innerHTML = `
                <div class="message ai">
                    안녕하세요! AyaBid AI 어시스턴트입니다. 입찰 관련 질문이나 서비스에 대해 궁금한 점이 있으시면 언제든 물어보세요! 😊
                    <div class="message-time">지금</div>
                </div>
            `;
        }
    },
    
    /**
     * 채팅 상태 확인
     */
    getStatus: function() {
        return {
            initialized: this.initialized,
            isOpen: this.isOpen,
            messageCount: this.messageContainer ? this.messageContainer.children.length : 0
        };
    }
};

// 전역 함수로 노출 (index.html에서 사용)
window.openChat = function() {
    if (window.AIAgent) {
        window.AIAgent.open();
    }
};

window.closeChat = function() {
    if (window.AIAgent) {
        window.AIAgent.close();
    }
};

window.sendMessage = function() {
    if (window.AIAgent) {
        window.AIAgent.sendMessage();
    }
};

// 문서 로드 시 자동 초기화
document.addEventListener('DOMContentLoaded', function() {
    // DOM이 완전히 로드된 후 짧은 지연 후 초기화
    setTimeout(() => {
        if (window.AIAgent) {
            window.AIAgent.init();
        }
    }, 100);
});

// 채팅 관련 이벤트 리스너
document.addEventListener('chatOpened', function() {
    console.log('채팅이 열렸습니다.');
    // 탭 네비게이션에서 채팅 탭 활성화
    const chatTab = document.querySelector('.tab-btn[data-tab="chat"]');
    if (chatTab) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        chatTab.classList.add('active');
    }
});

document.addEventListener('chatClosed', function() {
    console.log('채팅이 닫혔습니다.');
    // 탭 네비게이션 상태 복원
    const currentRoute = window.Router ? window.Router.currentRoute : 'home';
    const routeInfo = window.Router ? window.Router.routes[currentRoute] : null;
    if (routeInfo) {
        const activeTab = document.querySelector(`.tab-btn[data-tab="${routeInfo.tab}"]`);
        if (activeTab) {
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            activeTab.classList.add('active');
        }
    }
});