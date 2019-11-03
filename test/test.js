import { assert } from "chai";
import weatherClass from "../components/weather/component";
const weather = new weatherClass();

describe("Weather component's logic tests: ", () => {
  describe("buildURL function's tests: ", () => {
    it("Buils url with passing city name", () => {
      assert.equal(
        weather.buildURL("Berlin"),
        "https://api.openweathermap.org/data/2.5/weather?q=Berlin&units=metric&appid=6f49e4f6bef37c3172dac3cae65a0ae6"
      );
    });
    it("Buils url with passing empty string", () => {
      assert.equal(
        weather.buildURL(""),
        "https://api.openweathermap.org/data/2.5/weather?q=&units=metric&appid=6f49e4f6bef37c3172dac3cae65a0ae6"
      );
    });
    it("Buils url with passing numbers", () => {
      assert.equal(
        weather.buildURL(123),
        "https://api.openweathermap.org/data/2.5/weather?q=123&units=metric&appid=6f49e4f6bef37c3172dac3cae65a0ae6"
      );
    });
    it("Buils url with passing undefined", () => {
      assert.equal(
        weather.buildURL(undefined),
        "https://api.openweathermap.org/data/2.5/weather?q=undefined&units=metric&appid=6f49e4f6bef37c3172dac3cae65a0ae6"
      );
    });
  });
  describe("buildState function's tests: ", () => {
    it("Fillign state with expected response", () => {
      const expectedResponse = {
        data: {
          clouds: {
            all: 85
          },
          coord: {
            lat: 52.52,
            lon: 13.39
          },
          main: {
            humidity: 93,
            pressure: 989,
            temp: 8.8
          },
          name: "Berlin",
          wind: {
            speed: 1.5
          }
        },
        status: 200
      };
      const expectedState = {
        city: "Berlin",
        degr: 9,
        wind: 1.5,
        clouds: 85,
        pressure: "742",
        humidity: 93,
        show: true,
        err: ""
      };
      weather.buildState(expectedResponse);
      assert.deepEqual(weather.state, expectedState);
    });
    it("Fillign state with unexpected status code", () => {
      const expectedResponse = {
        data: {
          clouds: {
            all: 85
          },
          coord: {
            lat: 52.52,
            lon: 13.39
          },
          main: {
            humidity: 93,
            pressure: 989,
            temp: 8.8
          },
          name: "Berlin",
          wind: {
            speed: 1.5
          }
        },
        status: 201
      };
      const expectedState = {
        show: true,
        err: "No data"
      };
      weather.buildState(expectedResponse);
      assert.deepEqual(weather.state, expectedState);
    });
    it("Fillign state with unexpected data", () => {
      const expectedResponse = {
        definitelyNotData: {
          clouds: {
            all: 85
          },
          coord: {
            lat: 52.52,
            lon: 13.39
          },
          main: {
            humidity: 93,
            pressure: 989,
            temp: 8.8
          },
          name: "Berlin",
          wind: {
            speed: 1.5
          }
        },
        status: 200
      };
      const expectedState = {
        show: true,
        err: "No data"
      };
      weather.buildState(expectedResponse);
      assert.deepEqual(weather.state, expectedState);
    });
  });
});
