document.addEventListener("DOMContentLoaded", async function () {
  const weatherContainer = document.getElementById("weather_carousel");
  const container = document.getElementById("container");

  // buttons
  const moveRightButton = document.getElementById("carousel_right");
  const moveLeftButton = document.getElementById("carousel_left");
  const hourly_button = document.getElementById("hourly_button");
  const week_button = document.getElementById("week_button");
  const toggle = document.getElementById("toggle");

  const search_form = document.getElementById("search_form");

  // loading icon
  const loading_icon = document.getElementById("loading_icon");
  loading_icon.style.display = "block";

  // initial load
  let forecast = await getWeather("Daejeon");
  fillToday(forecast);
  fillDescription(forecast);
  let forecastWidth = weatherForecast(forecast, "week");
  loading_icon.style.display = "none";

  // carousel movement
  let containerWidth = 0;

  moveRightButton.addEventListener("click", function () {
    const moveRightReturn = moveRight(
      containerWidth,
      forecastWidth,
      weatherContainer,
      weather_carousel.offsetWidth
    );
    containerWidth = moveRightReturn;
  });

  moveLeftButton.addEventListener("click", function () {
    const moveLeftReturn = moveLeft(
      containerWidth,
      forecastWidth,
      weatherContainer,
      weather_carousel.offsetWidth
    );
    containerWidth = moveLeftReturn;
  });

  // toggle hourly or week
  hourly_button.addEventListener("click", function () {
    containerWidth = 0;
    weatherContainer.style.right = '0px';
    return (forecastWidth = weatherForecast(forecast, "hourly"));
  });

  week_button.addEventListener("click", function () {
    containerWidth = 0;
    weatherContainer.style.right = '0px';
    return (forecastWidth = weatherForecast(forecast, "week"));
  });

  // search form
  search_form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // loading screen
    const loading_icon = document.getElementById("loading_icon");
    loading_icon.style.display = "block";

    // data filling
    const search = document.getElementById("search").value;
    forecast = await getWeather(search);
    fillToday(forecast);
    fillDescription(forecast);
    forecastWidth = weatherForecast(forecast, "week");
    loading_icon.style.display = "none";

    // reset carousel
    containerWidth = 0;
    weatherContainer.style.right = '0px';
    
    this.reset();
  });

  //change C / F
  toggle.addEventListener("click", function () {
    const all_temps = document.querySelectorAll(".temp");
    all_temps.forEach((temp) => {
      temp.classList.toggle("hide");
    });
  });
});

// get weather JSON
async function getWeather(input) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=de4f2983b500413781f04557240807&q=${input}&days=10&aqi=no&alerts=no`,
      {
        mode: "cors",
      }
    );
    if (!response.ok) {
      // stop spinning icon
      const loading_icon = document.getElementById("loading_icon");
      loading_icon.style.display = "none";
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
  precip.innerHTML = `<b>Precipitation:</b> ${forecast.current.precip_mm}mm`;
  humidity.innerHTML = `<b>Humidity: </b>${forecast.current.humidity}%`;
  uv.innerHTML = `<b>UV:</b> ${forecast.current.uv}`;
}

function fillDescription(forecast) {
  const location = document.getElementById("location");
  const date = document.getElementById("date");
  const weather_text = document.getElementById("weather_text");

  location.innerHTML = `<b>${forecast.location.name},<br> ${forecast.location.country}</b>`;
  date.textContent = `${forecast.location.localtime}`;
  weather_text.textContent = `${forecast.current.condition.text}`;
}

// change date to day name
function getDayName(dateStr) {
  var date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", { weekday: "short" });
}

function weatherForecast(forecast, checker) {
  const weather_carousel = document.getElementById("weather_carousel");

  // reset
  weather_carousel.innerHTML = "";

  let width_count = 0;
  if (checker === "hourly") {
    const hours = forecast.forecast.forecastday[0].hour;
    const currentLocalTime = new Date(forecast.location.localtime);
    hours.map((hour) => {
      const dateTime = new Date(hour.time);
      if (dateTime.getTime() >= currentLocalTime.getTime()) {
        const wrapper = document.createElement("div");
        const title = document.createElement("h4");
        const icon = document.createElement("img");
        const temp_wrapper = document.createElement("div");
        const high_temp_c = document.createElement("p");
        const low_temp_c = document.createElement("p");
        const high_temp_f = document.createElement("p");
        const low_temp_f = document.createElement("p");

        title.textContent = `${dateTime.getHours()}:00`;
        icon.src = hour.condition.icon;
        high_temp_c.textContent = `${hour.temp_c}ºC`;
        high_temp_f.textContent = `${hour.temp_f}ºF`;
        low_temp_c.textContent = `${hour.feelslike_c}ºC`;
        low_temp_f.textContent = `${hour.feelslike_f}ºF`;

        high_temp_c.classList.add("temp");
        high_temp_f.classList.add("temp", "hide");
        low_temp_c.classList.add("temp");
        low_temp_f.classList.add("temp", "hide");
        temp_wrapper.append(high_temp_c, high_temp_f, low_temp_c, low_temp_f);

        wrapper.classList.add("weather_carousel_box");
        wrapper.append(title, icon, temp_wrapper);

        weather_carousel.append(wrapper);
        width_count++;
      }
    });
  } else if (checker === "week") {
    const days = forecast.forecast.forecastday;
    days.map((day) => {
      const wrapper = document.createElement("div");
      const title = document.createElement("h4");
      const icon = document.createElement("img");
      const temp_wrapper = document.createElement("div");
      const high_temp_c = document.createElement("p");
      const low_temp_c = document.createElement("p");
      const high_temp_f = document.createElement("p");
      const low_temp_f = document.createElement("p");

      title.textContent = getDayName(day.date);
      icon.src = day.day.condition.icon;
      high_temp_c.textContent = `${day.day.maxtemp_c}ºC`;
      high_temp_f.textContent = `${day.day.maxtemp_f}ºF`;
      low_temp_c.textContent = `${day.day.mintemp_c}ºC`;
      low_temp_f.textContent = `${day.day.mintemp_f}ºF`;

      high_temp_c.classList.add("temp");
      high_temp_f.classList.add("temp", "hide");
      low_temp_c.classList.add("temp");
      low_temp_f.classList.add("temp", "hide");
      temp_wrapper.append(high_temp_c, high_temp_f, low_temp_c, low_temp_f);

      wrapper.classList.add("weather_carousel_box");
      wrapper.append(title, icon, temp_wrapper);

      weather_carousel.append(wrapper);
      width_count++;
    });
  } else {
    console.error("checker was not added to function.");
  }

  return width_count * 100;
}

// carousel movements
function moveRight(
  containerWidth,
  forecastWidth,
  weatherContainer,
  FrameWidth
) {
  if (containerWidth >= forecastWidth - FrameWidth) {
    containerWidth = forecastWidth - FrameWidth;
    return containerWidth;
  } else {
    containerWidth += 100;
    weatherContainer.style.right = `${containerWidth}px`;
    return containerWidth;
  }
}

function moveLeft(containerWidth, forecastWidth, weatherContainer, FrameWidth) {
  if (containerWidth <= 0) {
    containerWidth = 0;
    return containerWidth;
  } else {
    containerWidth -= 100;
    weatherContainer.style.right = `${containerWidth}px`;
    return containerWidth;
  }
}
