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

const getDateText = (date) => {
    const d = dayjs(date);
    const month = monthNames.get(d.get("month") +1);
    const day = d.date();
    return day + ". " +month;
}

export {getDateText};