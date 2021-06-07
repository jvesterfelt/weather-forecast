// Variables
var apiKey = "xaoXvbJ5pvlszBP5BJ6wPn38g8AcLwr0";
var savedCities = [];

// Declared Functions
var getForecast = function(key) {
    var apiUrl = "http://dataservice.accuweather.com/forecasts/v1/daily/5day/" + key + "?apikey=" + apiKey;

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(forecast) {
                var date = "";
                var dayPhrase = [];
                var dayIcon = [];
                var dayDate = [];
                var dayHigh = [];
                var dayLow = [];


                for (var i = 0; i < 5; i++) {
                    dayPhrase.push(forecast.DailyForecasts[i].Day.IconPhrase);
                    dayIcon.push(forecast.DailyForecasts[i].Day.Icon);
                    date = forecast.DailyForecasts[i].Date;
                    dayDate.push(moment(date).format("ddd Do, MMM YY"));
                    dayHigh.push(forecast.DailyForecasts[i].Temperature.Maximum.Value);
                    dayLow.push(forecast.DailyForecasts[i].Temperature.Minimum.Value);
                }
                console.log("getForecast sends to loadForecast");
                loadForecast(dayPhrase, dayIcon, dayDate, dayHigh, dayLow);
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
                getForecast(key);
            });
        } else {
            alert("API call failed.");
        }
    });
};

var saveSearch = function(query) {
    getLocationDetails(query);

    if (!savedCities.includes(query)) {
        savedCities.push(query);
    }

    if (savedCities.length > 5) {
        savedCities.shift();
    }

    localStorage.setItem("savedCities", JSON.stringify(savedCities));
};

var loadCities = function() {
    var tempSavedCities = JSON.parse(localStorage.getItem("savedCities"));

    if (tempSavedCities) {
        var list = document.querySelector(".list-group");

        for (var i = 0; i < tempSavedCities.length; i++) {
            var listItem = document.createElement("li");
            listItem.className = "list-group-item";

            var listButton = document.createElement("button");
            listButton.className = "btn btn-outline-success my-2 my-sm-0";
            listButton.setAttribute("type", "submit");
            listButton.setAttribute("id", "city-" + [i]);
            listButton.textContent = tempSavedCities[i];

            listItem.append(listButton);
            list.append(listItem);

            listButton.addEventListener("click", function(event) {
                event.preventDefault();
                console.log("city button clicked");
                getForecast(listButton.textContent);

                for (var i = 0; i < 5; i++) {
                    var iconImage = document.getElementById("img-" + [i]);
                    iconImage.setAttribute("src", "");

                    var cardDay = document.getElementById("day-" + [i]);
                    cardDay.innerHTML = "";
                }
            });
        }

        var index = tempSavedCities.length - 1;
        getLocationDetails(tempSavedCities[index]);
    } else {
        console.log("No saved searches.")
    }
};

var loadLastCity = function(savedCities) {};

var loadForecast = function(dayPhrase, dayIcon, dayDate, dayHigh, dayLow) {
    var card = document.querySelector(".card");

    for (var i = 0; i < 5; i++) {
        var iconImage = document.getElementById("img-" + [i]);
        iconImage.setAttribute("src", "./assets/images/" + dayIcon[i] + ".png");

        var cardDiv = document.getElementById("day-" + [i]);

        var cardTitle = document.createElement("h5");
        cardTitle.className = "card-title";
        cardTitle.textContent = dayDate[i];

        var cardPhrase = document.createElement("p");
        cardPhrase.setAttribute("id", "phrase-" + [i]);
        cardPhrase.className = "card-text";
        cardPhrase.textContent = dayPhrase[i];

        var cardTemps = document.createElement("p");
        cardTemps.className = "card-text";

        var smallText = document.createElement("small");
        smallText.className = "text-muted";
        smallText.textContent = "High: " + dayHigh[i] + " Low: " + dayLow[i];

        cardTemps.append(smallText);

        cardDiv.append(cardTitle, cardPhrase, cardTemps);
    }
};

var getWeather = function() {

    var submitBtn = document.querySelector("#search-btn");
    submitBtn.addEventListener("click", function(event) {
        event.preventDefault();
        var query = document.getElementById("search-text").value;
        saveSearch(query);

        for (var i = 0; i < 5; i++) {
            var iconImage = document.getElementById("img-" + [i]);
            iconImage.setAttribute("src", "");

            var cardDay = document.getElementById("day-" + [i]);
            cardDay.innerHTML = "";
        }
        var searchText = document.getElementById("search-text");
        searchText.textContent = "";
    });

    loadCities();
};


getWeather();