import {useEffect, useState} from "react";
import API from "../api/API";
import dayjs from "dayjs";
import {useNavigate} from "react-router-dom";

export const usePlan = () => {

    const redirect = useNavigate();
    const [loading, setLoading] = useState(true);
    const [plans, setPlans] = useState(new Map());
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [plan, setPlan] = useState(null);

    const getPlan = async () => {
        try {
            const newPlan = await API.getWeekPlan();
            setPlan(newPlan.workDays);
            setLoading(false);
            setStartDate(dayjs(newPlan.startDate));
            setEndDate(dayjs(newPlan.endDate));

            const newPlans = new Map(plans);

            newPlan.workDays.forEach(plan => {
                newPlans.set(dayjs(plan.date).format("YYYY-MM-DD"), plan);
            })
            setPlans(newPlans);
        } catch (error) {
            if (error.message === "Unauthorized") {
                redirect("/#error=Unauthorized");
            }
        }
    };

    useEffect(() => {
        getPlan();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updatePlan = async (date) => {

        if (!date.isBefore(startDate) && !date.isAfter(endDate)) {
            setSelectedDate(date);
        } else {
            setLoading(true);

            const newStartDate = dayjs(date).add(-2, "day").isBefore(startDate) ? dayjs(date).add(-2, "day") : startDate;
            const newEndDate = dayjs(date).add(7, "day").isAfter(endDate) ? dayjs(date).add(7, "day") : endDate;

            setStartDate(newStartDate);
            setEndDate(newEndDate);

            try {
                const updatedPlan = await API.getPlan(newStartDate, newEndDate);

                const newPlans = new Map(plans);
                updatedPlan.workDays.forEach(p => {
                    newPlans.set(dayjs(p.date).format("YYYY-MM-DD"), p);
                });

                setPlans(newPlans);
                setPlan(updatedPlan.workDays);
                setLoading(false);
                setSelectedDate(date);
            } catch (error) {
                if (error.message === "Unauthorized") {
                    redirect("/#error=Unauthorized");
                }
            }
        }
    }

    useEffect(() => {
        setTimeout( () => {
            const element = document.getElementById(selectedDate.format("YYYY-MM-DD"));
                if (element) {
                    element.scrollIntoView({behavior: "smooth", block:"nearest", inline:"center"});
                }
        },100);
    }, [selectedDate]);

    return {loading, plan, updatePlan};
}