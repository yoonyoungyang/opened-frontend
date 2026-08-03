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

---

## 주요 트러블슈팅과 의사결정

### 1. 설치된 Node.js를 작업 셸에서 찾지 못한 문제

#### 현상

React 앱을 만든 뒤 `node --version`과 `npm --version`을 실행했지만 모두 `command not found`가 발생했다. 사용자 터미널에서는 Node.js 설치가 완료된 상태였다.

#### 원인

Node.js는 NVM으로 설치되어 있었고 NVM 초기화 코드는 `.zshrc`에 있었다. 작업 명령을 실행하는 로그인 셸은 대화형 셸이 아니어서 `.zshrc`의 NVM 초기화가 적용되지 않았다. 설치 실패가 아니라 셸 초기화 방식의 차이였다.

#### 검토한 선택지

- Node.js를 다시 설치한다.
- 시스템 PATH에 Node.js 경로를 직접 추가한다.
- NVM이 초기화되는 대화형 zsh에서 npm 명령을 실행한다.

#### 결정

이미 설치된 환경을 변경하지 않고 `zsh -ic`를 통해 NVM 설정이 적용된 셸에서 npm 명령을 실행했다.

```bash
zsh -ic 'node --version'
zsh -ic 'npm install'
zsh -ic 'npm run build'
```

#### 결과

Node.js `v24.18.1`, npm `11.16.0`을 확인했고 dependency 설치와 Vite build를 진행할 수 있었다. 환경 문제를 코드나 package 설정 문제로 오인해 재설치하지 않았다.

### 2. Production build는 성공하지만 Node 테스트만 실패한 문제

#### 현상

비밀번호 검증 테스트를 추가한 뒤 Vite production build는 성공했지만 `node --test`에서 다음 오류가 발생했다.

```text
ERR_MODULE_NOT_FOUND: Cannot find module '../auth/authValidation'
```

문제가 된 import는 다음과 같았다.

```js
import { validatePassword } from "../auth/authValidation";
```

#### 원인

Vite는 상대 경로의 확장자가 생략되어도 `authValidation.js`를 찾아준다. 반면 Node.js의 ESM loader가 직접 테스트 파일을 실행할 때는 상대 경로의 실제 확장자가 필요하다. 검증 로직의 오류가 아니라 Vite와 Node의 module resolution 차이였다.

#### 검토한 선택지

- 테스트 실행 도구를 Vite 기반 Vitest로 변경한다.
- Node 실행 옵션으로 확장자 해석 방식을 우회한다.
- Node가 직접 읽는 JavaScript import에 `.js`를 명시한다.

#### 결정

현재 테스트 규모에서는 새 테스트 도구를 추가할 이유가 없다고 판단해 import에 확장자를 명시했다.

```js
import { validatePassword } from "../auth/authValidation.js";
```

#### 결과

기능 변경 없이 Node 테스트와 Vite build가 모두 통과했다. 이 문제를 통해 “build 성공”과 “테스트 런타임의 module resolution 성공”은 별개의 검증이라는 점을 확인했다.

### 3. 기존 Page CSS를 그대로 import했을 때 스타일이 충돌하는 문제

#### 현상

기존 페이지 CSS에는 다음처럼 범위가 넓은 selector가 반복되어 있었다.

```css
.main { ... }
.form-group { ... }
.helper-text { ... }
.page-title { ... }
```

기존 앱에서는 HTML마다 필요한 CSS 파일 하나만 로드하므로 충돌하지 않았다. React 앱은 하나의 진입점에서 여러 화면의 CSS가 함께 bundle되기 때문에 나중에 import된 `.main`이나 `.form-group` 규칙이 다른 화면까지 변경할 수 있었다.

#### 검토한 선택지

- 기존 CSS를 그대로 모두 전역 import한다.
- 마이그레이션과 동시에 CSS Modules로 변경한다.
- 기존 속성값과 class는 유지하되 Page root class 아래로 selector 범위를 제한한다.

#### 결정

CSS Modules 도입은 구조 전환과 스타일 체계 전환을 동시에 일으키므로 제외했다. 각 Page의 root에 `login-page`, `posts-page`, `post-detail-page` 같은 class를 추가하고 충돌 가능한 selector만 해당 범위 아래로 옮겼다.

```css
.posts-page {
  padding: 48px 20px 88px;
}

.posts-page .cinema-ui-filter { ... }
.post-detail-page .post-title { ... }
```

#### 결과

기존 디자인 값과 내부 class는 유지하면서 SPA 전역 CSS 충돌을 막았다. CSS를 그대로 복사하는 것만으로는 MPA에서 SPA로 바뀐 실행 조건까지 보존할 수 없다는 점을 반영한 변경이다.

### 4. TanStack Query의 자동 재시도를 비활성화할지에 대한 판단

#### 처음 판단

기존 `fetch`는 요청 실패 시 자동 재시도를 하지 않았다. 기존 요청 횟수까지 동일하게 유지하려고 QueryClient에 다음 설정을 추가했다.

```js
queries: {
  retry: false,
}
```

#### 재검토

TanStack Query를 선택한 이유는 서버 상태 조회, 실패 처리와 갱신 규칙을 직접 반복 구현하지 않기 위해서다. 기존 구현의 모든 저수준 동작을 강제로 복제하면 라이브러리의 기본 동작까지 불필요하게 제한하게 된다. 이 설정을 재검토하면서 “사용자에게 보이는 기능 보존”과 “선택한 라이브러리의 자연스러운 동작”을 구분해 다시 판단했다.

#### 결정

명시적인 `retry` 설정을 제거하고 TanStack Query의 기본 정책을 따르도록 했다.

```js
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
```

#### 결과

화면의 기능과 API 계약은 유지하면서 서버 상태 도구의 기본 실패 복구 방식은 수용했다. 마이그레이션에서 보존해야 하는 것은 기존 구현 코드의 모든 제약이 아니라 사용자가 의존하는 동작이라는 기준을 세웠다.

### 5. React 방식의 개선과 기존 동작 보존이 충돌한 사례

마이그레이션 중 자연스럽게 개선할 수 있어 보였지만 기존 기능 변경이 되는 항목은 적용하지 않았다.

| 검토한 변경 | 기존 동작 | 결정 |
|---|---|---|
| 타인 게시글의 수정·삭제 버튼 제거 | 버튼을 화면에 남기고 `disabled` 처리 | 조건부 제거 대신 비활성화 유지 |
| 게시글 요청 중 버튼 문구 변경·중복 제출 차단 | 요청 중에도 기존 문구와 버튼 상태 유지 | 제출 중 UI 추가하지 않음 |
| 프로필 이미지 선택과 미리보기 구현 | 파일 input은 있으나 JavaScript와 API 흐름에 연결되지 않음 | 마크업만 이전하고 기능 추가하지 않음 |
| 영화·상영관·게시글 유형을 request body에 포함 | 화면에만 있고 백엔드 계약에 포함되지 않음 | UI만 보존하고 `title`, `content`만 전송 |
| 오류 화면의 다시 시도 버튼 연결 | 기존 버튼에 이벤트가 없음 | 표시만 이전하고 새 동작 추가하지 않음 |
| 회원정보 수정에 회원가입 닉네임 검증 재사용 | `maxlength=10`과 변경 감지만 존재 | 새로운 validation을 추가하지 않음 |

반대로 React 렌더링에 필수적인 변경은 적용했다.

- `querySelector`와 `createElement`를 JSX로 변경
- DOM에 흩어진 입력 상태를 controlled state로 변경
- `window.location`을 Router navigation으로 변경
- 댓글 수정 대상처럼 형제 컴포넌트가 공유하는 상태를 공통 부모로 이동

판단 기준은 “React답게 보이는가”가 아니라 “React 렌더링 모델에 필요한 변경인가, 사용자가 경험하는 동작을 바꾸는 개선인가”였다.

### 6. 댓글 수정 상태를 어디에 둘지 결정한 과정

#### 문제

댓글 수정 버튼은 `CommentItem`에 있지만 실제 수정 내용은 `CommentForm`에 표시된다. 두 컴포넌트가 각각 상태를 가지면 어떤 댓글을 수정 중인지 동기화하기 어렵다.

#### 선택지

- 전역 Context에 수정 중인 댓글을 저장한다.
- `CommentItem`이 Form의 DOM을 직접 변경한다.
- 두 컴포넌트의 공통 부모인 `CommentSection`이 수정 대상을 가진다.

#### 결정

`editingComment`는 사용하는 범위가 상세 화면의 댓글 영역 하나뿐이므로 `CommentSection`에 배치했다.

```text
CommentSection (editingComment)
├── CommentForm ← 수정 내용과 버튼 문구
└── CommentList
    └── CommentItem → 수정 대상을 부모에 전달
```

`CommentForm`의 textarea 값은 다른 컴포넌트가 입력 중 값을 알 필요가 없으므로 Form의 로컬 state로 유지했다. 수정 대상이 바뀌면 `comment_id`를 key로 사용해 Form을 다시 초기화했다.

#### 결과

기존의 “하나의 textarea를 등록과 수정에 함께 사용”하는 동작을 유지하면서 DOM 직접 접근 없이 단방향 데이터 흐름으로 표현했다. 전역 상태 없이 필요한 범위에서만 상태를 공유했다.

### 7. 게시글과 댓글 삭제 모달의 상태 범위

기존 상세 화면은 게시글 삭제와 댓글 삭제에 같은 모달을 사용하고, 대상에 따라 제목과 confirm 동작을 바꾼다. 처음에는 전역 Modal Context도 검토했지만 모달 사용 범위가 상세와 회원정보 화면에 한정되고 삭제 대상도 각 Page에만 필요했다.

`PostDetailPage`는 다음 형태의 삭제 대상만 소유한다.

```js
{ type: "post" }
{ type: "comment", commentId }
```

`ConfirmDialog`는 삭제 대상이나 API를 알지 않고 title, description과 callback만 렌더링한다. 전역에서 모달을 열 수 있는 API를 만들지 않아 상태의 출처와 삭제 실행 위치를 Page 안에서 추적할 수 있게 했다.

### 8. 테스트 파일을 기능 코드 옆에 배치한 이유

`authValidation.test.js`, `postValidation.test.js`, `passwordValidation.test.js`는 실제 애플리케이션 파일을 추가로 분리한 것이 아니라 해당 로직을 검증하는 테스트다.

```text
features/auth/
├── authValidation.js
└── authValidation.test.js
```

별도 최상위 `tests/` 폴더 대신 대상 파일 옆에 배치하는 co-location 방식을 선택했다.

- 검증 규칙을 변경할 때 관련 테스트를 바로 찾을 수 있다.
- production 코드와 테스트의 대응 관계가 명확하다.
- Node test runner는 `.test.js`만 실행하며 Vite production bundle에는 포함하지 않는다.
- 현재처럼 테스트 대상이 순수 함수 중심인 규모에서 별도 테스트 계층을 만들 필요가 없다.

컴포넌트 상호작용 테스트가 늘어나 여러 fixture와 mock server를 공유하게 되면 별도 테스트 지원 폴더를 다시 검토한다.

### 9. H2 파일 잠금으로 통합 서버를 추가 실행하지 못한 문제

#### 현상

8단계에서 백엔드와 React 개발 서버를 함께 실행해 proxy를 확인하려고 `./gradlew bootRun`을 실행했지만 다음 오류가 발생했다.

```text
Database may be already in use: w6.mv.db
```

#### 원인 확인

H2 파일과 8080 포트를 확인한 결과 기존 Java 프로세스가 이미 두 자원을 사용하고 있었다.

```text
java PID 67558 → TCP 8080 LISTEN
java PID 67558 → data/w6.mv.db 사용
```

#### 검토한 선택지

- 기존 Java 프로세스를 종료하고 새 서버를 실행한다.
- H2 lock 파일이나 DB 파일을 삭제한다.
- 이미 실행 중인 서버가 정상인지 읽기 전용 요청으로 확인해 그대로 사용한다.

#### 결정

실행 중인 프로세스와 데이터는 사용자 작업일 수 있으므로 종료하거나 삭제하지 않았다. 기존 8080 서버에 `GET /posts`를 요청해 상태를 확인한 뒤 해당 서버를 React proxy 검증에 사용했다.

#### 결과

기존 백엔드는 `post_list_success`와 게시글 3건을 정상 반환했고 React 개발 서버의 `/api/posts`도 같은 응답을 전달했다. 자원 점유 오류를 애플리케이션 장애로 단정하지 않고 현재 실행 상태를 먼저 확인했다.

### 10. curl과 Headless Chrome을 구분해 사용한 이유

#### curl로 확인할 수 있는 범위

`curl`로 React route를 요청하면 개발 서버가 SPA 진입점인 `index.html`을 반환하는지 확인할 수 있다. `/api/posts` 요청으로 Vite proxy와 백엔드 연결도 확인할 수 있다.

하지만 `curl`은 React JavaScript를 실행하지 않으므로 다음 항목은 검증할 수 없다.

- React component가 실제로 렌더링되는지
- API 응답이 카드 DOM으로 변환되는지
- ProtectedRoute가 이동시키는지
- `document.title`이 route에 맞게 바뀌는지

#### Headless Chrome으로 확인한 범위

Headless Chrome은 브라우저 창을 띄우지 않지만 일반 Chrome과 같은 엔진으로 HTML·CSS를 불러오고 JavaScript를 실행한다.

- 실제 백엔드 게시글 3건이 `PostCard`로 렌더링되는지 확인
- 날짜가 `2026-07-28 19:19:01` 형식으로 표시되는지 확인
- 제목이 `게시글 목록 | 열렸나요`로 변경되는지 확인
- production build에서 토큰 없이 `/profile/edit`에 접근하면 로그인 화면으로 이동하는지 확인

#### 한계

Headless Chrome의 DOM 확인만으로는 시각적 동등성과 모든 사용자 흐름을 보장할 수 없다. 다음 항목은 일반 브라우저에서 사람이 확인해야 한다.

- 데스크톱·모바일 레이아웃과 기존 화면 비교
- ProfileMenu, ConfirmDialog와 Toast 애니메이션
- 인증 계정으로 게시글·댓글 CRUD 전체 실행
- 작성자·타인 계정에 따른 권한 UI
- 회원정보·비밀번호 수정과 탈퇴

자동 검증은 “실행 가능한가”와 “핵심 데이터가 렌더링되는가”를 확인하고, 수동 검증은 “기존 사용자 경험과 같은가”를 확인하는 역할로 나눴다.

### 11. AuthRequiredPage와 브라우저 제목 누락

#### 현상

전체 route를 검색했을 때 `AuthRequiredPage`만 1단계의 `RoutePlaceholder`를 계속 사용하고 있었다. 또한 React 앱의 모든 route가 `index.html`의 `<title>열렸나요</title>`를 공유하고 있어 기존 HTML의 페이지별 제목이 사라졌다.

#### 결정

`auth-required.html`의 아이콘, 안내 문구와 링크를 JSX로 옮기고 placeholder 파일을 제거했다. 페이지 제목은 Page마다 effect를 반복하지 않고 route `handle.title`에 선언했다. `AppLayout`이 현재 route의 title을 읽어 `document.title`을 갱신한다.

```text
/login            → 로그인 | 열렸나요
/posts            → 게시글 목록 | 열렸나요
/posts/:postId    → 게시글 상세 | 열렸나요
/profile/edit     → 회원 정보 수정 | 열렸나요
```

#### 결과

새 기능을 추가하지 않고 마이그레이션 과정에서 빠진 기존 정적 화면과 문서 제목을 복원했다. 전체 route에서 placeholder와 `연결 완료` 문구가 더 이상 남아 있지 않음을 검색으로 확인했다.

---

## 검증 결과 요약

| 검증 계층 | 수행 내용 | 결과 |
|---|---|---|
| 순수 함수 | 인증·게시글·비밀번호 검증, 날짜 포맷 | Node 테스트 10개 통과 |
| 프런트 build | Vite production build | 성공 |
| 백엔드 회귀 | Service·Controller·Repository·context 테스트 | 50개 통과 |
| 정적 검사 | placeholder, 기존 정적 경로, TODO/FIXME, diff 형식 | 누락 없음 |
| API 연결 | 기존 백엔드 `GET /posts`, Vite `/api/posts` proxy | 정상 응답 |
| 브라우저 실행 | Headless Chrome 게시글 목록 렌더링 | 게시글 3건·날짜·제목 확인 |
| 보호 route | production build의 비로그인 `/profile/edit` 직접 접근 | `/login` 화면 이동 확인 |

## 현재 남은 확인 항목

마이그레이션 구현은 완료했지만 배포 진입점을 교체하기 전 다음 수동 검증이 필요하다.

1. 로그인 성공·실패와 회원가입 중복 오류
2. 게시글 작성·상세·수정·삭제 전체 흐름
3. 댓글 작성·수정·삭제와 `total_count` 갱신
4. 작성자와 타인 계정의 게시글·댓글 권한 UI
5. 회원정보 수정 성공·실패 Toast와 변경 없음 alert
6. 비밀번호 변경 성공·실패와 회원 탈퇴
7. ProfileMenu, 삭제 모달, Toast 애니메이션
8. 600px 이하 모바일 레이아웃과 주요 ARIA 속성
9. 운영 서버의 SPA fallback과 `/api` reverse proxy

위 항목을 통과한 뒤 React 진입점으로 전환하고, 안정화 기간 동안 기존 정적 앱과 이전 배포 산출물을 rollback 용도로 유지한다.
