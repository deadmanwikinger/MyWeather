const init = () => {
    if (localStorage.getItem('lat') && localStorage.getItem('long')) {
        const latitude = JSON.parse(localStorage.getItem('lat'))
        const longitude = JSON.parse(localStorage.getItem('long'))
        getWeather(latitude, longitude)
    } else {
        window.location.href = './startup.html'
    }
}


//Weatherdata API
const getWeather = (lat, long) => {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&timeformat=unixtime&forecast_days=14&models=best_match`
    fetch(apiUrl)
    .then(response => response.json())
    .catch(error => {
        alert('Error fetching weather data: ', error)
    })
    .then(displayData)
}

//Display Data
const displayData = (data) => {
    const forecastItems = document.getElementsByClassName('forecast-item')

    const timeData = data.daily.time
    const codeData = data.daily.weather_code
    const tempMinData = data.daily.temperature_2m_min
    const tempMaxData = data.daily.temperature_2m_max
    const precipitationProbability = data.daily.precipitation_probability_max

    const forecastDataArray = timeData.map((timeData, index) => ({
        timeData: timeData,
        codeData: codeData[index],
        tempMinData: tempMinData[index],
        tempMaxData: tempMaxData[index],
        precipitationProbability: precipitationProbability[index],
    }))
    
    for (let index = 0; index < forecastItems.length; index++) {
        forecastItems[index].innerHTML = ''

        const time = document.createElement('div')
        time.classList.add('date')
        var date = new Date(forecastDataArray[index].timeData * 1000).toDateString()
        time.innerText = date.substring(0, date.length - 5)

        const weatherDataContainer = document.createElement('div')
        weatherDataContainer.classList.add('weather-data')

        const precipitationProb = document.createElement('div')
        precipitationProb.innerText = `${forecastDataArray[index].precipitationProbability}%`

        const icon = document.createElement('img')
        icon.setAttribute('src', `./res/1/${forecastDataArray[index].codeData}.png`)

        const temp = document.createElement('div')
        temp.innerText = `${Math.round(forecastDataArray[index].tempMinData)}° / ${Math.round(forecastDataArray[index].tempMaxData)}°`


        weatherDataContainer.appendChild(precipitationProb)
        weatherDataContainer.appendChild(icon)
        weatherDataContainer.appendChild(temp)

        forecastItems[index].appendChild(time)
        forecastItems[index].appendChild(weatherDataContainer)
        
    }
}

//Site Navigation
document.getElementById('back').addEventListener('click', () => {
    window.location.href = './index.html'
})

window.onload = init