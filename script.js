var searchList = [];

$("#card1").hide();
$("#card2").hide();
$("#card3").hide();
$("#card4").hide();
$("#card5").hide();

var today = new Date();
var day = String(today.getDate());
var month = String(today.getMonth() + 1);
var year = today.getFullYear();
var displayDate = day + "/" + month + "/" + year;

function displayCityWeather() {
    event.preventDefault();

    var citySearch = $("#citySearchBar").val();
    var queryURLCWD = "https://api.openweathermap.org/data/2.5/weather?q=" + citySearch + "&appid=48eb8f7025236f284142f7fe0b9f55b4&units=metric";

    $.ajax({
        url: queryURLCWD,
        method: "GET"
    }).then(function (response) {
        $("#cityName").text(response.name + " " + displayDate);
        var tempNumber = Math.round(response.main.temp);
        $("#temperature").text("Temperature: " + tempNumber + "°C");
        $("#humidity").text("Humidity: " + response.main.humidity + "%");
        $("#windSpeed").text("Wind Speed: " + response.wind.speed + " KM/H");


}