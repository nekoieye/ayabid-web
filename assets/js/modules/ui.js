/**
 * UI 모듈
 * 사용자 인터페이스 관련 기능들을 관리
 */

const UI = {
    // 초기화
    init: function() {
        console.log('UI 모듈 초기화...');
        this.setupNavigation();
        this.setupModals();
        this.setupTooltips();
        this.setupParticles();
        this.setupFadeInAnimation(); // fade-in 애니메이션 설정 추가
        
        // 사이드바 초기화
        if (typeof Sidebar !== 'undefined') {
            Sidebar.init();
        } else {
            console.warn('Sidebar가 정의되지 않았습니다.');
        }
        
        console.log('UI 모듈 초기화 완료');
    },
    
    // 네비게이션 설정
    setupNavigation: function() {
        // 네비게이션 활성 상태 관리
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            });
        });
        
        // 모바일 메뉴 토글
        const navbarToggler = document.querySelector('.navbar-toggler');
        if (navbarToggler) {
            navbarToggler.addEventListener('click', function() {
                document.body.classList.toggle('nav-open');
            });
        }
    },
    
    // 모달 설정
    setupModals: function() {
        // 로그인 모달 이벤트
        const loginLink = document.getElementById('loginNavLink');
        const loginModal = document.getElementById('loginModal');
        
        if (loginLink && loginModal) {
            // Bootstrap 모달을 JS로 제어
            const bsLoginModal = new bootstrap.Modal(loginModal);
            
            loginLink.addEventListener('click', function(e) {
                e.preventDefault();
                bsLoginModal.show();
            });
            
            loginModal.addEventListener('shown.bs.modal', function() {
                document.getElementById('loginEmailInput').focus();
            });
            
            // 모달 로그인 폼 제출 처리
            const loginForm = document.getElementById('modalLoginForm');
            if (loginForm) {
                loginForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    const email = document.getElementById('loginEmailInput').value;
                    const password = document.getElementById('loginPasswordInput').value;
                    
                    // 간단한 유효성 검사
                    if (!email || !password) {
                        UI.showNotification('이메일과 비밀번호를 모두 입력해주세요.', 'danger');
                        return;
                    }
                    
                    // 로그인 성공 가정 (실제로는 서버 API 호출)
                    const user = {
                        email: email,
                        name: '테스트 사용자',
                        joinDate: '2024-01-01'
                    };
                    
                    // 사용자 정보 저장
                    if (window.Utils && Utils.saveToStorage) {
                        Utils.saveToStorage('user', user);
                        Utils.saveToStorage('isLoggedIn', true);
                    }
                    
                    // 모달 닫기
                    bsLoginModal.hide();
                    
                    // 알림 표시
                    UI.showNotification('로그인 되었습니다.', 'success');
                    
                    // 로그인 상태 업데이트
                    window.AppState.user = user;
                    document.dispatchEvent(new CustomEvent('userLoggedIn', { detail: user }));
                    
                    // 프로필 페이지로 리다이렉션
                    setTimeout(() => {
                        window.location.hash = 'profile';
                    }, 500);
                });
            }
        }
    },
    
    // 툴팁 설정
    setupTooltips: function() {
        // Bootstrap 툴팁 초기화
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function(tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    },
    
    // 파티클 효과 생성
    setupParticles: function() {
        const animatedBg = document.querySelector('.animated-bg');
        if (!animatedBg) return;
        
        // 파티클 생성
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.createParticle();
            }, i * 300);
        }
        
        // 주기적으로 새 파티클 생성
        setInterval(() => {
            this.createParticle();
        }, 2000);
    },
    
    // 개별 파티클 생성
    createParticle: function() {
        const animatedBg = document.querySelector('.animated-bg');
        if (!animatedBg) return;
        
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // 랜덤 위치와 크기
        const size = Math.random() * 4 + 2;
        const left = Math.random() * 100;
        const animationDuration = Math.random() * 10 + 15;
        
        particle.style.cssText = `
            left: ${left}%;
            width: ${size}px;
            height: ${size}px;
            animation-duration: ${animationDuration}s;
            animation-delay: 0s;
        `;
        
        animatedBg.appendChild(particle);
        
        // 애니메이션 완료 후 제거
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, animationDuration * 1000);
    },
    
    // 알림 메시지 표시
    showNotification: function(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} notification`;
        notification.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="bi bi-info-circle me-2"></i>
                <span>${message}</span>
                <button type="button" class="btn-close ms-auto" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        // 스타일 설정
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 1050;
            min-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        document.body.appendChild(notification);
        
        // 자동 제거
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, duration);
    },
    
    // 로딩 스피너 표시
    showLoading: function(target = document.body) {
        const loading = document.createElement('div');
        loading.className = 'loading-overlay';
        loading.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">로딩 중...</span>
                </div>
                <p class="mt-2">로딩 중...</p>
            </div>
        `;
        
        loading.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255,255,255,0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;
        
        target.appendChild(loading);
        return loading;
    },
    
    // 로딩 스피너 숨김
    hideLoading: function(loading = null) {
        const spinner = loading || document.querySelector('.loading-overlay');
        if (spinner && spinner.parentNode) {
            spinner.parentNode.removeChild(spinner);
        }
    },
    
    // 페이드 인 애니메이션 설정
    setupFadeInAnimation: function() {
        const animatedElements = document.querySelectorAll('.fade-in');
        animatedElements.forEach(el => {
            el.classList.add('opacity-0');
            
            // Intersection Observer를 사용하여 뷰포트에 들어올 때 애니메이션 적용
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.remove('opacity-0');
                        entry.target.classList.add('opacity-100', 'translate-y-0');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1 // 10% 이상 보일 때 트리거
            });
            
            observer.observe(el);
        });
    }
};

// 사이드바 모듈
const Sidebar = {
    items: [],
    sidebarElement: null,
    toggleBtn: null,
    
    init: function() {
        console.log('사이드바 초기화 시작...');
        this.sidebarElement = document.getElementById('sidebar');
        this.toggleBtn = document.getElementById('sidebarToggle');
        
        if (!this.sidebarElement) {
            console.log('사이드바 요소가 없습니다. 동적으로 생성합니다.');
            this.createSidebarElements();
        }
        
        if (!this.toggleBtn) {
            console.log('사이드바 토글 버튼이 없습니다. 동적으로 생성합니다.');
            this.createToggleButton();
        }
        
        // 사이드바 메뉴 항목 추가
        this.setupMenuItems();
        
        if (this.sidebarElement && this.toggleBtn) {
            this.bindEvents();
            console.log('사이드바 초기화 완료');
        } else {
            console.warn('사이드바 초기화에 필요한 요소를 생성할 수 없습니다.');
        }
    },
    
    // 메뉴 항목 설정
    setupMenuItems: function() {
        // 요청된 컴포넌트들로 메뉴 구성
        this.addItem({
            icon: 'bi bi-chat-dots',
            text: 'AI 상담',
            action: () => {
                if (window.openChat) {
                    window.openChat();
                }
            }
        });
        
        this.addItem({
            icon: 'bi bi-shop',
            text: '스토어',
            action: () => {
                if (window.Router) {
                    window.Router.navigate('store');
                } else {
                    window.location.hash = 'store';
                }
            }
        });
        
        this.addItem({
            icon: 'bi bi-question-circle',
            text: 'FAQ',
            action: () => {
                if (window.Router) {
                    window.Router.navigate('faq');
                } else {
                    window.location.hash = 'faq';
                }
            }
        });
        
        this.addItem({
            icon: 'bi bi-cloud-arrow-up',
            text: '웹 기반 입찰',
            action: () => {
                if (window.Router) {
                    window.Router.navigate('web-based');
                } else {
                    window.location.hash = 'web-based';
                }
            }
        });
        
        this.addItem({
            icon: 'bi bi-robot',
            text: '파이썬 AI',
            action: () => {
                if (window.Router) {
                    window.Router.navigate('python-excel-ai');
                } else {
                    window.location.hash = 'python-excel-ai';
                }
            }
        });
        
        this.addItem({
            icon: 'bi bi-file-earmark-excel',
            text: '엑셀 심플',
            action: () => {
                if (window.Router) {
                    window.Router.navigate('excel-simple');
                } else {
                    window.location.hash = 'excel-simple';
                }
            }
        });
    },
    
    // 사이드바 HTML 구조 생성
    createSidebarElements: function() {
        const sidebarHtml = `
            <div class="sidebar" id="sidebar">
                <div class="sidebar-header">
                    <h5 class="sidebar-title">메뉴</h5>
                    <button type="button" class="btn-close" id="sidebarClose" aria-label="Close"></button>
                </div>
                <div class="sidebar-content" id="sidebarContent">
                    <!-- 동적으로 추가될 메뉴 항목들 -->
                </div>
            </div>
            <div class="sidebar-overlay" id="sidebarOverlay"></div>
        `;
        
        // body에 추가
        document.body.insertAdjacentHTML('beforeend', sidebarHtml);
        this.sidebarElement = document.getElementById('sidebar');
    },
    
    // 토글 버튼 생성
    createToggleButton: function() {
        // 메뉴 버튼 생성 비활성화 (요구사항에 따라 숨김)
        console.log('사이드바 토글 버튼 생성이 비활성화되었습니다.');
        
        // 함수는 유지하되 버튼을 생성하지 않음
        this.toggleBtn = null;
        
        /* 원래 코드 주석 처리
        // 토글 버튼 생성 (Tab Navigation 근처에 배치)
        const toggleButtonHtml = `
            <button class="sidebar-toggle-btn" id="sidebarToggle" title="메뉴">
                <i class="bi bi-list"></i>
            </button>
        `;
        
        // Tab Navigation 위에 추가
        const tabNav = document.querySelector('.tab-navigation');
        if (tabNav) {
            tabNav.insertAdjacentHTML('beforebegin', toggleButtonHtml);
        } else {
            // Tab Navigation이 없으면 body에 추가
            document.body.insertAdjacentHTML('beforeend', toggleButtonHtml);
        }
        
        this.toggleBtn = document.getElementById('sidebarToggle');
        */
    },
    
    // 이벤트 바인딩
    bindEvents: function() {
        console.log('사이드바 이벤트 바인딩 중...');
        
        // 토글 버튼 이벤트
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => {
                console.log('사이드바 토글 버튼 클릭됨');
                this.toggle();
            });
        }
        
        // 닫기 버튼 이벤트
        const closeBtn = document.getElementById('sidebarClose');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                console.log('사이드바 닫기 버튼 클릭됨');
                this.close();
            });
        }
        
        // 오버레이 클릭 이벤트
        const overlay = document.getElementById('sidebarOverlay');
        if (overlay) {
            overlay.addEventListener('click', () => {
                this.close();
            });
        }
        
        // ESC 키로 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.sidebarElement?.classList.contains('active')) {
                this.close();
            }
        });
        
        console.log('사이드바 이벤트 바인딩 완료');
    },
    
    // 사이드바 항목 추가
    addItem: function(item) {
        this.items.push(item);
        this.renderItems();
    },
    
    // 사이드바 항목 렌더링
    renderItems: function() {
        const content = document.getElementById('sidebarContent');
        if (!content) return;
        
        content.innerHTML = this.items.map((item, index) => `
            <div class="sidebar-item" data-index="${index}">
                <i class="${item.icon}"></i>
                <span>${item.text}</span>
            </div>
        `).join('');
        
        // 아이템 클릭 이벤트
        content.querySelectorAll('.sidebar-item').forEach((el) => {
            el.addEventListener('click', () => {
                const index = parseInt(el.dataset.index);
                if (typeof this.items[index].action === 'function') {
                    this.items[index].action();
                }
                this.close();
            });
        });
    },
    
    // 사이드바 토글
    toggle: function() {
        console.log('사이드바 토글 실행');
        if (this.sidebarElement.classList.contains('active')) {
            this.close();
        } else {
            this.open();
        }
    },
    
    // 사이드바 열기
    open: function() {
        console.log('사이드바 열기');
        if (this.sidebarElement) {
            this.sidebarElement.classList.add('active');
            const overlay = document.getElementById('sidebarOverlay');
            if (overlay) overlay.classList.add('active');
        }
    },
    
    // 사이드바 닫기
    close: function() {
        console.log('사이드바 닫기');
        if (this.sidebarElement) {
            this.sidebarElement.classList.remove('active');
            const overlay = document.getElementById('sidebarOverlay');
            if (overlay) overlay.classList.remove('active');
        }
    }
};

// AI 에이전트 모듈 초기화를 위한 래퍼
const AIAgentInitializer = {
    init: function() {
        // AI 에이전트가 이미 정의되었는지 확인
        if (typeof window.AIAgent !== 'undefined') {
            console.log('AI 에이전트 초기화 시작');
            window.AIAgent.init();
        } else {
            console.warn('AIAgent가 정의되지 않았습니다. 모듈을 불러온 후 다시 시도하세요.');
            // AI 모듈 동적 로드 시도
            this.loadAIModule();
        }
    },
    
    loadAIModule: function() {
        console.log('AI 모듈 동적 로드 시도...');
        const script = document.createElement('script');
        script.src = 'assets/js/modules/ai.js';
        script.onload = () => {
            console.log('AI 모듈 로드 성공, 초기화 시도...');
            if (typeof window.AIAgent !== 'undefined') {
                window.AIAgent.init();
            }
        };
        document.head.appendChild(script);
    }
};

// 전역 스코프에 노출
window.UI = UI;
window.Sidebar = Sidebar;
window.AIAgentInitializer = AIAgentInitializer;

// DOM이 로드되면 자동 초기화 시도
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM 로드됨 - UI 모듈 자동 초기화 시작');
    UI.init();
});