# Agent AI — 영어학원 통합관리 OS

원본 `code_artifact (6).tsx`를 React + Vite 웹 프로젝트로 포장한 버전입니다. 기존 화면, 탭, 예시 데이터 및 동작 코드를 유지했습니다.

## 로컬 실행

Node.js 20 이상 설치 후:

```bash
npm install
npm run dev
```

## GitHub → Vercel

1. ZIP 압축을 풀고 **폴더 안의 파일 전체**를 GitHub 저장소 최상위에 업로드합니다. ZIP 파일 자체나 App.jsx 하나만 올리지 마세요.
2. Vercel → Add New → Project → GitHub 저장소 선택.
3. Framework Preset: `Vite`, Root Directory: `./`, Build Command: `npm run build`, Output Directory: `dist`.
4. Deploy → Visit.

## 데이터 저장 관련 중요 사항

원본은 특정 실행 환경의 전역 변수(`__firebase_config`, `__initial_auth_token`, `__app_id`)에 의존합니다. 이 배포용 버전에서는 `VITE_FIREBASE_*` 환경변수를 선택적으로 읽습니다. **설정이 없으면 데모 화면은 실행되지만 데이터는 새로고침 후 초기화**됩니다. 실제 운영용 저장은 Firebase Authentication/Firestore 설정과 보안 규칙을 별도로 구성해야 합니다. 로그인 없이 공개 배포하여 실제 학생/학부모 정보를 입력하지 마세요.

Firebase 연결용 선택적 변수는 `.env.example`을 참고하세요. Vite 클라이언트 환경변수는 브라우저에 노출될 수 있으므로 비밀 키나 서비스 계정 키를 넣으면 안 됩니다.

백업 메뉴가 내보내는 JSON 파일은 **암호화되지 않습니다**. 안전한 장소에 보관하세요.
