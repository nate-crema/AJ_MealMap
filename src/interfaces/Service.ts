
export const ServiceLanguageKorean = "ko";
export const ServiceLanguageEnglish = "en";
export const ServiceLanguages = {
    ko: ServiceLanguageKorean,
    en: ServiceLanguageEnglish
}

export type ServiceLanguage = typeof ServiceLanguageKorean | typeof ServiceLanguageEnglish;