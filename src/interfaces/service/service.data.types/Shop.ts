import { ShopWorkDateSunday, ShopWorkDateMonday, ShopWorkDateTuesday, ShopWorkDateWednesday, ShopWorkDateThursday, ShopWorkDateFriday, ShopWorkDateSaturday, ShopWorkDateDefault, ShopMainCategoryRestaurant, ShopMainCategoryBar, ShopMainCategoryCafe, ShopMainCategoryCVS, ShopMainCategoryETC, ShopRestaurantSubCategoryMeat, ShopRestaurantSubCategoryJapan, ShopRestaurantSubCategoryPortCutlet, ShopRestaurantSubCategoryItalina, ShopRestaurantSubCategoryChicken, ShopRestaurantSubCategoryKorean, ShopRestaurantSubCategoryNoodle, ShopCafeSubCategoryStarbucks, ShopCafeSubCategoryTwosomePlace, ShopCafeSubCategoryCoffeeBean, ShopCafeSubCategoryPascucci, ShopCafeSubCategoryHollys, ShopCafeSubCategoryAngelInUsCoffee, ShopCafeSubCategoryTomNToms, ShopCafeSubCategoryCaffeBene, ShopCafeSubCategoryMangoSix, ShopCafeSubCategoryCoffineGurunara, ShopCafeSubCategoryEdiya, ShopCafeSubCategoryBaek, ShopCafeSubCategoryEtc, ShopCVSSubCategoryGs25, ShopCVSSubCategoryEmart24, ShopCVSSubCategoryCu, ShopCVSSubCategorySevenEleven, ShopCVSSubCategoryMinistop, ShopCVSSubCategoryEtc, ShopRestaurantSubCategorySnack, ShopWorkTimeDefaultServiceType } from "@src/constant/service/Shop";
import { UserIDType } from "./User";

export type ShopIDType = string;

// 위치 정보
export type ShopLocationType = ServiceCoordinateType & Partial<{
    duration: string  
}>;

export type ServiceCoordinateType = {
    address?: string,
    lat: number,
    long: number
};

// 연락처 정보
export type ShopContactType = {
    default?: string
} & {
    [ contact in string ]?: string
}

// 상점 영업요일 정보
export type ShopWorkDateSundayType = typeof ShopWorkDateSunday;
export type ShopWorkDateMondayType = typeof ShopWorkDateMonday;
export type ShopWorkDateTuesdayType = typeof ShopWorkDateTuesday;
export type ShopWorkDateWednesdayType = typeof ShopWorkDateWednesday;
export type ShopWorkDateThursdayType = typeof ShopWorkDateThursday;
export type ShopWorkDateFridayType = typeof ShopWorkDateFriday;
export type ShopWorkDateSaturdayType = typeof ShopWorkDateSaturday;
export type ShopWorkDateDefaultType = typeof ShopWorkDateDefault;

export type ShopWorkDateListType = 
    ShopWorkDateSundayType |
    ShopWorkDateMondayType |
    ShopWorkDateTuesdayType |
    ShopWorkDateWednesdayType |
    ShopWorkDateThursdayType |
    ShopWorkDateFridayType |
    ShopWorkDateSaturdayType |
    ShopWorkDateDefaultType
;

// 상점 업종 유형
export type ShopMainCategoryRestaurantType = typeof ShopMainCategoryRestaurant;
export type ShopMainCategoryBarType = typeof ShopMainCategoryBar;
export type ShopMainCategoryCafeType = typeof ShopMainCategoryCafe;
export type ShopMainCategoryCVSType = typeof ShopMainCategoryCVS;
export type ShopMainCategoryETCType = typeof ShopMainCategoryETC;

export type ShopMainCategoryTypes = 
    ShopMainCategoryRestaurantType |
    ShopMainCategoryBarType |
    ShopMainCategoryCafeType |
    ShopMainCategoryCVSType | 
    ShopMainCategoryETCType
;

export type ShopRestaurantSubCategoryMeatType = typeof ShopRestaurantSubCategoryMeat;
export type ShopRestaurantSubCategoryJapanType = typeof ShopRestaurantSubCategoryJapan;
export type ShopRestaurantSubCategoryPortCutletType = typeof ShopRestaurantSubCategoryPortCutlet;
export type ShopRestaurantSubCategoryItalinaType = typeof ShopRestaurantSubCategoryItalina;
export type ShopRestaurantSubCategoryChickenType = typeof ShopRestaurantSubCategoryChicken;
export type ShopRestaurantSubCategoryKoreanType = typeof ShopRestaurantSubCategoryKorean;
export type ShopRestaurantSubCategoryNoodleType = typeof ShopRestaurantSubCategoryNoodle;
export type ShopRestaurantSubCategorySnackType = typeof ShopRestaurantSubCategorySnack;

export type ShopRestaurantSubCategoryTypes = 
    ShopRestaurantSubCategoryMeatType |
    ShopRestaurantSubCategoryJapanType |
    ShopRestaurantSubCategoryPortCutletType |
    ShopRestaurantSubCategoryItalinaType |
    ShopRestaurantSubCategoryChickenType |
    ShopRestaurantSubCategoryKoreanType |
    ShopRestaurantSubCategoryNoodleType |
    ShopRestaurantSubCategorySnackType
;

export type ShopCafeSubCategoryStarbucksType = typeof ShopCafeSubCategoryStarbucks;
export type ShopCafeSubCategoryTwosomePlaceType = typeof ShopCafeSubCategoryTwosomePlace;
export type ShopCafeSubCategoryCoffeeBeanType = typeof ShopCafeSubCategoryCoffeeBean;
export type ShopCafeSubCategoryPascucciType = typeof ShopCafeSubCategoryPascucci;
export type ShopCafeSubCategoryHollysType = typeof ShopCafeSubCategoryHollys;
export type ShopCafeSubCategoryAngelInUsCoffeeType = typeof ShopCafeSubCategoryAngelInUsCoffee;
export type ShopCafeSubCategoryTomNTomsType = typeof ShopCafeSubCategoryTomNToms;
export type ShopCafeSubCategoryCaffeBeneType = typeof ShopCafeSubCategoryCaffeBene;
export type ShopCafeSubCategoryMangoSixType = typeof ShopCafeSubCategoryMangoSix;
export type ShopCafeSubCategoryCoffineGurunaraType = typeof ShopCafeSubCategoryCoffineGurunara;
export type ShopCafeSubCategoryEdiyaType = typeof ShopCafeSubCategoryEdiya;
export type ShopCafeSubCategoryBaekType = typeof ShopCafeSubCategoryBaek;
export type ShopCafeSubCategoryEtcType = typeof ShopCafeSubCategoryEtc;

export type ShopCafeSubCategoryTypes = 
    ShopCafeSubCategoryStarbucksType | 
    ShopCafeSubCategoryTwosomePlaceType | 
    ShopCafeSubCategoryCoffeeBeanType | 
    ShopCafeSubCategoryPascucciType | 
    ShopCafeSubCategoryHollysType | 
    ShopCafeSubCategoryAngelInUsCoffeeType | 
    ShopCafeSubCategoryTomNTomsType | 
    ShopCafeSubCategoryCaffeBeneType | 
    ShopCafeSubCategoryMangoSixType | 
    ShopCafeSubCategoryCoffineGurunaraType | 
    ShopCafeSubCategoryEdiyaType | 
    ShopCafeSubCategoryBaekType | 
    ShopCafeSubCategoryEtcType
;

export type ShopCVSSubCategoryGs25Type = typeof ShopCVSSubCategoryGs25;
export type ShopCVSSubCategoryEmart24Type = typeof ShopCVSSubCategoryEmart24;
export type ShopCVSSubCategoryCuType = typeof ShopCVSSubCategoryCu;
export type ShopCVSSubCategorySevenElevenType = typeof ShopCVSSubCategorySevenEleven;
export type ShopCVSSubCategoryMinistopType = typeof ShopCVSSubCategoryMinistop;
export type ShopCVSSubCategoryEtcType = typeof ShopCVSSubCategoryEtc;

export type ShopCVSSubCategoryTypes = 
    ShopCVSSubCategoryGs25Type |
    ShopCVSSubCategoryEmart24Type |
    ShopCVSSubCategoryCuType |
    ShopCVSSubCategorySevenElevenType |
    ShopCVSSubCategoryMinistopType |
    ShopCVSSubCategoryEtcType
;

export type ShopSubCategoryTypes = 
    ShopRestaurantSubCategoryTypes | 
    ShopCafeSubCategoryTypes | 
    ShopCVSSubCategoryTypes | 
    null
;

// 상점 이미지 정보
export type ShopImageType = {
    default?: string
} | {
    [ image in string ]: string
}

// 상점 메뉴 정보
export type ShopMenusType = {
    [ menuname in string ]: {
        price: number,
        is_limit: boolean,
        // reviews: Array<ReviewIDType>,
        reviews: Array<string>,
        // alergic: Array<AlergicIDType>
    }
}

// 상점 영업시간 정보
export const ShopWorkDateServerSunday = "Sunday";
export const ShopWorkDateServerMonday = "Monday";
export const ShopWorkDateServerTuesday = "Tuesday";
export const ShopWorkDateServerWednesday = "Wednesday";
export const ShopWorkDateServerThursday = "Thursday";
export const ShopWorkDateServerFriday = "Friday";
export const ShopWorkDateServerSaturday = "Saturday";
export const ShopWorkDateServerDefault = "Default";

export type ShopWorkDateServerSundayType = typeof ShopWorkDateServerSunday;
export type ShopWorkDateServerMondayType = typeof ShopWorkDateServerMonday;
export type ShopWorkDateServerTuesdayType = typeof ShopWorkDateServerTuesday;
export type ShopWorkDateServerWednesdayType = typeof ShopWorkDateServerWednesday;
export type ShopWorkDateServerThursdayType = typeof ShopWorkDateServerThursday;
export type ShopWorkDateServerFridayType = typeof ShopWorkDateServerFriday;
export type ShopWorkDateServerSaturdayType = typeof ShopWorkDateServerSaturday;
export type ShopWorkDateServerDefaultType = typeof ShopWorkDateServerDefault;

export type ShopWorkDateServerListType = 
    ShopWorkDateServerSundayType |
    ShopWorkDateServerMondayType |
    ShopWorkDateServerTuesdayType |
    ShopWorkDateServerWednesdayType |
    ShopWorkDateServerThursdayType |
    ShopWorkDateServerFridayType |
    ShopWorkDateServerSaturdayType |
    ShopWorkDateServerDefaultType
;

export type ShopWorkTimeType = {
    start_time: {
        [ day in ShopWorkDateServerListType ]?: ShopWorkTimeDefaultServiceType
    },    
    end_time: {
        [ day in ShopWorkDateServerListType ]?: ShopWorkTimeDefaultServiceType
    },
    rest_time: Array<Array<number>>,
}

// 상점 행사 정보
export type EventInfoType = {
    [ eventer in string ]: {
        eventer: string,
        logo_img: string,
        logo_color: string,
        content: {
            text: string,
            condition: EventApplyConditionType,
        } & ({
            //eventType| 0: 금액할인(특정금액 차감) | 1: 금액할인(% 할인) | 2: 메뉴제공 | 3: 향후이용가능 쿠폰제공 | 4: 기타
            eventType: 0 | 1,
            discountPriceCalc?: ( prevPrice: number ) => number // 할인금액 계산함수
        } | {
            eventType: 2 | 3 | 4,
            eventApplyAction?: any
        })
    }
}

export type EventApplyConditionType = {
    [ chk_base in "AND" | "OR" ]?: EventApplyConditionType | Array<string>
}

// 상점정보
export type ShopServiceType = {
    shopID: ShopIDType,
    name: string,
    category: {
        main: ShopMainCategoryRestaurantType,
        sub: ShopRestaurantSubCategoryTypes | null
    } | {
        main: ShopMainCategoryBarType,
        sub: null
    } | {
        main: ShopMainCategoryCafeType,
        sub: ShopCafeSubCategoryTypes | null
    } | {
        main: ShopMainCategoryCVSType,
        sub: ShopCVSSubCategoryTypes | null
    } | {
        main: ShopMainCategoryETCType,
        sub: null
    },
    loc: ShopLocationType,
    contact: ShopContactType,
    imgs: ShopImageType,
    menus: ShopMenusType,
    workTime?: ShopWorkTimeType,
    events?: EventInfoType,
}






// 상점 검색 관련
export const ShopSearchOptionShopName = "shopName";
export const ShopSearchOptionLocation = "shopLocation";
export const ShopSearchOptionContact = "shopContact";
export const ShopSearchOptionWorkTime = "shopWorkTime";
export const ShopSearhcOptionCategory = "shopCategory";
export const ShopSearchOptionMenu = "shopMenu";

export type ShopSearchOptionShopNameType = typeof ShopSearchOptionShopName;
export type ShopSearchOptionLocationType = typeof ShopSearchOptionLocation;
export type ShopSearchOptionContactType = typeof ShopSearchOptionContact;
export type ShopSearchOptionWorkTimeType = typeof ShopSearchOptionWorkTime;
export type ShopSearhcOptionCategoryType = typeof ShopSearhcOptionCategory;
export type ShopSearchOptionMenuType = typeof ShopSearchOptionMenu;

export type ShopSearchOptionsType = 
    ShopSearchOptionShopNameType |
    ShopSearchOptionLocationType |
    ShopSearchOptionContactType |
    ShopSearchOptionWorkTimeType |
    ShopSearhcOptionCategoryType |
    ShopSearchOptionMenuType
;