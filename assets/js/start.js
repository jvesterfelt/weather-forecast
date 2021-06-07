// Variables
var apiKey = "31UtlrRos98rGyvqj7WHtq6hfoeMh50h";
var savedCities = [];

// Declared Functions
var getForecast = function(key, cityName) {
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

var getCurrentConditions = function(key) {
    var apiUrl = "http://dataservice.accuweather.com/currentconditions/v1/" + key + "?apikey=" + apiKey + "&details=true";

    console.log("apiUrl", apiUrl);

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(conditions) {
                console.log("conditions", conditions);
                var windSpeed = conditions[0].Wind.Speed.Imperial.Value;
                var windDirectionDegrees = conditions[0].Wind.Direction.Degrees;
                var windDirection = conditions[0].Wind.Direction.English;
                var uvIndex = conditions[0].UVIndex;
                var uvIndexRating = conditions[0].UVIndexText;
                var humidity = conditions[0].RelativeHumidity;

                var windHeader = document.getElementById("windspeed-header");
                windHeader.textContent = windSpeed + " mp/h";
                var windDirectionText = document.getElementById("wind-direction");
                windDirectionText.textContent = windDirectionDegrees + " degrees " + windDirection;

                var humidityHeader = document.getElementById("humidity-header");
                humidityHeader.textContent = humidity + "%";

                var uvIndexHeader = document.getElementById("uvindex-header");
                uvIndexHeader.textContent = uvIndex;
                var uvIndexText = document.getElementById("uvindex-text");
                uvIndexText.textContent = uvIndexRating;
                var uvCard = document.getElementById("uv-card");

                switch (uvIndexRating) {
                    case "Low":
                        uvCard.setAttribute("style", "background-color: lightseagreen;");
                        console.log("low uvindex");
                        break;

                    case "Moderate":
                        uvCard.setAttribute("style", "background-color: lightyellow;");
                        console.log("moderate uvindex");
                        break;

                    case "High":
                        uvCard.setAttribute("style", "background-color: #ed8e87;");
                        console.log("high uvindex");
                        break;

                    case "Very High":
                        uvCard.setAttribute("style", "background-color: #fa1d0c;");
                        console.log("very high uvindex");
                        break;
                };


            })
        }
    });
};

var getLocationDetails = function(query) {
    var apiUrl = "http://dataservice.accuweather.com/locations/v1/cities/search?apikey=" + apiKey + "&q=" + query + "details=true&offset=10";

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(location) {
                console.log("location", location);
                var key = location[0].Key;
                var cityName = location[0].LocalizedName;

                var cityHeader = document.getElementById("city-header");
                cityHeader.textContent = cityName;

                console.log("Location key:", key, cityName);
                getForecast(key, cityName);
                getCurrentConditions(key);
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