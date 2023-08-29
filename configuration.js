import {fetchConfigData, getAllConfigHeaders, insertConfiguration} from "./databaseHandler.js"

var routes = []

// fetchConfigData(function(response) {
//     var configs = JSON.parse(response)
//     console.log(configs)
// });

// getAllConfigHeaders(function(response) {
//     const res = JSON.parse(response)
//     res.documents.forEach(element => {
//         routes.push(element.header)
//         console.log(element.header)
//     });
// })

function createInsertData() {
    var json = {}
    json["header"]                  = document.getElementById("header").value
    json["originAirportIATA"]       = document.getElementById("originIATA").value;
    json["destinationAirportIATA"]  = document.getElementById("destinationIATA").value;
    json["dateFrom"] = {
        "year":     parseInt(document.getElementById("departureDateFrom").value.split('-')[0]),
        "month":    parseInt(document.getElementById("departureDateFrom").value.split('-')[1]),
        "day":      parseInt(document.getElementById("departureDateFrom").value.split('-')[2])
    }
    json["dateTo"] = {
        "year":     parseInt(document.getElementById("departureDateTo").value.split('-')[0]),
        "month":    parseInt(document.getElementById("departureDateTo").value.split('-')[1]),
        "day":      parseInt(document.getElementById("departureDateTo").value.split('-')[2]),
    }
    if (document.getElementById("returnDateFrom").value && document.getElementById("returnDateTo").value) {
        json["dateFromReturn"] = {
            "year":     parseInt(document.getElementById("returnDateFrom").value.split('-')[0]),
            "month":    parseInt(document.getElementById("returnDateFrom").value.split('-')[1]),
            "day":      parseInt(document.getElementById("returnDateFrom").value.split('-')[2]),
        }
        json["dateToReturn"] = {
            "year":     parseInt(document.getElementById("returnDateTo").value.split('-')[0]),
            "month":    parseInt(document.getElementById("returnDateTo").value.split('-')[1]),
            "day":      parseInt(document.getElementById("returnDateTo").value.split('-')[2]),
        }
        json["return"] = "True"
    } else {
        json["return"] = "False"
    }
    json["daysMinimum"] = document.getElementById("minDays").value
    json["daysMaximum"] = document.getElementById("maxDays").value
    // if()
    // "return": 1, -- if return date filled in
    //     // "priceNotification": 1,
    //     // "emailNotification": 1
    // }
    console.log(json)
    console.log(JSON.stringify(json))
    return json
}

const submit = document.querySelector('button')

submit.addEventListener('click', function() {
    createInsertData();    
})

// insertConfiguration(json, function(response) {
    
//     console.log(response, json)
// })