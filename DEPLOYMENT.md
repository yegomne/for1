# 🚀 for1 배포 및 환경 변경 이력 (Deployment & Environment Notes)

> 💡 **GPT / LLM 안내**: 이 문서는 해당 프로젝트가 최초 생성된 후, 개인 GitHub 및 Vercel로 이관·배포되는 과정에서 변경된 사항을 AI 에이전트가 쉽게 파악할 수 있도록 기록한 인프라 및 설정 명세서입니다.

---

## 1. 📌 프로젝트 개요 및 배포 메타데이터
- **프로젝트명**: `for1` (구 `ai-builder-academy`)
- **서비스 성격**: 90일 인터랙티브 AI 개발 교육 및 브라우저 기반 실습 프로그램 (BUILD / 90)
- **GitHub 저장소**: [https://github.com/yegomne/for1](https://github.com/yegomne/for1)
- **Vercel 운영 URL**: [https://for1-snowy.vercel.app](https://for1-snowy.vercel.app)
- **Vercel 소유자/팀 스코프**: `yegomnes-projects` (개인 계정)
- **배포 일시**: 2026-09-30

---

## 2. 🔄 배포 시 변경된 세부 사항 (Changelog)

### ① `package.json` 프로젝트 식별자 변경
- **변경 전**: `"name": "ai-builder-academy"`
- **변경 후**: `"name": "for1"`
- **사유**: 대표님의 신규 프로젝트 지정 명칭(`for1`)에 맞춰 패키지 메타데이터 일치화.

### ② `.gitignore` 보안 및 클린 빌드 규칙 보강
기존 `.gitignore`에는 빌드 디렉토리와 환경변수 설정이 누락되어 있어 아래 항목들을 추가했습니다.
```gitignore
# 추가된 항목
dist/
.vercel/
.env*
```

### ③ `dist/` 빌드 산출물 Git 추적 해제 (Clean CI/CD 구축)
- 기존 저장소에는 로컬 빌드 결과물인 `dist/` 하위 파일(번들 JS, CSS, wasm 등)이 Git에 커밋되어 있었습니다.
- `git rm -r --cached dist` 명령으로 Git 인덱스에서 제거하여, Vercel CI/CD 환경에서 매 커밋마다 깨끗하게 `npm run build`를 수행하도록 웹 표준 파이프라인으로 전환했습니다.

### ④ 문서 및 미리보기 에셋 추가
- **[README.md](./README.md)**: 프로젝트 개요, 주요 특징(SQL.js, Three.js, GSAP, 무과금 로컬 환경), 로컬 구동 및 빌드 명령어 추가.
- **`교육페이지-미리보기.jpg`**: 상위 폴더에 있던 미리보기 캡처 이미지를 프로젝트 루트로 복사하여 GitHub 및 README에서 열람 가능하도록 추가.

### ⑤ Git 원격 저장소(Remote) 이관
- **기존 Remote (origin)**: `https://git.chatgpt-team.site/89bcb8ae-5580-48de-9b08-e3c7837fcf24/appgprj_6abcbcedce78819183ded62e7516398b.git` (임시 호스팅용)
- **신규 Remote (origin)**: `https://github.com/yegomne/for1.git`
- `main` 브랜치로 전체 소스코드 및 커밋 히스토리를 푸시 완료.

### ⑥ Vercel 배포 및 CI/CD 자동화 연동
- Vercel CLI를 통해 대표님의 개인 팀 스코프(`yegomnes-projects`)에 `for1` 프로젝트를 생성 및 링크.
- GitHub `yegomne/for1` 리포지토리와 연동하여 향후 Git Push 시 Vercel에서 자동 무중단 배포가 트리거되도록 설정.

---

## 3. 🛠️ 기술 스택 및 빌드 스펙 (참고용)
- **빌드 툴**: Vite 7.x
- **프레임워크**: React 19
- **핵심 라이브러리**:
  - `sql.js`: 브라우저 내부에서 작동하는 WASM 기반 SQLite 엔진 (`sql-wasm.wasm`)
  - `three`: 3D 그래픽 렌더링
  - `gsap`: 인터랙티브 애니메이션 효과
  - `lucide-react`: UI 아이콘
- **빌드 명령어**: `npm run build` (`vite build`)
- **출력 디렉토리**: `dist`
- **배포 방식**: Static SPA (Single Page Application)
- **외부 종속성**: 외부 백엔드 API나 키 없이 브라우저 로컬스토리지 기반으로 동작하여 서버 비용 0원.

---

## 4. 🧭 향후 작업 시 주의사항 (For AI / Developers)
1. **GitHub Push 시 주의**:
   - `dist/` 폴더를 직접 Git에 commit하지 마십시오. Vercel이 자동으로 빌드합니다.
   - 환경변수가 필요할 경우 `.env.local`에 작성하고 Vercel 대시보드 Environment Variables에 등록하십시오.
2. **SQLite WASM 파일 위치**:
   - `sql.js` 구동에 필요한 `sql-wasm.wasm` 파일은 Vite 빌드 시 `dist/assets/`에 자동으로 복사되어 정상 로드됩니다.
