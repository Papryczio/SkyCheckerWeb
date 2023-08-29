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