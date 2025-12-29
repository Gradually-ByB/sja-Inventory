# 프로젝트 로드맵: 학교 미화팀 재고 관리 시스템

## 1. 프로젝트 개요
- **목표**: 학교 미화팀이 사용하는 소모품(세제, 종이컵, 쓰레기 봉투 등)의 입고, 출고, 현재고를 쉽고 정확하게 관리하는 웹 애플리케이션 구축.
- **주요 사용자**: 학교 미화 관리자 및 팀원 (비전공자도 사용하기 쉬운 UI 지향).

## 2. 기술 스택
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: Neon DB (Serverless PostgreSQL)
- **ORM**: Prisma
- **Deployment**: Vercel

## 3. 핵심 데이터 모델 (Database Schema)
### Item (재고 물품)
- `id`: 고유 식별자
- `name`: 물품명 (예: 쓰레기 봉투(100L, 50L, 30L, 20L, 막지, 연속비닐), 락스, 유리세정제, 종이물컵, 롤화장지, 핸드타올, 세제)
- `category`: 분류 (청소용품, 소모품)
- `currentStock`: 현재 재고 수량
- `unit`: 단위 (개, 박스, 롤)
- `location`: 보관 장소 (창고)

### Transaction (입출고 기록)
- `id`: 고유 식별자
- `itemId`: 연결된 물품 ID
- `type`: 유형 (IN: 입고, OUT: 출고)
- `quantity`: 변동 수량
- `description`: 출고처 (행정동, PAC, 유/초등학교, 중/고등학교, 체육관, 기숙사)
- `createdAt`: 기록 일시

## 4. 주요 기능 요구사항

### 1단계: 재고 현황판 (Dashboard)
- 전체 물품 목록을 테이블 형식으로 출력 (shadcn/ui `DataTable` 사용).
- 물품명 또는 카테고리로 실시간 검색 가능.
- 재고가 부족한 물품(예: 5개 미만)은 빨간색으로 강조 표시.

### 2단계: 입고 및 출고 관리
- 각 물품 옆에 '입고', '출고' 버튼 배치.
- 버튼 클릭 시 팝업(Dialog)이 뜨며 수량과 출고처를 입력.
- 저장 시 `Item`의 재고가 실시간 업데이트되고 `Transaction`에 기록 생성.

### 3단계: 물품 관리
- 새로운 관리 물품 등록 (이름, 초기 수량, 단위 등).
- 기존 물품 정보 수정 및 삭제 기능.

## 5. 개발 단계별 지시사항 (AI 코딩 가이드)

1.  **환경 설정**: `npx create-next-app` 실행 후 Prisma와 Neon DB 연결 설정을 진행한다.
2.  **스키마 생성**: `schema.prisma` 파일에 위 정의된 모델을 작성하고 `npx prisma db push`를 실행한다.
3.  **기본 UI 구조**: 상단 네비게이션과 메인 레이아웃을 잡고, shadcn/ui에서 필요한 컴포넌트(Table, Button, Input, Dialog)를 설치한다.
4.  **서버 액션 구현**: DB 데이터를 읽어오는 `getItems`, 재고를 변경하는 `updateStock` 서버 함수를 만든다.
5.  **검색 및 필터링**: 클라이언트 사이드에서 검색어 입력 시 테이블이 즉시 필터링되도록 구현한다.

## 6. 특이사항 (비전공자 가이드)
- 모든 코드는 **'Server Actions'**를 우선 사용하여 API 라우트 복잡성을 최소화한다.
- 모바일에서 현장 확인이 가능하도록 **반응형 디자인(Responsive Design)**을 적용한다.
- 에러 발생 시 사용자가 알 수 있도록 간단한 `toast` 메시지를 표시한다.