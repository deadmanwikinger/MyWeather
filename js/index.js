const weatherDescriptions = {
    0: "Clear sky",
    1: "Scattered clouds",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Freezing fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Heavy drizzle",
    56: "Light freezing drizzle",
    57: "Heavy freezing drizzle",
    61: "Light rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Light snowfall",
    73: "Moderate snowfall",
    75: "Heavy snowfall",
    77: "Snow grains",
    80: "Light rain showers",
    81: "Moderate rain showers",
    82: "Intense rain showers",
    85: "Light snow showers",
    86: "Heavy snow showers",
    95: "Slight thunderstorm",
    96: "Thunderstorm with light hail",
    99: "Thunderstorm with heavy hail"
};
  
const init = () => {
    if (localStorage.getItem('lat') && localStorage.getItem('long')) {
        const latitude = JSON.parse(localStorage.getItem('lat'))
        const longitude = JSON.parse(localStorage.getItem('long'))
        getWeather(latitude, longitude)
        getLocationName(latitude, longitude)
    } else {
        window.location.href = './startup.html'
    }
}

//Geocoding API
const getLocationName = (lat, long) => {
    const apiUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${long}&limit=1&appid=00ef585eceee6940d7fb2de5e5027cbc`
    fetch(apiUrl)
    .then(response => response.json())
    .catch(error => {
        alert('Error fetching location data: ', error)
    })
    .then(data => document.getElementById('location').innerText = data[0].name)
}


//Weatherdata API
const getWeather = (lat, long) => {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,relative_humidity_2m,is_day,weather_code,surface_pressure,wind_speed_10m&hourly=temperature_2m,weather_code,is_day&past_hours=1&forecast_hours=24&daily=uv_index_max,precipitation_probability_max,sunrise,sunset&forecast_days=1&models=best_match&timezone=auto`
    fetch(apiUrl)
    .then(response => response.json())
    .catch(error => {
        alert('Error fetching weather data: ', error)
    })
    .then(displayData)
}


//Display Data
const displayData = (data) => {
    //Current
    document.getElementById('description').innerText = weatherDescriptions[data.current.weather_code]
    document.getElementById('temp').innerText = `${Math.floor(data.current.temperature_2m)}°`

    document.getElementById('icon').setAttribute('src', `./res/${data.current.is_day}/${data.current.weather_code}.png`);

    document.getElementById('wind').innerText = `${data.current.wind_speed_10m} km/h`
    document.getElementById('humidity').innerText = `${data.current.relative_humidity_2m}%`
    document.getElementById('pressure').innerText = `${data.current.surface_pressure} hPa`

    //Hourly Forecast
    const forecastItems = document.getElementsByClassName('forecast-item')

    const timeData = data.hourly.time
    const codeData = data.hourly.weather_code
    const tempData = data.hourly.temperature_2m
    const isDay = data.hourly.is_day

    const forecastDataArray = timeData.map((timeData, index) => ({
        timeData: timeData,
        codeData: codeData[index],
        tempData: tempData[index],
        isDay: isDay[index]
    }))
    
    for (let index = 0; index < forecastItems.length; index++) {
        forecastItems[index].innerHTML = ''

        const time = document.createElement('span')
        time.classList.add('time')
        const splitDate = forecastDataArray[index].timeData.split('T')
        time.innerText = splitDate[1]

        const icon = document.createElement('img')
        icon.setAttribute('src', `./res/${forecastDataArray[index].isDay}/${forecastDataArray[index].codeData}.png`)

        const temp = document.createElement('span')
        temp.classList.add('temp')
        temp.innerText = `${Math.round(forecastDataArray[index].tempData)}°`

        forecastItems[index].appendChild(time)
        forecastItems[index].appendChild(icon)
        forecastItems[index].appendChild(temp)
    }

    document.getElementById('precipitation-probability').innerText = `${data.daily.precipitation_probability_max[0]}%`
    document.getElementById('precipitation-probability').style.backgroundImage = `
    radial-gradient(
        circle closest-side,
        #274157 0,
        #274157 85%,
        transparent 10%,
        transparent 100%,
        #274157 0
    ),
    conic-gradient(
        #ff701f 0,
        #ff701f ${data.daily.precipitation_probability_max[0]}%,
        #7c8291 0,
        #7c8291 100%
    )`

    document.getElementById('uv-index').innerText = data.daily.uv_index_max[0]
    document.getElementById('uv-index').style.backgroundImage = `
    radial-gradient(
        circle closest-side,
        #274157 0,
        #274157 85%,
        transparent 10%,
        transparent 100%,
        #274157 0
    ),
    conic-gradient(
        #ff701f 0,
        #ff701f ${data.daily.uv_index_max[0]/11*100}%,
        #7c8291 0,
        #7c8291 100%
    )`
    
    const splitSunrise = data.daily.sunrise[0].split('T')
    const splitSunset = data.daily.sunset[0].split('T')
    document.getElementById('sunrise').innerHTML = `Sunrise:<br>${splitSunrise[1]}`
    document.getElementById('sunset').innerHTML = `Sunset:<br>${splitSunset[1]}`
}


//Site Navigation
document.getElementById('change-location').addEventListener('click', () => {
    window.location.href = './startup.html'
})

document.getElementById('forecast-daily').addEventListener('click', () => {
    window.location.href = './extended_forecast.html'
})

window.onload = init