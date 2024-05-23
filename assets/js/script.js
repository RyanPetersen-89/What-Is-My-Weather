const apiKey = "deeddd3f4c6c7872ae67649acfc3e05f";
const submitBtn = document.getElementById('submit-button');
const searchHistoryContainer = document.getElementById('history');
const cityDisplay = document.getElementById('city-display');

// Function to get the weather data from the API
function getApi(event) {
  event.preventDefault(); // Prevent form submission and page reload
  const citySearch = document.getElementById('searchbar').value;
  const LocationLookUp = `http://api.openweathermap.org/data/2.5/weather?q=${citySearch}&units=imperial&appid=${apiKey}`;

  // Fetching weather data to get lat and lon
  $.get(LocationLookUp, function(data) {
    if (data.cod !== 200) {
      console.error("City not found");
      return;
    }
    const lat = data.coord.lat;
    const lon = data.coord.lon;
  
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
  
    $.get(apiUrl, function(data) {
      // Save data to local storage
      localStorage.setItem('weatherData', JSON.stringify(data));
      localStorage.setItem('lastCity', citySearch); // Save the city name to local storage
      updateSearchHistory(citySearch); // Update search history
      displayForecast(data);
      document.getElementById('searchbar').value = '';
    }).fail(function(error) {
      console.error('Error:', error);
    });
  }).fail(function(error) {
    console.error('Error:', error);
  });
}

// Function to display the forecast
function displayForecast(data) {
  const cityName = localStorage.getItem('lastCity');
  if (cityName) {
    cityDisplay.textContent = cityName;
  }
  // Display current weather data (first element of the array)
  const currentWeather = data.list[0];
  const currentTemp = currentWeather.main.temp.toFixed(1);
  const currentWind = currentWeather.wind.speed.toFixed(1);
  const currentHumidity = currentWeather.main.humidity.toFixed(1);
  const currentCondition = currentWeather.weather[0].main;

  document.getElementById('temp-day-0').textContent = `${currentTemp} °F`;
  document.getElementById('wind-day-0').textContent = `${currentWind} mph`;
  document.getElementById('humidity-day-0').textContent = `${currentHumidity} %`;

  updateBackground(currentCondition);

  // Display forecast for the next five days
  for (let i = 1; i <= 5; i++) {
    const forecast = data.list[i * 8 - 1]; // Get the forecast for each day at 12:00 PM
    const date = new Date(forecast.dt * 1000).toLocaleDateString();
    const temp = forecast.main.temp.toFixed(1); // Temperature in Fahrenheit
    const wind = forecast.wind.speed.toFixed(1); // Wind speed in miles per hour
    const humidity = forecast.main.humidity.toFixed(1); // Humidity in percentage

    document.getElementById(`date${i}`).textContent = date;
    document.getElementById(`temp-day-${i}`).textContent = `${temp} °F`;
    document.getElementById(`wind-day-${i}`).textContent = `${wind} mph`;
    document.getElementById(`humidity-day-${i}`).textContent = `${humidity} %`;
  }
}

function updateBackground(weatherCondition) {
  const dashboard = document.getElementById('dashboard');

  // Clear previous weather classes
  dashboard.classList.remove('clear', 'cloudy', 'rainy', 'snowy');

  // Log weather condition
  console.log('Weather Condition:', weatherCondition);

  // Add new weather class based on condition and apply background image directly
  if (weatherCondition.includes('Clear')) {
      dashboard.classList.add('clear');
      console.log('Added class: clear');
  } else if (weatherCondition.includes('Clouds')) {
      dashboard.classList.add('cloudy');
      console.log('Added class: cloudy');
  } else if (weatherCondition.includes('Rain') || weatherCondition.includes('Drizzle')) {
      dashboard.classList.add('rainy');
      console.log('Added class: rainy');
  } else if (weatherCondition.includes('Snow')) {
      dashboard.classList.add('snowy');
      console.log('Added class: snowy');
  }
}

// Function to update the search history
function updateSearchHistory(city) {
  let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  if (!searchHistory.includes(city)) {
    searchHistory.push(city);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    displaySearchHistory();
  }
}

// Function to display the search history
function displaySearchHistory() {
  const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  searchHistoryContainer.innerHTML = ''; // Clear the existing search history
  searchHistory.forEach(function(city) {
    const cityElement = document.createElement('div');
    cityElement.textContent = city;
    cityElement.classList.add('history-item');
    cityElement.addEventListener('click', function() {
      fetchCityWeather(city);
    });
    searchHistoryContainer.appendChild(cityElement);
  });
}

// Function to fetch weather data for a city from search history
function fetchCityWeather(city) {
  document.getElementById('searchbar').value = city;
  getApi(new Event('submit')); // Trigger getApi function
}

// Load weather data from local storage on page load
window.onload = function() {
  const savedData = localStorage.getItem('weatherData');
  const lastCity = localStorage.getItem('lastCity');
  if (savedData) {
    const weatherData = JSON.parse(savedData);
    displayForecast(weatherData);
  }
  if (lastCity) {
    cityDisplay.textContent = lastCity;
  }
  displaySearchHistory(); // Display search history on page load
}

// Add event listener to the submit button
submitBtn.addEventListener('click', getApi);