import {Box, Typography} from "@mui/material";
import {useWeather} from "../../hooks/Weather";
import dayjs from "dayjs";

const Weather = (props) => {

    const weather = useWeather(state => state.weatherData);

    if (weather && weather.has(dayjs(props.date).format('YYYY-MM-DD'))) {
        const data = weather.get(dayjs(props.date).format('YYYY-MM-DD'));
        return (
            <Box display="flex" flexDirection="row" alignItems="flex-end">
                <img src={getIconUrl(data.code)} height={40} alt=""/>
                <Typography variant="h6">{
                    getTemperature(data.temperature)
                }</Typography>
            </Box>
        )
    } else {
        return null;
    }
}

const getIconUrl = (code) => {
    //sunny
    if (code === 0) {
        return "https://img.icons8.com/?size=100&id=15352&format=png&color=000000";
    }
    //
    if (code <= 2) {
        return "https://img.icons8.com/?size=100&id=15359&format=png&color=000000";
    }
    //overcast or foggy
    if (code <= 49) {
        return "https://img.icons8.com/?size=100&id=15341&format=png&color=000000";
    }

    //light rain
    if (code === 51 || code === 61) {
        return "https://img.icons8.com/?size=100&id=15353&format=png&color=000000";
    }

    //rain
    if (code === 53 || code === 63) {
        return "https://img.icons8.com/?size=100&id=15360&format=png&color=000000";
    }

    //heavy rain
    if (code === 55 || code === 65) {
        return "https://img.icons8.com/?size=100&id=19542&format=png&color=000000";
    }

    //rain showers
    if (code >= 80 && code < 85) {
        return "https://img.icons8.com/?size=100&id=19541&format=png&color=000000"
    }

    //snowy
    if (code >= 70 && code < 80) {
        return "https://img.icons8.com/?size=100&id=15356&format=png&color=000000";
    }

    //still snowy
    if (code < 90) {
        return "https://img.icons8.com/?size=100&id=15356&format=png&color=000000";
    }

    //stormy
    if (code >= 95) {
        return "https://img.icons8.com/?size=100&id=15346&format=png&color=000000";
    }
}

const getTemperature = (temperature) => {
    return parseInt(temperature) + " ˚C";
}


export default Weather;