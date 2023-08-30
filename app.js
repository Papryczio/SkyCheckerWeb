import {fetchFlightData, fetchAllFlightHeaders} from "./databaseHandler.js"

const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar__menu');

menu.addEventListener('click', function() {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
})

// Fetching configured routes
let routes = [];

function processFlightHeaders(response) {
    var resp = JSON.parse(response);
    resp.documents.forEach(doc => {
        if (!routes.includes(doc.name)) {
            routes.push(doc.name);
        }
    });
}

function fetchAllFlightHeadersAsync() {
    return new Promise((resolve, reject) => {
        fetchAllFlightHeaders(response => {
            resolve(response);
        });
    });
}

async function fetchDataAndProcess() {
    const response = await fetchAllFlightHeadersAsync();
    processFlightHeaders(response);
}

await fetchDataAndProcess();

// ================
// Analyze the data
// ================

function getAverage(json) {
    var avgPrice = 0;
    json.documents.forEach(doc => {
        avgPrice += doc.price;
    });
    avgPrice /= json.documents.length;
    return parseInt(avgPrice) + " PLN"
}

function getLow(json) {
    var minPrice = 99999999;
    var date = "never";
    json.documents.forEach(doc => {
        if(doc.price <= minPrice) {
            minPrice = doc.price;
            date = doc.checkDate;
        }
    })
    return [minPrice + " PLN", date];
}

function getDataSet(json) {
    var dataSet = [];
    json.documents.forEach(doc => {
        dataSet.push({ x: doc.checkDate, y: doc.price});
    });
    console.log(dataSet)
    return dataSet;
}

// Create a chart

var myChart;

function createChart(json, canva) {
    console.log(json)
    const data = {
        datasets: [{
            label: json.documents[0].name,
            data: getDataSet(json),
            backgroundColor: 'rgba(54, 162, 235, 1)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2.5,
            cubicInterpolationMode: "monotone",
            tension: 0.4,
            pointRadius: 3,
            pointHoverRadius: 8
        }]
    };

    const afterLabel = (tooltipItem) => {
        var date1 = parseInt(new Date(tooltipItem.parsed.x).getTime())
        var labelText = ""
        json.documents.forEach(entry => {
            var date2 = parseInt(new Date(entry.checkDate).getTime())
            if (date1 === date2) {
                labelText += "Price: " + entry.price + " PLN"
                labelText += "\nDeparture: " + entry.departure;
                if (entry.return) {
                    labelText += "\nReturn: " + entry.return;
                }
                labelText += "\nDirect: " + entry.direct
            }
        })
        return labelText
    }

    const label = (tooltipItem) => {
        var date = new Date(tooltipItem.parsed.x)
        return "Date: " + date
    }

    const options = {
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Price'
                }
            },
            x: {
                type: 'time',
                time: {
                    unit: 'day',
                    tooltipFormat: 'MMM d',
                    displayFormats: {
                        day: 'MMM d',
                    }
                },
                title: {
                    display: true,
                    text: 'Date'
                }
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    afterLabel: afterLabel,
                    label: label
                }
            }
        }
    }
    myChart = new Chart(canva, {
        type: 'line',
        data: data,
        options: options
    });
}

// ==============
// Current prices
// ==============

// Display elements
const checkDate         = document.getElementById("checkDate");
const flightHeader      = document.getElementById("flightHeader");
const flightPrice       = document.getElementById("flightPrice");
const flightDeparture   = document.getElementById("flightDeparture");
const flightReturn      = document.getElementById("flightReturn");
const flightDirect      = document.getElementById("flightDirect");
const lowestPrice       = document.getElementById("lowestPrice");
const ctx               = document.getElementById('myChart').getContext('2d');

// Navigation
let currentIndex = 0;
const prevButton    = document.getElementById("prevButton");
const nextButton    = document.getElementById("nextButton");
const dataSelector  = document.getElementById("dataSelector");
const foldableList  = document.querySelector(".foldable-list");

function displayData(index) {
    fetchFlightData(routes[index], function(response) {
        var flight = JSON.parse(response)
        // Current data
        var lastIndex = flight.documents.length - 1

        checkDate.textContent       = 'Last check: '    + flight.documents[lastIndex].checkDate;
        flightHeader.textContent    = 'Route: '         + routes[index];
        flightPrice.textContent     = 'Current price: ' + flight.documents[lastIndex].price + " PLN";
        flightDeparture.textContent = 'Departure: '     + flight.documents[lastIndex].departure;
        flightReturn.textContent    = 'Return: '        + flight.documents[lastIndex].return;
        flightDirect.textContent    = 'Direct: '        + flight.documents[lastIndex].direct;

        // Historic data
        var historicLow = getLow(flight)
        lowestPrice.textContent = 'The lowest price ' + historicLow[0] + ' on ' + historicLow[1].split('T')[0];
        averagePrice.textContent = 'The average price is: ' + getAverage(flight)

        // Graph
        if (myChart) {
            console.log("Rozdupcam")
            myChart.destroy();
        }
        
        createChart(flight, ctx);
    });
}

function populateDataSelector() {
    dataSelector.innerHTML = "";
    routes.forEach((item, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = routes[index];
        dataSelector.appendChild(option);
    });
}

prevButton.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    displayData(currentIndex);
    dataSelector.value = currentIndex;
  }
});

nextButton.addEventListener("click", () => {
  if (currentIndex < routes.length - 1) {
    console.log(routes.length - 1)
    currentIndex++;
    displayData(currentIndex);
    dataSelector.value = currentIndex;
  }
});

dataSelector.addEventListener("change", (event) => {
  currentIndex = parseInt(event.target.value);
  displayData(currentIndex);
});

populateDataSelector();
displayData(currentIndex);
foldableList.style.display = "block";