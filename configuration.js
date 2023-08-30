import {fetchConfigData, getAllConfigHeaders, insertOrModifyConfiguration} from "./databaseHandler.js"

var configs = []

function processConfigHeaders(response) {
    var resp = JSON.parse(response);
    resp.documents.forEach(doc => {
        if (!configs.includes(doc.header)) {
            configs.push(doc.header);
        }
    });
}

function fetchAllConfigHeadersAsync() {
    return new Promise((resolve, reject) => {
        getAllConfigHeaders(response => {
            resolve(response);
        });
    });
}

async function fetchDataAndProcess() {
    const response = await fetchAllConfigHeadersAsync();
    processConfigHeaders(response);
}

await fetchDataAndProcess();
console.log(configs)

// GUI Elements
var header              = document.getElementById("header");
var originIATA          = document.getElementById("originIATA");
var destinationIATA     = document.getElementById("destinationIATA")
var departureDateFrom   = document.getElementById("departureDateFrom")
var departureDateTo     = document.getElementById("departureDateTo")
var returnDateFrom      = document.getElementById("returnDateFrom")
var returnDateTo        = document.getElementById("returnDateTo")
var minDays             = document.getElementById("minDays")
var maxDays             = document.getElementById("maxDays")
var directFlight        = document.getElementById("directFlight")
var priceNotification   = document.getElementById("priceNotification")
var emailAddress        = document.getElementById("emailAddress")
var additionalInfo      = document.getElementById("additionalInfo")

var dataValid           = document.getElementById("validateData")
const submit = document.getElementById('submit')
submit.addEventListener('click', function() {
    var data = createInsertData();
    insertOrModifyConfiguration(data, function(response) {
        console.log(response)
    })
})

function createInsertData() {
    var json = {}
    json["header"]                  = header.value
    json["originAirportIATA"]       = originIATA.value
    json["destinationAirportIATA"]  = destinationIATA.value
    json["dateFrom"] = {
        "year":     parseInt(departureDateFrom.value.split('-')[0]),
        "month":    parseInt(departureDateFrom.value.split('-')[1]),
        "day":      parseInt(departureDateFrom.value.split('-')[2])
    }
    json["dateTo"] = {
        "year":     parseInt(departureDateTo.value.split('-')[0]),
        "month":    parseInt(departureDateTo.value.split('-')[1]),
        "day":      parseInt(departureDateTo.value.split('-')[2])
    }
    if (returnDateFrom.value && returnDateTo.value) {
        json["dateFromReturn"] = {
            "year":     parseInt(returnDateFrom.value.split('-')[0]),
            "month":    parseInt(returnDateFrom.value.split('-')[1]),
            "day":      parseInt(returnDateFrom.value.split('-')[2]),
        }
        json["dateToReturn"] = {
            "year":     parseInt(returnDateTo.value.split('-')[0]),
            "month":    parseInt(returnDateTo.value.split('-')[1]),
            "day":      parseInt(returnDateTo.value.split('-')[2]),
        }
        json["return"] = "True"
    } else {
        json["return"] = "False"
    }
    json["daysMinimum"]         = parseInt(minDays.value)
    json["daysMaximum"]         = parseInt(maxDays.value)
    if (directFlight.checked) {
        json["onlyDirectFlights"] = "True"
    } else {
        json["onlyDirectFlights"] = "False"
    }
    json["priceNotification"]   = parseInt(priceNotification.value)
    json["emailNotification"]   = {
        "emailAddress":     emailAddress.value,
        "additionalInfo":   additionalInfo.value
    }

    // Check data
    if (validateDates(departureDateFrom.value, departureDateTo.value)) return null
    if (returnDateFrom.value && returnDateTo.value) {
        if (validateDates(returnDateFrom.value, returnDateTo.value)) return null
        if (validateDates(departureDateFrom.value, returnDateFrom.value)) return null
    }
    return json
}

function validateDates(date1, date2) {
    var dateFrom    = new Date(date1)
    var dateTo      = new Date(date2)

    if (dateFrom <= dateTo) return 0
    else {
        console.error("Data invalid\n" + dateFrom + "\n" + dateTo)
        dataValid.textContent = "Data invalid"
        return 1
    }
}

// ===========================================================
//                        NAVIGATION
// ===========================================================

let currentIndex = 0;

const prevConfig        = document.getElementById("prevConfig");
const nextConfig        = document.getElementById("nextConfig");
const configSelector    = document.getElementById("configSelector");
const foldableList      = document.querySelector(".foldable-list-config");

function displayData(index) {
    fetchConfigData(configs[index], function(response) {
        var configuration = JSON.parse(response)
        var cfg = configuration.documents[0]

        // Populate textFields
        header.value            = cfg.header
        originIATA.value        = cfg.originAirportIATA
        destinationIATA.value   = cfg.destinationAirportIATA
        departureDateFrom.value = checkDateLength(cfg.dateFrom)
        departureDateTo.value   = checkDateLength(cfg.dateTo)
        returnDateFrom.value    = checkDateLength(cfg.dateFromReturn)
        returnDateTo.value      = checkDateLength(cfg.dateToReturn)
        minDays.value           = cfg.daysMinimum
        maxDays.value           = cfg.daysMaximum
        if (cfg.onlyDirectFlights === 'True') {
            directFlight.checked = 1
        } else {
            directFlight.checked = 0
        }
        priceNotification.value = cfg.priceNotification
        emailAddress.value      = cfg.emailNotification.emailAddress
        if (cfg.emailNotification.additionalInfo) {
            additionalInfo.value    = cfg.emailNotification.additionalInfo
        }
    })
}

function checkDateLength(dateObject) {
    var correctedDate = ""
    correctedDate += dateObject.year + "-"
    if (dateObject.month.toString().length === 1) {
        correctedDate += "0" + dateObject.month + "-"
    } else {
        correctedDate += dateObject.month + "-"
    }
    if (dateObject.day.toString().length === 1) {
        correctedDate += "0" + dateObject.day
    } else {
        correctedDate += dateObject.day
    }

    return correctedDate
}

function populateDataSelector() {
    configSelector.innerHTML = "";
    configs.forEach((item, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = configs[index];
        configSelector.appendChild(option);
    });
}

prevConfig.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    displayData(currentIndex)
    configSelector.value = currentIndex;
  }
});

nextConfig.addEventListener("click", () => {
  if (currentIndex < configs.length - 1) {
    console.log(configs.length - 1)
    currentIndex++;
    displayData(currentIndex)
    configSelector.value = currentIndex;
  }
});

configSelector.addEventListener("change", (event) => {
  currentIndex = parseInt(event.target.value);
  displayData(currentIndex)
});

populateDataSelector();
displayData(currentIndex)
foldableList.style.display = "block";