// Variables
var apiKey = "xaoXvbJ5pvlszBP5BJ6wPn38g8AcLwr0";
var savedCities = [];

// Declared Functions
var getForecast = function(key) {
    console.log("key", key);
    var apiUrl = "http://dataservice.accuweather.com/forecasts/v1/daily/5day/" + key + "?apikey=" + apiKey;
    console.log("apiUrl getForecast", apiUrl);

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            console.log("getForecast response ok");
            response.json().then(function(forecast) {
                console.log("Forecast details", forecast);
                var dayPhrase = [];
                var dayIcon = [];
                var dayDate = [];
                var dayHigh = [];
                var dayLow = [];
                for (var i = 0; i < 5; i++) {
                    dayPhrase.push(forecast.DailyForecasts[i].Day.IconPhrase);
                    dayIcon.push(forecast.DailyForecasts[i].Day.Icon);
                    dayDate.push(forecast.DailyForecasts[i].Date);
                    dayHigh.push(forecast.DailyForecasts[i].Temperature.Maximum.Value);
                    dayLow.push(forecast.DailyForecasts[i].Temperature.Minimum.Value);
                }
            })
        }
    });
};

var getLocationDetails = function(query) {
    var apiUrl = "http://dataservice.accuweather.com/locations/v1/cities/search?apikey=" + apiKey + "&q=" + query + "details=true&offset=10";

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(location) {
                var key = location[0].Key;
                console.log("location key", key);
                getForecast(key);
            });
        } else {
            alert("API call failed.");
        }
    });
};

var saveSearch = function(query) {
    if (!savedCities.includes(query)) {
        savedCities.push(query)
    } else {
        return;
    }

    if (savedCities.length > 5) {
        savedCities.shift();
    }

    localStorage.setItem("savedCities", JSON.stringify(savedCities));
};

var loadCities = function() {
    savedCities = JSON.parse(localStorage.getItem("savedCities"));

    if (savedCities) {
        var index = savedCities.length - 1;
        getLocationDetails(savedCities[index]);
    } else {
        console.log("No saved searches.")
    }
};


var getWeather = function() {
    loadCities();

    var submitBtn = document.querySelector("#search-btn");
    submitBtn.addEventListener("click", function(event) {
        event.preventDefault();
        var query = document.getElementById("search-text").value;
        saveSearch(query);
        query.value = "";
    });
};


getWeather();