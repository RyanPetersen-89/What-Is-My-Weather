const apiKey = "deeddd3f4c6c7872ae67649acfc3e05f";

const submitBtn = document.getElementById('submit-button')

function getApi() {
  alert('Firstline in getApi Function');
  const citySearch = document.getElementById('searchbar').value
  console.log(citySearch);
  alert('Before Fetch');
  
  const LocationLookUp = `http://api.openweathermap.org/data/2.5/weather?q=${citySearch}&appid=${apiKey}`;

    // Fetching weather data to get lat and lon
    $.get(LocationLookUp, function(data) {
        if (data.cod !== 200) {
            console.error("City not found");
            alert('Location Not Found')
            return;
        }
        const lat = data.coord.lat;
        const lon = data.coord.lon;

        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

        $.get(apiUrl, function(data) {
            displayForecast(data);
        }).fail(function(error) {
            console.error('Error:', error);
        });
    }).fail(function(error) {
        console.error('Error:', error);
    });

    /////////////////Double check the above function! Continue code below to push fetch data to cards

}



submitBtn.addEventListener('click', getApi)