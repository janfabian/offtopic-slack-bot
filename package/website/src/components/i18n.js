import { initReactI18next } from "react-i18next";
import cs from "../../../translations/cs/website.json";
import en from "../../../translations/en/website.json";
import i18n from "i18next";

const resources = {
  cs,
  en,
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  keySeparator: false,
});

export default i18n;
