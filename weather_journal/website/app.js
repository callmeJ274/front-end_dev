/* Global Variables */
// Personal API Key for OpenWeatherMap API
const API_KEY = "";
const baseURL = "https://weatherbit-v1-mashape.p.rapidapi.com/current?";

// Async GET
/* Function to GET Web API Data*/
const getDataApi = async (baseURL, longitude, latitude, API_KEY) => {
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': API_KEY,
                'X-RapidAPI-Host': 'weatherbit-v1-mashape.p.rapidapi.com'
            }
        };
        const url = `${baseURL}lon=${longitude}&lat=${latitude}`;

        const request = await fetch(url, options)
        try {
            const data = await request.json();
			if (data.error) { /* Alert when input invalid longitude and latitude*/
				alert(data.error);
			} else {
                console.log("Data from get: ",data)
				return data;
			}
        }
        catch(error){
            console.log("error", error);
            return error;
        }
    };
// };

// Set event listener to add function to HTML DOM element
/* Function called by event listener */
document.getElementById("generate").addEventListener("click", displayAction);

/* Clean data */
// date_time, temp, uv, weather.description, sunrise, sunset
function displayAction() {
	const long = document.getElementById("long").value;
    console.log(long)
	const lat = document.getElementById("lat").value;
    console.log(lat)

	getDataApi(baseURL, long, lat, API_KEY)
		.then(function (data) {
			// Add data
			console.log("AllData from api: ", data);
			postDataApi("/weather_data", {
				date: new Date(data.data[0].ts * 1000).toISOString().slice(0, 19).replace('T', ' '),
				temp: data.data[0].app_temp,
                uv: data.data[0].uv,
				description: data.data[0].weather.description,
                sunrise: data.data[0].sunrise,
                sunset: data.data[0].sunset,
			});
		})
		.then(() => update_UI());
}

// Async POST
/* Function to POST data */
const postDataApi = async (url = "", data = {}) => {
	console.log("post weather data: ", data);
	const response = await fetch(url, {
		method: "POST",
		credentials: "same-origin",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	try {
		const newData = await response.json();
		console.log("post res: ", newData);
	} catch (error) {
		console.log("error", error);
	}
};

/* Function to update UI */
const update_UI = async () => {
	const request = await fetch("/all");
	try {
		const data = await request.json();
        console.log("request",request)
		console.log("update UI: ", data);
        console.log(document.getElementById("date"));
		document.getElementById("date").innerHTML = `Date: ${data.date}`;
		document.getElementById("temp").innerHTML = `Temperature(°C): ${data.temp}`;
		document.getElementById("uv").innerHTML = `UV: ${data.uv}`;
		document.getElementById("description").innerHTML = `Description: ${data.description}`;
		document.getElementById("sunrise").innerHTML = `Sunrise: ${data.sunrise}`;
		document.getElementById("sunset").innerHTML = `Sunset: ${data.sunset}`;
	} catch (error) {
		console.log("error", error);
	}
};