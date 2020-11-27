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
      saveCrafts(file);
      saveQuartz(file);
      saveMasterQuartz(file);
      saveItems(file);
      saveBraveOrders(file);
      saveAccessories(file);
      saveDoors(file);
    }
  );
}

function saveCrafts(file) {
  const crafts = xlsx.utils
    .sheet_to_json(file.Sheets.Crafts, {
      header: ["name", "cpCost", "pbu", "aoe", "effects"],
    })
    .reduce((acc, line) => {
      if (Object.keys(line).length === 1) {
        if (line.name.includes("REVERIE")) {
          return acc;
        }
        return { ...acc, [line.name]: [] };
      }
      if (line.name === "Craft Name") {
        return acc;
      }

      const currentCharacter = Object.keys(acc)[Object.keys(acc).length - 1];
      const type = line.name.match(/C|S/g)[0];
      const name = line.name.replace(/\[(C|S)\]/g, "");
      return {
        ...acc,
        [currentCharacter]: [...acc[currentCharacter], { type, ...line, name }],
      };
    }, {});
  fs.writeFileSync("resources/crafts.json", JSON.stringify(crafts, null, 2));
}

function saveQuartz(file) {
  const quartz = xlsx.utils
    .sheet_to_json(file.Sheets.Quartz, {
      header: ["japanese", "english", "stats", "notes", "arts"],
    })
    .slice(1)
    .reduce((acc, line) => {
      if (Object.keys(line).length === 1) {
        if (line.japanese.includes("quartz")) {
          return acc;
        }
        return { ...acc, [line.japanese]: [] };
      }
      const currentElement = Object.keys(acc)[Object.keys(acc).length - 1];
      return {
        ...acc,
        [currentElement]: [...acc[currentElement], line],
      };
    }, {});
  fs.writeFileSync("resources/quartz.json", JSON.stringify(quartz, null, 2));
}

function saveMasterQuartz(file) {
  const masterQuartz = xlsx.utils
    .sheet_to_json(file.Sheets["Master Quartz"], {
      header: ["japanese", "english", "effects", "arts"],
    })
    .slice(1)
    .reduce((acc, line) => {
      if (Object.keys(line).length === 1) {
        return { ...acc, [line.japanese]: [] };
      }
      const currentElement = Object.keys(acc)[Object.keys(acc).length - 1];
      return {
        ...acc,
        [currentElement]: [...acc[currentElement], line],
      };
    }, {});
  fs.writeFileSync(
    "resources/masterQuartz.json",
    JSON.stringify(masterQuartz, null, 2)
  );
}

function saveItems(file) {
  const items = xlsx.utils
    .sheet_to_json(file.Sheets.Items, {
      header: ["japanese", "english", "effects"],
    })
    .slice(1)
    .reduce((acc, line) => {
      if (Object.keys(line).length === 1) {
        return { ...acc, [line.japanese]: [] };
      }
      const currentCategory = Object.keys(acc)[Object.keys(acc).length - 1];
      return {
        ...acc,
        [currentCategory]: [...acc[currentCategory], line],
      };
    }, {});
  fs.writeFileSync("resources/items.json", JSON.stringify(items, null, 2));
}

function saveBraveOrders(file) {
  const braveOrders = xlsx.utils
    .sheet_to_json(file.Sheets["Brave Orders"], {
      header: ["name", "bpCost", "turns", "primaryEffect", "secondaryEffect"],
    })
    .slice(1)
    .reduce((acc, line) => {
      if (Object.keys(line).length === 1) {
        if (line.name.includes("REVERIE")) {
          return acc;
        }
        return { ...acc, [line.name]: [] };
      }
      const currentCharacter = Object.keys(acc)[Object.keys(acc).length - 1];
      return {
        ...acc,
        [currentCharacter]: [...acc[currentCharacter], line],
      };
    }, {});
  fs.writeFileSync(
    "resources/braveOrders.json",
    JSON.stringify(braveOrders, null, 2)
  );
}

function saveAccessories(file) {
  const accessories = xlsx.utils
    .sheet_to_json(file.Sheets.Accessories, {
      header: ["japanese", "english", "effects"],
    })
    .slice(1)
    .reduce((acc, line) => {
      if (Object.keys(line).length === 1) {
        return { ...acc, [line.japanese]: [] };
      }
      const currentCategory = Object.keys(acc)[Object.keys(acc).length - 1];
      return {
        ...acc,
        [currentCategory]: [...acc[currentCategory], line],
      };
    }, {});
  fs.writeFileSync(
    "resources/accessories.json",
    JSON.stringify(accessories, null, 2)
  );
}

function saveDoors(file) {
  const doors = xlsx.utils
    .sheet_to_json(file.Sheets["Door of Trials"], {
      header: ["door", "characters", "lvl"],
    })
    .slice(2);
  fs.writeFileSync("resources/doors.json", JSON.stringify(doors, null, 2));
}

downloadAndParseCombat();
