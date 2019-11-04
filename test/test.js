import { assert } from "chai";
import sinon from "sinon";
import axios from "axios";
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

  describe("updateWeather function's tests: ", () => {
    let sandbox;
    beforeEach(() => {
      sandbox = sinon.createSandbox();
    });
    afterEach(() => {
      sandbox.restore();
    });

    it("Passing existent data", done => {
      const expectedState = {
        city: "Tokyo",
        degr: 13,
        wind: 4.6,
        clouds: 75,
        pressure: "762",
        humidity: 67,
        show: true,
        err: ""
      };
      const resolved = new Promise(r =>
        r({
          data: {
            coord: { lon: 139.76, lat: 35.68 },
            weather: [
              {
                id: 803,
                main: "Clouds",
                description: "broken clouds",
                icon: "04n"
              }
            ],
            base: "stations",
            main: {
              temp: 13.14,
              pressure: 1016,
              humidity: 67,
              temp_min: 10.56,
              temp_max: 15
            },
            visibility: 10000,
            wind: { speed: 4.6, deg: 50 },
            rain: {},
            clouds: { all: 75 },
            dt: 1572874390,
            sys: {
              type: 1,
              id: 8074,
              country: "JP",
              sunrise: 1572815103,
              sunset: 1572853435
            },
            timezone: 32400,
            id: 1850147,
            name: "Tokyo",
            cod: 200
          },
          status: 200,
          statusText: "OK",
          headers: {
            "content-length": "452",
            "content-type": "application/json; charset=utf-8"
          },
          config: {
            url:
              "https://api.openweathermap.org/data/2.5/weather?q=tokyo&units=metric&appid=6f49e4f6bef37c3172dac3cae65a0ae6",
            method: "get",
            headers: { Accept: "application/json, text/plain, */*" },
            transformRequest: [null],
            transformResponse: [null],
            timeout: 0,
            xsrfCookieName: "XSRF-TOKEN",
            xsrfHeaderName: "X-XSRF-TOKEN",
            maxContentLength: -1
          },
          request: {}
        })
      );
      sandbox.stub(axios, "get").returns(resolved);
      weather
        .updateWeather("tokyo")
        .then(() => {
          assert.deepEqual(weather.state, expectedState);
        })
        .then(done, done);
    });

    it("Passing unexistent data", done => {
      const expectedState = {
        show: true,
        err: "No data"
      };
      const resolved = new Promise(r =>
        r({ cod: "404", message: "city not found" })
      );
      sandbox.stub(axios, "get").returns(resolved);
      weather
        .updateWeather("to")
        .catch(() => {
          assert.deepEqual(weather.state, expectedState);
        })
        .then(done, done);
    });
  });
});
