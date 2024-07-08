document.addEventListener("DOMContentLoaded", async function () {
  const forecast = await getWeather("daejeon");
  fillToday(forecast);
  fillDescription(forecast);
});

// get weather JSON
async function getWeather(input) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=de4f2983b500413781f04557240807&q=${input}&days=7&aqi=no&alerts=no`,
      {
        mode: "cors",
      }
    );
    if (!response.ok) {
      return alert("Location does not exist, Try Again");
    }
    const forecast = await response.json();
    console.log(forecast);
    return forecast;
  } catch (error) {
    console.error(error);
  }
}

function fillToday(forecast) {
  const icon = document.getElementById("today_icon");
  const temp_c = document.getElementById("today_temp_c");
  const temp_f = document.getElementById("today_temp_f");
  const precip = document.getElementById("today_precip");
  const humidity = document.getElementById("today_humidity");
  const uv = document.getElementById("today_uv");

  icon.src = forecast.current.condition.icon;
  temp_c.innerHTML = `<b>${forecast.current.temp_c}ºC</b>`;
  temp_f.innerHTML = `<b>${forecast.current.temp_f}ºF</b>`;
  precip.textContent = `Precipitation: ${forecast.current.precip_mm}mm`;
  humidity.textContent = `Humidity: ${forecast.current.humidity}%`;
  uv.textContent = `UV: ${forecast.current.uv}`;
}
function fillDescription(forecast) {
  const location = document.getElementById("location");
  const date = document.getElementById("date");
  const weather_text = document.getElementById("weather_text");

  location.innerHTML = `<b>${forecast.location.name}, ${forecast.location.country}</b>`;
  date.textContent = `${forecast.location.localtime}`;
  weather_text.textContent = `${forecast.current.condition.text}`;
}

function getDayName(dateStr, local){
    var date = new Date(dateStr);
    return date.toLocaleDateString(local, { weekday: 'long' });        
}

