# 🎬 OPENED Frontend

> **영화관 특별관 정보 공유 커뮤니티 OPENED의 Frontend**

IMAX, 4DX, Dolby Cinema 등 영화관 특별관의 **예매 오픈 정보, 취소표 정보, 좌석 후기 등을 공유하고 실시간 채팅으로 소통할 수 있는 커뮤니티 서비스**입니다.

초기 Vanilla JavaScript로 구현했던 애플리케이션을 React 기반으로 마이그레이션하고, 페이지와 기능 단위로 구조를 분리했습니다.

---

## 🛠 Tech Stack

### Frontend

- React
- Vite
- JavaScript
- React Router
- TanStack Query
- Axios
- STOMP.js
- CSS

### Deployment

- Nginx
- Docker
- Docker Compose
- AWS EC2

---

## ✨ 주요 기능

### 1. 회원 기능

- 회원가입
- 로그인
- JWT Access Token 관리
- 로그인 사용자 정보 조회
- 프로필 조회 및 수정
- 회원 탈퇴

로그인 이후 발급받은 JWT를 API 요청의 `Authorization` Header에 전달합니다.

```text
Login
 ↓
Access Token 저장
 ↓
API 요청
 ↓
Authorization: Bearer {token}
 ↓
Backend 인증
```

인증이 만료되거나 유효하지 않은 경우 로그인 상태를 해제하고 다시 로그인할 수 있도록 처리했습니다.

### 2. 특별관 게시판

영화관 특별관 이용자들이 필요한 정보를 쉽게 공유하고 탐색할 수 있도록 게시판을 구현했습니다.

- 게시글 목록 조회
- 게시글 상세 조회
- 게시글 작성
- 게시글 수정
- 게시글 삭제
- 영화 기준 필터링
- 영화관 기준 필터링

게시글은 다음 목적에 따라 활용됩니다.

- 예매 오픈 제보
- 취소표 제보
- 좌석 후기
- 질문

### 3. 게시글 상호작용

- 게시글 좋아요
- 댓글 작성 / 수정 / 삭제
- 대댓글
- 조회수 표시
- 신고
- 사용자 차단

### 4. 실시간 채팅

영화관 특별관별로 사용자들이 정보를 실시간으로 공유할 수 있도록 WebSocket 채팅 UI를 구현했습니다.

- 채팅방 목록 조회
- 채팅방 선택
- 이전 메시지 조회
- WebSocket 연결
- 채팅방별 STOMP 구독
- 메시지 전송 및 실시간 수신
- 로그인 사용자 / 다른 사용자 메시지 구분
- 날짜별 메시지 구분선
- 자동 스크롤
- 메시지 중복 수신 방지
- WebSocket 자동 재연결
- 재연결 후 현재 채팅방 재구독

```text
채팅방 선택
   │
   ├── REST API
   │      └── 이전 메시지 조회
   │
   └── WebSocket
          └── /topic/chat/{roomId} 구독
                     │
                     ▼
                새 메시지 수신
                     │
                     ▼
                화면 상태 갱신
```

---

## 💬 WebSocket 연결 구조

```text
React
  │
  │ CONNECT + JWT
  ▼
/ws
  │
  ▼
Spring Boot
  │
  ├── SEND
  │    /app/chat
  │
  └── SUBSCRIBE
       /topic/chat/{roomId}
              │
              ▼
         Message 수신
              │
              ▼
       messagesByRoom 갱신
```

연결이 끊어진 경우 일정 시간 후 자동 재연결하고 현재 활성화된 채팅방을 다시 구독하도록 구성했습니다.

---

## ⚛️ React Migration

초기 화면은 Vanilla JavaScript 기반으로 구현했으며 이후 React로 마이그레이션했습니다.

```text
opened-frontend
├── vanilla-app
│   └── Vanilla JavaScript 기반 기존 애플리케이션
│
└── react-app
    └── React 기반 마이그레이션 애플리케이션
```

단순히 문법만 React로 변경하기보다 다음 부분을 중심으로 구조를 개선했습니다.

- 페이지별 상태 분리
- 공통 컴포넌트 분리
- Routing 분리
- API 호출 로직 분리
- 기능별 코드 구성
- 서버 상태와 UI 상태 구분

---

## 📂 Project Structure

```text
react-app/src
├── app
├── assets
├── features
├── layout
├── pages
├── routes
├── shared
└── styles
```

### 주요 역할

- `pages` : 페이지 단위 UI
- `features` : 기능별 로직 및 컴포넌트
- `shared` : 공통 컴포넌트 및 Utility
- `routes` : React Router 설정
- `layout` : 공통 Layout
- `assets` : 이미지 및 정적 리소스
- `styles` : 전역 및 공통 스타일

---

## 🔧 주요 구현 포인트

### 채팅 메시지 상태 분리

채팅 메시지를 단순 배열 하나가 아니라 채팅방별 상태로 관리했습니다.

```text
messagesByRoom
 ├── room 1 → messages[]
 ├── room 2 → messages[]
 └── room 3 → messages[]
```

채팅방을 변경하더라도 각 방의 메시지 상태를 독립적으로 유지할 수 있도록 구성했습니다.

### 이전 메시지와 실시간 메시지 연결

채팅방 진입 시 REST API로 기존 메시지를 불러온 뒤 WebSocket에서 수신한 새 메시지를 기존 상태 뒤에 추가합니다.

### 중복 메시지 방지

REST API로 조회한 메시지와 WebSocket으로 전달된 메시지가 중복 렌더링되지 않도록 메시지 식별자를 기준으로 중복 여부를 확인했습니다.

### WebSocket 자동 재연결

네트워크 문제 등으로 연결이 종료되었을 때 STOMP Client의 재연결 기능을 이용해 자동 연결을 시도하도록 구성했습니다.

재연결에 성공하면 활성화되어 있던 채팅방을 다시 구독합니다.

### 날짜별 채팅 구분

연속된 메시지의 날짜를 비교해 날짜가 변경되는 지점에 날짜 구분선을 표시하도록 구현했습니다.

---

## 🚀 실행 방법

### 1. Repository Clone

```bash
git clone https://github.com/yoonyoungyang/opened-frontend.git
cd opened-frontend/react-app
```

### 2. Package 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

### 4. Production Build

```bash
npm run build
```

---

## 🌐 API / WebSocket

개발 환경에서는 Spring Boot 서버와 통신합니다.

```text
REST API
http://localhost:8080

WebSocket
ws://localhost:8080/ws
```

운영 환경에서는 Nginx를 통해 Backend로 요청을 전달합니다.

```text
/api/* → Spring Boot
/ws    → Spring Boot WebSocket
```

---

## 🐳 Deployment

React 애플리케이션을 Production Build한 후 Docker와 Nginx를 이용해 배포했습니다.

```text
Browser
   │
   ▼
 Nginx
   │
   ├── React 정적 파일
   │
   ├── /api/* → Backend
   │
   └── /ws    → WebSocket Backend
```

Nginx에서 React SPA Routing과 Backend Reverse Proxy를 함께 처리하도록 구성했습니다.
