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

## 4단계. 게시글 목록·상세 조회

- **작업 범위**: 게시글 목록·상세 API와 Query, 필터 UI, PostList·PostCard·PostDetail, 댓글 목록 조회와 날짜 포맷
- **AI 제안**: 목록과 상세의 서버 상태를 TanStack Query로 관리하고 반복 DOM 생성을 표시 컴포넌트로 변환
- **검토 내용**: 목록만 공개이고 상세·댓글은 인증이 필요함을 SecurityConfig와 Controller에서 확인. 타인 게시글 버튼은 숨김이 아니라 비활성화, 본인 댓글 버튼은 조건부 표시임을 기존 JavaScript와 대조
- **채택 결과**: 목록의 비로그인 작성 동작, 기본 프로필 이미지, 날짜 형식, 상세 오류 영역과 댓글 수 갱신 순서를 유지
- **수정한 판단**: Page CSS의 공통 `.main` 충돌을 막기 위해 값은 유지하고 화면별 class로 범위를 제한. 서버 요청 재시도는 TanStack Query의 기본 정책을 따름
- **검증 결과**: 전체 테스트 5개 통과, production build 성공, Git diff 형식 검사 통과
- **남은 검증**: 백엔드가 실행되지 않아 실제 목록·상세·댓글 응답 렌더링은 수동 확인 필요. 수정·삭제, 좋아요와 댓글 변경 동작은 후속 단계에서 연결

## 5단계. 게시글 작성·수정·삭제

- **작업 범위**: 게시글 검증, 공통 PostForm, 작성·수정 mutation, 수정 권한 확인, 상세 수정 이동과 삭제 확인 모달
- **AI 제안**: 작성·수정 입력을 PostForm으로 공유하고 요청·초기 조회·이동은 각 Page가 담당. 삭제 대상과 실행 함수는 PostDetailPage가 소유
- **검토 내용**: 제목은 입력 시 26자로 절삭하고 제목·내용 중 하나라도 비면 기존 helper를 표시. 수정은 서버 초기값과 현재 값이 달라야 제출 가능함을 기존 코드와 대조
- **채택 결과**: 화면에만 있는 게시글 유형·상영 정보·이미지 입력은 UI만 옮기고 request body에는 기존과 같이 `title`, `content`만 포함
- **수정한 판단**: 요청 중 버튼 문구 변경과 추가 비활성화는 기존에 없는 동작이므로 제거. 작성·수정별 상영 정보 문구 차이도 유지
- **검증 결과**: 게시글 검증 테스트를 포함한 전체 테스트 7개 통과, production build 성공, Git diff 형식 검사 통과
- **남은 검증**: 백엔드 실행 상태에서 작성 후 상세 이동, 수정 초기값·변경 감지·권한 실패, 삭제 모달과 목록 이동 수동 확인

## 6단계. 댓글 작성·수정·삭제

- **작업 범위**: CommentForm, 댓글 작성·수정·삭제 API와 mutation, 수정 대상 상태, 게시글·댓글 공용 삭제 모달
- **AI 제안**: 댓글 입력값은 CommentForm, 수정 중인 댓글은 Form과 List의 공통 부모인 CommentSection, 삭제 대상은 공용 모달을 사용하는 PostDetailPage가 소유
- **검토 내용**: 기존 코드는 하나의 textarea를 등록과 수정에 함께 사용하고, 수정 클릭 시 기존 내용을 trim해서 채우며 버튼 문구를 `댓글 수정`으로 변경. 본인 댓글에만 수정·삭제 버튼을 표시
- **채택 결과**: `editingComment` 유무로 등록·수정을 구분하고 성공 시 댓글 Query를 갱신. 삭제 대상의 type에 따라 같은 ConfirmDialog의 제목과 실행 함수를 변경
- **수정한 판단**: 댓글 등록·수정 성공 시 입력 상태를 먼저 초기화하고 재조회는 기다리지 않도록 기존 반응 순서를 유지
- **검증 결과**: 전체 테스트 7개 통과, production build 성공, Git diff 형식 검사 통과
- **남은 검증**: 백엔드 실행 상태에서 댓글 등록·수정·삭제, 수정 모드 전환, 본인·타인 버튼과 `total_count` 반영 수동 확인

## 7단계. 회원정보·비밀번호·탈퇴

- **작업 범위**: 회원정보 조회·수정, 비밀번호 변경, 회원 탈퇴, ProfileEditForm·PasswordEditForm·Toast와 회원 API
- **AI 제안**: 회원 서버 상태는 Query, 각 입력은 Form 로컬 state, 탈퇴 확인은 기존 ConfirmDialog, 수정 결과는 공통 Toast로 처리
- **검토 내용**: 회원정보 수정에는 별도 닉네임 검증 없이 `maxlength=10`과 변경 감지만 존재. 프로필 이미지 선택은 JavaScript에 연결되지 않으며 기존 `profile_img` 값만 수정 요청에 다시 포함. 비밀번호 필드별 문구와 검증 실행 시점을 기존 이벤트 순서와 대조
- **채택 결과**: 변경 없는 회원정보 제출 시 기존 alert 유지, 성공·실패 Toast 문구와 2초 표시·0.3초 종료 시간 유지. 탈퇴 성공 시 토큰 삭제 후 로그인 이동
- **수정한 판단**: 회원가입의 닉네임 검증이나 프로필 이미지 미리보기를 재사용하면 기능이 추가되므로 도입하지 않음
- **검증 결과**: 비밀번호 검증을 포함한 전체 테스트 10개 통과, production build 성공, Git diff 형식 검사 통과
- **남은 검증**: 백엔드 실행 상태에서 회원 초기값, 변경 없음 alert, 수정 성공·실패 Toast, 비밀번호 성공·실패와 회원 탈퇴 수동 확인

## 8단계. 전체 연결과 전환 준비

- **작업 범위**: 전체 route·placeholder·정적 경로 검사, AuthRequiredPage 완성, 기존 문서 제목 복원, 프런트·백엔드 테스트와 개발 proxy 확인
- **AI 제안**: route metadata에 기존 페이지 제목을 함께 선언하고 AppLayout에서 `document.title`을 갱신. 배포 조건은 React 앱 README에 분리
- **검토 내용**: AuthRequiredPage만 placeholder로 남아 있음을 확인해 기존 정적 마크업과 링크를 JSX로 이전. 알 수 없는 기능이나 404 화면은 새로 추가하지 않음
- **채택 결과**: 모든 계획 Page가 실제 화면에 연결됐고 `RoutePlaceholder`를 제거. 기존 페이지별 브라우저 제목과 인증 안내 화면을 복원
- **검증 결과**: 프런트 테스트 10개, production build, 백엔드 테스트 50개 통과. `/posts`, `/posts/3`, `/profile/edit`의 SPA 응답과 `/api/posts` proxy 확인. headless Chrome에서 실제 게시글 3건 렌더링·기존 날짜 형식·페이지 제목을 확인하고, production build의 비로그인 `/profile/edit` 접근이 로그인 화면으로 이동하는 것을 확인
- **환경 확인**: 별도 백엔드 실행은 기존 Java 프로세스가 H2 파일과 8080 포트를 사용 중이라 실패했으나, 해당 기존 서버의 공개 API는 정상 응답함
- **남은 검증**: 실제 브라우저에서 인증 계정으로 전체 CRUD, Toast·모달·권한 UI와 반응형 화면을 수동 확인한 뒤 배포 진입점 전환
