// This is for the title element
var title = document.getElementById("cityTitle");

var clear = document.getElementById("clear");

var icons = document.getElementById('icons');
var currentWeather = document.getElementById('currentDay');
var cityWeather = document.getElementById('cityWeather');

var submit = document.getElementById("submit");
var buttonArea = document.getElementById("buttons");

// Buttons
var btn1 = document.getElementById("btn1");
var btn2 = document.getElementById("btn2");
var btn3 = document.getElementById("btn3");
var btn4 = document.getElementById("btn4");
var btn5 = document.getElementById("btn5");
var btn6 = document.getElementById("btn6");

var api_key = '9a79cae9bb4ffc11b3eac88fea11149c';

var lastSearched = JSON.parse(localStorage.getItem("lastSearched"));
var savedSearches = JSON.parse(localStorage.getItem("savedSearches")) || [];

// Always returns a promise and can be executed in the background asyncronously while other code executes
async function getCityWeather(cityName) {
    document.querySelectorAll("#weatherBox").forEach(box => box.remove()); // Removing boxes everytime function is called. This makes it so boxes aren't being adding to the existing boxes

    // Getting lat and lon from city name
    var apiEndpoint = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;
    var geocodingResponse = await fetch(apiEndpoint); // Awaits response from the API. This makes it so there are .then() statements
    var geocodingData = await geocodingResponse.json();
    var {lat, lon} = geocodingData[0];
    console.log("Geocoding Data ",geocodingData);

    // In this one we will make sure to specify that we want the the data to be in imperial units instead of kelvin
    var weatherEndpoint = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&exclude=hourly&units=imperial&appid=${api_key}`;
    var weatherResponse = await fetch(weatherEndpoint);
    var weatherData = await weatherResponse.json();
    //console.log("Data: ",weatherData);

    var currentTemp = document.getElementById('temp');

    let dailyForecasts = [];
    let currentDate = '';
    
    // Filters the lists and checks if its a new day, if true we will push it to dailyForecasts
    weatherData.list.filter((forecast) => {
        var date = forecast.dt_txt.split(' ')[0];
        if (date !== currentDate) {
            currentDate = date;
            //console.log(forecast.dt_txt);
            dailyForecasts.push(forecast);
        } else {
            currentTemp.innerHTML = forecast.main.temp;
        }
    });

    title.innerHTML = weatherData.city.name + " | Weather Today News";
    cityWeather.innerHTML = weatherData.city.name + "'s Weather";

    // This is logging the current temp of the specified city
    //console.log("temp:",weatherData.list[0].main.temp);

    for (var i = 1; i < dailyForecasts.length; i++) {
        var day = new Date(dailyForecasts[i].dt_txt); // Mon Feb 27 2023 03:00:00 GMT-0600 (Central Standard Time)
        day = day.toLocaleDateString(); // 2/27/2023

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

    // Getting the current days weather
    function getCurrent() {
        var currentCity = document.getElementById('city');
        var currentIcon = document.getElementById('iconLocation');

        var currentTemp = document.getElementById('temp');
        var currentWind = document.getElementById('wind');
        var currentHum = document.getElementById('humidity');

        // Getting icon from the first list
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

// If the lastSearched localStorage is empty or null then we will default the loading location to chicago else we will load the last searched city
if (lastSearched === null || lastSearched === "") {
    getCityWeather("Chicago");
} else {
    getCityWeather(lastSearched);
}

// Function for adding the city to the page after user enters a value into the input
function addCity() {
    // Reloading the page so that duplicates are removed
    window.location.reload();

    var inputVal = document.getElementById("cityName");
    console.log(inputVal.value[0].toUpperCase());

    // Calling getCityWeather function with the value of the text box and passing that as a parameter
    getCityWeather(inputVal.value);

    // Saving the input to a str that will load the last searched city whenever the page gets reloaded
    localStorage.setItem("lastSearched", JSON.stringify(inputVal.value));

    // Creating and setting the buttons
    var cityButton = document.createElement('button');
    cityButton.setAttribute("class", "btn");
    cityButton.value = inputVal.value;

    // Setting the first letter of the input value to be capitalized
    inputVal.value = inputVal.value[0].toUpperCase() + inputVal.value.slice(1);
    cityButton.textContent = inputVal.value;

    buttonArea.append(cityButton);
    savedSearches.push(inputVal.value);

    // clearing the textbox
    inputVal.value = "";

    // This will save the button added to the screen into the localStorage
    localStorage.setItem("savedSearches", JSON.stringify(savedSearches));
}

// Getting rid of any duplicate searches that may have been saved to local Storage
var savedSearches = savedSearches.filter((city, index) => {
    return savedSearches.indexOf(city) === index;
}); 

// Loop through the pastSearch array and add the button to the screen 
for (i = 0; i < savedSearches.length; i++) {
    var cityButton = document.createElement('button');
    cityButton.setAttribute("class", "btn");
    cityButton.textContent = savedSearches[i];
    cityButton.value = cityButton.textContent;

    cityButton.setAttribute("id", "btn" + i);

    buttonArea.append(cityButton);

    // Finding the button pressed and then getting the value of that button and passing that to the getCityWeather function
    document.getElementById("btn" + i).addEventListener('click', function(event) {
        getCityWeather(event.target.value);
    });
}

// Once the user clicks the submit button the button will be added to the page
submit.addEventListener('click', addCity);

clear.addEventListener('click', function() {
    localStorage.removeItem('savedSearches');
    window.location.reload();
});
