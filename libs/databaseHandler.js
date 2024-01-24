var API_URL = "https://eu-central-1.aws.data.mongodb-api.com/app/data-opowv/endpoint/data/v1/action/"

export function fetchFlightData(route, callback) {
    var response = "";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            response = this.responseText;
            callback(response);
        }
    };
    xhttp.open("POST", API_URL + "find", true);
    
    xhttp.send(JSON.stringify({
        "collection": "flightData",
        "database": "skyChecker",
        "dataSource": "SkyChecker",
        "filter": {
            "name": route
        },
        "projection": {
            "name": 1,
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

export function fetchAllFlightHeaders(callback) {
    var response = "";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            response = this.responseText;
            callback(response);
        }
    };
    xhttp.open("POST", API_URL + "find", true);
    xhttp.send(JSON.stringify({
        "collection": "flightData",
        "database": "skyChecker",
        "dataSource": "SkyChecker",
        "projection": {
            "name": 1
        },
        "sort": {
            "name": -1
        }
    }));
}

export function fetchConfigData(config, callback) {
    var response = "";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            response = this.responseText;
            callback(response);
        }
    };
    xhttp.open("POST", API_URL + "find", true);
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
            "date": 1,
            "dateReturn": 1,
            "isFixed": 1,
            "daysMinimum": 1,
            "daysMaximum": 1,
            "onlyDirectFlights": 1,
            "return": 1,
            "priceNotification": 1,
            "emailNotification": 1
        },
        // "filter": {
        //     "header": config
        // }
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
    xhttp.open("POST", API_URL + "find", true);
    xhttp.send(JSON.stringify({
        "collection": "Configuration",
        "database": "skyChecker",
        "dataSource": "SkyChecker",
        "projection": {
            "header": 1,
        },
    }));
}

export function insertOrModifyConfiguration(configMap, callback) {
    var response = "";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            response = this.responseText;
            callback(response);
        }
    };
    
    xhttp.open("POST", API_URL + "updateOne", true);
    xhttp.setRequestHeader("content-type", "application/json")
    xhttp.send(JSON.stringify({
        "collection": "Configuration",
        "database": "skyChecker",
        "dataSource": "SkyChecker",
        "filter": {
            "header": configMap.header
        },
        "upsert": true,
        "update": configMap
    }));
}

export function removeConfiguration(header, callback) {
    var response = "";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            response = this.responseText;
            callback(response);
        }
    };

    xhttp.open("POST", API_URL + "deleteOne", true);
    xhttp.setRequestHeader("content-type", "application/json")
    xhttp.send(JSON.stringify({
        "collection": "Configuration",
        "database": "skyChecker",
        "dataSource": "SkyChecker",
        "filter": {
            "header": header
        }
    }));
}

export function removeData(header, callback) {
    var response = "";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            response = this.responseText;
            callback(response);
        }
    };
    xhttp.open("POST", API_URL + "deleteMany", true);
    xhttp.send(JSON.stringify({
        "collection": "flightData",
        "database": "skyChecker",
        "dataSource": "SkyChecker",
        "filter": {
            "name": header
        },
    }));
}