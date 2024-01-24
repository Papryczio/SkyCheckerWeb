var translation_navbar = {
    English: {
        main_page: "Home",
        flights_page: "Flights",
        config_page: "Config"
    },
    Polish: {
        main_page: "Strona główna",
        flights_page: "Loty",
        config_page: "Konfiguracja"
    }
}

var translation_flights = {
    English: {
        previous_button: "Previous",
        next_button: "Next",
        last_check: "Last check: ",
        route: "Route: ",
        current_price: "Current price: ",
        departure: "Departure date: ",
        return: "Return date: ",
        direct: "Direct: ",
        lowest_price: "Lowest price: ",
        average_price: "Average price: ",
        on_day: " on ",
        date: "Date",
        price: "Price"
    },
    Polish: {
        previous_button: "Poprzedni",
        next_button: "Następny",
        last_check: "Ostatnie sprawdzenie: ",
        route: "Trasa: ",
        current_price: "Obecna cena: ",
        departure: "Data wylotu: ",
        return: "Data powrotu: ",
        direct: "Bezpośredni: ",
        lowest_price: "Najniższa cena: ",
        average_price: "Średnia cena: ",
        on_day: " w dniu ",
        date: "Data",
        price: "Cena"
    }
}

var translation_configuration = {
    English: {
        configuration_name: "Configuration name",
        configuration_name_helper: "Unique name of the configuration",
        origin_airport: "From",
        destination_airport: "To",
        date_fixed: "Date fixed?",
        return_flight: "Return flight?",
        departure_date: "Depart",
        return_date: "Return",
        from: " from",
        to: " to",
        minimum_days: "Minumum days",
        maximum_days: "Maximum days",
        direct: "Direct flight?",
        price_notification: "Price notification threshold",
        email_address: "Email address",
        additional_info: "Additional info to be included in email notification",
        submit: "Submit",
        remove_config: "Remove configuration",
        remove_config_and_data: "Remove configuration with its data"
    },
    Polish: {
        configuration_name: "Nazwa konfiguracji",
        configuration_name_helper: "Unikalna nazwa konfiguracji",
        origin_airport: "Skąd?",
        destination_airport: "Dokąd?",
        date_fixed: "Ustalone daty?",
        return_flight: "W obie strony?",
        departure_date: "Wylot",
        return_date: "Powrót",
        from: " od",
        to: " do",
        minimum_days: "Minumum dni pobytu",
        maximum_days: "Maksimum dni pobytu",
        direct: "Połączenie bezpośrednie?",
        price_notification: "Powiadomienie poniżej kwoty",
        email_address: "Adres e-mail",
        additional_info: "Dodatkowe informacje uwzględniane w powiadomieniu",
        submit: "Zatwierdź",
        remove_config: "Usuń konfigurację",
        remove_config_and_data: "Usuń konfigurację oraz dane"
    }
}

export function translateNavbar() {
    var STORED_LANGUAGE = localStorage.getItem('languageOfChoice')

    switch (STORED_LANGUAGE) {
        default:
        case "English":
            return translation_navbar.English
        case "Polish":
            return translation_navbar.Polish
    }
}

export function translateFlights() {
    var STORED_LANGUAGE = localStorage.getItem('languageOfChoice')

    switch (STORED_LANGUAGE) {
        default:
        case "English":
            return translation_flights.English
        case "Polish":
            return translation_flights.Polish
    }
}

export function translateConfig() {
    var STORED_LANGUAGE = localStorage.getItem('languageOfChoice')

    switch (STORED_LANGUAGE) {
        default:
        case "English":
            return translation_configuration.English
        case "Polish":
            return translation_configuration.Polish
    }
}