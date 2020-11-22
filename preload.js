const trads = require("./translation.json");
const { contextBridge } = require("electron");
const downloadAndParseTranslations = require("./parseXlsx");

contextBridge.exposeInMainWorld("api", {
  getTranslations: () => trads,
  updateTranslations: (cb) => downloadAndParseTranslations(cb),
  getPlatform: () => process.platform,
});
