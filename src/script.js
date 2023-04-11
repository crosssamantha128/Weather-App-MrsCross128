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

//Forecast variables
let forecastDay1 = days[date.getDay() + 1];
let forecastDay2 = days[date.getDay() + 2];
let forecastDay3 = days[date.getDay() + 3];
let forecastDay4 = days[date.getDay() + 4];

let forecastDate1 = document.querySelector("#weekDay1");
forecastDate1.innerHTML = `${forecastDay1}`;

let forecastDate2 = document.querySelector("#weekDay2");
forecastDate2.innerHTML = `${forecastDay2}`;

let forecastDate3 = document.querySelector("#weekDay3");
forecastDate3.innerHTML = `${forecastDay3}`;

let forecastDate4 = document.querySelector("#weekDay4");
forecastDate4.innerHTML = `${forecastDay4}`;

// eventlisteners
window.addEventListener("load", getCurrentPosition);

form.addEventListener("submit", search);

//functions

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

function convertToFahrenheit(event) {
  event.preventDefault();
  temperaturefahrenheit;
  let temperatureElement = document.querySelector("#temperatureChange");
  temperatureElement.innerHTML = `${temperaturefahrenheit} °F`;
}
let fahrenheitLink = document.querySelector("#fahrenheitLink");
fahrenheitLink.addEventListener("click", convertToFahrenheit);

function convertToCelsius(event) {
  event.preventDefault();
  temperaturecelsius;
  let temperatureElement = document.querySelector("#temperatureChange");
  temperatureElement.innerHTML = `${temperaturecelsius} °C`;
}
let celsiusLink = document.querySelector("#celsiusLink");
celsiusLink.addEventListener("click", convertToCelsius);

//Forecast functions
