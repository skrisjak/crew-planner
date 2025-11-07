import {Box, Tooltip, Typography} from "@mui/material";
import {useWeather} from "../../../hooks/Weather";
import dayjs from "dayjs";

const Weather = (props) => {

    const weather = useWeather(state => state.weatherData);

    if (weather && weather.has(dayjs(props.date).format('YYYY-MM-DD'))) {
        const data = weather.get(dayjs(props.date).format('YYYY-MM-DD'));

        const tooltipText = `
            Teplota: ${parseInt(data.temperature)} °C
            Slunce: ${Math.round(data.sunshine/3600)} h
            Srážky: ${data.precipitation} h
        `;

        return (
            <Tooltip title={tooltipText} placement="top" arrow>
            <Box display="flex" flexDirection="row" alignItems="flex-end">
                <img src={getIconUrl(data)} height={40} alt=""/>
                <Typography variant="h6">{
                    getTemperature(data.temperature)
                }</Typography>
            </Box>
            </Tooltip>
        )
    } else {
        return null;
    }
}

const getIconUrl = (data) => {
    if (data.sunshineRatio < 0.8) {
        if (data.code >= 95) return STORMY;
        if ([71, 73, 75, 77, 85, 86].includes(data.code)) return SNOWY;
    }


    if (data.sunshineRatio >= 0.75) return SUNNY;

    if (data.sunshineRatio >= 0.2) {
        if (data.precipitation === 0) return CLOUDY;
        if (data.precipitation < 3 && data.sunshineRatio > 0.5) {
            return SHOWERS;
        } else if (data.precipitation <3){
            return LIGHT_RAIN;
        }
        return RAIN;
    }

    if (data.precipitation === 0) {
        return OVERCAST;
    } else {
        if (data.precipitation < 3) return LIGHT_RAIN;
        if (data.precipitation < 6) {
            return RAIN;
        } else {
            return HEAVY_RAIN;
        }
    }
}

const getTemperature = (temperature) => {
    return parseInt(temperature) + " ˚C";
}


const SUNNY = window.origin + "/weather/sunny.gif";

const CLOUDY = window.origin + "/weather/cloudy.gif";

const OVERCAST = "https://img.icons8.com/?size=100&id=15341&format=png&color=000000";

const LIGHT_RAIN = window.origin + "/weather/light_rain.gif";

const RAIN = window.origin + "/weather/rain.gif";

const HEAVY_RAIN = window.origin + "/weather/heavy_rain.gif";

const SHOWERS = window.origin + "/weather/showers.gif";

const SNOWY = window.origin + "/weather/snowy.gif";

const STORMY = window.origin + "/weather/stormy.gif";

const FALL_BACK_ICON = "https://img.icons8.com/?size=100&id=15350&format=png&color=000000";


export default Weather;