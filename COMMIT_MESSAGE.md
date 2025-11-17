feat: 메모/투두/타이머/메뉴 페이지 및 하단 GNB, 요약 대시보드 구현

## 주요 기능 추가

### 📝 메모 페이지

-   메모 리스트 페이지 (목록 보기)
-   메모 상세 페이지 (읽기/수정)
-   새 메모 작성 페이지
-   메모 추가/수정/삭제 기능
-   실시간 메모 목록 업데이트

### ✅ 투두 페이지

-   투두 리스트 페이지 (목록 보기)
-   투두 상세 페이지 (읽기/수정)
-   새 투두 작성 페이지
-   투두 추가/수정/삭제/완료 토글 기능
-   우선순위 설정 (high/medium/low)
-   완료된 항목 필터링

### ⏰ 타이머 페이지

-   타이머 생성 및 관리 기능
-   타이머 추가/삭제 기능
-   타이머 히스토리 표시

### 🍽️ 메뉴 추천 페이지

-   메뉴 추가/삭제 기능 구현
-   태그 기반 필터링 및 랜덤 추천 기능
-   모달 형태의 메뉴 에디터 (ESC 키 지원, 자동 포커스)
-   중복 메뉴 이름 검증
-   최근 추천 기록 표시

### 📱 하단 GNB (Global Navigation Bar)

-   모든 페이지 하단에 고정 표시
-   홈 버튼: 홈 페이지로 이동
-   요약 버튼: 요약 대시보드 페이지로 이동
-   현재 페이지에 따른 활성 상태 표시

### 📊 요약 대시보드 페이지

-   각 기능별 통계 카드 그리드 (메모, 투두, 타이머, 계산기, 메뉴추천)
-   투두 상태 요약 (완료/미완료/전체)
-   최근 메모 목록 (최근 3개)
-   최근 계산 기록 (최근 5개)
-   최근 추천 메뉴 (최근 3개)
-   각 섹션에서 상세 페이지로 이동 가능한 링크

## 개선 사항

### Export 구조 정리

-   `shared/ui/index.ts`에 누락된 컴포넌트 export 추가
    -   Card, Button, Input, Badge, IconButton, Divider, UIShowcase
-   `widgets/home/index.ts`에 HomeSummaryWidget export 추가
-   모든 features와 entities의 index.ts export 정리

### 코드 품질

-   FSD 아키텍처 준수
-   TypeScript 타입 안전성 유지
-   린터 오류 없음

## 파일 구조

### 새로 추가된 페이지

-   `app/memo/` - 메모 페이지 라우트 (리스트, 상세, 새로 작성)
-   `app/todo/` - 투두 페이지 라우트 (리스트, 상세, 새로 작성)
-   `app/timer/` - 타이머 페이지 라우트
-   `app/menu/` - 메뉴 추천 페이지 라우트
-   `app/summary/` - 요약 대시보드 페이지 라우트
-   `src/02-pages/memo/` - 메모 페이지 컴포넌트 (리스트, 상세, 새로 작성)
-   `src/02-pages/todo/` - 투두 페이지 컴포넌트 (리스트, 상세, 새로 작성)
-   `src/02-pages/timer/` - 타이머 페이지 컴포넌트
-   `src/02-pages/menu/` - 메뉴 페이지 컴포넌트
-   `src/02-pages/summary/` - 요약 페이지 컴포넌트

### 새로 추가된 위젯

-   `src/03-widgets/memo/` - 메모 관련 위젯 (리스트, 레이아웃, 에디터)
-   `src/03-widgets/todo/` - 투두 관련 위젯 (리스트, 에디터)
-   `src/03-widgets/timer/` - 타이머 관련 위젯 (메인, 페이지)
-   `src/03-widgets/menu/` - 메뉴 관련 위젯
-   `src/03-widgets/summary/` - 요약 대시보드 위젯
-   `src/03-widgets/home/home-summary/` - 홈 요약 위젯

### 새로 추가된 컴포넌트

-   `src/06-shared/ui/BottomNavigationBar.tsx` - 하단 네비게이션 바
-   `src/05-entities/memo/ui/` - 메모 엔티티 UI 컴포넌트 (에디터, 리스트, 아이템)
-   `src/05-entities/todo/ui/` - 투두 엔티티 UI 컴포넌트 (에디터, 리스트, 아이템)
-   `src/05-entities/timer/ui/` - 타이머 엔티티 UI 컴포넌트 (디스플레이, 컨트롤, 에디터, 히스토리)
-   `src/05-entities/menu/ui/` - 메뉴 엔티티 UI 컴포넌트 (에디터, 리스트, 카드, 추천)
