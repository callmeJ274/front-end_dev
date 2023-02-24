/* Global Variables */
// Personal API Key for OpenWeatherMap API
KEY = "";
const API_KEY = `us&appid=${KEY}&units=imperial`;
const baseURL = "https://api.openweathermap.org/data/2.5/weather?zip=";

// Convert date
function convert_date(unixtimestamp) {
	converted_date = new Date(unixtimestamp * 1000).toISOString().slice(0, 19).replace('T', ' ')
	return converted_date;
}

// Set event listener to add function to HTML DOM element
document.getElementById("generate").addEventListener("click", display);

function display() {
	const zip = document.getElementById("zip").value;
	const feelings = document.getElementById("feel").value;

	get_data(baseURL, zip, API_KEY)
		.then(function (data) {
			// Add data
			console.log("API data: ", data);
			post_data("/weather_data", {
				temperature: data.main.temp,
				date: convert_date(data.dt),
				userResponse: feelings,
			});
		})
		.then(() => update_UI());
}

// Async GET
/* Function to GET Web API Data*/
const get_data = async (baseURL, zip, API_KEY) => {
	if (zip.toString().length !== 5) {
		alert("Length of Zipcode is 5, please re-enter the code");
	} else {
		// Country is set default US
		const url = `${baseURL}${zip},${API_KEY}`;

		const request = await fetch(url);
		try {
			const allData = await request.json();
			if (allData.message) {
				alert(allData.message);
			} else {
				return allData;
			}
		} catch (error) {
			console.log("error", error);
			alert(error)
		}
	}
};


// Async POST
/* Function to POST data */
const post_data = async (url = "", data = {}) => {
	console.log("POST data: ", data);
	const response = await fetch(url, {
		method: "POST",
		credentials: "same-origin",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	try {
		const response_data = await response.json();
		console.log("post res: ", response_data);
	} catch (error) {
		console.log("error", error);
	}
};

/* Function to update UI */
const update_UI = async () => {
	const request = await fetch("/all");
	try {
		const data = await request.json();
		console.log("updateUI: ", data);
		document.getElementById("date").innerHTML = `Date: ${data.date}`;
		document.getElementById("temp").innerHTML = `Temperature(°C): ${data.temperature}`;
		document.getElementById("feeling").innerHTML = `Feelings: ${data.userResponse}`;
	} catch (error) {
		console.log("error", error);
		alert(error)
	}
};
