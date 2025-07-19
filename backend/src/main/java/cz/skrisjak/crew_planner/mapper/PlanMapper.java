package cz.skrisjak.crew_planner.mapper;

import cz.skrisjak.crew_planner.data.Plan;
import cz.skrisjak.crew_planner.data.ResponseShiftPlan;
import cz.skrisjak.crew_planner.data.WorkDayPlan;
import cz.skrisjak.crew_planner.model.ShiftPlan;
import cz.skrisjak.crew_planner.model.WorkDay;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class PlanMapper {
    public static Plan map(List<WorkDay> workDays) {
        Plan plan = new Plan();
        plan.setStartDate(LocalDate.now());
        plan.setEndDate(LocalDate.now());

        workDays.forEach(workDay -> {
                    if (workDay.getDate().isAfter(plan.getEndDate())) {
                        plan.setEndDate(workDay.getDate());
                    }
                });
        List<WorkDayPlan> plans = workDays
                .stream()
                .map(PlanMapper::map)
                .collect(Collectors.toList());
        plan.setWorkDays(plans);
        return plan;
    }

    public static WorkDayPlan map(WorkDay workDay) {
        LocalDate date = workDay.getDate();
        WorkDayPlan dayPlan = new WorkDayPlan();
        dayPlan.setDate(date);
        dayPlan.setNotes(workDay.getNotes());
        dayPlan.setId(workDay.getId());
        dayPlan.setRegisteredWorkers(mapPlans(workDay.getRegisteredEmployees()));
        return dayPlan;
    }

    public static List<ResponseShiftPlan> mapPlans(List<ShiftPlan> registeredEmployees) {
        List<ResponseShiftPlan> workers = new ArrayList<>();
        if (registeredEmployees != null) {
            workers = registeredEmployees.stream().map(PlanMapper::mapPlan)
            .collect(Collectors.toList());
        }
        return workers;
    }

    public static ResponseShiftPlan mapPlan(ShiftPlan shiftPlan) {
        ResponseShiftPlan rsp = new ResponseShiftPlan();
        rsp.setId(shiftPlan.getId());
        rsp.setUser(shiftPlan.getUser().getNickName() != null ? shiftPlan.getUser().getNickName() : shiftPlan.getUser().getName());
        rsp.setImage(shiftPlan.getUser().getImage());
        rsp.setNote(shiftPlan.getNote());
        rsp.setAvailability(shiftPlan.getAvailability());
        return rsp;
    }
}