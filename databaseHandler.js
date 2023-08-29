export function fetchFlightData(route, callback) {
    var response = "";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            response = this.responseText;
            callback(response);
        }
    };
    xhttp.open("POST", "https://eu-central-1.aws.data.mongodb-api.com/app/data-uiofu/endpoint/data/v1/action/find", true);
    xhttp.send(JSON.stringify({
        "collection": "flightData",
        "database": "skyChecker",
        "dataSource": "SkyChecker",
        "projection": {
            "name": route,
            "from": 1,
            "to": 1,
            "direct": 1,
            "departure": 1,
            "price": 1,
            "return": 1,
            "checkDate": 1
        },
    }));
}

export function fetchConfigData(callback) {
    var response = "";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            response = this.responseText;
            callback(response);
        }
    };
    xhttp.open("POST", "https://eu-central-1.aws.data.mongodb-api.com/app/data-uiofu/endpoint/data/v1/action/find", true);
    xhttp.send(JSON.stringify({
        "collection": "Configuration",
        "database": "skyChecker",
        "dataSource": "SkyChecker",
        "projection": {
            "header": 1,
            "originAirportIATA": 1,
            "destinationAirportIATA": 1,
            "dateFrom": 1,
            "dateTo": 1,
            "dateFromReturn": 1,
            "dateToReturn": 1,
            "daysMinimum": 1,
            "daysMaximum": 1,
            "onlyDirectFlights": 1,
            "return": 1,
            "priceNotification": 1,
            "emailNotification": 1
        },
    }));
}

export function getAllConfigHeaders(callback) {
    var response = "";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            response = this.responseText;
            callback(response);
        }
    };
    xhttp.open("POST", "https://eu-central-1.aws.data.mongodb-api.com/app/data-uiofu/endpoint/data/v1/action/find", true);
    xhttp.send(JSON.stringify({
        "collection": "Configuration",
        "database": "skyChecker",
        "dataSource": "SkyChecker",
        "projection": {
            "header": 1,
        },
    }));
}

export function insertConfiguration(configMap, callback) {
    var response = "";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            response = this.responseText;
            callback(response);
        }
    };
    
    xhttp.open("POST", "https://eu-central-1.aws.data.mongodb-api.com/app/data-uiofu/endpoint/data/v1/action/insertOne", true);
    xhttp.setRequestHeader("content-type", "application/json")
    xhttp.send(JSON.stringify({
        "collection": "Configuration",
        "database": "skyChecker",
        "dataSource": "SkyChecker",
        "document": configMap
    }));
}