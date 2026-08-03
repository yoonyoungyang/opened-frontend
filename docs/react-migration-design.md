# 열렸나요 React Migration 설계 문서

바닐라 JavaScript, HTML, CSS로 작성된 게시판 서비스 **열렸나요**를 React로 마이그레이션하기 위한 설계 문서다. 기능이나 디자인을 새로 만드는 작업이 아니라, 현재 동작을 유지하면서 DOM 중심 구조를 컴포넌트와 상태 중심 구조로 전환하는 것이 목적이다.

## 1. 기존 프로젝트 분석

### 1-1. 프로젝트 구조

```text
opened-frontend/
├── vanilla-app/                    # 마이그레이션 전 정적 앱 보존본
│   ├── pages/
│   │   ├── login.html
│   │   ├── signup.html
│   │   ├── posts.html
│   │   ├── post-detail.html
│   │   ├── post-create.html
│   │   ├── post-edit.html
│   │   ├── profile-edit.html
│   │   ├── password-edit.html
│   │   └── auth-required.html
│   ├── js/
│   │   ├── apis/
│   │   │   └── api.js             # 인증 헤더와 인증 실패 처리
│   │   ├── components/
│   │   │   └── header.js          # 공통 Header 로드와 메뉴 동작
│   │   └── pages/
│   │       ├── login.js
│   │       ├── signup.js
│   │       ├── posts.js
│   │       ├── post-detail.js
│   │       ├── post-create.js
│   │       ├── post-edit.js
│   │       ├── profile-edit.js
│   │       └── password-edit.js
│   ├── components/
│   │   └── header.html            # 페이지가 fetch해서 사용하는 공통 Header
│   ├── css/
│   │   ├── base/                  # reset, 변수, 공통 스타일
│   │   ├── components/            # Header, 폼, 모달, 토스트
│   │   └── pages/                 # 페이지별 배치와 표현
│   └── assets/
│       └── default-profile.png
├── react-app/                      # 독립 실행·배포하는 React 앱
└── docs/                           # 설계와 마이그레이션 기록
```

### 1-2. 페이지 구성

| 페이지        | HTML / JavaScript                         | 주요 기능                                     |
| ------------- | ----------------------------------------- | --------------------------------------------- |
| 로그인        | `login.html` / `login.js`                 | 이메일·비밀번호 검증, 로그인, 토큰 저장       |
| 회원가입      | `signup.html` / `signup.js`               | 이메일·비밀번호·닉네임 검증, 중복 오류 표시   |
| 게시글 목록   | `posts.html` / `posts.js`                 | 목록 조회, 게시글 카드 생성, 상세·작성 이동   |
| 게시글 상세   | `post-detail.html` / `post-detail.js`     | 상세 조회, 작성자 권한 처리, 게시글·댓글 CRUD |
| 게시글 작성   | `post-create.html` / `post-create.js`     | 제목·내용 검증, 게시글 등록                   |
| 게시글 수정   | `post-edit.html` / `post-edit.js`         | 기존 값 조회, 변경 감지, 게시글 수정          |
| 회원정보 수정 | `profile-edit.html` / `profile-edit.js`   | 내 정보 조회, 닉네임 수정, 회원 탈퇴          |
| 비밀번호 수정 | `password-edit.html` / `password-edit.js` | 현재·새 비밀번호 검증과 변경                  |
| 인증 안내     | `auth-required.html`                      | 로그인과 목록 이동을 안내하는 정적 화면       |

### 1-3. 공통 구조

#### Header

- 모든 페이지가 같은 `header.html`을 사용한다.
- 로그인·회원가입 화면은 프로필 메뉴를 제거한다.
- 게시글 상세·작성·수정은 뒤로가기 버튼을 표시한다.
- 프로필 메뉴는 회원정보수정, 비밀번호수정, 로그아웃 링크를 제공한다.
- 로그아웃은 `access_token`을 삭제하고 로그인으로 이동한다.

#### 폼과 검증

- 이메일, 비밀번호, 닉네임 검증이 로그인·회원가입·비밀번호 화면에 분산되어 있다.
- helper 문구는 DOM의 `textContent`를 직접 변경한다.
- 필드별 유효 여부를 boolean 변수로 보관해 submit 버튼의 `disabled`를 변경한다.
- 게시글 작성·수정은 같은 CSS와 거의 같은 HTML을 사용하지만 JavaScript는 별도 파일이다.

#### 모달과 토스트

- 게시글 상세의 모달은 게시글 삭제와 댓글 삭제가 공유한다.
- 삭제 대상이 바뀔 때 제목, 설명과 confirm 동작을 바꾼다.
- 회원 탈퇴는 별도의 확인 모달을 사용한다.
- 회원정보와 비밀번호 수정은 같은 형태의 토스트를 각 페이지에서 직접 제어한다.

#### 인증과 API

- JWT는 `localStorage.access_token`에 저장한다.
- `authenticatedFetch`는 Bearer 헤더를 추가한다.
- 토큰이 없거나 응답이 401/403이면 토큰을 삭제하고 로그인으로 이동한다.
- API 응답은 `{ message, data, errors }` 구조다.
- 백엔드는 도메인 실패도 주로 HTTP 200으로 반환하므로 성공 `message` 확인이 필요하다.

### 1-4. 현재 데이터 흐름

```text
HTML 로드
→ 페이지 JavaScript 실행
→ DOM 탐색과 이벤트 등록
→ API 호출
→ response.message 확인
→ DOM 생성·수정
→ 필요하면 다른 HTML로 이동
```

게시글 목록은 응답을 순회하며 카드 DOM을 만들고, 상세 페이지는 미리 만들어진 요소에 응답 값을 채운다. 댓글은 게시글 상세와 별도로 조회하며 댓글 등록·수정·삭제가 끝날 때마다 목록을 다시 요청한다.

현재 화면 상태는 JavaScript 변수와 DOM에 나뉘어 있다. 예를 들어 댓글 수정 대상은 변수에, 입력 내용은 textarea에, 제출 가능 여부는 버튼의 `disabled` 속성에 저장된다. 동일한 화면 상태를 확인하려면 변수와 DOM을 함께 추적해야 한다.

### 1-5. 현재 구조의 한계와 전환 목표

| 현재 구조                                                                          | React 전환 방향                           |
| ---------------------------------------------------------------------------------- | ----------------------------------------- |
| 페이지마다 `querySelector`, `createElement`, `addEventListener`로 화면을 직접 제어 | JSX와 state로 화면을 선언적으로 표현      |
| API 호출, 응답 판단, DOM 갱신과 화면 이동이 한 함수에 혼재                         | API, Page, 표시 컴포넌트의 책임 분리      |
| 게시글 작성·수정처럼 유사한 화면의 검증과 이벤트 코드 반복                         | 동일한 입력 구조를 `PostForm`으로 공유    |
| Header를 페이지마다 fetch하고 `data-*`로 설정                                      | 공통 Layout에서 route에 맞게 렌더링       |
| 서버 데이터를 다시 가져오는 시점이 함수 호출 순서에 의존                           | 서버 상태 도구로 조회와 갱신 시점 관리    |
| 컴포넌트 단위 테스트가 어려움                                                      | 폼, 권한 UI와 반복 항목을 독립적으로 검증 |

이번 전환에서는 기존 URL과 API 요청·응답, 검증 규칙, 문구, CSS 클래스와 사용자 흐름을 우선 유지한다. 화면에만 존재하고 아직 동작하지 않는 영화 필터, 게시글 유형·상영 정보, 이미지 업로드, 좋아요 등은 React 전환 과정에서 새 기능으로 완성하지 않는다.

---

## 2. 예상 컴포넌트 구조

### 2-1. 컴포넌트 분리 기준

컴포넌트 수를 늘리는 것이 목적은 아니다. 다음 기준에 해당할 때만 파일을 분리한다.

1. **반복 렌더링되는 항목**: `PostList` / `PostCard`, `CommentList` / `CommentItem`
2. **독립적인 입력이나 UI 상태가 있는 영역**: `CommentForm`, `ProfileMenu`
3. **둘 이상의 화면에서 같은 역할로 사용하는 영역**: `PostForm`, `ConfirmDialog`, `Toast`
4. **독립적으로 검증할 가치가 있는 동작**: `ProtectedRoute`, 폼 검증

한 페이지에서 한 번만 사용하고 별도 상태도 없는 작은 제목, 통계, 버튼 묶음은 Page 또는 상위 컴포넌트 안에 유지한다.

### 2-2. 폴더 구조와 파일별 역할

기존 코드는 `vanilla-app/`에 보존하고 React 앱은 `react-app/`에서 독립적으로 운영한다. 두 앱이 CSS나 이미지를 공유하면 한쪽의 변경이 다른 쪽에 영향을 주므로, 공통 파일도 각 앱이 소유한다.

```text
react-app/
├── index.html
├── package.json
├── vite.config.js                    # 개발 서버, 백엔드 proxy, build 설정
└── src/
    ├── main.jsx                      # React root와 전역 CSS 진입점
    ├── app/
    │   ├── App.jsx                   # RouterProvider 렌더링
    │   ├── router.jsx                # URL, Layout, 보호 라우트 연결
    │   └── queryClient.js            # 서버 상태의 공통 기본 옵션
    │
    ├── layout/
    │   ├── AppLayout.jsx             # Header와 현재 Page(Outlet) 배치
    │   ├── Header.jsx                # 뒤로가기, 제목, 프로필 영역
    │   └── ProfileMenu.jsx           # 드롭다운 상태와 로그아웃
    │
    ├── routes/
    │   └── ProtectedRoute.jsx        # 토큰이 필요한 화면의 진입 제어
    │
    ├── pages/
    │   ├── LoginPage.jsx             # 로그인 성공 후 이동 조정
    │   ├── SignupPage.jsx            # 회원가입 성공 후 이동 조정
    │   ├── PostsPage.jsx             # 목록 조회와 작성 진입
    │   ├── PostDetailPage.jsx        # postId, 상세·댓글, 삭제 대상 조정
    │   ├── PostCreatePage.jsx         # 작성 요청과 성공 이동
    │   ├── PostEditPage.jsx           # 기존 값·소유권 확인과 수정 요청
    │   ├── ProfileEditPage.jsx        # 회원 조회·수정·탈퇴 흐름
    │   ├── PasswordEditPage.jsx       # 비밀번호 변경 흐름
    │   └── AuthRequiredPage.jsx       # 기존 인증 안내 화면
    │
    ├── features/
    │   ├── auth/
    │   │   ├── authApi.js             # 회원가입·로그인 요청
    │   │   ├── tokenStorage.js        # access_token 읽기·저장·삭제
    │   │   ├── authValidation.js      # 이메일·비밀번호·닉네임 검증
    │   │   ├── LoginForm.jsx          # 로그인 입력과 필드 오류
    │   │   └── SignupForm.jsx         # 회원가입 입력과 필드 오류
    │   │
    │   ├── posts/
    │   │   ├── postApi.js             # 게시글 조회·작성·수정·삭제
    │   │   ├── postQueries.js         # 게시글 조회와 변경 규칙
    │   │   ├── postValidation.js      # 제목·내용 검증
    │   │   ├── PostList.jsx           # 배열을 PostCard로 렌더링
    │   │   ├── PostCard.jsx           # 게시글 한 건 표시
    │   │   ├── PostDetail.jsx         # 본문·작성자·통계·권한 버튼 표시
    │   │   ├── PostForm.jsx           # 작성·수정 공통 입력과 변경 감지
    │   │   └── PostFilterView.jsx     # 현재 동작 없는 필터 UI 보존
    │   │
    │   ├── comments/
    │   │   ├── commentApi.js          # 댓글 조회·작성·수정·삭제
    │   │   ├── commentQueries.js      # 댓글 조회와 변경 규칙
    │   │   ├── CommentSection.jsx     # 수정 대상을 소유하고 폼·목록 연결
    │   │   ├── CommentForm.jsx        # 등록·수정 입력 상태
    │   │   ├── CommentList.jsx        # 댓글 배열 렌더링
    │   │   └── CommentItem.jsx        # 댓글 한 건과 작성자 버튼 표시
    │   │
    │   └── profile/
    │       ├── profileApi.js          # 내 정보·비밀번호·탈퇴 요청
    │       ├── profileQueries.js      # 회원정보 조회와 변경 규칙
    │       ├── ProfileEditForm.jsx    # 닉네임 입력과 변경 감지
    │       ├── PasswordEditForm.jsx   # 비밀번호 입력과 검증
    │       └── passwordValidation.js  # 비밀번호 관련 검증
    │
    ├── shared/
    │   ├── api/
    │   │   └── client.js              # base URL, JSON, 인증 헤더 공통 처리
    │   ├── components/
    │   │   ├── ConfirmDialog.jsx      # 삭제·탈퇴 확인 UI
    │   │   ├── Toast.jsx              # 수정 완료 알림 UI
    │   │   ├── FormField.jsx          # label·input·helper 조합
    │   │   └── ErrorState.jsx         # 조회 실패 영역
    │   └── utils/
    │       └── formatDate.js           # 현재 날짜 표시 형식 유지
    │
    ├── styles/                         # 기존 CSS 구조와 클래스명 유지
    │   ├── base/
    │   ├── components/
    │   └── pages/
    └── assets/
        └── default-profile.png
```

Page는 URL 파라미터, 데이터 요청, 성공 후 이동처럼 화면 흐름을 조정한다. `features`의 컴포넌트는 입력과 표현을 담당하고, API 파일은 HTTP 요청만 담당한다. 실제로 여러 기능에서 함께 사용하는 코드만 `shared`에 둔다.

작성과 수정은 `PostForm`을 공유하지만 API 요청까지 Form에 넣지는 않는다. Form은 제목·내용·검증·변경 여부를 처리하고, `PostCreatePage`와 `PostEditPage`가 서로 다른 요청과 이동을 담당한다. 댓글 수정 대상은 수정 버튼과 입력 폼의 공통 부모인 `CommentSection`이 소유한다.

별도 `AuthContext`와 전역 Modal Context는 1차 마이그레이션에서 두지 않는다. 현재 인증에서 여러 화면이 즉시 공유해야 하는 사용자 객체가 없고, 모달의 삭제 대상도 각 Page에만 필요하기 때문이다. 토큰은 `tokenStorage`, 서버 데이터는 Query, 모달은 Page 로컬 state로 관리하는 편이 현재 규모에 맞다.

### 2-3. 라우팅

| 경로                  | Page               | 인증 필요 |
| --------------------- | ------------------ | --------: |
| `/`                   | `/posts`로 이동    |         X |
| `/login`              | `LoginPage`        |         X |
| `/signup`             | `SignupPage`       |         X |
| `/posts`              | `PostsPage`        |         X |
| `/posts/:postId`      | `PostDetailPage`   |         O |
| `/posts/new`          | `PostCreatePage`   |         O |
| `/posts/:postId/edit` | `PostEditPage`     |         O |
| `/profile/edit`       | `ProfileEditPage`  |         O |
| `/profile/password`   | `PasswordEditPage` |         O |
| `/auth-required`      | `AuthRequiredPage` |         X |

기존 `?postId=` query string은 React Router의 `/posts/:postId`로 바꾼다. Header의 `data-*` 설정은 route metadata로 옮겨 Page마다 Header 조건을 반복하지 않는다.

### 2-4. 기술 선택

| 대상      | 검토한 선택지                             | 결정           | 선택 근거와 결론                                                                                                                                  |
| --------- | ----------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 빌드 도구 | Vite / Next.js                            | Vite           | 백엔드는 Spring Boot가 담당하고 SSR 요구가 없다. SPA 마이그레이션에 필요한 개발 서버와 build만 제공하는 Vite가 적합하다.                          |
| 언어      | JavaScript / TypeScript                   | JavaScript     | React와 TypeScript를 동시에 도입하면 오류 원인을 구분하기 어렵다. 이번에는 구조 전환에 집중하고 타입 도입은 안정화 이후 판단한다.                 |
| 라우팅    | 직접 History API 처리 / React Router      | React Router   | 동적 postId, 중첩 Layout, 보호 화면을 직접 구현하는 것보다 라우팅 책임을 명확하게 표현할 수 있다.                                                 |
| 서버 상태 | `useEffect` + `useState` / TanStack Query | TanStack Query | 댓글 변경 후 재조회, 게시글 수정 후 목록·상세 갱신처럼 서버 데이터 동기화가 반복된다. 이를 Page의 호출 순서가 아니라 조회·변경 규칙으로 관리한다. |
| 폼        | React Hook Form / `useState`              | `useState`     | 현재 폼 규모가 작고 기존 검증 시점과 문구 보존이 우선이다. 필드가 늘어날 때 React Hook Form을 다시 검토한다.                                      |
| 전역 상태 | Context·Redux·Zustand / 미도입            | 미도입         | 서버 상태, URL 상태와 Page 로컬 상태로 모두 분류할 수 있다. 현재 없는 전역 상태를 미리 만들지 않는다.                                             |
| HTTP      | Axios / fetch wrapper                     | fetch wrapper  | 현재 `fetch` 기반 코드와 응답 구조를 유지할 수 있고, Axios를 추가해 얻는 이점이 크지 않다.                                                        |
| 스타일    | CSS Modules·Tailwind / 기존 CSS           | 기존 CSS       | 구조와 디자인을 동시에 바꾸지 않는다. 기존 클래스명을 JSX에 그대로 적용해 화면 차이를 줄인다.                                                     |

---

## 3. 상태와 데이터 흐름

### 3-1. 상태 분류

| 상태 종류 | 예시                                           | 관리 위치                       |
| --------- | ---------------------------------------------- | ------------------------------- |
| 서버 상태 | 게시글 목록·상세, 댓글, 회원정보               | TanStack Query                  |
| 폼 상태   | 이메일, 비밀번호, 제목, 댓글 내용              | 해당 Form의 `useState`          |
| 화면 상태 | 프로필 메뉴, 삭제 대상, 토스트, 댓글 수정 대상 | 사용하는 컴포넌트 또는 Page     |
| 인증 정보 | `access_token`                                 | `localStorage` + `tokenStorage` |
| URL 상태  | 현재 화면, `postId`                            | React Router                    |

상태는 가장 가까운 사용 범위에 둔다. 여러 화면이 사용할 가능성만으로 전역 상태로 올리지 않고, 실제로 공유가 필요할 때만 공통 부모나 Context 도입을 검토한다.

### 3-2. 데이터 흐름

```text
사용자 입력
→ Form 또는 Item의 이벤트
→ Page가 요청 실행
→ feature API
→ 공통 client
→ Spring Boot
→ 응답 확인
→ 서버 상태 갱신 또는 화면 이동
```

- 부모에서 자식으로 데이터는 props로 전달한다.
- 자식의 수정·삭제 같은 행동은 callback으로 상위 컴포넌트에 전달한다.
- 컴포넌트는 endpoint 문자열이나 인증 헤더를 직접 다루지 않는다.
- 변경 요청이 성공하면 영향을 받은 서버 데이터를 다시 조회한다.
- 백엔드의 URL, request body, `{ message, data, errors }` 응답과 성공 `message`는 변경하지 않는다.

### 3-3. 주요 상태 소유권

#### 게시글 작성과 수정

```text
PostCreatePage ─┐
                ├─ PostForm(title, content, validation, changed)
PostEditPage ───┘
```

입력과 검증은 `PostForm`이 소유한다. 작성·수정 요청 선택, 수정 화면의 초기 데이터와 소유권 확인, 성공 후 이동은 각 Page가 담당한다.

#### 댓글 수정

```text
CommentSection (editingComment)
├── CommentForm ← 수정할 내용 전달
└── CommentList
    └── CommentItem → 수정 클릭을 부모에 전달
```

수정 버튼은 `CommentItem`에 있고 실제 입력은 `CommentForm`에서 이루어진다. 두 컴포넌트가 함께 사용하는 `editingComment`만 공통 부모인 `CommentSection`으로 끌어올린다. textarea의 입력 중 값은 `CommentForm`에 그대로 둔다.

#### 삭제 확인

```text
Page (삭제 대상과 실행 함수)
└── ConfirmDialog (표시와 confirm/cancel 이벤트)
```

`ConfirmDialog`는 삭제 대상을 알지 않는 표시 컴포넌트다. 어떤 게시글 또는 댓글을 삭제할지는 해당 Page가 소유한다. 모달이 앱 전역에서 호출되는 구조가 아니므로 전역 Context를 만들지 않는다.

---

## 4. 단계별 마이그레이션 순서

기존 HTML과 JavaScript는 React 앱 검증이 끝날 때까지 유지한다. `react-app/`에서 화면을 하나씩 완성하고 기존 화면과 비교한 뒤 최종 진입점을 교체한다.

| 단계 | 작업                                              | 완료 기준                                    | AI 활용                                   |
| ---- | ------------------------------------------------- | -------------------------------------------- | ----------------------------------------- |
| 0    | 현재 동작과 백엔드 테스트 결과를 기준선으로 기록  | 핵심 사용자 흐름과 기존 오류 구분            | 코드 분석과 체크리스트 초안               |
| 1    | Vite, Router, QueryClient, 기존 CSS 구성          | 모든 목표 URL 렌더링, production build 성공  | 설정과 폴더 초안 작성                     |
| 2    | 공통 client, tokenStorage, ProtectedRoute, Layout | Header, 토큰, 로그아웃과 보호 화면 동작 일치 | 기존 공통 JavaScript 포팅 초안            |
| 3    | 로그인·회원가입                                   | 검증 문구, 버튼 상태, 요청과 이동 일치       | 정규식과 이벤트 로직을 React state로 변환 |
| 4    | 게시글 목록·상세 조회                             | 카드 필드, 날짜, 오류 화면, 작성자 UI 일치   | DOM 생성 코드를 JSX로 변환                |
| 5    | 게시글 작성·수정·삭제                             | 제한, 변경 감지, 확인 모달과 이동 일치       | 작성·수정 코드 차이 분석과 PostForm 초안  |
| 6    | 댓글 조회·작성·수정·삭제                          | 수정 모드, 작성자 버튼, 총 댓글 수 일치      | 댓글 상태 소유권과 컴포넌트 초안          |
| 7    | 회원정보·비밀번호·탈퇴                            | 초기값, 검증, 토스트와 토큰 삭제 일치        | 폼 로직 변환과 테스트 케이스 초안         |
| 8    | 전체 연결과 전환                                  | 핵심 흐름 회귀 없음, 이전 앱으로 복귀 가능   | 변경 diff와 누락 동작 점검                |

진행 순서는 공통 기반 → 조회 → 변경 순서다. 먼저 API와 인증 처리 방식을 고정하고 조회 화면에서 데이터 형태를 확인한 뒤 작성·수정·삭제를 연결한다. 각 단계가 실제로 동작하는 상태에서 다음 단계로 넘어간다.

최종 전환 전에는 로그인, 게시글 CRUD, 댓글 CRUD, 작성자 권한, 회원정보·비밀번호 수정과 탈퇴를 브라우저에서 확인한다. React route를 직접 열어도 동작하도록 배포 서버의 SPA fallback을 설정하고, 안정화 전까지 기존 정적 파일과 이전 배포 산출물을 보존한다.

---

## 5. AI 협업 프로세스 (Human-in-the-Loop)

이번 마이그레이션에서 AI는 기존 코드를 분석하고 변환 초안을 작성하는 도구로 사용한다. 컴포넌트 경계, 상태 위치, 기존 동작과의 차이, 최종 채택 여부는 직접 검토한다.

1. **기존 코드 분석**: 대상 HTML, JavaScript, CSS와 연결된 백엔드 API를 함께 확인한다.
2. **구조와 코드 제안**: AI가 컴포넌트 분리, 상태 소유권과 변환 코드 초안을 제시한다.
3. **사람 검토**: 기존 동작과 같은지, 과도하게 분리되지 않았는지, API 계약에 없는 동작이 추가되지 않았는지 확인한다.
4. **구현과 검증**: 승인한 범위만 적용하고 기존 화면과 React 화면을 같은 조건에서 비교한다.
5. **수정 또는 채택**: 문제가 있으면 구조를 다시 조정하고, 검증을 통과한 변경만 다음 단계의 기준으로 삼는다.

이 설계 과정에서도 AI가 처음 제안한 `AuthContext`와 전역 Modal Context를 그대로 채택하지 않았다. 실제 코드를 확인한 결과 여러 화면이 공유해야 할 사용자 객체가 없고, 삭제 대상도 각 Page 안에서만 사용됐다. 따라서 토큰 저장소와 Page 로컬 state로 범위를 줄였다. AI 제안을 현재 코드의 사용 범위와 대조해 수정한 사례다.

### 5-1. 기록 방법

4장의 각 단계가 끝날 때 다음 내용을 짧게 기록한다.

| 항목      | 기록 내용                                 |
| --------- | ----------------------------------------- |
| 작업 범위 | 마이그레이션한 화면·컴포넌트·기능         |
| AI 제안   | 처음 제시된 구조나 코드의 핵심            |
| 검토 내용 | 기존 동작, 상태 위치, 네이밍, 과설계 여부 |
| 채택 결과 | 채택·수정·폐기한 내용과 이유              |
| 검증 결과 | 실행한 테스트와 브라우저 확인 결과        |

```md
### 게시글 상세 마이그레이션

- 작업 범위: 상세 조회, 작성자 버튼, 댓글 연결
- AI 제안: 타인 게시글의 수정·삭제 버튼을 조건부 렌더링으로 제거
- 검토 내용: 기존 화면은 버튼을 숨기지 않고 비활성화함
- 채택 결과: 버튼을 유지하고 `disabled`만 적용
- 검증 결과: 작성자와 타인 응답을 각각 사용해 화면 비교
```

마이그레이션 완료 후에는 설계와 실제 구현이 달라진 지점, AI 제안의 채택·수정·폐기 사례, 기존 동작을 보존하기 위해 해결한 문제와 테스트 결과를 회고 문서로 정리한다. 성과 수치와 개선 효과는 미리 작성하지 않고 실제로 확인한 결과만 기록한다.
