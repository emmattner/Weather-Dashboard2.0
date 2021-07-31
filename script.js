var API_KEY_WEATHER = "999765913b2b7cf6debaba7129671cd8";

const k2c_temp = (k) => Math.round(k - 273.15);
const mps2kts = (mps) => Math.round(mps * 1.94384);
const dt2date = function (dt) {
    let d = new Date(dt * 1000)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


    return `${d.getDate()} ${months[d.getMonth()]}, ${d.getFullYear()}`
}

const uvClass = (uvi) => {
    //  takes uv index value and returns the class of the uv index
    if (uvi < 2) {
        return 'uv-low';
    } else if (uvi < 5) {
        return 'uv-mod';
    } else if (uvi < 7) {
        return 'uv-high';
    } else if (uvi < 10) {
        return 'uv-very-high';
    } else {
        return 'uv-extreme';
    }
}

document.querySelector("#city-search-form").addEventListener('submit', (event) => {
    event.preventDefault();
    let city = document.querySelector("#search-for-city-input").value;
    searchForCity(city);
}
)

function searchForCity(city) {
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API_KEY_WEATHER}`)
        .then(response => response.json())
        .then(arrData => {
            data = arrData[0];
            let storedCityData = JSON.parse(localStorage.getItem('weatherApp'));
            cities = Object.keys(storedCityData);
            // updates local storage data
            if (!cities.includes(data.name)) {
                storedCityData[data.name] = data;
                localStorage.setItem('weatherApp', JSON.stringify(storedCityData));
                // update list of cities for update to the search results
                cities.push(data.name)
                cities.sort()
            }
            updateSearchResultsList(cities);
            return data.name;
        })
        .then(city => {
            // clear the seach bar
            document.querySelector("#search-for-city-input").value = '';
            //  update the display
            updateWeatherReport(city);
        })
}

const updateSearchResultsList = (cities) => {
    let searchResultsList = document.querySelector('#search-results');
    // clear the results and reload
    searchResultsList.innerHTML = '';

    cities.sort().forEach(city => {
        let li = document.createElement('li');
        let liText = document.createTextNode(city);
        li.appendChild(liText);
        searchResultsList.appendChild(li);
    })
}

document.querySelector('#search-results').addEventListener('click', (event) => {
    event.preventDefault();
    updateWeatherReport(event.target.innerHTML)

});

const updateWeatherReport = (city) => {
    const cityElement = document.querySelector('#city-weather');

    // converts into lat/long 
    let storedCityData = JSON.parse(localStorage.getItem('weatherApp'));
    let { lat, lon } = storedCityData[city]

    window.fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${API_KEY_WEATHER}`)
        .then(response => response.json())
        .then(data => {
            cityElement.innerHTML = cityWeatherTemplate(city, data);
            upDateFiveDayForecast(city, data);
        })
}

const upDateFiveDayForecast = (city, data) => {

    let forecast = document.querySelector('#forecast');

    // update heading
    document.querySelector('#forecast h3').innerText = `Forecast for ${city} : `;
    for (let index = 1; index <= 5; index++) {
        const element = document.querySelector(`#today-plus-${index}`);
        element.innerHTML = fiveDayForecastTemplate(data.daily[index]);
    }
}

const fiveDayForecastTemplate = function (dataDaily) {
    let date = dt2date(dataDaily.dt)
    let icon = ''
    let temp = k2c_temp(dataDaily.temp.day);
    let humidity = dataDaily.humidity;

    return `<p class="date">${date}</p>
<p class="icon"><i class="wi ${icon}"></i></p>
<p class="temp">Temperature: ${temp} °C</p>
<p class="humidity">humidity: ${humidity} %</p>`;
}

const cityWeatherTemplate = (cityname, data) => {
    const date = dt2date(data.current.dt);
    const cssColSpans = 4

    return `                    <h3>${cityname} (${date})</h3>
<p><div class='grid grid-cols-4 gap-4'> 
    <div> Temperature </div> <div> ${k2c_temp(data.current.temp)}°C </div> <div class='col-span-2'></div>
</div></p>
<p><div class='grid grid-cols-4 gap-4'> 
    <div> Humidity </div> <div>${data.current.humidity}% </div> <div class='col-span-2'></div>
</div></p>
<p><div class='grid grid-cols-4 gap-4'>
     <div> Wind speed </div> <div> ${mps2kts(data.current.wind_speed)} kts </div> <div class='col-span-2'></div> 
</div></p>
<p><div class='grid grid-cols-4 gap-4'> 
    <div> UV-index </div>  <div> <span class='rounded ${uvClass(data.current.uvi)}'>${data.current.uvi}</span> </div> <div class='col-span-2'></div> 
</div></p>
`
}

