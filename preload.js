const { contextBridge, remote } = require("electron");
const BrowserWindow = remote.BrowserWindow;
const downloadAndParseTranslations = require("./parseXlsx");
const getAppDataPath = require("./getAppDataPath");
const fs = require("fs");
const path = require("path");

contextBridge.exposeInMainWorld("api", {
  getTranslations: () => {
    const file = path.join(getAppDataPath(), "translation.json");
    if (!fs.existsSync(file)) {
      return require("./resources/translation.json");
    }
    const translations = fs.readFileSync(file);
    return JSON.parse(translations);
  },
  updateTranslations: downloadAndParseTranslations,
  getPlatform: () => process.platform,
  openCombatOverlay: (section) => {
    const win = new BrowserWindow({
      width: 910,
      height: 300,
      titleBarStyle: "hidden",
      transparent: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: true,
        preload: path.join(__dirname, "preload.js"),
      },
    });

    win.loadFile(`combat/${section}.html`);
  },
  getResource: (name) => require(`./resources/${name}.json`),
});
