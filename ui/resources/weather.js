// weather update
const week_day_options = { weekday: 'long'};
const date_options = { year: 'numeric', month: 'long', day: 'numeric' };
const today  = new Date();

navigator.geolocation.getCurrentPosition( async (position) => {
	const latitude = position.coords.latitude;
	const longitude = position.coords.longitude;

	document.getElementById("location_name").innerHTML = "Loading....";
	let url = "https://localhost:5001/api/Books" + "/" + latitude + "/" + longitude
	try {
		await fetch(url)								
			.then(response => response.json()) // read response body and parse as JSON
			.then(result => {													
				document.getElementById("location_name").innerHTML = "<span class='weather_output'>" + result .name + "</span>";
				document.getElementById("temperature").innerHTML = "Temprature: <span class='weather_output'>" + result .main.temp + " &deg;C" + "</span>";
				document.getElementById("sunrise").innerHTML = "Sunrise: <span class='weather_output'>" + new Date(result .sys.sunrise * 1000).toLocaleTimeString('en-IN') + "</span>";
				document.getElementById("sunset").innerHTML = "Sunset: <span class='weather_output'>" + new Date(result .sys.sunset * 1000).toLocaleTimeString('en-IN') + "</span>";
				document.getElementById("description1").innerHTML = "Description: <span class='weather_output'>" + result .weather[0].main + "</span>";
				document.getElementById("humidity").innerHTML = "Humidity: <span class='weather_output'>" + result .main.humidity + "%" + "</span>";
				document.getElementById("day").innerHTML = "Day: <span class='weather_output'>" + today.toLocaleDateString("en-US", week_day_options) + "</span>";
				document.getElementById("date").innerHTML = "Date: <span class='weather_output'>" + today.toLocaleDateString("en-US", date_options) + "</span>";					
			});				  			  
	} catch {
		//console.log("weather")	
	}	
});    	  