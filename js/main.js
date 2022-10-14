// api key
const apiKey = "4e5ea1620ea14a21bfd234944221310";

// search section
const locationInput = document.querySelector("#searchInput");
const findLocationBtn = document.querySelector(".hero button");

// today degree
const dayText = document.querySelector(".card-header");
const city = document.querySelector(".city-name");
const degree = document.querySelector(".degree span");
const weatherStatus = document.querySelector(".weather-status");
const weatherDesc = document.querySelectorAll(".weather-desc span");

// forecast degrees
const tomorrowDayText = document.querySelectorAll(
  ".second-degree-card .card-header"
);
// console.log(tomorrowDayText);
const tomorrowImage = document.querySelectorAll(
  ".second-degree-card .blockquote img"
);
const tomorrowWeatherStatus = document.querySelectorAll(
  ".second-degree-card .weather-status"
);
const tomorrowHighestDegree = document.querySelectorAll(
  ".second-degree-card .highest-degree span"
);
const tomorrowLowestDegree = document.querySelectorAll(
  ".second-degree-card .lowest-degree span"
);

// Event listener for location field
locationInput.addEventListener("input", (e) => {
  if (e.target.value !== "") {
    searchWeather(e.target.value);
  }
});

async function searchWeather(cityNameFromSearch) {
  let apiResponse = await fetch(
    `http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${cityNameFromSearch}`
  );
  let apiDataToBeUsed = await apiResponse.json();
  if (apiDataToBeUsed.length !== 0) {
    let latitude = apiDataToBeUsed[0].lat;
    let longitude = apiDataToBeUsed[0].lon;

    getTodayWeather(await getWeather(`${latitude},${longitude}`));
    getForecastWeather(await getWeather(`${latitude},${longitude}`));
  }
}

async function getWeather(query) {
  let apiResponse = await fetch(
    `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${query}&days=3&aqi=no&alerts=no`
  );
  let apiDataToBeUsed = await apiResponse.json();
  return apiDataToBeUsed;
}

function getTodayWeather(apiDataJson) {
  dayText.textContent = getCurrentDate(
    new Date(apiDataJson.current.last_updated).getDay()
  );

  city.textContent = apiDataJson.location.name;
  weatherStatus.textContent = apiDataJson.current.condition.text;
  degree.textContent = apiDataJson.current.temp_c;
  for (let i = 0; i < weatherDesc.length; i++) {
    weatherDesc[0].childNodes[1].textContent =
      apiDataJson.current.humidity + "%";
    weatherDesc[1].childNodes[1].textContent =
      apiDataJson.current.wind_kph + "km/h";
    weatherDesc[2].childNodes[1].textContent = apiDataJson.current.wind_dir;
  }
}

function getForecastWeather(apiDataJson) {
  for (let i = 0; i < 2; i++) {
    tomorrowDayText[i].innerText = getCurrentDate(
      new Date(apiDataJson.forecast.forecastday[i + 1].date).getDate()
    );

    tomorrowImage[i].src =
      apiDataJson.forecast.forecastday[i + 1].day.condition.icon;

    tomorrowHighestDegree[i].textContent =
      apiDataJson.forecast.forecastday[i + 1].day.maxtemp_c;
    tomorrowLowestDegree[i].textContent =
      apiDataJson.forecast.forecastday[i + 1].day.mintemp_c;
    tomorrowWeatherStatus[i].textContent =
      apiDataJson.forecast.forecastday[i + 1].day.condition.text;
  }
}

function getCurrentDate(dayNumber) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  //   reseting dayNumber
  if (dayNumber > 7) dayNumber = 0;

  for (const [index, day] of days.entries()) {
    if (index == dayNumber) {
      return day;
    }
  }
}

// Auto run script when website is opened
(async function () {
  let weather = await getWeather("cairo");
  getTodayWeather(weather);
  getForecastWeather(weather);
})();
