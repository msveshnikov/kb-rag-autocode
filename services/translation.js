import i18next from "i18next";
import fetch from "node-fetch";

export class TranslationService {
    constructor() {
        this.initializeI18next();
    }

    async initializeI18next() {
        await i18next.init({
            lng: "en",
            fallbackLng: "en",
            resources: {},
        });
    }

    async translate(text, targetLanguage) {
        if (targetLanguage === "en") {
            return text;
        }

        try {
            const response = await fetch(process.env.TRANSLATION_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.TRANSLATION_API_KEY}`,
                },
                body: JSON.stringify({
                    text,
                    target_language: targetLanguage,
                }),
            });

            if (!response.ok) {
                throw new Error(`Translation API error: ${response.statusText}`);
            }

            const result = await response.json();
            return result.translated_text;
        } catch (error) {
            console.error("Translation error:", error);
            return text;
        }
    }

    async addTranslation(key, translations) {
        Object.entries(translations).forEach(([lang, value]) => {
            i18next.addResource(lang, "translation", key, value);
        });
    }

    getTranslation(key, language) {
        return i18next.t(key, { lng: language });
    }
}
