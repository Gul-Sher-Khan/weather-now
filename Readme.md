WeatherNow Application
This project is a web-based application that allows users to search for weather forecasts in any city using the OpenWeather API. The application displays the forecast data in a paginated table and includes a chatbot that answers weather-related queries. It also allows users to filter and sort weather data using different filters like highest temperature, rainy days, etc.

Features
Weather Search: Users can search for weather forecasts in any city.
Table View: Displays a 5-day weather forecast (hourly data) in a paginated table, showing 10 entries at a time.
Filters:
Sort temperatures in ascending or descending order.
Filter out days without rain.
Show the day with the highest temperature.
Chatbot: The chatbot answers weather-related questions using the forecast data. If a user asks non-weather questions, it politely informs them that it can only respond to weather-related queries.
Mobile Responsive: The application is fully responsive and adapts to different screen sizes.
Sidebar Navigation: A simple sidebar menu for navigation with a hamburger button for mobile screens.
Technologies Used
HTML/CSS: For page structure and styling.
JavaScript: For dynamic functionalities (like fetching data from the OpenWeather API, chatbot functionality, and pagination).
Tailwind CSS: A utility-first CSS framework for designing a responsive UI.
OpenWeather API: For retrieving weather data for a city.
Google Gemini API: For implementing the chatbot that answers weather-related questions.

Running the Project Locally
Open the index.html file in your web browser. You can simply open it by double-clicking the file or using an editor like Visual Studio Code with the Live Server extension to serve it.

Use the search bar at the top to search for the weather in any city.

The table will display the weather data for the next 5 days, and you can use the filters to sort and view specific information.

The chatbot is available on the right-hand side to answer weather-related questions.
