/**
 * 아야비드(AyaBid) 메인 자바스크립트 파일
 * test.html과 완전 호환되는 SPA + MVC 패턴 구현
 */

// Controller가 초기화되면 자동으로 호출될 함수들
window.MainApp = {
    init: function() {
        console.log('MainApp 초기화 시작...');
        
        // 스무스 스크롤 구현
        this.setupSmoothScroll();
        
        // 컨택트 폼 제출 처리
        this.setupContactForm();
        
        // 스크롤 이벤트 설정
        this.setupScrollEvents();
        
        // Tab Navigation 설정 - test.html 스타일
        this.setupTabNavigation();
        
        // Chat Interface 설정 - test.html 스타일
        this.setupChatInterface();
        
        // AOS 초기화
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: true,
                offset: 100
            });
        }
        
        // 성능 최적화
        this.setupPerformanceOptimizations();
        
        console.log('MainApp 초기화 완료');
    },

    /**
     * Tab Navigation 설정 - test.html과 동일한 방식
     */
    setupTabNavigation: function() {
        console.log('Tab Navigation 설정 시작...');
        
        const tabButtons = document.querySelectorAll('.tab-btn');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tabName = button.getAttribute('data-tab');
                
                // Chat 탭은 특별 처리
                if (tabName === 'chat') {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // 모든 탭에서 active 제거
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    
                    // 채팅 열기
                    if (window.openChat) {
                        window.openChat();
                    }
                    return;
                }
                
                // 일반 탭 처리
                if (tabName) {
                    // 모든 탭에서 active 제거
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    
                    // 라우팅 처리
                    const routeMap = {
                        'home': 'home',
                        'services': 'excel-simple',
                        'contact': 'faq'
                    };
                    
                    const route = routeMap[tabName] || tabName;
                    window.location.hash = route;
                }
            });
        });
        
        console.log('Tab Navigation 설정 완료');
    },

    /**
     * Chat Interface 설정 - test.html 풀스크린 스타일
     */
    setupChatInterface: function() {
        console.log('Chat Interface 설정 시작...');
        
        const chatInput = document.getElementById('chatInput');
        const sendButton = document.getElementById('chatSend'); // 수정: sendMessage -> chatSend
        const closeChatButton = document.getElementById('chatClose');
        
        // 메시지 전송 처리
        if (chatInput && sendButton) {
            const handleSendMessage = () => {
                const message = chatInput.value.trim();
                if (message) {
                    this.sendChatMessage(message);
                    chatInput.value = '';
                }
            };
            
            sendButton.addEventListener('click', handleSendMessage);
            
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                }
            });
        }
        
        // 채팅 닫기 처리
        if (closeChatButton) {
            closeChatButton.addEventListener('click', () => {
                if (window.closeChat) {
                    window.closeChat();
                }
            });
        }
        
        console.log('Chat Interface 설정 완료');
    },

    /**
     * 채팅 메시지 전송
     */
    sendChatMessage: function(message) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;
        
        // 사용자 메시지 추가
        this.addChatMessage(message, 'user');
        
        // 스크롤을 맨 아래로
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // AI 응답 시뮬레이션 (실제로는 API 호출)
        setTimeout(() => {
            const responses = [
                "안녕하세요! 입찰 관련해서 어떤 도움이 필요하신가요?",
                "AyaBid의 입찰 예측 시스템에 대해 더 자세히 알려드릴게요.",
                "엑셀기반 심플 예측부터 AI 학습형까지 다양한 서비스를 제공합니다.",
                "입찰 성공률을 높이는 전략에 대해 상담해드릴 수 있습니다.",
                "궁금한 점이 더 있으시면 언제든 물어보세요!"
            ];
            
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            this.addChatMessage(randomResponse, 'ai');
            
            // 스크롤을 맨 아래로
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000 + Math.random() * 2000);
    },

    /**
     * 채팅 메시지 추가
     */
    addChatMessage: function(message, sender) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const now = new Date();
        const timeString = now.toLocaleTimeString('ko-KR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        messageDiv.innerHTML = `
            ${message}
            <div class="message-time">${timeString}</div>
        `;
        
        chatMessages.appendChild(messageDiv);
    },

    /**
     * 스무스 스크롤 기능 설정
     */
    setupSmoothScroll: function() {
        // 스무스 스크롤 구현
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            // 이미 이벤트 리스너가 있는 경우를 방지
            anchor.removeEventListener('click', this.smoothScrollHandler);
            anchor.addEventListener('click', this.smoothScrollHandler);
        });
    },

    /**
     * 스무스 스크롤 핸들러
     */
    smoothScrollHandler: function(e) {
        const href = this.getAttribute('href');
        
        // # 만 있는 링크(맨 위로)와 해시 라우팅 링크 구분
        if (href === '#') {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else if (href.startsWith('#') && href.length > 1) {
            const targetId = href.substring(1);
            // 단순 페이지 내 앵커인지 확인
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // 페이지 내 요소로 스크롤
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            } 
            // 라우팅 링크는 기본 동작 수행 (Router에서 처리)
        }
    },

    /**
     * 연락처 폼 설정 및 제출 처리
     */
    setupContactForm: function() {
        // 컨택트 폼 처리
        const contactForms = document.querySelectorAll('#contactForm, #contact-form');
        contactForms.forEach(form => {
            if (form) {
                form.addEventListener('submit', this.handleContactSubmit.bind(this));
            }
        });
    },

    /**
     * 스크롤 이벤트 설정
     */
    setupScrollEvents: function() {
        // 스크롤 이벤트 처리
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    },

    /**
     * 성능 최적화 설정
     */
    setupPerformanceOptimizations: function() {
        // 이미지 지연 로딩
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    },

    handleContactSubmit: function(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        // 간단한 유효성 검사
        if (!data.email || !data.message) {
            this.showMessage('모든 필드를 입력해주세요.', 'error');
            return;
        }
        
        // 이메일 형식 검사
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            this.showMessage('올바른 이메일 주소를 입력해주세요.', 'error');
            return;
        }
        
        // 실제로는 서버로 전송
        console.log('Contact form submitted:', data);
        this.showMessage('문의가 성공적으로 전송되었습니다!', 'success');
        e.target.reset();
    },

    handleScroll: function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 헤더 스크롤 효과 (navbar 클래스로 수정)
        const header = document.querySelector('header, .navbar');
        if (header) {
            if (scrollTop > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        
        // 스크롤 투 탑 버튼 (클래스 이름 통일)
        const scrollToTopBtn = document.querySelector('.scroll-top, #scrollTop');
        if (scrollToTopBtn) {
            if (scrollTop > 300) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        }
    },

    showMessage: function(message, type = 'info') {
        // 메시지 표시 함수
        const messageContainer = document.createElement('div');
        messageContainer.className = `message message-${type}`;
        messageContainer.textContent = message;
        
        // 스타일 적용
        Object.assign(messageContainer.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '5px',
            color: 'white',
            fontWeight: 'bold',
            zIndex: '9999',
            opacity: '0',
            transform: 'translateY(-20px)',
            transition: 'all 0.3s ease'
        });
        
        // 타입별 색상
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        messageContainer.style.backgroundColor = colors[type] || colors.info;
        
        document.body.appendChild(messageContainer);
        
        // 애니메이션
        setTimeout(() => {
            messageContainer.style.opacity = '1';
            messageContainer.style.transform = 'translateY(0)';
        }, 10);
        
        // 자동 제거
        setTimeout(() => {
            messageContainer.style.opacity = '0';
            messageContainer.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                if (messageContainer.parentNode) {
                    document.body.removeChild(messageContainer);
                }
            }, 300);
        }, 3000);
    },

    /**
     * 카운터 애니메이션
     */
    animateCounter: function(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    },

    /**
     * 네비게이션 하이라이트 업데이트
     */
    updateNavHighlight: function() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }
};

/**
 * 채팅 관련 전역 함수들 - test.html과 동일
 */
window.openChat = function() {
    console.log('채팅 열기');
    const chatInterface = document.getElementById('chatInterface');
    const mainContent = document.getElementById('main-content');
    
    if (chatInterface && mainContent) {
        // 채팅 인터페이스 표시
        chatInterface.classList.add('active');
        
        // 메인 콘텐츠 숨기기 (풀스크린 효과)
        mainContent.style.display = 'none';
        
        // 채팅 입력창에 포커스
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            setTimeout(() => chatInput.focus(), 100);
        }
        
        // 상태 업데이트
        window.AppState.chatOpen = true;
        
        // 이벤트 발생
        document.dispatchEvent(new CustomEvent('chatOpened'));
    }
};

window.closeChat = function() {
    console.log('채팅 닫기');
    const chatInterface = document.getElementById('chatInterface');
    const mainContent = document.getElementById('main-content');
    
    if (chatInterface && mainContent) {
        // 채팅 인터페이스 숨기기
        chatInterface.classList.remove('active');
        
        // 메인 콘텐츠 다시 표시
        mainContent.style.display = 'block';
        
        // 상태 업데이트
        window.AppState.chatOpen = false;
        
        // 이벤트 발생
        document.dispatchEvent(new CustomEvent('chatClosed'));
    }
};

// 스크롤 시 네비게이션 하이라이트 업데이트
window.addEventListener('scroll', function() {
    if (window.MainApp) {
        window.MainApp.updateNavHighlight();
    }
});

// 컴포넌트 로드 완료 이벤트 리스너 추가
document.addEventListener('componentLoaded', function(e) {
    console.log(`컴포넌트 로드 완료: ${e.detail.file}`);
    
    // 페이지 특정 스크립트 실행
    if (window.MainApp) {
        // 스무스 스크롤 다시 설정 (새로 로드된 링크에 적용)
        window.MainApp.setupSmoothScroll();
        
        // Tab Navigation 다시 설정
        window.MainApp.setupTabNavigation();
        
        // Chat Interface 다시 설정
        window.MainApp.setupChatInterface();
        
        // 페이지별 특수 처리
        switch (e.detail.route) {
            case 'home':
                // 홈페이지 특수 초기화
                break;
            case 'store':
                // 스토어 페이지 특수 초기화
                break;
            // 기타 페이지들...
        }
    }
    
    // AOS 새로고침 (애니메이션)
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
});

// 라우트 변경 이벤트 리스너 - 탭 상태 동기화
document.addEventListener('routeChanged', function(e) {
    const route = e.detail.route;
    const routeInfo = e.detail.routeInfo;
    
    if (routeInfo && routeInfo.tab) {
        // 현재 활성 탭 업데이트
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        
        const activeTab = document.querySelector(`.tab-btn[data-tab="${routeInfo.tab}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }
        
        // AppState 업데이트
        window.AppState.currentTab = routeInfo.tab;
    }
});

/**
 * 유틸리티 함수들
 */
window.AyaBidUtils = {
    // 디바운스 함수
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // 쓰로틀 함수
    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
};

// 글로벌 유틸리티 함수들
window.showMessage = function(message, type) {
    if (window.MainApp) {
        window.MainApp.showMessage(message, type);
    }
};

window.debounce = function(func, wait) {
    if (window.AyaBidUtils) {
        return window.AyaBidUtils.debounce(func, wait);
    }
    return func;
};

window.throttle = function(func, limit) {
    if (window.AyaBidUtils) {
        return window.AyaBidUtils.throttle(func, limit);
    }
    return func;
};