var icons = document.getElementById('icons');
var currentWeather = document.getElementById('currentDay');
var cityWeather = document.getElementById('cityWeather');
var submit = document.getElementById("submit");
var btn1 = document.getElementById("btn1");
var btn2 = document.getElementById("btn2");
var btn3 = document.getElementById("btn3");
var btn4 = document.getElementById("btn4");
var btn5 = document.getElementById("btn5");
var btn6 = document.getElementById("btn6");

var api_key = config.MY_API_KEY;

async function getCityWeather(cityName) {
    document.querySelectorAll("#weatherBox").forEach(box => box.remove());

    var apiEndpoint = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;
    var geocodingResponse = await fetch(apiEndpoint);
    var geocodingData = await geocodingResponse.json();
    var {lat, lon} = geocodingData[0];
    console.log("Geocoding Data ",geocodingData);

    // In this one we will make sure to specify that we want the the data to be in imperial units instead of kelvin
    var weatherEndpoint = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&exclude=hourly&units=imperial&appid=${api_key}`;
    var weatherResponse = await fetch(weatherEndpoint);
    var weatherData = await weatherResponse.json();
    console.log("Data: ",weatherData);

    var currentTemp = document.getElementById('temp');

    let dailyForecasts = [];
    let currentDate = '';
    // Filters the lists and checks if its a new day, if true we will push it to dailyForecasts
    weatherData.list.filter((forecast) => {
        var date = forecast.dt_txt.split(' ')[0];
        if (date !== currentDate) {
            currentDate = date;
            console.log(forecast.dt_txt);
            dailyForecasts.push(forecast);
        } else {
            currentTemp.innerHTML = forecast.main.temp;
        }
    });

    cityWeather.innerHTML = weatherData.city.name + "'s Weather";

    // This is logging the current temp of the specified city
    //console.log("temp:",weatherData.list[0].main.temp);

    for (var i = 0; i < dailyForecasts.length; i++) {
        var day = new Date(dailyForecasts[i].dt_txt);
        day = day.toLocaleDateString();

        // Getting the icon code from data
        var iconCode = weatherData.list[i].weather[0].icon;

        // This is the link where the icons are located we just have to add in the code
        var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
        
        // Here we are creating an img element and giving it a attr of "img" + i and then chaning the src to the icon url. We then append icon to the screen
        var weatherBox = document.createElement('div');
        var date = document.createElement("h2");
        var icon = document.createElement("img");
        var temperature = document.createElement("p");
        var wind = document.createElement("p");
        var hum = document.createElement("p");

        icon.setAttribute('id', 'img' + i);
        weatherBox.setAttribute('id', 'weatherBox');
        icon.style.height = '50px';
        icon.setAttribute('src', iconURL);

        date.innerHTML = day;
        temperature.innerHTML = "Temp: " + dailyForecasts[i].main.temp + "\u00B0F";
        wind.innerHTML = "Wind: " + dailyForecasts[i].wind.speed + " MPH";
        hum.innerHTML = "Humidity: " + dailyForecasts[i].main.humidity + "%";

        // Adding items to the weather box
        weatherBox.appendChild(date);
        weatherBox.appendChild(icon);
        weatherBox.appendChild(temperature);
        weatherBox.appendChild(wind);
        weatherBox.appendChild(hum);
        icons.appendChild(weatherBox);
    }


    function getCurrent() {
        var currentCity = document.getElementById('city');
        var currentDate = document.getElementById('date');
        var currentIcon = document.getElementById('iconLocation');

        var currentTemp = document.getElementById('temp');
        var currentWind = document.getElementById('wind');
        var currentHum = document.getElementById('humidity');

        var iconCode = weatherData.list[0].weather[0].icon;

        // This is the link where the icons are located we just have to add in the code
        var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";

        var currentDay = weatherData.list[0];
        var day = new Date(currentDay.dt_txt);
        day = day.toLocaleDateString();
        
        currentCity.innerHTML = weatherData.city.name + " " + "(" + day +")";
        //currentDate.innerHTML = "(" + day +")";
        currentIcon.setAttribute('src', iconURL);
        currentTemp.innerHTML = "Temp: " + dailyForecasts[0].main.temp + "\u00B0F";
        currentWind.innerHTML = "Wind: " + dailyForecasts[0].wind.speed + " MPH";
        currentHum.innerHTML = "Humidity: " + dailyForecasts[0].main.humidity + "%";
    }

    // Get the value of the search bar and when the the user clicks the submit button the getCityWeather() function will fire

    // Save the value of the last search the user has made so that when they come back the city will still be there for them
    getCurrent();
}

getCityWeather("London");

submit.addEventListener('click', function() {
    var inputVal = document.getElementById("cityName").value;
    getCityWeather(inputVal);
    inputVal = "";
});
btn1.addEventListener('click', function() {
    getCityWeather('New York City');
});
btn2.addEventListener('click', function() {
    getCityWeather('Los Angeles');
});
btn3.addEventListener('click', function() {
    getCityWeather('Chicago');
});
btn4.addEventListener('click', function() {
    getCityWeather('Portland');
});
btn5.addEventListener('click', function() {
    getCityWeather('Seattle');
});
btn6.addEventListener('click', function() {
    getCityWeather('Miami');
});