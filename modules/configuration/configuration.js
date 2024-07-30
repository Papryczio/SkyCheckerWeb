import {fetchConfigData, getAllConfigHeaders, insertOrModifyConfiguration, removeConfiguration, removeData} from "/SkyCheckerWeb/libs/databaseHandler.js"
import {map, getIATAcode, getListOfAirports, getAirport} from "/SkyCheckerWeb/libs/IATAdictionary.js"
import { translateConfig } from "/SkyCheckerWeb/libs/translation.js";

var dictionary = translateConfig()

// ================================================================
//                  FETCHING ALL CONFIGURATIONS
// ================================================================
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
console.debug(configs)

// ================================================================
//                          GUI ELEMENTS
// ================================================================

// Update language of labels
configurationName_label.textContent     = dictionary.configuration_name
originAirport_label.textContent         = dictionary.origin_airport
destinationAirport_label.textContent    = dictionary.destination_airport
departureDate_label.textContent         = dictionary.departure_date
returnDate_label.textContent            = dictionary.return_date
fixedDate_label.textContent             = dictionary.date_fixed
isReturn_label.textContent              = dictionary.return_flight
departureDateFrom_label.textContent     = dictionary.departure_date + dictionary.from
departureDateTo_label.textContent       = dictionary.departure_date + dictionary.to
returnDateFrom_label.textContent        = dictionary.return_date + dictionary.from
returnDateTo_label.textContent          = dictionary.return_date + dictionary.to
minDays_label.textContent               = dictionary.minimum_days
maxDays_label.textContent               = dictionary.maximum_days
directFlight_label.textContent          = dictionary.direct
priceNotification_label.textContent     = dictionary.price_notification
emailAddress_label.textContent          = dictionary.email_address
additionalInfo_label.textContent        = dictionary.additional_info

// Update language of helpers
header.title = dictionary.configuration_name_helper

//var header                  = document.getElementById("header");
var originAirport           = document.getElementById("originAirport");
var originAirportHint       = document.getElementById("originAirportHint");
var destinationAirport      = document.getElementById("destinationAirport");
var destinationAirportHint  = document.getElementById("destinationAirportHint");
var departureDateFrom       = document.getElementById("departureDateFrom")
var departureDateTo         = document.getElementById("departureDateTo")
var returnDateFrom          = document.getElementById("returnDateFrom")
var returnDateTo            = document.getElementById("returnDateTo")
var fixedDate               = document.getElementById("fixedDate")
var isReturn                = document.getElementById("isReturn")
var departureDate           = document.getElementById("departureDate")
var returnDate              = document.getElementById("returnDate")
var minDays                 = document.getElementById("minDays")
var maxDays                 = document.getElementById("maxDays")
var directFlight            = document.getElementById("directFlight")
var priceNotification       = document.getElementById("priceNotification")
var emailAddress            = document.getElementById("emailAddress")
var additionalInfo          = document.getElementById("additionalInfo")

var dataValid               = document.getElementById("validateData")

// ================================================================
//              BUTTONS, CHECKBOXES AND LISTENERS
// ================================================================

// Submit new configuration
const submit = document.getElementById('submit')
submit.addEventListener('click', function() {
    var data = createInsertData();
    if (!data) {
        dataValid.textContent = "Data invalid!"
        dataValid.style.color = "red"
    } else {
        insertOrModifyConfiguration(data, function(response) {
            dataValid.textContent = "Data inserted"
            dataValid.style.color = "green"
            console.log(response)
        })
    }
})

// Remove old configuration (without data)
const remove = document.getElementById('remove')
remove.addEventListener('click', function() {

    var userConfirmation = window.confirm("Are you sure you want to delete configuration and it's data?")

    if (userConfirmation) {
        removeConfiguration(configs[currentIndex], function(response) {
            dataValid.textContent = "Config removed"
            dataValid.style.color = "green"
            console.log(response)
        })

        location.reload()
    } else {
        alert("Delete cancelled.")
    }
})

// Remove old configuration (with data)
const removeWithData = document.getElementById('removeWithData')
removeWithData.addEventListener('click', function() {
    var userConfirmation = window.confirm("Are you sure you want to delete configuration and it's data?")
    
    if (userConfirmation) {
        removeConfiguration(configs[currentIndex], function(response) {
            console.log(response)
        })
    
        removeData(configs[currentIndex], function(response) {
            console.log(response)
        })

        location.reload()
    } else {
        alert("Delete cancelled.")
    }
})

// Check if fixed date and return is active
var dateSelectorMonths  = document.getElementById("dateSelectorMonths")
var dateSelectorFixed   = document.getElementById("dateSelectorFixed")
var dateReturnFixed     = document.getElementById("dateRangeReturnFixed")
var dateReturnMonths    = document.getElementById("dateRangeReturnMonths")

fixedDate.addEventListener('change', function() {
    lockDates(fixedDate.checked, isReturn.checked)
})

isReturn.addEventListener('change', function() {
    lockDates(fixedDate.checked, isReturn.checked)
})

function lockDates(isFixed, isReturn) {
    if (isFixed && isReturn) {
        lock_unlock_element(dateSelectorMonths, 1)
        lock_unlock_element(dateSelectorFixed, 0)
        lock_unlock_element(dateReturnFixed, 0)
        lock_unlock_element(dateReturnMonths, 0)
    } else if (isFixed && !isReturn) {
        lock_unlock_element(dateSelectorMonths, 1)
        lock_unlock_element(dateSelectorFixed, 0)
        lock_unlock_element(dateReturnFixed, 1)
        lock_unlock_element(dateReturnMonths, 0)
    } else if (!isFixed && isReturn) {
        lock_unlock_element(dateSelectorMonths, 0)
        lock_unlock_element(dateSelectorFixed, 1)
        lock_unlock_element(dateReturnFixed, 0)
        lock_unlock_element(dateReturnMonths, 0)
    } else {
        lock_unlock_element(dateSelectorMonths, 0)
        lock_unlock_element(dateSelectorFixed, 1)
        lock_unlock_element(dateReturnFixed, 0)
        lock_unlock_element(dateReturnMonths, 1)
    }
}

function lock_unlock_element(element, lock) {
    if(lock) {
        element.style.pointerEvents = 'none'
        element.style.opacity = 0.4
    } else {
        element.style.pointerEvents = 'all'
        element.style.opacity = 1
    }
}

// ================================================================
//                    INSERT CONFIGURATION
// ================================================================

function createInsertData() {
    var json = {}
    
    var originAirportIATA = getIATAcode(originAirport.value)
    var destinationAirportIATA = getIATAcode(destinationAirport.value)

    if(!originAirportIATA || !destinationAirportIATA) {
        console.error("Airport does not exist or has not been configured")
        return null;
    }

    json["header"]                  = header.value
    json["originAirportIATA"]       = originAirportIATA
    json["destinationAirportIATA"]  = destinationAirportIATA

    if (fixedDate.checked) {
        json = insertDateFixed(json)
    } else {
        json = insertDateMonths(json)
    }

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

    json["locale"] = insertLocale()

    // TODO: Check data
    // if (validateDates(departureDateFrom.value, departureDateTo.value)) return null
    // if (returnDateFrom.value && returnDateTo.value) {
    //     if (validateDates(returnDateFrom.value, returnDateTo.value)) return null
    //     if (validateDates(departureDateFrom.value, returnDateFrom.value)) return null
    // }
    return json
}

function insertDateMonths(json) {
    json["dateFrom"] = {
        "year":     parseInt(departureDateFrom.value.split('-')[0]),
        "month":    parseInt(departureDateFrom.value.split('-')[1])
    }
    json["dateTo"] = {
        "year":     parseInt(departureDateTo.value.split('-')[0]),
        "month":    parseInt(departureDateTo.value.split('-')[1])
    }

    if (returnDateFrom.value && returnDateTo.value) {
        json["dateFromReturn"] = {
            "year":     parseInt(returnDateFrom.value.split('-')[0]),
            "month":    parseInt(returnDateFrom.value.split('-')[1])
        }
        json["dateToReturn"] = {
            "year":     parseInt(returnDateTo.value.split('-')[0]),
            "month":    parseInt(returnDateTo.value.split('-')[1])
        }
        json["return"] = "True"
    } else {
        json["return"] = "False"
    }

    json["daysMinimum"]         = parseInt(minDays.value)
    json["daysMaximum"]         = parseInt(maxDays.value)
    json["isFixed"]             = "False"

    return json
}

function insertDateFixed(json) {
    // TODO: HANDLE ONEWAYS
    json["date"] = {
        "year":     parseInt(departureDate.value.split('-')[0]),
        "month":    parseInt(departureDate.value.split('-')[1]),
        "day":      parseInt(departureDate.value.split('-')[2])
    }
    json["dateReturn"] = {
        "year":     parseInt(returnDate.value.split('-')[0]),
        "month":    parseInt(returnDate.value.split('-')[1]),
        "day":      parseInt(returnDate.value.split('-')[2])
    }
    json["return"]  = "True"
    json["isFixed"] = "True"

    return json
}

function insertLocale() {
    var language = localStorage.getItem('languageOfChoice')

    if (language === 'pl') {
        return {
            "market": "PL",
            "locale": "pl-PL",
            "currency": "PLN"
        }
    } else if (language === 'en') {
        return {
            "market": "UK",
            "locale": "en-GB",
            "currency": "GBP"
        }
    }
}

function validateDates(date1, date2) {
    var dateFrom    = new Date(date1)
    var dateTo      = new Date(date2)

    if (dateFrom <= dateTo) return 0
    else {
        console.error("Data invalid\n" + dateFrom + "\n" + dateTo)
        return 1
    }
}

// ===========================================================
//                NAVIGATION BETWEEN CONFIGS
// ===========================================================

let currentIndex = 0;

const prevConfig        = document.getElementById("prevConfig");
const nextConfig        = document.getElementById("nextConfig");
const configSelector    = document.getElementById("configSelector");
const foldableList      = document.querySelector(".foldable-list-config");

function displayData(index) {
    fetchConfigData(configs[index], function(response) {
        var configuration = JSON.parse(response)
        var cfg = configuration.documents[index]

        // Populate textFields
        header.value                = cfg.header
        originAirport.value         = getAirport(cfg.originAirportIATA)
        destinationAirport.value    = getAirport(cfg.destinationAirportIATA)
        if (cfg.isFixed === "True" && cfg.return === "True") {
            departureDate.value     = checkDateLength(cfg.date, 0)
            returnDate.value        = checkDateLength(cfg.dateReturn, 0)
            fixedDate.checked       = true
            isReturn.checked        = true
            lockDates(true, true)
        } else if (cfg.isFixed === "True" && cfg.return === "False") {
            departureDate.value     = checkDateLength(cfg.date, 0)
            fixedDate.checked       = true
            isReturn.checked        = false
            lockDates(true, false)
        } else if (cfg.isFixed === "False" && cfg.return === "True") {
            departureDateFrom.value = checkDateLength(cfg.dateFrom, 1)
            departureDateTo.value   = checkDateLength(cfg.dateTo, 1)
            returnDateFrom.value    = checkDateLength(cfg.dateFromReturn, 1)
            returnDateTo.value      = checkDateLength(cfg.dateToReturn, 1)
            minDays.value           = cfg.daysMinimum
            maxDays.value           = cfg.daysMaximum 
            fixedDate.checked       = false
            isReturn.checked        = true
            lockDates(false, true)
        } else {
            departureDateFrom.value = checkDateLength(cfg.dateFrom, 1)
            departureDateTo.value   = checkDateLength(cfg.dateTo, 1)
            returnDateFrom.value    = checkDateLength(cfg.dateFromReturn, 1)
            returnDateTo.value      = checkDateLength(cfg.dateToReturn, 1)
            minDays.value           = cfg.daysMinimum
            maxDays.value           = cfg.daysMaximum 
            fixedDate.checked       = false
            isReturn.checked        = false
            lockDates(false, false)
        }
        if (cfg.onlyDirectFlights === 'True') {
            directFlight.checked = 1
        } else {
            directFlight.checked = 0
        }
        priceNotification.value     = cfg.priceNotification
        emailAddress.value          = cfg.emailNotification.emailAddress
        if (cfg.emailNotification.additionalInfo) {
            additionalInfo.value    = cfg.emailNotification.additionalInfo
        }
    })
}

function checkDateLength(dateObject, monthOnly) {
    var correctedDate = ""
    correctedDate += dateObject.year + "-"
    if (dateObject.month.toString().length === 1) {
        correctedDate += "0" + dateObject.month
    } else {
        correctedDate += dateObject.month
    }
    if (!monthOnly) {
        correctedDate += "-"
        if (dateObject.day.toString().length === 1) {
            correctedDate += "0" + dateObject.day
        } else {
            correctedDate += dateObject.day
        }
    }

    return correctedDate
}

// Navigation arrows and foldable list
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
  console.log("Data changed to " + currentIndex)
});

populateDataSelector();
displayData(currentIndex)
foldableList.style.display = "block";

// ===========================================================
//                   AIRPORT NAME HINTS
// ===========================================================

var hints = getListOfAirports()

originAirport.addEventListener('input', function () {
    const inputValue = originAirport.value.toLowerCase();
  
    if (inputValue.length === 0) {
        originAirportHint.style.display = 'none';
        return;
    }
  
    const matchingHints = hints.filter((hint) =>
        hint.toLowerCase().includes(inputValue)
    );
  
    if (matchingHints.length === 0) {
        originAirportHint.style.display = 'none';
    } else {
        for (let i = matchingHints.length - 1; i > 5; i--) {
            matchingHints.splice(i, 1);
        }

        const hintList = matchingHints
            .map((hint) => `<div>${hint}</div>`)
            .join('');

        originAirportHint.innerHTML = hintList;
        originAirportHint.style.display = 'block';
    }
});

originAirportHint.addEventListener('click', function (event) {
    if (event.target.tagName === 'DIV') {
        originAirport.value = event.target.textContent;
        originAirportHint.style.display = 'none';
    }
});

destinationAirport.addEventListener('input', function () {
    const inputValue = destinationAirport.value.toLowerCase();
  
    if (inputValue.length === 0) {
        destinationAirportHint.style.display = 'none';
        return;
    }
  
    const matchingHints = hints.filter((hint) =>
        hint.toLowerCase().includes(inputValue)
    );
  
    if (matchingHints.length === 0) {
        destinationAirportHint.style.display = 'none';
    } else {
        for (let i = matchingHints.length - 1; i > 5; i--) {
            matchingHints.splice(i, 1);
        }

        const hintList = matchingHints
            .map((hint) => `<div class="airportHint">${hint}</div>`)
            .join('');

        destinationAirportHint.innerHTML = hintList;
        destinationAirportHint.style.display = 'block';
    }
});

destinationAirportHint.addEventListener('click', function (event) {
    if (event.target.tagName === 'DIV') {
        destinationAirport.value = event.target.textContent;
        destinationAirportHint.style.display = 'none';
    }
});