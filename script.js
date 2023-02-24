var icons = document.getElementById('icons');
var currentWeather = document.getElementById('currentDay');

async function getCityWeather(cityName) {
    var apiEndpoint = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=9a79cae9bb4ffc11b3eac88fea11149c`;
    var geocodingResponse = await fetch(apiEndpoint);
    var geocodingData = await geocodingResponse.json();
    var {lat, lon} = geocodingData[0];
    console.log("Geocoding Data ",geocodingData);

    // In this one we will make sure to specify that we want the the data to be in imperial units instead of kelvin
    var weatherEndpoint = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&exclude=hourly&units=imperial&appid=9a79cae9bb4ffc11b3eac88fea11149c`;
    var weatherResponse = await fetch(weatherEndpoint);
    var weatherData = await weatherResponse.json();
    console.log("Data: ",weatherData);

    // This is logging the current temp of the specified city
    console.log("temp:",weatherData.list[0].main.temp);

    // Looping through the data incrementing by 8 each time to get daily forecast
    for (var i = 2; i < 40; i+=8) {
        var day = new Date(weatherData.list[i].dt_txt);
        day = day.toLocaleDateString();

        console.log("Day ",weatherData.list[i].dt_txt);
        console.log("Temp ",weatherData.list[i].main.temp);
        //console.log("Icon ",weatherData.list[i].weather[0].icon);

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
        temperature.innerHTML = "Temp: " + weatherData.list[i].main.temp + "\u00B0F";
        wind.innerHTML = "Wind: " + weatherData.list[i].wind.speed + " MPH";
        hum.innerHTML = "Humidity: " + weatherData.list[i].main.humidity + "%";

        // Adding items to the weather box
        weatherBox.appendChild(date);
        weatherBox.appendChild(icon);
        weatherBox.appendChild(temperature);
        weatherBox.appendChild(wind);
        weatherBox.appendChild(hum);
        icons.appendChild(weatherBox);
    }

    // <div class="top">
    //         <h2 id="city">Chicago</h2>
    //         <h2 id="date">Chicago</h2>
    //         <img src="" alt="" id="iconLocation">
    //     </div>
    //     <p id="temp">12</p>
    //     <p id="wind">13</p>
    //     <p id="humidity">14</p>

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
        
        currentCity.innerHTML = weatherData.city.name;
        currentDate.innerHTML = "(" + day +")";
        currentIcon.setAttribute('src', iconURL);
        currentTemp.innerHTML = "Temp: " + weatherData.list[0].main.temp + "\u00B0F";
        currentWind.innerHTML = "Wind: " + weatherData.list[0].wind.speed + " MPH";
        currentHum.innerHTML = "Humidity: " + weatherData.list[0].main.humidity + "%";
    }
    getCurrent();
}

getCityWeather("Chicago");