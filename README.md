# Ajou Mealmap

## 0. TL;DR
아주대학교 대학로 인근 밥집 및 상권 서비스화 프로젝트
https://ajou.mealmap.app

## 1. Project Info
* 프로젝트 기간: 2021.04~(진행중)
* 기술스택: React + Typescript

## 2. Project Structure
* Atomic Component Design 적용
* 확장형 모바일화면 대응을 위해 컴포넌트 디자인 종류로 'frame' 추가
```Markdown
    App
    : Ajou Mealmap Applicaton
    [frame]
        DisplayHandler
        : page에 대한 페이지 별 프레임설정 관리
    [page]
        Login
        : 로그인페이지
        Main
        : 서비스페이지
        Subdisplay
        : 하단/측면 표시 페이지
    [template]
        InfoDisplay
        : Subdisplay에서 정보표시용 컨텐츠영역 관리
        InfoSpecific
        : InfoDisplay에서 추가적인 정보를 표시할 때 사용하는 영역 (위로 올라오는 영역)
        ReviewWriter
        : Subdisplay에서 리뷰작성용 컨텐츠영역 관리 (구조화 미완성)

        [F]LoginState
        : Login에서 로그인을 위한 Stage Template 관리폴더
            StageLogin
            : 사용자 로그인 관련 template
            StageJoinSelection
            : 사용자정보가 없을 때 가입여부 질의단계 관련 template
            StageAuthBelong
            : 재학여부 확인단계 관련 template
            StageEmailVerify
            : 이메일 인증단계 관련 template
    [organism]
        InfoMenu
        : InfoDisplay에 표시되는 기능 관리
        ShopList
        : 시스템 전반 상점에 대한 리스팅 및 표시기능 관리
        ServiceAlert(Prev: Alert)
        : 시스템 전반 alert, prompt 등의 알림기능 관리
        Selector
        : 시스템 전반 사용자 선택액션관련 입력시스템 관리 

        [F]Effect
        : 서비스 전반 애니메이션 구현 컴포넌트 관리폴더
            LogoAnimate
            : Login 페이지 최초 로그인 애니메이션 관리

        [F]InfoSpecific
        : InfoSpecific에만 포함되는 기능별 구현 컴포넌트 관리폴더
            [F]Specific
            : 상세정보 표시 컴포넌트 관리폴더
                WorktimeInfoSpecific
                : 영업시간정보 상세표시 관리
                MenuInfoSpecific
                : 메뉴정보 상세표시 관리
                EventInfoSpecific
                : 이벤트정보 상세표시 관리
                ContactInfoSpecific
                : 연락처정보 상세표시 관리
                LocationInfoSpecific
                : 위치정보 상세표시 관리
                ImageInfoSpecific
                : 이미지 상세표시 관리
                ReviewInfoSpecific
                : 리뷰 상세표시 관리
            [F]Add
            : 정보 추가 컴포넌트 관리폴더
                ContactInfoAdd
                : 연락처 추가기능 관리
                WorktimeInfoAdd
                : 영업시간 추가기능 관리
    [molecule]
        ServiceTitler
        : 시스템 전반 서비스 정규 제목영역 스타일링 관리

        [F]Main
        : Main에만 사용되는 기능별 구현 컴포넌트 관리폴더
            Locator
            : GPS 및 IP주소 기반 사용자 위치 표시 관리 
        
        [F]InfoMenu
        : InfoMenu에만 포함되는 기능별 구현 컴포넌트 관리폴더
            EventBlockWrap
            : 제휴행사, 할인정보 등 행사블록 관리
            ShopSpecific
            : 상점정보에 대한 4가지 기본정보표시 관리
            ReviewStatistic (Prev: ReviewBlock)
            : 리뷰정보에 대한 통계정보표시 관리
            
        [F]Blocks
        : 시스템 전반에 반복적으로 사용되는 블록 컴포넌트 관리폴더
            ShopBlock
            : 상점정보 표시블록 (Main에서 활용; ShopList에 의해)
            ImageBlock
            : 이미지정보 표시블록 (InfoMenu에서 활용)
            EventBlock
            : 행사관련정보 표시블록 (InfoMenu에서 활용; EventBlockWrap에 의해 관리)
            MenuBlock
            : 메뉴정보 표시블록
            ReviewBlock (Prev: ReviewSpecBlock)
            : 리뷰정보 표시블록
            ContactBlock
            : 연락처정보 표시블록
            WorktimeBlock (Prev: WorktimeManager)
            : 영업시간정보 표시블록
            
        [F]Buttons
        : 시스템 전반에 반복적으로 사용되는 버튼 컴포넌트 관리폴더
            InfoSpecificAddButton
            : InfoSpecific 상세정보 표시 컴포넌트에만 사용되는 리뷰추가버튼
            InfoSpecificCtrlButton
            : InfoSpecific 상세정보 표시 컴포넌트 상단 좌/우측에만 사용되는 InfoSpecific 제어버튼
            ReviewEntryButton (Prev: ReviewEntrypoint)
            : Main에서 리뷰작성을 위해 리뷰페이지로 진입하는 리뷰추가버튼
            LoginButton
            : Login에서 사용자의 로그인정보 입력완료를 확인하기 위한 로그인버튼 (StageLogin에 종속되어있음; 추후 분리)

        [F]Selector
        : 시스템 전반에 반복적으로 사용되는 선택 컴포넌트 관리폴더
            SelectionSelector(Prev: Selector)
            : 객관형 선택 컴포넌트 (legacy코드 업데이트 필요 (js -> tsx); SelectionBlock 분기 필요)
            DateSelector
            : 영업시간 등 날짜 및 시간 선택 컴포넌트 (legacy코드 업데이트 진행중)
            DepartSelector
            : 대학 학과정보 선택 컴포넌트 (추후 SelectionSelector로 편입예정)
            MapSelector
            : 위치 선택 컴포넌트

        [F]Map
        : 지도 관련 기능에서 사용되는 지도 지원 컴포넌트 관리폴더
            MapHandler
            : 지도 관련 기능에서 Kakao Map API와 연동을 위해 사용되는 지도 제어 컴포넌트
            AddressDisplay
            : 지도에 표시되는 위치에 대한 주소를 보여주는 주소정보 표시 컴포넌트
            
    [atom]
        ServiceInput
        : 서비스 전반 표준입력 컴포넌트
        ServiceButton
        : 서비스 전반 표준버튼 컴포넌트
        [F]Selector
        : 선택 컴포넌트에서만 사용되는 표준 컴포넌트 관리폴더
            Selection
            : 객관형 선택지 컴포넌트 ([F]/Selector/SelectionSelector에 종속되어 있음; 추후 분리)
```
