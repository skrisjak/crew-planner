import { fetchWeatherApi } from 'openmeteo';
import {create} from "zustand/react";
import CONF from "../api/CONF";
import dayjs from "dayjs";

export const useWeather = create( (set)=> ({
    weatherData: null,
    getWeatherData: async () => {
        const params = {
            "latitude": CONF.latitude,
            "longitude": CONF.longitude,
            "daily": ["weather_code", "temperature_2m_max"],
            "timezone": "GMT",
        };
        const url = "https://api.open-meteo.com/v1/forecast";
        const responses = await fetchWeatherApi(url, params);

        const response = responses[0];

        const daily = response.daily();

        const weatherData = {
            time: [...Array((Number(daily.timeEnd()) - Number(daily.time())) / daily.interval())].map(
                    (_, i) => new Date((Number(daily.time()) + i * daily.interval()) * 1000)
            ),
            weather_code: daily.variables(0).valuesArray(),
            temperature_2m_max: daily.variables(1).valuesArray(),
        };

        const weather = new Map();

        weatherData.time.forEach(((day, index) => {
            weather.set(dayjs(day).format("YYYY-MM-DD"), {
                code: weatherData.weather_code[index],
                temperature: weatherData.temperature_2m_max[index]
            })
        }))

        set({ weatherData: weather });
    }
}));
