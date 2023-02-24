var icons = document.getElementById('icons');

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
    for (var i = 0; i < 40; i+=8) {
        //console.log(i);
        console.log("Day ",weatherData.list[i].dt_txt);
        console.log("Temp ",weatherData.list[i].main.temp);
        //console.log("Icon ",weatherData.list[i].weather[0].icon);

        // Getting the icon code from data
        var iconCode = weatherData.list[i].weather[0].icon;

        // This is the link where the icons are located we just have to add in the code
        var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
        // Here we are creating an img element and giving it a attr of "img" + i and then chaning the src to the icon url. We then append icon to the screen
        
        var weatherBox = document.createElement('div');
        var icon = document.createElement("img");
        icon.setAttribute('id', 'img' + i);
        weatherBox.setAttribute('id', 'weatherBox');
        icon.style.height = '50px';
        icon.setAttribute('src', iconURL);

        // Adding items to the weather box
        weatherBox.appendChild(icon);
        icons.appendChild(weatherBox);
    }
}

getCityWeather("Chicago");