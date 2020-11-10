const trads = require("./test.json");
const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("api", {
  getTranslations: () => trads,
});
