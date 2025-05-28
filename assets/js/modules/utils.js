/**
 * 유틸리티 모듈
 * 일반적인 유틸리티 함수들 제공
 */

const Utils = {
    /**
     * 파비콘 동적 로드 (존재하지 않는 경우 기본 파비콘 생성)
     */
    loadFavicon: function() {
        const faviconPath = 'assets/images/favicon.ico';
        
        // 기존 파비콘 링크 요소 확인
        let existingFavicon = document.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
        
        // 파비콘 존재 여부 체크
        fetch(faviconPath, { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    // 파비콘이 존재하면 적용
                    if (!existingFavicon) {
                        const link = document.createElement('link');
                        link.rel = 'icon';
                        link.href = faviconPath;
                        link.type = 'image/x-icon';
                        document.head.appendChild(link);
                    }
                } else {
                    console.warn('파비콘을 찾을 수 없습니다. 기본 파비콘을 생성합니다.');
                    this.createDefaultFavicon();
                }
            })
            .catch(() => {
                console.warn('파비콘 로드에 실패했습니다. 기본 파비콘을 생성합니다.');
                this.createDefaultFavicon();
            });
    },
    
    /**
     * 기본 파비콘 생성 (개선된 버전)
     */
    createDefaultFavicon: function() {
        try {
            // 기존 파비콘 링크 요소 제거
            const existingFavicons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
            existingFavicons.forEach(favicon => {
                if (favicon.parentNode) {
                    favicon.parentNode.removeChild(favicon);
                }
            });
            
            // 캔버스로 개선된 파비콘 생성
            const canvas = document.createElement('canvas');
            canvas.width = 32;
            canvas.height = 32;
            
            const ctx = canvas.getContext('2d');
            
            // 그라데이션 배경
            const gradient = ctx.createLinearGradient(0, 0, 32, 32);
            gradient.addColorStop(0, '#1e3a5f'); // primary-navy
            gradient.addColorStop(1, '#2196F3'); // primary-blue
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 32, 32);
            
            // 둥근 모서리 효과
            ctx.globalCompositeOperation = 'destination-in';
            ctx.beginPath();
            ctx.roundRect(0, 0, 32, 32, 6);
            ctx.fill();
            
            // 텍스트 추가
            ctx.globalCompositeOperation = 'source-over';
            ctx.font = 'bold 18px Arial, sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('A', 16, 16);
            
            // 데이터 URL로 변환하여 파비콘 설정
            const faviconUrl = canvas.toDataURL('image/png');
            const link = document.createElement('link');
            link.rel = 'icon';
            link.href = faviconUrl;
            link.type = 'image/png';
            
            document.head.appendChild(link);
            
            console.log('기본 파비콘이 생성되었습니다.');
            
        } catch (error) {
            console.error('파비콘 생성 중 오류가 발생했습니다:', error);
            // 최소한의 파비콘 설정
            this.createSimpleFavicon();
        }
    },
    
    /**
     * 간단한 파비콘 생성 (fallback)
     */
    createSimpleFavicon: function() {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 16;
            canvas.height = 16;
            
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#2196F3';
            ctx.fillRect(0, 0, 16, 16);
            
            const faviconUrl = canvas.toDataURL('image/png');
            const link = document.createElement('link');
            link.rel = 'icon';
            link.href = faviconUrl;
            link.type = 'image/png';
            
            document.head.appendChild(link);
        } catch (error) {
            console.error('간단한 파비콘 생성도 실패했습니다:', error);
        }
    },
    
    /**
     * 로그 함수 (디버그 모드일 때만 로그 출력)
     */
    log: function(message, ...args) {
        if (window.AppState && window.AppState.debug) {
            console.log(`[AyaBid] ${message}`, ...args);
        }
    },
    
    /**
     * 에러 로그 함수 (항상 출력)
     */
    error: function(message, ...args) {
        console.error(`[AyaBid Error] ${message}`, ...args);
    },
    
    /**
     * 로컬 스토리지에 데이터 저장
     */
    saveToStorage: function(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (err) {
            this.error('로컬 스토리지 저장 오류:', err);
            return false;
        }
    },
    
    /**
     * 로컬 스토리지에서 데이터 로드
     */
    loadFromStorage: function(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (err) {
            this.error('로컬 스토리지 로드 오류:', err);
            return defaultValue;
        }
    },
    
    /**
     * 디바이스 타입 확인
     */
    getDeviceType: function() {
        const width = window.innerWidth;
        if (width < 576) return 'mobile';
        if (width < 992) return 'tablet';
        return 'desktop';
    },
    
    /**
     * 다크 모드 감지
     */
    isDarkModeEnabled: function() {
        // 사용자 설정 확인
        const userSetting = this.loadFromStorage('darkMode');
        if (userSetting !== null) return userSetting;
        
        // 시스템 설정 확인
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    },
    
    /**
     * URL 파라미터 파싱
     */
    getUrlParams: function(url = window.location.href) {
        const params = {};
        const parser = document.createElement('a');
        parser.href = url;
        
        const query = parser.search.substring(1);
        const vars = query.split('&');
        
        for (let i = 0; i < vars.length; i++) {
            const pair = vars[i].split('=');
            params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
        }
        
        return params;
    },
    
    /**
     * 해시 파라미터 파싱
     */
    getHashParams: function() {
        const hash = window.location.hash.substr(1);
        const hashParts = hash.split('?');
        
        if (hashParts.length < 2) return {};
        
        const params = {};
        const query = hashParts[1];
        const vars = query.split('&');
        
        for (let i = 0; i < vars.length; i++) {
            const pair = vars[i].split('=');
            params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
        }
        
        return params;
    }
};

// 전역 스코프에 노출
window.Utils = Utils;

// 문서 로드 시 파비콘 로드
document.addEventListener('DOMContentLoaded', function() {
    Utils.loadFavicon();
});
