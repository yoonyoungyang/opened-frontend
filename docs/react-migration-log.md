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
