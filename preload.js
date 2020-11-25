const { contextBridge } = require("electron");
const downloadAndParseTranslations = require("./parseXlsx");
const getAppDataPath = require("./getAppDataPath");
const fs = require("fs");
const path = require("path");

contextBridge.exposeInMainWorld("api", {
  getTranslations: () => {
    const file = path.join(getAppDataPath(), "translation.json");
    if (!fs.existsSync(file)) {
      return require("./translation.json");
    }
    const translations = fs.readFileSync(file);
    return JSON.parse(translations);
  },
  updateTranslations: downloadAndParseTranslations,
  getPlatform: () => process.platform,
});
