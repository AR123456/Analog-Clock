let str = "Atlanta \n5783 75%";
var pattern = /\n/g;
// var pattern = /[a-z]/g;
// var pattern = /[^atn]/g;
// var pattern = /[4-7]/g;
//var pattern = /\d/g;
//var pattern = /\w/g;
//var pattern = /\W/g;
//var pattern = /\s/g;
//var pattern = /\d{10}/g;
//var pattern = /^b/g;
document.getElementById("string").innerHTML = str;
document.getElementById("string").innerHTML = str;
document.getElementById("search").innerHTML = str.search(pattern);
document.getElementById("match").innerHTML = str.match(pattern);
document.getElementById("test").innerHTML = pattern.test(str);
