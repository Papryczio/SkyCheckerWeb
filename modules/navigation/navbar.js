import { translateNavbar } from "../../libs/translation.js"

var dictionary = translateNavbar()

main_page.textContent       = dictionary.main_page
flights_page.textContent    = dictionary.flights_page
config_page.textContent     = dictionary.config_page    

// At page start -> translate based on stored language.
var STORED_LANGUAGE     = localStorage.getItem('languageOfChoice')
var languageSelector    = document.getElementById("languageSelector")
languageSelector.value = STORED_LANGUAGE

// Foldable list listener
languageSelector.addEventListener("change", (event) => {
    var newLanguage = event.target.value;
    console.debug(newLanguage)
    localStorage.setItem('languageOfChoice', newLanguage)
    location.reload()
});