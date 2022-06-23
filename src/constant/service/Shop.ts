// 상점 영업시간 관련

export const ShopWorkDateSunday = "Sunday";
export const ShopWorkDateMonday = "Monday";
export const ShopWorkDateTuesday = "Tuesday";
export const ShopWorkDateWednesday = "Wednesday";
export const ShopWorkDateThursday = "Thursday";
export const ShopWorkDateFriday = "Friday";
export const ShopWorkDateSaturday = "Saturday";
export const ShopWorkDateDefault = "Default";

export const ShopWorkDateDBSunday = 0;
export const ShopWorkDateDBMonday = 1;
export const ShopWorkDateDBTuesday = 2;
export const ShopWorkDateDBWednesday = 3;
export const ShopWorkDateDBThursday = 4;
export const ShopWorkDateDBFriday = 5;
export const ShopWorkDateDBSaturday = 6;
export const ShopWorkDateDBDefault = 9;

export const MappedShopWorkDateList = {
    [ ShopWorkDateSunday ]: ShopWorkDateDBSunday,
    [ ShopWorkDateMonday ]: ShopWorkDateDBMonday,
    [ ShopWorkDateTuesday ]: ShopWorkDateDBTuesday,
    [ ShopWorkDateWednesday ]: ShopWorkDateDBWednesday,
    [ ShopWorkDateThursday ]: ShopWorkDateDBThursday,
    [ ShopWorkDateFriday ]: ShopWorkDateDBFriday,
    [ ShopWorkDateSaturday ]: ShopWorkDateDBSaturday,
    [ ShopWorkDateDefault ]: ShopWorkDateDBDefault
}

export type ShopWorkTimeDefaultServiceType = [ number, number ];

// 상점 업종 유형
export const ShopMainCategoryRestaurant = "RESTAURANT";
export const ShopMainCategoryBar = "BAR";
export const ShopMainCategoryCafe = "CAFE";
export const ShopMainCategoryCVS = "CVS";
export const ShopMainCategoryETC = "ETC";

export const ShopRestaurantSubCategoryMeat = "MEAT";
export const ShopRestaurantSubCategoryJapan = "JAPANESE_FOOD";
export const ShopRestaurantSubCategoryPortCutlet = "PORT_CUTLET";
export const ShopRestaurantSubCategoryItalina = "ITALIAN"
export const ShopRestaurantSubCategoryChicken = "CHICKEN";
export const ShopRestaurantSubCategoryKorean = "KOREAN";
export const ShopRestaurantSubCategoryNoodle = "NOODLE";
export const ShopRestaurantSubCategorySnack = "SNACK";

export const ShopCafeSubCategoryStarbucks = "STARBUCKS";
export const ShopCafeSubCategoryTwosomePlace = "TWOSOMEPLACE";
export const ShopCafeSubCategoryCoffeeBean = "COFFEEBEAN";
export const ShopCafeSubCategoryPascucci = "PASCUCCI";
export const ShopCafeSubCategoryHollys = "HOLLYS";
export const ShopCafeSubCategoryAngelInUsCoffee = "ANGELINUSCOFFEE";
export const ShopCafeSubCategoryTomNToms = "TOMNTOMS";
export const ShopCafeSubCategoryCaffeBene = "CAFFEBENE";
export const ShopCafeSubCategoryMangoSix = "MANGOSIX";
export const ShopCafeSubCategoryCoffineGurunara = "COFFINEGURUNARA";
export const ShopCafeSubCategoryEdiya = "EDIYA";
export const ShopCafeSubCategoryBaek = "BAEK";
export const ShopCafeSubCategoryEtc = "ETC";

export const ShopCVSSubCategoryGs25 = "GS25";
export const ShopCVSSubCategoryEmart24 = "EMART24";
export const ShopCVSSubCategoryCu = "CU";
export const ShopCVSSubCategorySevenEleven = "SEVENELEVEN";
export const ShopCVSSubCategoryMinistop = "MINISTOP";
export const ShopCVSSubCategoryEtc = "ETC";