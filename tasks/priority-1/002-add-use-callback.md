## 📅 일정

- **시작일**: 2025-11-30
- **종료일**: 2025-12-01
- **예상 소요 시간**: 1일

# Task: useCallback을 이벤트 핸들러에 적용

## 📅 Status
- [ ] Todo
- [ ] In Progress
- [ ] Done

## 📝 Description
컴포넌트 리렌더링 시 함수가 새로 생성되는 것을 방지하기 위해 `useCallback`을 이벤트 핸들러에 적용합니다.
특히 자식 컴포넌트에 props로 전달되는 함수들에 우선 적용합니다.

## ✅ Acceptance Criteria (완료 조건)
- [ ] `ChecklistForm`의 `handleSubmit`, `handleImageUpload` 등에 `useCallback` 적용
- [ ] `WorkerDashboard`, `SupervisorDashboard` 등의 새로고침 핸들러에 `useCallback` 적용 여부 확인 (이미 적용되어 있을 수 있음)
- [ ] 커스텀 훅 내부의 반환 함수들에 `useCallback` 적용 확인

## 🔗 References
- 관련 이슈: #
- 관련 문서: 

## 🛠 Implementation Plan
1. `src/components/checklist/checklist-form.tsx` 리팩토링
2. `src/hooks/use-checklist-query.ts` 리팩토링
3. 대시보드 컴포넌트 점검

## 📝 Notes
- 의존성 배열(dependency array)을 정확하게 관리해야 함.
