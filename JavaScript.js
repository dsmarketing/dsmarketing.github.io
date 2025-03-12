function doGet(request) {
  return HtmlService.createTemplateFromFile('Index').evaluate()
.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}


  // Trigger table creation when the DOM is ready.
document.addEventListener("DOMContentLoaded", createTable);

function createTable() {

  // Show the loading progress bar when data is being fetched
  document.getElementById("loading-bar").style.display = "flex";  // Show progress bar

  const totalDataPoints = 42480;
  // Set the chunk size (in increments)
  const chunkSize = 500;
  let currentProgress = 0;

// Simulate loading by updating the progress bar in chunks
    function updateProgress() {
      if (currentProgress < totalDataPoints) {
        currentProgress += chunkSize;  // Increase progress by chunk size (500)
        if (currentProgress > totalDataPoints) {
          currentProgress = totalDataPoints;  // Cap the progress to totalDataPoints
        }
        const progressPercentage = (currentProgress / totalDataPoints) * 100;
        document.getElementById("progress").style.width = `${progressPercentage}%`;
        document.getElementById("progress-text").textContent = `${currentProgress} / ${totalDataPoints}`;
      }
    }

    // Simulate progress bar update every 100ms (this is just visual)
    const progressInterval = setInterval(updateProgress, 100);

    // Stop the progress bar after it reaches 100% (or simulating end of loading)
    setTimeout(() => {
      clearInterval(progressInterval); // Stop the progress bar once it's done
      document.getElementById("loading-bar").style.display = "none";  // Hide the progress bar
    }, 11000);  // Simulate loading for 11 seconds (adjustable)
  
  google.script.run.withSuccessHandler((tableData) => {
    console.log(tableData);

    let table = new Tabulator("#example-table", {
      data: tableData,
      pagination: true,
      paginationSize: 10,
      paginationSizeSelector: true,
      paginationCounter:"rows", //add pagination row counter
      movableColumns: true,
      responsiveLayout: "collapse",
      layout: "fitColumns",
      columnDefaults: { tooltip: true },
      columns: [
        {title:"", field:"Billede", formatter:"image", formatterParams:{ height:"70px", width:"70px"}, width: 85},
        { title: "Kemikalie", field: "Kemikalie", headerFilter: true, width: 300 },
        { title: "CAS nr.", field: "CAS nummer", headerFilter: true },
        { title: "Vare nr.", field: "Vare nummer", headerFilter: true },
        { title: "Produkt type", field: "Produkt type", headerFilter: true },
        { title: "Produkt", field: "Produkt", headerFilter: true },
        { title: "Gennembrudstid", field: "Gennembrudstid", headerFilter: true },
        { title: "Index", field: "Index", headerFilter: true, width: 100, formatter: function(cell) { 
          let value = cell.getValue();
          let color = value === "Index: 1" ? "#d53243" : value === "Index: 2" ? "#e8862b" : value === "Index: 3" ? "#e8862b" : value === "Index: 4" ? "#f1b833" : value === "Index: 5" ? "#abb731" : value === "Index: 6" ? "#abb731" : value === "Index: A" ? "#d53243" : value === "Index: B" ? "#d53243" : value === "Index: 0" ? "#d53243" : "white";   
          cell.getElement().style.backgroundColor = color; 
          return value; } },
        { title: "Link", field: "URL", formatter:"link", width: 82, formatterParams:{ labelField:"Link", target:"_blank",} }
      ],
    });

    table.on("rowClick", function (e, row) {
      showPopup(row.getData());
    });

    // Add event listener for global search
      document.getElementById("global-search").addEventListener("keyup", function() {
        let searchTerm = this.value;
        table.setFilter((data) => {
          // Search all columns
          return Object.values(data).some(value => 
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
          );
        });
      });



  }).getData();
}

function showPopup(data) {
  let popup = document.getElementById("popup");

  // Create popup if it doesn't exist
  if (!popup) {
    popup = document.createElement("div");
    popup.id = "popup";
    document.body.appendChild(popup);

    // Add basic styling
    popup.style.position = "fixed";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.backgroundColor = "#fff";
    popup.style.padding = "20px";
    popup.style.border = "1px solid #ccc";
    popup.style.zIndex = "1000";
    popup.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.5)";
  }

  // Update popup content
  popup.innerHTML = `
    <div class="popup-content">
      <h2>Testresultat</h2>
      <p><strong>Kemikalie:</strong> ${data.Kemikalie}</p>
      <p><strong>CAS nummer:</strong> ${data["CAS nummer"]}</p>
      <p><strong>Vare nummer:</strong> ${data["Vare nummer"]}</p>
      <p><strong>Produkt type:</strong> ${data["Produkt type"]}</p>
      <p><strong>Produkt:</strong> 
        <a href="${data["URL"]}">
        ${data.Produkt}
        </a>
      </p>
      <p><strong>Gennembrudstid:</strong> ${data.Gennembrudstid}</p>
      <p><strong>Index:</strong> ${data.Index}</p>
      <button onclick="closePopup()">Luk</button>
    </div>
  `;

  // Ensure the popup is visible
  popup.style.display = "block";
}

function closePopup() {
  const popup = document.getElementById("popup");
  if (popup) popup.style.display = "none";
}



/**
 * Implements "greater than" filtering for Tabulator column headers.
 *
 * @param {string} headerValue Text entered in the filter input.
 * @param {number|string} rowValue Current row's value for the column.
 * @returns {boolean} True if rowValue > headerValue, otherwise false.
 */
  function greaterThanFilter(headerValue, rowValue){
    // Convert values to numbers for comparison (if necessary)
    headerValue = parseFloat(headerValue);
    rowValue = parseFloat(rowValue);

    //Greater than logic
    return rowValue > headerValue;
  }


  /**
 * Implements "less than" filtering for Tabulator column headers.
 *
 * @param {string} headerValue Text entered in the filter input.
 * @param {number|string} rowValue Current row's value for the column.
 * @returns {boolean} True if rowValue > headerValue, otherwise false.
 */
  function lessThanFilter(headerValue, rowValue){
    // Convert values to numbers for comparison (if necessary)
    headerValue = parseFloat(headerValue);
    rowValue = parseFloat(rowValue);

    //Greater than logic
    return rowValue < headerValue;
  }

  <!-- JavaScript to toggle modals -->
  function toggleModal(id) {
    document.getElementById(id).style.display = 'block';
  }

  function closeModal(id) {
    document.getElementById(id).style.display = 'none';
  }