## 📅 일정

- **시작일**: 2025-12-01
- **종료일**: 2025-12-02
- **예상 소요 시간**: 1일

# Task: useMemo를 계산 비용이 높은 값에 적용

## 📅 Status
- [ ] Todo
- [ ] In Progress
- [ ] Done

## 📝 Description
렌더링 시마다 반복되는 무거운 계산 로직이나 객체/배열 생성 로직을 `useMemo`로 최적화합니다.
필터링, 정렬, 복잡한 데이터 가공 로직이 대상입니다.

## ✅ Acceptance Criteria (완료 조건)
- [ ] `ChecklistList`에서 데이터 필터링/정렬 로직이 있다면 `useMemo` 적용
- [ ] `Dashboard`에서 통계 데이터 계산 로직이 추가된다면 `useMemo` 적용
- [ ] `useChecklistQuery` 훅 내부의 쿼리 생성 로직 확인 (이미 `useMemoFirebase` 사용 중인지 체크)

## 🔗 References
- 관련 이슈: #
- 관련 문서: 

## 🛠 Implementation Plan
1. `src/components/checklist/checklist-list.tsx` 정렬/필터링 로직 검토
2. `src/hooks/use-checklist-query.ts` 쿼리 객체 생성 최적화 검토

## 📝 Notes
- 섣부른 최적화는 지양. 실제로 비용이 발생하는 부분 위주로 적용.
