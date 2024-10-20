// OpenWeather API Key
const apiKey = "711d84bb7023c218290e992da2d101f0";

// Elements
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherCard = document.getElementById("weatherCard");
const defaultState = document.getElementById("defaultState");
const charts = document.getElementById("charts");
const loader = document.getElementById("loader");
const unitToggle = document.getElementById("unitToggle");

const cityName = document.getElementById("cityName");
const weatherDescription = document.getElementById("weatherDescription");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");

let barChart, doughnutChart, lineChart;
let tempUnit = "metric"; // default to Celsius
let isCelsius = true; // default unit

// Event Listener for search button
searchBtn.addEventListener("click", () => {
  const city = cityInput.value;
  if (city) {
    getWeather(city);
  }
});

// Event Listener for unit toggle
unitToggle.addEventListener("click", () => {
  isCelsius = !isCelsius;
  unitToggle.innerText = isCelsius ? "Switch to °F" : "Switch to °C";
  tempUnit = isCelsius ? "metric" : "imperial";
  // Reload weather data if a city is already searched
  if (cityInput.value) {
    getWeather(cityInput.value);
  }
});

// Show loader
function showLoader() {
  loader.classList.remove("hidden");
}

// Hide loader
function hideLoader() {
  loader.classList.add("hidden");
}

// Show weather and charts
function showWeatherUI() {
  weatherCard.classList.remove("hidden");
  charts.classList.remove("hidden");
  defaultState.classList.add("hidden");
}

// Fetch Weather Data
function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${tempUnit}&appid=${apiKey}`;
  showLoader();

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const weather = data.list[0].weather[0].description;
      const temp = data.list[0].main.temp;
      const hum = data.list[0].main.humidity;
      const wind = data.list[0].wind.speed;

      // Update UI
      cityName.innerText = data.city.name;
      weatherDescription.innerText = weather;
      temperature.innerText = `${temp}°${isCelsius ? "C" : "F"}`;
      humidity.innerText = `${hum}%`;
      windSpeed.innerText = `${wind} km/h`;

      updateWeatherBackground(weather);
      updateCharts(data);
      showWeatherUI();
    })
    .catch((error) => console.error("Error fetching weather data:", error))
    .finally(hideLoader);
}

// Update Background Based on Weather Condition
function updateWeatherBackground(weather) {
  weatherCard.className =
    "mb-8 p-8 rounded-lg shadow-lg text-white widget-content weather-widget hidden";

  if (weather.includes("clear")) {
    weatherCard.classList.add("bg-blue-400");
  } else if (weather.includes("cloud")) {
    weatherCard.classList.add("bg-gray-500");
  } else if (weather.includes("rain")) {
    weatherCard.classList.add("bg-blue-700");
  } else {
    weatherCard.classList.add("bg-blue-500");
  }
}

// Geolocation
function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  }
}

function showPosition(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${tempUnit}&appid=${apiKey}`;

  showLoader();

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const weather = data.list[0].weather[0].description;
      const temp = data.list[0].main.temp;
      const hum = data.list[0].main.humidity;
      const wind = data.list[0].wind.speed;

      cityName.innerText = data.city.name;
      weatherDescription.innerText = weather;
      temperature.innerText = `${temp}°${isCelsius ? "C" : "F"}`;
      humidity.innerText = `${hum}%`;
      windSpeed.innerText = `${wind} km/h`;

      updateWeatherBackground(weather);
      updateCharts(data);
      showWeatherUI();
    })
    .catch((error) => console.error("Error fetching weather data:", error))
    .finally(hideLoader);
}

// Update Charts with 5-day Forecast Data
function updateCharts(data) {
  const labels = data.list
    .slice(0, 5)
    .map((item) => new Date(item.dt_txt).toLocaleDateString());
  const temps = data.list.slice(0, 5).map((item) => item.main.temp);
  const weatherConditions = data.list
    .slice(0, 5)
    .map((item) => item.weather[0].main);

  const sunnyDays = weatherConditions.filter((cond) => cond === "Clear").length;
  const cloudyDays = weatherConditions.filter(
    (cond) => cond === "Clouds"
  ).length;
  const rainyDays = weatherConditions.filter((cond) => cond === "Rain").length;

  // Destroy previous charts if they exist
  if (barChart) barChart.destroy();
  if (doughnutChart) doughnutChart.destroy();
  if (lineChart) lineChart.destroy();

  // Bar Chart - Temperature
  const barCtx = document.getElementById("barChart").getContext("2d");
  barChart = new Chart(barCtx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: `Temperature (°${isCelsius ? "C" : "F"})`,
          data: temps,
          backgroundColor: "#38b2ac",
          borderColor: "#319795",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      animation: {
        duration: 1000,
      },
    },
  });

  // Doughnut Chart - Weather Conditions
  const doughnutCtx = document.getElementById("doughnutChart").getContext("2d");
  doughnutChart = new Chart(doughnutCtx, {
    type: "doughnut",
    data: {
      labels: ["Sunny", "Cloudy", "Rainy"],
      datasets: [
        {
          label: "Weather Conditions",
          data: [sunnyDays, cloudyDays, rainyDays],
          backgroundColor: ["#ffc800", "#6b7575", "#00387d"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      animation: {
        duration: 1000,
      },
    },
  });

  // Line Chart - Temperature Change for the next 5 days
  const lineCtx = document.getElementById("lineChart").getContext("2d");
  lineChart = new Chart(lineCtx, {
    type: "line",
    data: {
      labels: data.list
        .filter((item, index) => index % 8 === 0)
        .map((item) => new Date(item.dt_txt).toLocaleDateString()),
      datasets: [
        {
          label: `Temperature (°${isCelsius ? "C" : "F"})`,
          data: data.list
            .filter((item, index) => index % 8 === 0)
            .map((item) => item.main.temp),
          borderColor: "#38b2ac",
          fill: false,
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      animation: {
        duration: 1000,
      },
    },
  });
}

// Initialize app by getting user location
getUserLocation();
