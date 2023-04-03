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

let button = document.querySelector("#currentlocationweather");

// eventlisteners
form.addEventListener("submit", search);

button.addEventListener("click", getCurrentPosition);

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

function weatherdata(response) {
  currentlocation = response.data.city;
  temperaturecelsius = Math.round(response.data.temperature.current);
  temperaturefahrenheit = Math.round((temperaturecelsius * 9) / 5 + 32);
  description = response.data.condition.description;
  feelslike = Math.round(response.data.temperature.feels_like);
  humidity = response.data.temperature.humidity;
  windspeed = Math.round(response.data.wind.speed);
  showTemperature(response.data);
}

function showTemperature(weatherdata) {
  let weather = weatherdata;
  let temperatureElement = document.querySelector("#temperatureChange");
  temperatureElement.innerHTML = `${temperaturecelsius} °C`;
  let p = document.querySelector("p");
  p.innerHTML = `${description}`;
}

function showPosition(position, units = "metric") {
  let longitude = position.coords.longitude;
  let latitude = position.coords.latitude;
  let apiUrlPosition = `https://api.shecodes.io/weather/v1/current?lon=${longitude}&lat=${latitude}&key=${apiKey}&units=${units}`;
  axios.get(apiUrlPosition).then(showCurrentPositionTemperature);
}

function showCurrentPositionTemperature(response) {
  weatherdata(response);
  let currentPositionTemperatureElement =
    document.querySelector("#temperatureChange");
  currentPositionTemperatureElement.innerHTML = `${temperaturecelsius} °C`;
  let h2 = document.querySelector("h2");
  h2.innerHTML = `${currentlocation}`;
  let p = document.querySelector("p");
  p.innerHTML = `${description}`;
}

function getCurrentPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}
