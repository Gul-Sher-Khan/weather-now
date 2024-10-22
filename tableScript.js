const apiKey = "711d84bb7023c218290e992da2d101f0";
const weatherTable = document.getElementById("weatherTable");
const prevPageBtn = document.getElementById("prevPage");
const nextPageBtn = document.getElementById("nextPage");
const sortAscBtn = document.getElementById("sortAsc");
const sortDescBtn = document.getElementById("sortDesc");
const filterRainBtn = document.getElementById("filterRain");
const highestTempBtn = document.getElementById("highestTemp");

let forecasts = [];
let currentPage = 1;
const itemsPerPage = 10;

const chatbox = document.getElementById("chatbox");
const chatInput = document.getElementById("chatInput");
const chatBtn = document.getElementById("chatBtn");
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");

// Fetch weather data for the entered city
searchBtn.addEventListener("click", () => {
  const city = cityInput.value;
  getWeather(city);
});

function getWeather(city) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      forecasts = data.list; // Get all the forecasts
      currentPage = 1;
      renderTable();
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
    });
}

// Function to render the table with pagination
function renderTable() {
  weatherTable.innerHTML = ""; // Clear previous data
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, forecasts.length);
  const currentItems = forecasts.slice(startIndex, endIndex);

  currentItems.forEach((forecast) => {
    const date = new Date(forecast.dt * 1000).toLocaleString();
    const temperature = forecast.main.temp;
    const condition = forecast.weather[0].description;
    const row = `
              <tr>
                  <td class="px-4 py-2 border">${date}</td>
                  <td class="px-4 py-2 border">${cityInput.value}</td>
                  <td class="px-4 py-2 border">${temperature}°C</td>
                  <td class="px-4 py-2 border">${condition}</td>
              </tr>
              `;
    weatherTable.innerHTML += row;
  });

  // Disable/enable pagination buttons
  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = endIndex >= forecasts.length;
}

prevPageBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderTable();
  }
});

nextPageBtn.addEventListener("click", () => {
  if (currentPage * itemsPerPage < forecasts.length) {
    currentPage++;
    renderTable();
  }
});

// Filters and Sorting Implementation
sortAscBtn.addEventListener("click", () => {
  forecasts.sort((a, b) => a.main.temp - b.main.temp);
  renderTable();
});

sortDescBtn.addEventListener("click", () => {
  forecasts.sort((a, b) => b.main.temp - a.main.temp);
  renderTable();
});

filterRainBtn.addEventListener("click", () => {
  forecasts = forecasts.filter((f) => f.weather[0].main.includes("Rain"));
  renderTable();
});

highestTempBtn.addEventListener("click", () => {
  const highestTemp = forecasts.reduce((prev, curr) =>
    prev.main.temp > curr.main.temp ? prev : curr
  );
  forecasts = [highestTemp]; // Show only the day with the highest temp
  renderTable();
});

const geminiApiKey = "AIzaSyBoTeby6LkrRBY-z19uvPYFrCMLP9uaKVY"; // Replace with your Gemini API Key
const geminiApiUrl =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

// Chatbot functionality using Gemini API
chatBtn.addEventListener("click", () => {
  const userMessage = chatInput.value;
  if (userMessage.trim() === "") return;

  const userChat = `<p class="bg-gray-200 text-black p-2 rounded-lg mb-2">${userMessage}</p>`;
  chatbox.innerHTML += userChat;

  // Check if the query contains the word "weather"
  if (userMessage.toLowerCase().includes("weather")) {
    // If the query is about the weather, process the forecast data and send the query
    fetchGeminiResponse(userMessage);
  } else {
    // If the query is not weather-related, respond with a custom message
    displayBotResponse("I can only help with weather-related questions.");
  }

  chatInput.value = "";
  chatbox.scrollTop = chatbox.scrollHeight;
});

// Function to fetch response from Gemini API
function fetchGeminiResponse(query) {
  const forecastSummary = generateForecastSummary();

  fetch(geminiApiUrl + `?key=${geminiApiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `User Query: ${query}. \n Forecast Data: ${forecastSummary}`,
            },
          ],
        },
      ],
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      const botResponse =
        data.candidates[0]?.content?.parts[0]?.text ||
        "Sorry, I couldn't generate a response.";
      displayBotResponse(botResponse);
    })
    .catch((error) => {
      console.error("Error fetching Gemini API response:", error);
      displayBotResponse(
        "Sorry, I'm having trouble answering your question right now."
      );
    });
}

// Function to generate a summary of the forecast data
function generateForecastSummary() {
  // For simplicity, you can summarize the first 3-5 items in the forecast data
  let summary = "";

  forecasts.slice(0, 5).forEach((forecast) => {
    const date = new Date(forecast.dt * 1000).toLocaleString();
    const temperature = forecast.main.temp;
    const condition = forecast.weather[0].description;

    summary += `On ${date}, the temperature will be ${temperature}°C with ${condition}. `;
  });

  return summary;
}

function displayBotResponse(response) {
  const botChat = `<p class="bg-gray-800 text-white p-2 rounded-lg mb-2">${response}</p>`;
  chatbox.innerHTML += botChat;
}

// Geolocation
function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  }
}

// Initialize app by getting user location
getUserLocation();
