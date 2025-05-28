/**
 * 아야비드(AyaBid) 통합 라우터 모듈
 * test.html과 완전 호환되는 SPA 라우팅 시스템 + tab-navigation 연동
 */

window.Router = {
    routes: {},
    currentRoute: '',
    previousRoute: '',
    initialized: false,
    loadingTimeout: null,

    /**
     * 라우터 초기화
     */
    init: function() {
        if (this.initialized) {
            console.log('Router already initialized');
            return;
        }

        console.log('라우터 초기화 시작...');
        this.setupRoutes();
        this.bindEvents();
        this.handleInitialRoute();
        this.initialized = true;
        console.log('라우터 초기화 완료');
    },

    /**
     * 라우트 설정 - tab-navigation과 완전 연동
     */
    setupRoutes: function() {
        this.routes = {
            'home': {
                component: 'components/home.html',
                title: '홈 - AyaBid',
                tab: 'home'
            },
            'excel-simple': {
                component: 'components/excel-simple.html',
                title: '엑셀 기반 심플 예측 - AyaBid',
                tab: 'services'
            },
            'python-excel-ai': {
                component: 'components/python-excel-ai.html',
                title: '파이썬과 엑셀 학습형 AI - AyaBid',
                tab: 'services'
            },
            'web-based': {
                component: 'components/web-based.html',
                title: '웹 기반 입찰 프로그램 - AyaBid',
                tab: 'services'
            },
            'login': {
                component: 'components/login.html',
                title: '로그인 - AyaBid',
                tab: 'home'
            },
            'signup': {
                component: 'components/signup.html',
                title: '회원가입 - AyaBid',
                tab: 'home'
            },
            'profile': {
                component: 'components/profile.html',
                title: '프로필 - AyaBid',
                tab: 'home'
            },
            'faq': {
                component: 'components/faq.html',
                title: '자주 묻는 질문 - AyaBid',
                tab: 'contact'
            },
            'terms': {
                component: 'components/terms.html',
                title: '이용약관 - AyaBid',
                tab: 'contact'
            },
            'privacy': {
                component: 'components/privacy.html',
                title: '개인정보처리방침 - AyaBid',
                tab: 'contact'
            },
            'store': {
                component: 'components/store.html',
                title: '스토어 - AyaBid',
                tab: 'services'
            }
        };
    },

    /**
     * 이벤트 바인딩 - tab-navigation 완전 지원
     */
    bindEvents: function() {
        // 해시 변경 이벤트
        window.addEventListener('hashchange', () => {
            this.handleRouteChange();
        });
        
        // SPA 링크 클릭 이벤트 (일반 링크)
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link && !link.classList.contains('tab-btn')) {
                e.preventDefault();
                const hash = link.getAttribute('href');
                if (hash && hash !== '#') {
                    this.navigate(hash.substring(1));
                }
            }
        });
        
        // Tab Navigation 전용 이벤트 처리
        document.addEventListener('click', (e) => {
            const tabBtn = e.target.closest('.tab-btn');
            if (tabBtn) {
                e.preventDefault();
                e.stopPropagation();
                
                const tab = tabBtn.getAttribute('data-tab');
                this.handleTabNavigation(tab, tabBtn);
            }
        });
    },

    /**
     * 탭 네비게이션 처리 - test.html과 동일한 로직
     */
    handleTabNavigation: function(tab, tabElement) {
        console.log('탭 네비게이션:', tab);
        
        // 모든 탭에서 active 제거
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        
        // 현재 탭 활성화
        if (tabElement) {
            tabElement.classList.add('active');
        }
        
        switch(tab) {
            case 'home':
                this.navigate('home');
                break;
                
            case 'chat':
                // 채팅은 페이지 변경 없이 오버레이로 열기
                if (window.openChat) {
                    window.openChat();
                }
                // 채팅 탭은 임시 활성화이므로 이전 탭 상태로 복원하지 않음
                break;
                
            case 'services':
                // 기본 서비스 페이지로 이동
                this.navigate('excel-simple');
                break;
                
            case 'contact':
                // 홈페이지의 연락처 섹션으로 이동
                this.navigate('home');
                setTimeout(() => {
                    const contactSection = document.getElementById('contact');
                    if (contactSection) {
                        contactSection.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }, 300);
                break;
        }
    },

    /**
     * 초기 라우트 처리
     */
    handleInitialRoute: function() {
        const hash = window.location.hash.substring(1) || 'home';
        this.navigate(hash, false); // 초기 로드시에는 탭 업데이트 스킵
        
        // 초기 탭 상태 설정
        setTimeout(() => {
            this.updateTabState(this.routes[hash]?.tab || 'home');
        }, 100);
    },

    /**
     * 라우트 변경 처리
     */
    handleRouteChange: function() {
        const hash = window.location.hash.substring(1) || 'home';
        this.navigate(hash);
    },

    /**
     * 라우트 네비게이션 - 개선된 탭 연동
     */
    navigate: function(route, updateTab = true) {
        console.log('라우팅:', route);
        
        if (this.currentRoute === route) return;
        
        // 채팅 창이 열려있으면 닫기
        if (window.closeChat && document.getElementById('chatInterface')?.classList.contains('active')) {
            window.closeChat();
        }
        
        // 해시 파라미터 처리 (예: home#contact)
        let actualRoute = route;
        let hashParam = null;
        
        if (route.includes('#')) {
            const parts = route.split('#');
            actualRoute = parts[0];
            hashParam = parts[1];
        }
        
        // 라우트 존재 여부 확인
        if (!this.routes[actualRoute]) {
            console.warn('존재하지 않는 라우트:', actualRoute);
            actualRoute = 'home';
        }
        
        this.previousRoute = this.currentRoute;
        this.currentRoute = actualRoute;
        
        // 라우트 정보 가져오기 (안전한 접근)
        const routeInfo = this.routes[actualRoute];
        if (!routeInfo) {
            console.error('라우트 정보를 찾을 수 없습니다:', actualRoute);
            return;
        }
        
        // 페이지 타이틀 업데이트
        document.title = routeInfo.title || 'AyaBid';
        
        // 해시 업데이트 (무한 루프 방지)
        const newHash = hashParam ? `${actualRoute}#${hashParam}` : actualRoute;
        if (window.location.hash !== `#${newHash}`) {
            history.replaceState(null, null, `#${newHash}`);
        }
        
        // 컴포넌트 로드
        this.loadComponent(routeInfo.component, actualRoute).then(() => {
            // 해시 파라미터가 있는 경우 해당 섹션으로 스크롤
            if (hashParam) {
                setTimeout(() => {
                    const targetElement = document.getElementById(hashParam);
                    if (targetElement) {
                        targetElement.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }, 300);
            }
        });
        
        // 탭 상태 업데이트 (tab-navigation에서 호출된 경우 제외)
        if (updateTab && routeInfo.tab) {
            this.updateTabState(routeInfo.tab);
        }
        
        // 네비게이션 상태 업데이트
        this.updateNavigationState(actualRoute);
    },

    /**
     * 컴포넌트 로딩 - 개선된 오류 처리
     */
    loadComponent: async function(componentPath, route) {
        try {
            const mainContent = document.getElementById('main-content');
            if (!mainContent) {
                console.error('main-content 요소를 찾을 수 없습니다');
                return;
            }
            
            console.log(`컴포넌트 로딩: ${componentPath}`);
            
            // 로딩 표시
            mainContent.innerHTML = `
                <div class="text-center p-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">로딩 중...</span>
                    </div>
                    <p class="mt-3">페이지를 불러오고 있습니다...</p>
                </div>
            `;
            
            // 스크롤을 맨 위로
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            const response = await fetch(componentPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const html = await response.text();
            
            // 빈 컴포넌트 감지 및 기본 콘텐츠 제공
            if (!html.trim() || html.trim().length < 50) {
                mainContent.innerHTML = this.getDefaultContent(route);
            } else {
                mainContent.innerHTML = html;
            }
            
            // 내부 링크를 SPA 방식으로 변환
            this.convertLinksToSpa(mainContent);
            
            // 페이지별 초기화
            this.initializePage(route);
            
            console.log(`컴포넌트 로딩 완료: ${componentPath}`);
            
            // 이벤트 발생
            document.dispatchEvent(new CustomEvent('componentLoaded', { 
                detail: { route, component: componentPath } 
            }));
            
        } catch (error) {
            console.error(`컴포넌트 로딩 실패: ${componentPath}`, error);
            this.showError(route);
        }
    },

    /**
     * 빈 컴포넌트를 위한 기본 콘텐츠 생성
     */
    getDefaultContent: function(route) {
        const routeInfo = this.routes[route];
        const title = routeInfo ? routeInfo.title.replace(' - AyaBid', '') : route;
        
        return `
            <div class="container py-5">
                <div class="row justify-content-center">
                    <div class="col-lg-8">
                        <div class="text-center mb-5">
                            <h1 class="display-4 mb-3">${title}</h1>
                            <p class="lead text-muted">페이지 준비 중입니다</p>
                        </div>
                        <div class="alert alert-info">
                            <h4 class="alert-heading">개발 중</h4>
                            <p>이 페이지는 현재 개발 중입니다. 곧 완성된 콘텐츠를 만나보실 수 있습니다.</p>
                            <hr>
                            <p class="mb-0">
                                <a href="#home" class="btn btn-primary">홈으로 돌아가기</a>
                                <a href="javascript:openChat();" class="btn btn-outline-primary ms-2">AI 상담받기</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * 탭 상태 업데이트 - test.html과 동일한 방식
     */
    updateTabState: function(activeTab) {
        // 채팅이 열려있지 않을 때만 탭 상태 업데이트
        if (document.getElementById('chatInterface')?.classList.contains('active')) {
            return;
        }
        
        // 모든 탭 버튼에서 active 클래스 제거
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // 현재 탭에 active 클래스 추가
        const activeTabBtn = document.querySelector(`.tab-btn[data-tab="${activeTab}"]`);
        if (activeTabBtn) {
            activeTabBtn.classList.add('active');
        }
    },

    /**
     * 네비게이션 상태 업데이트
     */
    updateNavigationState: function(route) {
        // 헤더 네비게이션 링크 활성화
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${route}`) {
                link.classList.add('active');
            }
        });
    },

    /**
     * SPA 링크 변환
     */
    convertLinksToSpa: function(container) {
        const links = container.querySelectorAll('a[href]');
        links.forEach(link => {
            const href = link.getAttribute('href');
            
            // 외부 링크나 특수 링크는 건드리지 않음
            if (!href || href.startsWith('http') || href.startsWith('#') || 
                href.startsWith('tel:') || href.startsWith('mailto:') || 
                href.startsWith('javascript:')) {
                return;
            }
            
            // HTML 파일을 해시 라우팅으로 변경
            if (href.endsWith('.html')) {
                const routeName = href.replace('.html', '').replace('./', '');
                link.setAttribute('href', '#' + routeName);
            }
        });
    },

    /**
     * 페이지별 초기화
     */
    initializePage: function(route) {
        // AOS (Animate On Scroll) 새로고침
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
        
        // 페이지별 특수 처리
        switch(route) {
            case 'home':
                this.initHomePage();
                break;
            case 'excel-simple':
            case 'python-excel-ai':
            case 'web-based':
                this.initServicePage();
                break;
            case 'profile':
                this.initProfilePage();
                break;
            case 'store':
                this.initStorePage();
                break;
        }
    },

    /**
     * 홈페이지 초기화
     */
    initHomePage: function() {
        // 통계 카운터 애니메이션
        const counters = document.querySelectorAll('[data-count]');
        counters.forEach(counter => {
            if (window.MainApp && window.MainApp.animateCounter) {
                window.MainApp.animateCounter(counter);
            }
        });
        
        // 타이핑 효과 (있는 경우)
        const typingElement = document.querySelector('.typing-text');
        if (typingElement) {
            this.initTypingEffect(typingElement);
        }
    },

    /**
     * 서비스 페이지 초기화
     */
    initServicePage: function() {
        // 서비스 관련 인터랙션 초기화
        const demoButtons = document.querySelectorAll('.demo-btn');
        demoButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showDemoModal();
            });
        });
    },

    /**
     * 프로필 페이지 초기화
     */
    initProfilePage: function() {
        // 로그인 상태 확인
        const isLoggedIn = window.Utils ? window.Utils.loadFromStorage('isLoggedIn', false) : false;
        
        if (!isLoggedIn) {
            // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
            this.navigate('login');
            if (window.UI && window.UI.showNotification) {
                window.UI.showNotification('로그인이 필요합니다.', 'warning');
            }
        }
    },

    /**
     * 스토어 페이지 초기화
     */
    initStorePage: function() {
        // 서비스 카드 인터랙션
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    },

    /**
     * 타이핑 효과 초기화
     */
    initTypingEffect: function(element) {
        const text = element.textContent;
        element.textContent = '';
        
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, 100);
    },

    /**
     * 데모 모달 표시
     */
    showDemoModal: function() {
        // Bootstrap 모달이 있는 경우
        const demoModal = document.getElementById('demoModal');
        if (demoModal) {
            const modal = new bootstrap.Modal(demoModal);
            modal.show();
        } else {
            // 간단한 알림
            if (window.UI && window.UI.showNotification) {
                window.UI.showNotification('데모 기능은 준비 중입니다.', 'info');
            }
        }
    },

    /**
     * 오류 페이지 표시 - 개선된 UI
     */
    showError: function(route = null) {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="container py-5">
                    <div class="row justify-content-center">
                        <div class="col-md-8">
                            <div class="alert alert-danger text-center">
                                <i class="bi bi-exclamation-triangle fs-1 text-danger mb-3"></i>
                                <h4 class="alert-heading">페이지 로딩 오류</h4>
                                <p>요청하신 페이지를 불러올 수 없습니다.</p>
                                ${route ? `<p class="small text-muted">경로: ${route}</p>` : ''}
                                <hr>
                                <div class="d-flex gap-2 justify-content-center">
                                    <button class="btn btn-primary" onclick="Router.navigate('home')">
                                        <i class="bi bi-house me-2"></i>홈으로 돌아가기
                                    </button>
                                    <button class="btn btn-outline-primary" onclick="location.reload()">
                                        <i class="bi bi-arrow-clockwise me-2"></i>새로고침
                                    </button>
                                    <button class="btn btn-outline-secondary" onclick="openChat()">
                                        <i class="bi bi-chat-dots me-2"></i>도움 요청
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    },

    /**
     * 라우터 상태 반환
     */
    getStatus: function() {
        return {
            initialized: this.initialized,
            currentRoute: this.currentRoute,
            previousRoute: this.previousRoute,
            routes: Object.keys(this.routes)
        };
    }
};