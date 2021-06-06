// Variables
var savedCities = [];

// Declared Functions
var getForecast = function() {};

var getLocationDetails = function(query) {
    console.log("Starting getLocationDetails");
    console.log("query", query);
    var apiKey = "xaoXvbJ5pvlszBP5BJ6wPn38g8AcLwr0";
    var apiUrl = "http://dataservice.accuweather.com/locations/v1/cities/search?apikey=" + apiKey + "&q=" + query + "details=true&offset=10";

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(forecast) {
                console.log(forecast);
            });
        } else {
            alert("API call failed.");
        }
    });
};

var saveSearch = function(query) {
    savedCities.push(query)

    if (savedCities.length > 5) {
        savedCities.pop();
    }

    console.log("saving city to localStorage.")
    localStorage.setItem("savedCities", JSON.stringify(savedCities));
};

var loadCities = function() {
    console.log("starting loadCities");
    savedCities = JSON.parse(localStorage.getItem("savedCities"));

    if (savedCities) {
        console.log("getting details for last city searched.");
        var index = savedCities.length - 1;
        getLocationDetails(savedCities[index]);
    } else {
        console.log("No saved searches.")
    }
};


var getWeather = function() {
    console.log("executing getWeather");

    loadCities();

    var submitBtn = document.querySelector("#search-btn");
    submitBtn.addEventListener("click", function(event) {
        event.preventDefault();
        var query = document.getElementById("search-text").value;
        saveSearch(query);

    });
};


getWeather();