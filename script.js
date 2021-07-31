var API_KEY_WEATHER = "999765913b2b7cf6debaba7129671cd8";

const k2c_temp = (k) => Math.round(k - 273.15);
const mps2kts = (mps) => Math.round(mps * 1.94384);
const dt2date = function (dt) {
    let d = new Date(dt * 1000)
    const months =  ['Jan','Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


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

