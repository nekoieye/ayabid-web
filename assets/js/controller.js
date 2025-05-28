/**
 * 아야비드(AyaBid) 메인 컨트롤러
 * test.html과 완전 호환되는 SPA + MVC 패턴 관리
 */

class Controller {
    constructor() {
        this.initialized = false;
        this.components = {
            header: false,
            footer: false,
            router: false,
            mainApp: false,
            tabNavigation: false,
            chatInterface: false
        };
    }

    /**
     * 컨트롤러 초기화 - test.html 스타일 완전 지원
     */
    async init() {
        if (this.initialized) {
            console.log('Controller already initialized');
            return;
        }

        try {
            console.log('Controller 초기화 시작...');

            // AppState 존재 확인 및 초기화
            if (!window.AppState) {
                console.log('AppState 초기화 중...');
                window.AppState = {
                    isLoaded: false,
                    components: {
                        header: false,
                        footer: false,
                        router: false,
                        mainApp: false,
                        tabNavigation: false,
                        chatInterface: false
                    },
                    currentRoute: null,
                    currentTab: 'home',
                    user: null,
                    chatOpen: false
                };
            }
            
            // 1단계: 헤더/푸터 로딩
            await this.loadHeaderFooter();
            
            // 2단계: Tab Navigation 초기화
            this.initializeTabNavigation();
            
            // 3단계: Chat Interface 초기화
            this.initializeChatInterface();
            
            // 4단계: 라우터 초기화 
            await this.initializeRouter();
            
            // 5단계: MainApp 초기화
            this.initializeMainApp();
            
            // 6단계: UI 이벤트 설정
            this.setupUIEvents();
            
            // 7단계: 사이드바 및 기타 초기화
            this.initializeSidebarAndExtras();
            
            // 8단계: 앱 상태 업데이트
            window.AppState.isLoaded = true;
            this.initialized = true;
            
            console.log('Controller 초기화 완료');
            
            // 초기화 완료 이벤트 발생
            document.dispatchEvent(new CustomEvent('appReady'));
            
        } catch (error) {
            console.error('Controller 초기화 오류:', error);
            this.showInitError();
        }
    }

    /**
     * 헤더와 푸터를 로딩합니다
     */
    async loadHeaderFooter() {
        try {
            console.log('헤더/푸터 로딩 시작...');
            
            // 로딩 시작 이벤트
            document.dispatchEvent(new CustomEvent('loadingStart'));
            
            // 헤더 로딩
            const headerResponse = await fetch('components/header.html');
            if (headerResponse.ok) {
                const headerHtml = await headerResponse.text();
                const headerElement = document.getElementById('header-container'); // 수정: header -> header-container
                if (headerElement) {
                    headerElement.innerHTML = headerHtml;
                    console.log('헤더 로딩 완료');
                    this.components.header = true;
                    window.AppState.components.header = true;
                    
                    // 헤더 로드 후 즉시 네비게이션 이벤트 설정
                    this.setupNavigationEvents();
                }
            } else {
                console.error('헤더 로딩 실패:', headerResponse.status);
                this.components.header = false;
                window.AppState.components.header = false;
            }
            
            // 푸터 로딩
            const footerResponse = await fetch('components/footer.html');
            if (footerResponse.ok) {
                const footerHtml = await footerResponse.text();
                const footerElement = document.getElementById('footer-container'); // 수정: footer -> footer-container
                if (footerElement) {
                    footerElement.innerHTML = footerHtml;
                    console.log('푸터 로딩 완료');
                    this.components.footer = true;
                    window.AppState.components.footer = true;
                    
                    // 푸터 링크에도 SPA 이벤트 적용
                    this.setupFooterEvents();
                }
            } else {
                console.error('푸터 로딩 실패:', footerResponse.status);
                this.components.footer = false;
                window.AppState.components.footer = false;
            }
            
            // 로딩 완료 이벤트 
            document.dispatchEvent(new CustomEvent('componentsLoaded'));
            
        } catch (error) {
            console.error('헤더/푸터 로딩 오류:', error);
            document.dispatchEvent(new CustomEvent('loadingError', { detail: error }));
        }
    }

    /**
     * Tab Navigation 초기화 - test.html과 동일한 구조
     */
    initializeTabNavigation() {
        console.log('Tab Navigation 초기화...');
        
        const tabNavigation = document.querySelector('.tab-navigation');
        if (!tabNavigation) {
            console.log('Tab Navigation 요소가 없습니다. HTML 구조에 tab-navigation이 있는지 확인하세요.');
            // Tab Navigation이 없어도 계속 진행
            this.components.tabNavigation = false;
            window.AppState.components.tabNavigation = false;
            return;
        }
        
        // 탭 버튼들이 이미 HTML에 있는지 확인
        const existingTabs = tabNavigation.querySelectorAll('.tab-btn');
        if (existingTabs.length === 0) {
            console.log('Tab 버튼들이 없습니다. 동적으로 생성합니다.');
            this.createTabButtons(tabNavigation);
        }
        
        this.components.tabNavigation = true;
        window.AppState.components.tabNavigation = true;
        
        // 초기 탭 상태 설정
        const homeBtn = document.querySelector('.tab-btn[data-tab="home"]');
        if (homeBtn) {
            homeBtn.classList.add('active');
        }
        
        console.log('Tab Navigation 초기화 완료');
    }
    
    /**
     * Tab 버튼들을 동적으로 생성
     */
    createTabButtons(container) {
        const tabButtonsHtml = `
            <button class="tab-btn" data-tab="home" data-tooltip="홈">
                <i class="bi bi-house"></i>
            </button>
            <button class="tab-btn" data-tab="services" data-tooltip="서비스">
                <i class="bi bi-grid-3x3-gap"></i>
            </button>
            <button class="tab-btn" data-tab="chat" data-tooltip="AI 상담">
                <i class="bi bi-chat-dots"></i>
            </button>
            <button class="tab-btn" data-tab="contact" data-tooltip="연락처">
                <i class="bi bi-telephone"></i>
            </button>
        `;
        
        container.innerHTML = tabButtonsHtml;
        console.log('Tab 버튼들이 동적으로 생성되었습니다.');
    }

    /**
     * Chat Interface 초기화 - test.html 풀스크린 스타일
     */
    initializeChatInterface() {
        console.log('Chat Interface 초기화...');
        
        const chatInterface = document.getElementById('chatInterface');
        if (!chatInterface) {
            console.warn('Chat Interface 요소를 찾을 수 없습니다');
            return;
        }
        
        // 채팅 인터페이스가 이미 HTML에 있는지 확인
        const chatMessages = document.getElementById('chatMessages');
        const chatInput = document.getElementById('chatInput');
        
        if (!chatMessages || !chatInput) {
            console.warn('Chat Interface 구성 요소를 찾을 수 없습니다');
            return;
        }
        
        // 초기 환영 메시지 추가 (비어있는 경우)
        if (chatMessages.children.length === 0) {
            chatMessages.innerHTML = `
                <div class="message ai">
                    안녕하세요! AyaBid AI 어시스턴트입니다. 입찰 관련 질문이나 서비스에 대해 궁금한 점이 있으시면 언제든 물어보세요! 😊
                    <div class="message-time">지금</div>
                </div>
            `;
        }
        
        this.components.chatInterface = true;
        window.AppState.components.chatInterface = true;
        
        console.log('Chat Interface 초기화 완료');
    }

    /**
     * 라우터 초기화
     */
    async initializeRouter() {
        return new Promise((resolve) => {
            if (window.Router && typeof window.Router.init === 'function') {
                console.log('Router 초기화...');
                window.Router.init();
                this.components.router = true;
                window.AppState.components.router = true;
                console.log('Router 초기화 완료');
            } else {
                console.warn('Router를 찾을 수 없거나 유효하지 않습니다');
                this.components.router = false;
                window.AppState.components.router = false;
            }
            resolve();
        });
    }

    /**
     * MainApp 초기화
     */
    initializeMainApp() {
        if (window.MainApp && typeof window.MainApp.init === 'function') {
            console.log('MainApp 초기화...');
            window.MainApp.init();
            this.components.mainApp = true;
            console.log('MainApp 초기화 완료');
        } else {
            console.warn('MainApp을 찾을 수 없습니다');
            this.components.mainApp = false;
        }
    }

    /**
     * 네비게이션 이벤트를 설정합니다 (헤더 링크들을 SPA 방식으로 변경)
     */
    setupNavigationEvents() {
        // 헤더의 모든 링크를 SPA 방식으로 변경
        const navLinks = document.querySelectorAll('header a[href]');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            // 이미 #으로 시작하거나 외부 링크인 경우 건너뜀
            if (!href || href.startsWith('#') || href.startsWith('http') || 
                href.startsWith('tel:') || href.startsWith('mailto:')) {
                return;
            }
            
            // 정적 HTML 파일 링크를 해시 라우팅으로 변경
            if (href === 'index.html' || href === './') {
                link.setAttribute('href', '#home');
            } else if (href.endsWith('.html')) {
                const routeName = href.replace('.html', '').replace('./', '');
                link.setAttribute('href', '#' + routeName);
            }
        });
        
        console.log('네비게이션 이벤트 설정 완료');
    }

    /**
     * 푸터 이벤트를 설정합니다
     */
    setupFooterEvents() {
        // 푸터의 모든 링크가 이미 #으로 시작하도록 처리되어 있음
        // 필요한 경우 추가 로직 구현
        console.log('푸터 이벤트 설정 완료');
    }

    /**
     * UI 이벤트 설정 - test.html과 호환
     */
    setupUIEvents() {
        // 모바일 메뉴 토글
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarMenu = document.getElementById('navbarNav');
        
        if (navbarToggler && navbarMenu) {
            navbarToggler.addEventListener('click', function() {
                navbarMenu.classList.toggle('show');
            });
        }

        // 스크롤 맨 위로 버튼
        const scrollTopBtn = document.getElementById('scrollTop');
        if (scrollTopBtn) {
            // 스크롤 위치에 따라 버튼 표시/숨김
            window.addEventListener('scroll', function() {
                if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
                    scrollTopBtn.classList.add('show');
                } else {
                    scrollTopBtn.classList.remove('show');
                }
            });
            
            // 클릭 이벤트
            scrollTopBtn.addEventListener('click', function() {
                window.scrollTo({top: 0, behavior: 'smooth'});
            });
        }

        // Tab Navigation의 Chat 버튼 특수 처리
        const chatTabBtn = document.querySelector('.tab-btn[data-tab="chat"]');
        if (chatTabBtn) {
            chatTabBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // 모든 탭에서 active 제거
                document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                
                // 채팅 탭 활성화
                chatTabBtn.classList.add('active');
                
                // 채팅 열기
                if (window.openChat) {
                    window.openChat();
                    window.AppState.chatOpen = true;
                }
            });
        }

        console.log('UI 이벤트 설정 완료');
    }
    
    /**
     * 사이드바 및 기타 초기화
     */
    initializeSidebarAndExtras() {
        console.log('사이드바 및 기타 초기화 시작...');
        
        // 사이드바 초기화 및 메뉴 추가
        try {
            if (window.Sidebar) {
                // 메뉴 항목 추가
                window.Sidebar.addItem({
                    icon: 'bi bi-house-door',
                    text: '홈',
                    action: function() { 
                        window.location.hash = 'home';
                        // 탭 상태도 업데이트
                        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                        const homeTab = document.querySelector('.tab-btn[data-tab="home"]');
                        if (homeTab) homeTab.classList.add('active');
                    }
                });
                
                window.Sidebar.addItem({
                    icon: 'bi bi-grid-3x3-gap',
                    text: '서비스',
                    action: function() { 
                        window.location.hash = 'excel-simple';
                        // 탭 상태도 업데이트
                        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                        const servicesTab = document.querySelector('.tab-btn[data-tab="services"]');
                        if (servicesTab) servicesTab.classList.add('active');
                    }
                });
                
                window.Sidebar.addItem({
                    icon: 'bi bi-chat-dots',
                    text: 'AI 상담',
                    action: function() { 
                        if (window.openChat) {
                            window.openChat();
                            // 채팅 탭 활성화
                            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                            const chatTab = document.querySelector('.tab-btn[data-tab="chat"]');
                            if (chatTab) chatTab.classList.add('active');
                        }
                    }
                });
                
                window.Sidebar.addItem({
                    icon: 'bi bi-info-circle',
                    text: 'FAQ',
                    action: function() { 
                        window.location.hash = 'faq';
                        // 탭 상태도 업데이트
                        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                        const contactTab = document.querySelector('.tab-btn[data-tab="contact"]');
                        if (contactTab) contactTab.classList.add('active');
                    }
                });
                
                window.Sidebar.addItem({
                    icon: 'bi bi-person-circle',
                    text: '로그인',
                    action: function() { 
                        const loginModal = document.getElementById('loginModal');
                        if (loginModal) {
                            const modal = new bootstrap.Modal(loginModal);
                            modal.show();
                        } else {
                            window.location.hash = 'login';
                        }
                    }
                });
            }
        } catch (error) {
            console.error('사이드바 초기화 오류:', error);
        }
        
        // AI 채팅 초기화
        try {
            if (window.AIAgent) {
                window.AIAgent.init();
                console.log('AIAgent 초기화 완료');
            }
        } catch (error) {
            console.error('AI 채팅 초기화 오류:', error);
        }
        
        console.log('사이드바 및 기타 초기화 완료');
    }
    
    /**
     * 초기화 오류 처리
     */
    showInitError() {
        const errorHtml = `
            <div class="alert alert-danger m-3" role="alert">
                <h4 class="alert-heading">앱 초기화 오류</h4>
                <p>애플리케이션을 시작하는 중에 문제가 발생했습니다.</p>
                <hr>
                <p class="mb-0">페이지를 새로고침하거나 잠시 후 다시 시도해주세요.</p>
                <button class="btn btn-outline-danger mt-2" onclick="location.reload()">
                    새로고침
                </button>
            </div>
        `;
        
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.innerHTML = errorHtml;
        }
    }

    /**
     * 컴포넌트 상태 확인
     */
    getStatus() {
        return {
            initialized: this.initialized,
            components: this.components
        };
    }
}

// 전역 Controller 인스턴스 생성
window.Controller = new Controller();

// DOM 로드 후 자동 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM 로드 완료 - Controller 초기화 시작');
    
    // 즉시 로딩 오버레이 표시
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
        loadingOverlay.style.opacity = '1';
    }
    
    // UI 초기화
    if (window.UI) UI.init();
    
    // Controller 초기화
    if (window.Controller) {
        window.Controller.init().catch(error => {
            console.error('Controller 초기화 오류:', error);
            
            // 로딩 오버레이 숨기기 (오류 발생 시에도)
            if (loadingOverlay) {
                loadingOverlay.style.opacity = '0';
                setTimeout(() => {
                    loadingOverlay.style.display = 'none';
                }, 500);
            }
        });
    } else {
        console.error('Controller를 찾을 수 없습니다.');
    }
});

// 앱 준비 완료 이벤트 리스너
document.addEventListener('appReady', function() {
    console.log('앱이 완전히 준비되었습니다.');
    
    // 로딩 오버레이 숨기기
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 500);
    }
    
    // 메인 콘텐츠 표시
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.style.opacity = '1';
    }
    
    // 탭 네비게이션 초기 상태 설정
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

// 채팅 상태 관련 이벤트 리스너
document.addEventListener('chatOpened', function() {
    window.AppState.chatOpen = true;
});

document.addEventListener('chatClosed', function() {
    window.AppState.chatOpen = false;
    
    // 채팅 닫힐 때 원래 탭으로 복원
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

// 에러 처리
window.addEventListener('error', function(e) {
    console.error('앱 런타임 오류:', e.error);
});