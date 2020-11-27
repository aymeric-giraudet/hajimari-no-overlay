var tbody;
var filters;
var renderTable;
var activeFilters = [];

const colors = {
  EARTH: "#EFCAA2",
  WATER: "#A4C2F4",
  FIRE: "#F4CCCC",
  WIND: "#D9EAD3",
  TIME: "#434343",
  SPACE: "#FFF2CC",
  MIRAGE: "#D9D9D9",
  LOST: "#D5A6BD",
};

function renderOverlay({ resourceName, rowTemplate }) {
  tbody = document.querySelector("tbody");
  filters = document.getElementById("filters");
  const resource = window.api.getResource(resourceName);
  renderFilters(resource);
  renderTable = function () {
    tbody.innerHTML = "";
    for (const category in resource) {
      if (activeFilters.length > 0 && !activeFilters.includes(category)) {
        continue;
      }
      renderHeader(category);
      for (const row of resource[category]) {
        const tr = document.createElement("tr");
        tr.innerHTML = rowTemplate(row);
        tbody.appendChild(tr);
      }
    }
  };
  renderTable();
}

function renderFilters(resource) {
  for (const category in resource) {
    const div = document.createElement("div");
    const input = document.createElement("input");
    input.type = "radio";
    input.name = category;
    div.appendChild(input);
    const label = document.createElement("label");
    label.textContent = category;
    div.appendChild(label);
    filters.appendChild(div);
    div.addEventListener("click", () => {
      if (input.checked) {
        activeFilters = activeFilters.filter((filter) => filter !== category);
        input.checked = false;
      } else {
        activeFilters = [...activeFilters, category];
        input.checked = true;
      }
      renderTable();
    });
  }
}

function renderHeader(category) {
  const tr = document.createElement("tr");
  const th = document.createElement("th");
  tr.style.backgroundColor = colors[category] ?? "black";
  th.colSpan = document.querySelector("thead tr").childElementCount;
  th.textContent = category;
  tr.appendChild(th);
  tbody.appendChild(tr);
}
