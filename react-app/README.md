# 열렸나요 React App

기존 HTML·JavaScript 화면을 대체하기 위해 별도로 구축한 React 애플리케이션이다. 기존 정적 앱은 저장소의 `vanilla-app/`에 보존하며, 이 앱은 해당 디렉터리의 CSS나 이미지에 의존하지 않고 독립적으로 실행된다.

## 실행

Node.js 20.19 이상이 필요하다.

```bash
npm install
npm run dev
```

개발 서버는 `/api` 요청을 `http://localhost:8080`으로 전달한다. 다른 API 주소가 필요하면 `VITE_API_BASE_URL`을 설정한다.

## 검증

```bash
npm test
npm run build
```

## 배포 조건

- React production build 결과는 `dist/`에 생성된다.
- `/posts/1`, `/profile/edit`처럼 React route로 직접 접근해도 `index.html`을 반환하도록 SPA fallback을 설정한다.
- 브라우저의 `/api/*` 요청을 Spring Boot로 전달하는 reverse proxy를 설정하거나 `VITE_API_BASE_URL`에 실제 API 주소를 지정한다.
- React 앱 안정화 전에는 기존 정적 파일과 이전 배포 산출물을 제거하지 않는다.
