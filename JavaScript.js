document.addEventListener("DOMContentLoaded", createTable);

function createTable() {
  document.getElementById("loading-bar").style.display = "flex";

  fetch('https://script.google.com/macros/s/AKfycbx-fnmqkqvvDrcU1mSOADCvADEpV46AK031194_jAlOc6N_Heu5LRiwWg4jBsPczhSP/exec') // Google Sheets JSON URL
    .then(response => response.json())
    .then(tableData => {
      let table = new Tabulator("#example-table", {
        data: tableData,
        pagination: true,
        paginationSize: 10,
        paginationSizeSelector: [10, 20, 50],
        paginationCounter: "rows",
        movableColumns: true,
        responsiveLayout: "collapse",
        layout: "fitColumns",
        columnDefaults: { tooltip: true },
        columns: [
          { title: "", field: "Billede", formatter: "image", formatterParams: { height: "70px", width: "70px" }, width: 85 },
          { title: "Kemikalie", field: "Kemikalie", headerFilter: true, width: 300 },
          { title: "CAS nr.", field: "CAS nummer", headerFilter: true },
          { title: "Vare nr.", field: "Vare nummer", headerFilter: true },
          { title: "Produkt type", field: "Produkt type", headerFilter: true },
          { title: "Produkt", field: "Produkt", headerFilter: true },
          { title: "Gennembrudstid", field: "Gennembrudstid", headerFilter: true },
          { title: "Index", field: "Index", headerFilter: true, width: 100, formatter: colorIndex },
          { title: "Link", field: "URL", formatter: "link", width: 82, formatterParams: { label: "Link", target: "_blank" } }
        ],
      });

      document.getElementById("loading-bar").style.display = "none";
    })
    .catch(error => {
      console.error('Error loading data:', error);
      document.getElementById("loading-bar").style.display = "none";
    });
}

function colorIndex(cell) {
  let value = cell.getValue();
  let color = {
    "Index: 1": "#d53243",
    "Index: 2": "#e8862b",
    "Index: 3": "#e8862b",
    "Index: 4": "#f1b833",
    "Index: 5": "#abb731",
    "Index: 6": "#abb731",
    "Index: A": "#d53243",
    "Index: B": "#d53243",
    "Index: 0": "#d53243"
  }[value] || "white";
  
  cell.getElement().style.backgroundColor = color;
  return value;
}
