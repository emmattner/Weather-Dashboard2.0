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