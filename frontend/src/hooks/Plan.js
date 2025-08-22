import API from "../api/API";
import dayjs from "dayjs";
import {create} from "zustand/react";

export const usePlan = create((set, get) => ({
    loading: true,
    plans: new Map(),
    selectedDate: dayjs(),
    startDate: null,
    endDate: null,
    plan: null,

    getPlan: async () => {
        try {
            const newPlan = await API.getWeekPlan();

            set({
                plan: newPlan.workDays,
                loading: false,
                startDate: dayjs(newPlan.startDate),
                endDate: dayjs(newPlan.endDate),
            });

            set(state => {
                const newPlans = new Map(state.plans);
                newPlan.workDays.forEach(p => {
                    newPlans.set(dayjs(p.date).format("YYYY-MM-DD"), p);
                });
                return { plans: newPlans };
            });

        } catch (error) {
            alert(error.message);
        }
    },

    updatePlan: async (date) => {
        const { startDate, endDate, plans } = get();

        if (!date.isBefore(startDate) && !date.isAfter(endDate)) {
            set({ selectedDate: date });
        } else {
            set({ loading: true });

            const newStartDate = dayjs(date).add(-2, "day").isBefore(startDate) ? dayjs(date).add(-2, "day") : startDate;
            const newEndDate = dayjs(date).add(7, "day").isAfter(endDate) ? dayjs(date).add(7, "day") : endDate;

            set({
                startDate: newStartDate,
                endDate: newEndDate,
            });

            try {
                const updatedPlan = await API.getPlan(newStartDate, newEndDate);

                const newPlans = new Map(plans);
                updatedPlan.workDays.forEach(p => {
                    newPlans.set(dayjs(p.date).format("YYYY-MM-DD"), p);
                });

                set({
                    plans: newPlans,
                    plan: updatedPlan.workDays,
                    loading: false,
                    selectedDate: date,
                });

            } catch (e) {
                alert(e.message);
            }
        }
    },

    refreshPlan: async () => {
        const { startDate, endDate, plans } = get();
        try {
            set({ loading: true });
            const rsp = await API.getPlan(startDate, endDate);
            const newPlans = new Map(plans);
            rsp.workDays.forEach(p => {
                newPlans.set(dayjs(p.date).format("YYYY-MM-DD"), p);
            });

            set({
                plans: newPlans,
                plan: rsp.workDays,
                loading: false,
            });
        } catch (error) {
            alert(error.message);
        }
    },
}));