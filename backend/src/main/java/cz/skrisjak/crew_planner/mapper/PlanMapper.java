package cz.skrisjak.crew_planner.mapper;

import cz.skrisjak.crew_planner.data.*;
import cz.skrisjak.crew_planner.model.*;

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
        if (workDay.getNotes() != null) {
            dayPlan.setNotes(workDay.getNotes().stream().map(PlanMapper::mapNote).toList());
        }
        if (workDay.getSlots() != null) {
            dayPlan.setSlots(workDay.getSlots().stream().map(PlanMapper::mapSlot).toList());
        }
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

    public static ResponseNote mapNote(WorkDayNote note) {
        ResponseNote rn = new ResponseNote();
        rn.setLabel(note.getLabel());
        rn.setDescription(note.getDescription());
        rn.setId(note.getId());
        rn.setWorkDayId(note.getWorkDay().getId());
        return rn;
    }

    public static ResponseSlot mapSlot(WorkDaySlot slot) {
        ResponseSlot rs = new ResponseSlot();
        rs.setId(slot.getId());
        rs.setDate(slot.getWorkDay().getDate());
        if (slot.getDefaultSlot() != null) {
            rs.setSlotName(slot.getDefaultSlot().getSlotName());
        } else {
            rs.setSlotName(slot.getSlotName());
        }
        User u = slot.getUser();

        if (u != null) {
            if (u.getNickName() != null && u.getNickName() != "") {
                rs.setRegisteredWorkerName(u.getNickName());
            } else {
                rs.setRegisteredWorkerName(u.getName());
            }
        }
        return rs;
    }

    public static ResponseSlot mapSlot(DefaultSlot slot) {
        ResponseSlot rs = new ResponseSlot();
        rs.setId(slot.getId());
        rs.setSlotName(slot.getSlotName());
        return rs;
    }
}