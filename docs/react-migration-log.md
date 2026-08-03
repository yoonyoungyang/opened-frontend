# 열렸나요 React Migration 작업 기록

설계와 실제 구현의 차이, AI 제안에 대한 검토 결과와 단계별 검증 내용을 기록한다.

## 1단계. React 기반 구성

- **작업 범위**: 별도 `react-app/`, Vite, React Router, TanStack Query, 전체 Page route와 기존 base CSS 연결
- **AI 제안**: 기존 정적 앱을 유지하고 React 앱을 별도 디렉터리에서 구축
- **검토 내용**: 기존 HTML·JavaScript와 비교 가능한 구조인지, 동적 `postId` 경로가 표현되는지 확인
- **채택 결과**: `react-app/` 분리 방식을 채택하고 각 Page는 route 확인용 placeholder로 생성
- **검증 결과**: dependency 설치, production build 성공, `/login`과 `/posts/1` 직접 요청에서 SPA fallback 응답 확인

## 2단계. API·인증·Layout

- **작업 범위**: 공통 API client, tokenStorage, ProtectedRoute, AppLayout, Header, ProfileMenu
- **AI 제안**: route metadata로 Header 구성을 관리하고 토큰 저장소와 보호 라우트로 인증 책임 분리
- **검토 내용**: 기존 `data-back`, `data-back-label`, `data-profile`, 로그아웃과 401/403 처리 동작을 실제 코드와 대조
- **채택 결과**: 전역 AuthContext 없이 `tokenStorage`를 사용하고, Header의 Page별 차이는 route `handle`에 선언
- **수정한 판단**: 모달은 아직 2단계 범위가 아니며 전역 상태가 필요하지 않아 도입하지 않음
- **검증 결과**: production build 성공, 공개·동적 route의 개발 서버 응답 확인, Git diff 형식 검사 통과
- **남은 검증**: 브라우저에서 토큰 유무에 따른 보호 route 이동과 ProfileMenu 상호작용 확인

## 3단계. 로그인·회원가입

- **작업 범위**: 인증 API, 공통 검증 함수, LoginForm, SignupForm, 로그인·회원가입 Page와 인증 화면 스타일
- **AI 제안**: 검증 규칙은 순수 함수로 분리하고 두 화면은 같은 Form 컴포넌트로 합치지 않음
- **검토 내용**: 로그인은 하나의 helper를 공유하고 회원가입은 필드별 helper를 사용하므로 화면별 상태 구조를 유지. 프로필 이미지 입력은 기존 JavaScript에 연결되지 않은 UI임을 확인
- **채택 결과**: 이메일·비밀번호 검증은 공유하되 LoginForm과 SignupForm을 분리하고, API 성공 후 토큰 저장과 route 이동은 Page가 조정
- **수정한 판단**: 기존 Page CSS를 동시에 전역 import하면 `.main` 규칙이 충돌하므로 값은 유지하되 React 인증 화면 범위로 selector를 제한
- **검증 결과**: 검증 함수 테스트 4개 통과, production build 성공, Git diff 형식 검사 통과
- **남은 검증**: 백엔드 실행 상태에서 로그인 성공·실패, 이메일·닉네임 중복 응답과 화면 이동 수동 확인
