const apiKey = "deeddd3f4c6c7872ae67649acfc3e05f";
const location = `api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}`
const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=${apiKey}`;
const citySearch = document.getElementById('searchbar').value
const submitBtn = document.getElementById('submit-button')

function getApi() {
  alert('firstline in getApi function');
  console.log(citySearch);
  alert('Before Fetch');

  fetch(apiUrl)
  .then(function(response){
    return response.json();
  })
  .then(function(data) {
    console.log(data);
    console.log('ryan');
  });
}

submitBtn.addEventListener('click', getApi)