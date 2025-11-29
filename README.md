# Safety Management Studio (프로토타입)

이 프로젝트는 **Vite (React)**, **Firebase**, 그리고 **Simulated AI**로 구축된 **안전 관리 시스템(Safety Management System)** 프로토타입입니다. 산업 현장이나 건설 현장의 안전 업무 흐름을 효율화하기 위해 역할 기반 대시보드, 디지털 체크리스트, AI 기반 위험 분석 기능을 제공합니다.

## 📋 프로젝트 개요

이 애플리케이션은 세 가지 주요 사용자 역할과 각각의 전용 워크플로우를 제공합니다:

1.  **작업자 (Worker)**:
    *   안전 체크리스트 제출 (예: 일일 점검, 기계 장비 점검).
    *   사진과 설명을 통해 위험 요소 보고.
    *   제출한 체크리스트의 상태 확인.
2.  **관리감독자 (Supervisor)**:
    *   작업자가 제출한 체크리스트 검토.
    *   안전 기준에 따라 체크리스트 승인 또는 반려.
    *   대시보드를 통해 팀 활동 모니터링.
3.  **안전관리자 (Safety Manager)**:
    *   안전 준수 현황에 대한 고수준 개요 확인.
    *   위험 추세 및 통계 분석.
    *   시스템 전반의 설정 관리 (암시적 기능).

### 주요 기능
*   **역할 기반 인증**: 시연 및 테스트를 위해 사용자 역할을 자유롭게 전환할 수 있습니다.
*   **디지털 체크리스트**: 다양한 작업 유형에 맞는 동적 양식과 유효성 검사 기능을 제공합니다.
*   **AI 위험 분석**: 안전 데이터와 잠재적 위험을 분석하는 시뮬레이션된 AI 기능을 제공합니다 (프로토타입용 클라이언트 사이드 모의 기능).
*   **실시간 업데이트**: Firebase Firestore를 기반으로 하며 수동 새로고침 기능도 지원합니다.
*   **현대적인 UI**: Tailwind CSS와 Radix UI 컴포넌트로 구축되어 일관되고 반응형인 디자인을 제공합니다.

## 📚 문서

이 프로젝트에 대한 상세 문서는 `docs/` 디렉토리에서 확인할 수 있습니다:

*   [**사용자 워크플로우**](./docs/USER_WORKFLOW.md): 핵심 사용자 시나리오(작업자, 감독자, 관리자)에 대한 단계별 가이드.
*   [**컴포넌트 아키텍처**](./docs/COMPONENT_ARCHITECTURE.md): 시스템 구조, 컴포넌트 트리, 아키텍처 결정 사항.
*   [**코드 품질 평가**](./CODE_QUALITY_ASSESSMENT.md): 코드베이스의 가독성, 재사용성, 유지보수성 분석.


---

## 🚀 시작하기

로컬 개발 환경에서 프로젝트를 설정하고 실행하려면 다음 지침을 따르세요.

### 필수 조건

*   **Node.js**: 버전 18 이상 권장.
*   **npm** 또는 **yarn**: 패키지 매니저.
*   **Firebase 프로젝트**: (기존 설정을 사용하는 경우 선택 사항) Firestore가 활성화된 Firebase 프로젝트 접근 권한.

### 설치

1.  레포지토리 클론 (해당되는 경우):
    ```bash
    git clone <repository-url>
    cd studio
    ```

2.  의존성 설치:
    ```bash
    npm install
    ```

### 환경 설정

1.  **Firebase 설정**:
    *   Firebase 클라이언트 설정은 현재 `src/firebase/config.ts`에 위치해 있습니다.
    *   새로운 백엔드를 설정하는 경우 이 설정이 본인의 Firebase 프로젝트 자격 증명과 일치하는지 확인하세요.

2.  **AI 설정**:
    *   이 프로토타입은 클라이언트 사이드에서 시뮬레이션된 AI 흐름을 사용하므로, 데모 모드 작동을 위해 별도의 API 키가 반드시 필요하지는 않습니다.

### 데이터베이스 시딩 (초기 데이터)

Firestore에 초기 샘플 데이터(사용자, 체크리스트, 템플릿)를 채우려면 다음 명령어를 실행하세요:

```bash
npm run seed
```

이 스크립트(`scripts/seed.ts`)는 애플리케이션 테스트에 필요한 문서를 생성합니다.

---

## 🏃‍♂️ 애플리케이션 실행

### 웹 애플리케이션 시작

Vite 개발 서버를 실행합니다:

```bash
npm run dev
```

*   브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.
*   로그인 페이지에서 역할을 선택하여 로그인(시뮬레이션 인증)할 수 있습니다.

---

## 📂 프로젝트 구조

```
studio/
├── docs/               # 프로젝트 문서 (아키텍처, 워크플로우)
├── src/
│   ├── ai/             # AI 시뮬레이션 로직
│   ├── components/     # React 컴포넌트 (UI, 기능별)
│   ├── firebase/       # Firebase 설정 및 훅
│   ├── hooks/          # 커스텀 React 훅 (useChecklistQuery 등)
│   ├── lib/            # 유틸리티 함수, 타입, 상수
│   ├── pages/          # 페이지 컴포넌트 (라우트)
│   ├── providers/      # 컨텍스트 프로바이더 (Auth 등)
│   ├── App.tsx         # 메인 애플리케이션 컴포넌트 및 라우팅
│   ├── main.tsx        # 진입점 (Entry point)
│   └── scripts/        # 헬퍼 스크립트 (예: 데이터베이스 시딩)
├── public/             # 정적 자산 (Static assets)
└── ...설정 파일들
```

## 📄 라이선스

이 프로젝트는 프로토타입이며 데모 목적으로 제작되었습니다.
## 🛠 기술 스택

*   **프레임워크**: [Vite](https://vitejs.dev/) + [React](https://react.dev/)
*   **라우팅**: [React Router](https://reactrouter.com/)
*   **백엔드 / 데이터베이스**: [Firebase](https://firebase.google.com/) (Firestore, Auth)
*   **스타일링**: [Tailwind CSS](https://tailwindcss.com/)
*   **UI 컴포넌트**: [Radix UI](https://www.radix-ui.com/) / [shadcn/ui](https://ui.shadcn.com/)
*   **폼 관리**: React Hook Form + Zod
