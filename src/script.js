//variables
let apiKey = "af4f50d48b0a4d51411f9b27tf613o47";
let date = new Date();
let today = date.getDate();
let year = date.getFullYear();
let currentlocation;
let temperaturecelsius;
let temperaturefahrenheit;
let description;
let feelslike;
let humidity;
let windspeed;
let form = document.querySelector("#city-search");
let hours = addZero(date.getHours());
let minutes = addZero(date.getMinutes());

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[date.getDay()];

let months = [
  "January",
  "Febuary",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
let month = months[date.getMonth()];

let presentDate = document.querySelector("#currentDate");
presentDate.innerHTML = `${day} ${today} ${month} ${year}`;

let presentTime = document.querySelector("#currentTime");
presentTime.innerHTML = `${hours} : ${minutes}`;

// eventlisteners
window.addEventListener("load", getCurrentPosition);

form.addEventListener("submit", search);

//functions
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
  return days[day];
}
function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

function captialise(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function weatherdata(response) {
  currentlocation = response.data.city;
  temperaturecelsius = Math.round(response.data.temperature.current);
  temperaturefahrenheit = Math.round((temperaturecelsius * 9) / 5 + 32);
  description = response.data.condition.description;
  feelslike = Math.round(response.data.temperature.feels_like);
  humidity = response.data.temperature.humidity;
  windspeed = Math.round(response.data.wind.speed);
  weathericon = response.data.condition.icon;
  showTemperature(response.data);
  getForecast(response.data.coordinates);
}

function showCurrentPositionTemperature(response) {
  weatherdata(response);
  changestoHTML();
}

function changestoHTML() {
  let weathericonhtml = document.querySelector("#weathericon");
  weathericonhtml.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${weathericon}.png`
  );
  let currentPositionTemperatureElement =
    document.querySelector("#temperatureChange");
  currentPositionTemperatureElement.innerHTML = `${temperaturecelsius} °C`;
  let h2 = document.querySelector("h2");
  h2.innerHTML = `${currentlocation}`;
  let p = document.querySelector("p");
  p.innerHTML = `${description}`;
  let feelsLike = document.querySelector("#feelslike");
  feelsLike.innerHTML = `Feels-like = ${feelslike} °C`;
  let humidityul = document.querySelector("#humidity");
  humidityul.innerHTML = `Humidity = ${humidity}%`;
  let windspeedul = document.querySelector("#windspeed");
  windspeedul.innerHTML = `Windspeed = ${windspeed} km/h`;
}

function showPosition(position, units = "metric") {
  let longitude = position.coords.longitude;
  let latitude = position.coords.latitude;
  let apiUrlPosition = `https://api.shecodes.io/weather/v1/current?lon=${longitude}&lat=${latitude}&key=${apiKey}&units=${units}`;
  axios.get(apiUrlPosition).then(showCurrentPositionTemperature);
}

function getCurrentPosition(event) {
  event.preventDefault;
  navigator.geolocation.getCurrentPosition(showPosition);
}

function search(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#text-input");
  searchInput.value = captialise(searchInput.value);
  callApi(searchInput.value);
  let h2 = document.querySelector("h2");
  h2.innerHTML = `${searchInput.value}`;
}

function callApi(query, units = "metric") {
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${query}&key=${apiKey}&${units}`;
  axios.get(apiUrl).then(weatherdata);
}

function showTemperature(weatherdata) {
  let weather = weatherdata;
  changestoHTML();
}
//Forecast functions
function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2">
      <img src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
        forecastDay.condition.icon
      }.png" />
      <span>${formatDay(forecastDay.time)}</span>
      <span>${Math.round(forecastDay.temperature.day)} °C</span>
      <span>${forecastDay.condition.description}</span>
    </div>`;
    }
  });
  forecastHTML = forecastHTML + `</div`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates, units = "metric") {
  let apiLocationUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}&${units}`;
  axios.get(apiLocationUrl).then(displayForecast);
}
