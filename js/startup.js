document.querySelector('#search-btn').addEventListener('click', () => {
    let searchValue = document.getElementById('search-location').value.trim()
    const apiUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${searchValue}&count=1&language=en&format=json`
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                const lat = data.results[0].latitude
                const long = data.results[0].longitude

                localStorage.setItem('lat', lat)
                localStorage.setItem('long', long)
                window.location.href = './index.html'
            } else {
                alert('No results found for the entered location.')
            }
        })
        .catch(error => {
            console.error('Error fetching location data:', error)
            alert('Error fetching location data. Please try again.')
        })
})


document.querySelector('#location-btn').addEventListener('click', () => {
  navigator.geolocation.getCurrentPosition(
      function(position) {
          const lat = position.coords.latitude;
          const long = position.coords.longitude;

          localStorage.setItem('lat', lat);
          localStorage.setItem('long', long);
          window.location.href = './index.html';
      },
      function(error) {
          switch (error.code) {
              case error.PERMISSION_DENIED:
                  alert("User denied the request for Geolocation.");
                  break;
              case error.POSITION_UNAVAILABLE:
                  alert("Location information is unavailable.");
                  break;
              case error.TIMEOUT:
                  alert("The request to get user location timed out.");
                  break;
              case error.UNKNOWN_ERROR:
                  alert("An unknown error occurred.");
                  break;
          }
      },
      { enableHighAccuracy: true }
  );
});

