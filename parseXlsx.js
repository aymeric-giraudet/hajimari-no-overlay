const xlsx = require("xlsx");
const fs = require("fs");
const https = require("follow-redirects").https;
const concat = require("concat-stream");

function download(url, cb) {
  const concatStream = concat(cb);
  https.get(url, function (response) {
    response.pipe(concatStream);
  });
}

const sheetsToIgnore = ["Misc", "Minigames", "Episodes"];

module.exports = function downloadAndParseTranslations(cb) {
  download(
    "https://docs.google.com/spreadsheets/d/16vqUNRQRB5CimIOVHfdyT5Yp6YOPzzVkR_9vtrU1wtI/export?format=xlsx",
    function xlsxToJson(buffer) {
      const file = xlsx.read(buffer, { type: "buffer" });
      const translations = {
        ...Object.fromEntries(
          file.SheetNames.filter(
            (name) =>
              !sheetsToIgnore.some((nameToIgnore) => name === nameToIgnore)
          ).map((name) => [
            name,
            xlsx.utils
              .sheet_to_json(file.Sheets[name], {
                header: ["name", "en", "jp"],
              })
              .slice(name === "Prologue" ? 22 : 1),
          ])
        ),
        Episodes: xlsx.utils
          .sheet_to_json(file.Sheets["Episodes"], {
            header: ["name", "en", "jp", "flag"],
          })
          .slice(1)
          .reduce(
            (acc, line) =>
              line.flag === "x"
                ? [...acc, [line]]
                : [...acc.slice(0, -1), [...acc[acc.length - 1], line]],
            []
          ),
      };
      cb(translations);
      fs.writeFileSync(
        "translation.json",
        JSON.stringify({ date: new Date(), ...translations })
      );
    }
  );
};
