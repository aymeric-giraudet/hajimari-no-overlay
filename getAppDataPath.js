const path = require("path");

module.exports = function getAppDataPath() {
  switch (process.platform) {
    case "darwin": {
      return path.join(
        process.env.HOME,
        "Library",
        "Application Support",
        "hajimari-no-overlay"
      );
    }
    case "win32": {
      return path.join(process.env.APPDATA, "hajimari-no-overlay");
    }
    case "linux": {
      return path.join(process.env.HOME, ".hajimari-no-overlay");
    }
    default: {
      console.log("Unsupported platform!");
      process.exit(1);
    }
  }
};
