package cz.skrisjak.crew_planner.service;

import cz.skrisjak.crew_planner.data.PostNote;
import cz.skrisjak.crew_planner.data.PostShiftPlan;
import cz.skrisjak.crew_planner.model.ShiftPlan;
import cz.skrisjak.crew_planner.model.User;
import cz.skrisjak.crew_planner.model.WorkDay;
import cz.skrisjak.crew_planner.model.WorkDayNote;
import cz.skrisjak.crew_planner.repository.ShiftPlanRepository;
import cz.skrisjak.crew_planner.repository.UserRepository;
import cz.skrisjak.crew_planner.repository.WorkDayNoteRepository;
import cz.skrisjak.crew_planner.repository.WorkDayRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PlanningService {

    private final UserRepository userRepository;
    private final WorkDayRepository repository;
    private final WorkDayNoteRepository noteRepository;
    private final ShiftPlanRepository shiftPlanRepository;

    @Autowired
    public PlanningService(WorkDayRepository repository, WorkDayNoteRepository noteRepository, ShiftPlanRepository shiftPlanRepository, UserRepository userRepository) {
        this.repository = repository;
        this.noteRepository = noteRepository;
        this.shiftPlanRepository = shiftPlanRepository;
        this.userRepository = userRepository;
    }

    public List<WorkDay> getWeekPlan() {
        LocalDate today = LocalDate.now(ZoneId.of("Europe/Prague"));
        LocalDate weekLater = today.plusDays(7);
        return getPlan(today, weekLater);
    }

    public List<WorkDay> getPlan(LocalDate startDate, LocalDate endDate) {

        List<WorkDay> workDays = repository.findByDateBetween(startDate, endDate);

        Map<LocalDate, WorkDay> workDaysMap = workDays.stream()
                .collect(Collectors.toMap(WorkDay::getDate, wd -> wd));

        List<WorkDay> weekPlan = new ArrayList<>(8);

        long difference = ChronoUnit.DAYS.between(startDate, endDate);

        for (int i = 0; i <= difference; i++) {
            LocalDate currentDate = startDate.plusDays(i);

            WorkDay workDay = workDaysMap.get(currentDate);
            if (workDay == null) {
                WorkDay newWorkDay = new WorkDay();
                newWorkDay.setDate(currentDate);
                newWorkDay = repository.save(newWorkDay);
                weekPlan.add(newWorkDay);
            } else {
                weekPlan.add(workDay);
            }
        }
        return weekPlan;
    }

    public WorkDayNote addNote(PostNote note) {
        WorkDay workDay = repository.findById(note.getWorkDayId()).orElseThrow();
        WorkDayNote workDayNote = new WorkDayNote();
        workDayNote.setLabel(note.getLabel());
        workDayNote.setDescription(note.getDescription());
        workDayNote.setWorkDay(workDay);
        workDay.getNotes().add(workDayNote);
        return noteRepository.save(workDayNote);
    }

    public void updateNote(PostNote updatedNote) {
        WorkDayNote note = noteRepository.findById(updatedNote.getId()).orElseThrow();
        note.setLabel(updatedNote.getLabel());
        note.setDescription(updatedNote.getDescription());
        noteRepository.save(note);
    }

    public void removeNote(Long id) {
        WorkDayNote note = noteRepository.findById(id).orElseThrow();
        note.getWorkDay().getNotes().remove(note);
        noteRepository.delete(note);
    }

    public ShiftPlan addUserToWorkDay(PostShiftPlan shiftPlan) {
        User user = userRepository.findByEmail(shiftPlan.getUserEmail()).orElseThrow();
        WorkDay workDay = repository.findById(shiftPlan.getWorkDayId()).orElseThrow();

        ShiftPlan plan = new ShiftPlan();
        plan.setUser(user);
        plan.setWorkDay(workDay);
        plan.setAvailability(shiftPlan.getAvailability());
        plan.setNote(shiftPlan.getNote());
        shiftPlanRepository.save(plan);
        return plan;
    }

    public void updateUserToWorkDay(PostShiftPlan shiftPlan) {
        System.out.println(shiftPlan);
        WorkDay workDay = repository.findById(shiftPlan.getWorkDayId()).orElseThrow();
        workDay.getRegisteredEmployees()
                .stream()
                .filter(sp -> {
                    return sp.getId().equals(shiftPlan.getId());
                })
                .findFirst()
                .ifPresent(sp -> {
                    sp.setAvailability(shiftPlan.getAvailability());
                    sp.setNote(shiftPlan.getNote());
                    shiftPlanRepository.save(sp);
            });
    }

    public void removeUserFromWorkDay(Long planId) {
        ShiftPlan plan =shiftPlanRepository.findById(planId).orElseThrow();
        shiftPlanRepository.delete(plan);
    }

    private List<WorkDay> findByDate(LocalDate date) {
        return repository.findByDate(date);
    }

    private List<WorkDay> findByDateBetween(LocalDate date1, LocalDate date2) {
        return repository.findByDateBetween(date1, date2);
    }
}
