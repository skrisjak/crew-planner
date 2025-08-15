import dayjs from "dayjs";

const monthNames = new Map([
    [1, "ledna"],
    [2, "února"],
    [3, "března"],
    [4, "dubna"],
    [5, "května"],
    [6, "června"],
    [7, "července"],
    [8,"srpna"],
    [9,"září"],
    [10, "října"],
    [11, "listopadu"],
    [12, "prosince"]
])

const dayNames= new Map( [
    [1, "Po"],
    [2, "Út"],
    [3, "St"],
    [4, "Čt"],
    [5, "Pá"],
    [6, "So"],
    [0, "Ne"]
])

const fullDayNames = new Map([
    [1, "Pondělí"],
    [2, "Úterý"],
    [3, "Středa"],
    [4, "Čtvrtek"],
    [5, "Pátek"],
    [6, "Sobota"],
    [0, "Něděle"]
]);

const getDateText = (date) => {
    const d = dayjs(date);
    const month = monthNames.get(d.get("month") +1);
    const day = d.date();
    const dayName = dayNames.get(d.day());
    return dayName + ", " + day + ". " +month;
}

const getFullDateText = (date) => {
    const d = dayjs(date);
    const month = monthNames.get(d.get("month") +1);
    const day = d.date();
    const dayName = fullDayNames.get(d.day());
    return dayName + ", " + day + ". " +month;
}

export {getDateText, getFullDateText};