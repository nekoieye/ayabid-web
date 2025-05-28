# AyaBid - AI 기반 입찰 예측 시스템

## 프로젝트 개요
AyaBid는 나라장터(G2B) 비공개복수예가 입찰의 성공률을 높이는 AI 기반 예측 시스템입니다.

## 주요 기능
- 엑셀 기반 심플 예측
- 입찰 시뮬레이션 시스템  
- 파이썬과 엑셀 학습형 AI
- 웹 기반 입찰 프로그램

## 기술 스택
- HTML5, CSS3, JavaScript (ES6+)
- Bootstrap 5
- Bootstrap Icons
- Chart.js (차트 시각화)
- 반응형 웹 디자인

## 파일 구조
```
├── index.html              # 메인 페이지
├── test.html              # 테스트 페이지
├── .htaccess              # 웹서버 설정
├── assets/
│   ├── css/
│   │   ├── main.css       # 메인 스타일시트
│   │   └── responsive.css # 반응형 스타일
│   ├── js/
│   │   ├── main.js        # 메인 JavaScript
│   │   ├── controller.js  # 컨트롤러
│   │   └── modules/       # 모듈 디렉토리
│   └── images/            # 이미지 파일
├── components/            # HTML 컴포넌트
└── policy/               # 정책 관련 문서
```

## 웹호스팅 배포 방법

### 1. 파일 업로드
- FTP 클라이언트를 사용하여 모든 파일을 웹서버에 업로드
- 루트 디렉토리에 업로드 (public_html 또는 www 폴더)

### 2. 웹서버 요구사항
- Apache 웹서버 (권장)
- PHP 지원 (선택사항)
- .htaccess 지원 활성화

### 3. 브라우저 호환성
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### 4. 성능 최적화
- GZIP 압축 활성화됨
- 이미지 및 CSS/JS 파일 캐싱 설정됨
- 보안 헤더 적용됨

## 로컬 테스트 방법

### Python 사용
```bash
cd 프로젝트폴더
python -m http.server 8080
```

### Node.js 사용
```bash
npx serve .
```

브라우저에서 http://localhost:8080 접속

## 주요 페이지
- **홈페이지**: 서비스 소개 및 주요 기능
- **서비스 페이지**: 4가지 주요 서비스 상세 안내
- **FAQ**: 자주 묻는 질문
- **로그인/회원가입**: 사용자 인증
- **정책 페이지**: 이용약관 및 개인정보처리방침

## 연락처
- 이메일: info@ayabid.com
- 전화: 02-1234-5678
- 주소: 서울특별시 강남구

## 라이선스
© 2024 아야비드(AyaBid). All rights reserved.