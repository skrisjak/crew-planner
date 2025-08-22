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
            "daily": ["weather_code", "temperature_2m_max", "sunshine_duration", "precipitation_hours", "daylight_duration"],
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
            code: daily.variables(0).valuesArray(),
            temperature: daily.variables(1).valuesArray(),
            sunshine: daily.variables(2).valuesArray(),
            precipitation: daily.variables(3).valuesArray(),
            daylight:daily.variables(4).valuesArray()
        };

        const weather = new Map();

        weatherData.time.forEach(((day, index) => {
            const sunshineRatio = weatherData.sunshine[index]/ weatherData.daylight[index];
            weather.set(dayjs(day).format("YYYY-MM-DD"), {
                date: dayjs(day).format("DD.MM.YYYY"),
                code: weatherData.code[index],
                temperature: weatherData.temperature[index],
                sunshine: weatherData.sunshine[index],
                daylight: weatherData.daylight[index],
                sunshineRatio:sunshineRatio,
                precipitation: weatherData.precipitation[index],
            })
        }))

        set({ weatherData: weather });
    }
}));
