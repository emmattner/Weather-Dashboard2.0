const searchList = [];

$("#card1").hide();
$("#card2").hide();
$("#card3").hide();
$("#card4").hide();
$("#card5").hide();

const today = new Date();
const  day = String(today.getDate());
const month = String(today.getMonth() + 1);
const year = today.getFullYear();
const displayDate = day + "/" + month + "/" + year;

function displayCityWeather() {
    event.preventDefault();

    const citySearch = $("#citySearchBar").val();
    const queryURLCWD = "https://api.openweathermap.org/data/2.5/weather?q=" + citySearch + "&appid=48eb8f7025236f284142f7fe0b9f55b4&units=metric";

    $.ajax({
        url: queryURLCWD,
        method: "GET"
    }).then(function (response) {
        $("#cityName").text(response.name + " " + displayDate);
        const tempNumber = Math.round(response.main.temp);
        $("#temperature").text("Temperature: " + tempNumber + "°C");
        $("#humidity").text("Humidity: " + response.main.humidity + "%");
        $("#windSpeed").text("Wind Speed: " + response.wind.speed + " KM/H");
        
        const long = response.coord.lon;
        const lat = response.coord.lat;

        const queryURLUVIndex = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + long + "&appid=48eb8f7025236f284142f7fe0b9f55b4";


        $.ajax({
            url: queryURLUVIndex,
            method: "GET"
        }).then(function (response) {

            var uvIndexValue = response.value;

            var indexLow = $("<span>");
            indexLow.addClass("badge badge-success");
            indexLow.text(response.value);

            var indexMid = $("<span>");
            indexMid.addClass("badge badge-warning");
            indexMid.text(response.value);

            var indexHigh = $("<span>");
            indexHigh.addClass("badge badge-danger");
            indexHigh.text(response.value);

            if (uvIndexValue <= 3) {
                $("#uvIndex").append(indexLow);
            }
            else if (uvIndexValue <= 7) {
                $("#uvIndex").append(indexMid);
            }
            else if (uvIndexValue => 7) {
                $("#uvIndex").append(indexHigh);
            }
        });
    });

}