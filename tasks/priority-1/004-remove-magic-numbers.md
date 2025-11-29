## 📅 일정

- **시작일**: 2025-12-02
- **종료일**: 2025-12-03
- **예상 소요 시간**: 1일

# Task: 매직 넘버를 상수로 추출

## 📅 Status
- [ ] Todo
- [ ] In Progress
- [ ] Done

## 📝 Description
코드 내에 하드코딩된 숫자나 문자열(매직 넘버/스트링)을 의미 있는 상수로 추출하여 가독성과 유지보수성을 높입니다.
API 타임아웃, 리스크 레벨 문자열, 상태 코드 등이 대상입니다.

## ✅ Acceptance Criteria (완료 조건)
- [ ] 리스크 레벨 ('Safe', 'Warning', 'Danger') 상수로 정의
- [ ] 체크리스트 상태 ('submitted', 'approved' 등) 상수로 정의
- [ ] 타임아웃 시간 (예: 2000ms) 상수로 정의
- [ ] `src/lib/constants.ts` 파일 생성 및 상수 중앙 관리

## 🔗 References
- 관련 이슈: #
- 관련 문서: 

## 🛠 Implementation Plan
1. `src/lib/constants.ts` 파일 생성
2. `src/ai/flows/simulate-ai-analysis.ts`의 타임아웃, 리스크 레벨 추출
3. `src/components/shared/status-badge.tsx`의 상태값 추출
4. 기타 컴포넌트의 하드코딩된 값 교체

## 📝 Notes
- 상수는 대문자 스네이크 케이스(UPPER_SNAKE_CASE) 사용.
