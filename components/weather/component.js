import axios from "axios";

module.exports = class {
  onCreate() {
    this.state = {
      city: "",
      degr: 0,
      wind: 0,
      clouds: 0,
      pressure: 0,
      humidity: 0,
      show: false,
      err: ""
    };
  }

  updatePage(e) {
    e.preventDefault();
    let cityName = document.getElementById("city").value;
    this.updateWeather(cityName);
  }

  updateWeather(cityName) {
    return axios
      .get(this.buildURL(cityName))
      .then(response => {
        this.buildState(response);
      })
      .catch(error => {
        this.buildState(error.response);
      });
  }

  buildURL(cityName) {
    let apiKey = "6f49e4f6bef37c3172dac3cae65a0ae6";
    return (
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityName +
      "&units=metric&appid=" +
      apiKey
    );
  }

  buildState(response) {
    this.state =
      response.data && response.status === 200
        ? {
            city: response.data.name,
            degr: Math.round(response.data.main.temp),
            wind: response.data.wind.speed,
            clouds: response.data.clouds.all,
            pressure: (response.data.main.pressure * 0.750062).toFixed(0),
            humidity: response.data.main.humidity,
            show: true,
            err: ""
          }
        : { show: true, err: response.status };
  }
};
