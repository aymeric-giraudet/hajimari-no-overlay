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

function downloadAndParseCombat() {
  download(
    "https://docs.google.com/spreadsheets/d/1gyoxZ5oLcQW4tt5dzFmJ1sqGwP_NxUuM947C5cVAJzE/export?format=xlsx",
    function xlsxToJson(buffer) {
      const file = xlsx.read(buffer, { type: "buffer" });
      const crafts = xlsx.utils
        .sheet_to_json(file.Sheets.Crafts, {
          header: ["name", "cpCost", "pbu", "aoe", "effects"],
        })
        .reduce((acc, line) => {
          if (Object.keys(line).length === 1) {
            return { ...acc, [line.name]: [] };
          }
          const currentCharacter = Object.keys(acc)[
            Object.keys(acc).length - 1
          ];
          return {
            ...acc,
            [currentCharacter]: [...acc[currentCharacter], line],
          };
        }, {});
      fs.writeFileSync(
        "resources/crafts.json",
        JSON.stringify(crafts, null, 2)
      );
    }
  );
}

downloadAndParseCombat();
