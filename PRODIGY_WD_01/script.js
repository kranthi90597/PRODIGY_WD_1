document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '6aff690b5bc720b0d5906c857e596849';
    const getWeatherBtn = document.getElementById('getWeatherBtn');
    const getLocationBtn = document.getElementById('getLocationBtn');
    const cityInput = document.getElementById('cityInput');
    const weatherDisplay = document.getElementById('weatherDisplay');
    const errorDisplay = document.getElementById('errorDisplay');

    getWeatherBtn.addEventListener('click', () => {
        const city = cityInput.value.trim();
        if (city) {
            fetchWeatherByCity(city);
        } else {
            displayError('Please enter a city name.');
        }
    });

    getLocationBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(fetchWeatherByLocation, handleLocationError);
        } else {
            displayError('Geolocation is not supported by this browser.');
        }
    });

    function fetchWeatherByCity(city) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('City not found or API request failed.');
                }
                return response.json();
            })
            .then(data => {
                const temperature = data.main.temp;
                const description = data.weather[0].description;
                const country = data.sys.country;
                displayWeatherData(city, country, temperature, description);
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                displayError('City not found.');
            });
    }

    function fetchWeatherByLocation(position) {
        const { latitude, longitude } = position.coords;
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Location not found or API request failed.');
                }
                return response.json();
            })
            .then(data => {
                const city = data.name;
                const temperature = data.main.temp;
                const description = data.weather[0].description;
                const country = data.sys.country;
                displayWeatherData(city, country, temperature, description);
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                displayError('Could not retrieve weather data for your location.');
            });
    }

    function displayWeatherData(city, country, temperature, description) {
        weatherDisplay.innerHTML = `
            <div class="weatherDisplay">
                <h2>${city}, ${country}</h2>
                <p>Temperature: ${temperature}°C</p>
                <p>Description: ${description}</p>
            </div>
        `;
        clearError();
    }

    function displayError(message) {
        errorDisplay.innerHTML = `<p class="error">${message}</p>`;
        clearWeatherData();
    }

    function clearWeatherData() {
        weatherDisplay.innerHTML = '';
    }

    function clearError() {
        errorDisplay.innerHTML = '';
    }

    function handleLocationError(error) {
        switch(error.code) {
            case error.PERMISSION_DENIED:
                displayError('User denied the request for Geolocation.');
                break;
            case error.POSITION_UNAVAILABLE:
                displayError('Location information is unavailable.');
                break;
            case error.TIMEOUT:
                displayError('The request to get user location timed out.');
                break;
            case error.UNKNOWN_ERROR:
                displayError('An unknown error occurred.');
                break;
        }
    }
});
