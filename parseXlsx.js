const xlsx = require("xlsx");
const fs = require("fs");

const file = xlsx.readFile("./Hajimari.xlsx");
const translations = Object.fromEntries(
  file.SheetNames.map((name) => [
    name,
    xlsx.utils.sheet_to_json(file.Sheets[name]),
  ])
);

fs.writeFileSync("test.json", JSON.stringify(translations));
