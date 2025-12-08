package cz.skrisjak.crew_planner.planning;

import cz.skrisjak.crew_planner.planning.data.PostNote;
import cz.skrisjak.crew_planner.shopping.data.PostShiftPlan;
import cz.skrisjak.crew_planner.planning.data.PostSlot;
import cz.skrisjak.crew_planner.planning.data.PostSlotPlan;
import cz.skrisjak.crew_planner.subscription.SubscriptionService;
import cz.skrisjak.crew_planner.user.User;
import cz.skrisjak.crew_planner.user.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PlanningService {

    private final UserRepository userRepository;
    private final WorkDayRepository repository;
    private final WorkDayNoteRepository noteRepository;
    private final ShiftPlanRepository shiftPlanRepository;
    private final DefaultSlotRepository defaultSlotRepository;
    private final WorkDaySlotRepository slotRepository;
    private final WorkDayRepository workDayRepository;
    private final SubscriptionService subscriptionService;


    @Autowired
    public PlanningService(WorkDayRepository repository, WorkDayNoteRepository noteRepository, ShiftPlanRepository shiftPlanRepository, UserRepository userRepository, DefaultSlotRepository defaultSlotRepository, WorkDaySlotRepository slotRepository, WorkDayRepository workDayRepository, SubscriptionService subscriptionService) {
        this.repository = repository;
        this.noteRepository = noteRepository;
        this.shiftPlanRepository = shiftPlanRepository;
        this.userRepository = userRepository;
        this.defaultSlotRepository = defaultSlotRepository;
        this.slotRepository = slotRepository;
        this.workDayRepository = workDayRepository;
        this.subscriptionService = subscriptionService;
    }

    public List<WorkDay> getWeekPlan() {
        LocalDate today = LocalDate.now(ZoneId.of("Europe/Prague"));
        LocalDate weekLater = today.plusDays(6);
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
                workDay = newWorkDay;
            } else {
                weekPlan.add(workDay);
            }

            if (workDay.getSlots() == null || workDay.getSlots().isEmpty()) {
                if (workDay.getSlots()==null) {
                    workDay.setSlots(new ArrayList<>());
                }
                WorkDay finalWorkDay = workDay;
                defaultSlotRepository.findAll().forEach(defaultSlot -> {
                    WorkDaySlot workDaySlot = new WorkDaySlot();
                    workDaySlot.setDefaultSlot(defaultSlot);
                    workDaySlot.setWorkDay(finalWorkDay);
                    finalWorkDay.getSlots().add(workDaySlot);
                    slotRepository.save(workDaySlot);
                });
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

    @Transactional
    public ShiftPlan addUserToWorkDay(PostShiftPlan shiftPlan) throws Exception {
        User user = userRepository.findByEmail(shiftPlan.getUserEmail()).orElseThrow();
        WorkDay workDay = repository.findById(shiftPlan.getWorkDayId()).orElseThrow();
        if (workDay.getRegisteredEmployees().stream().anyMatch(shiftPlan1 -> shiftPlan1.getUser().equals(user))) {
            throw new Exception("Already exists");
        }
        ShiftPlan plan = new ShiftPlan();
        plan.setUser(user);
        plan.setWorkDay(workDay);
        plan.setAvailability(shiftPlan.getAvailability());
        plan.setNote(shiftPlan.getNote());
        shiftPlanRepository.save(plan);
        return plan;
    }

    @Transactional
    public void updateUserToWorkDay(PostShiftPlan shiftPlan) {
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

    @Transactional
    public DefaultSlot addDefaultSlot(PostSlot postSlot) {
        DefaultSlot slot = new DefaultSlot();
        slot.setSlotName(postSlot.getSlotName());
        slot = defaultSlotRepository.save(slot);
        DefaultSlot finalSlot = slot;
        workDayRepository.findAll().forEach(workDay -> {
            WorkDaySlot workDaySlot = new WorkDaySlot();
            workDaySlot.setWorkDay(workDay);
            workDaySlot.setDefaultSlot(finalSlot);
            slotRepository.save(workDaySlot);
        });
        return slot;
    }

    public void deleteDefaultSlot(Long slotId) {
        DefaultSlot slot = defaultSlotRepository.findById(slotId).orElseThrow();
        defaultSlotRepository.delete(slot);
    }

    public void updateDefaultSlot(PostSlot slot) {
        DefaultSlot update = defaultSlotRepository.findById(slot.getId()).orElseThrow();
        update.setSlotName(slot.getSlotName());
        defaultSlotRepository.save(update);
    }

    public WorkDaySlot createSlot(PostSlot postSlot, User author) {
        WorkDaySlot workDaySlot = new WorkDaySlot();
        workDaySlot.setSlotName(postSlot.getSlotName());
        if (postSlot.getUser() != null) {
            workDaySlot.setUser(userRepository.findByEmail(postSlot.getUser()).orElseThrow());
        }
        if (postSlot.getWorkDayId() != null) {
            workDaySlot.setWorkDay(workDayRepository.findById(postSlot.getWorkDayId()).orElseThrow());
        }
        subscriptionService.notifyPlanChange(author);
        return slotRepository.save(workDaySlot);
    }

    public void updateSlot(PostSlot updatedSlot) {
        WorkDaySlot workDaySlot = slotRepository.findById(updatedSlot.getId()).orElseThrow();
        workDaySlot.setSlotName(updatedSlot.getSlotName());
        workDaySlot.setUser(userRepository.findByEmail(updatedSlot.getUser()).orElse(null));
        subscriptionService.notifySlotChange(workDaySlot);
        slotRepository.save(workDaySlot);
    }
    public void deleteSlot(Long slotId) {
        WorkDaySlot slot = slotRepository.findById(slotId).orElseThrow();
        subscriptionService.notifySlotChange(slot);
        slotRepository.delete(slot);
    }

    public void addUserToSlot(PostSlotPlan slot) {
        User user= userRepository.findByEmail(slot.getUser()).orElseThrow();
        WorkDaySlot workSlot = slotRepository.findById(slot.getSlotId()).orElseThrow();
        workSlot.setUser(user);
        subscriptionService.notifySlotChange(workSlot);
        slotRepository.save(workSlot);
    }

    public void deleteUserFromSlot(Long slotId) {
        WorkDaySlot workSlot = slotRepository.findById(slotId).orElseThrow();
        workSlot.setUser(null);
        slotRepository.save(workSlot);
    }

    private List<WorkDay> findByDate(LocalDate date) {
        return repository.findByDate(date);
    }

    private List<WorkDay> findByDateBetween(LocalDate date1, LocalDate date2) {
        return repository.findByDateBetween(date1, date2);
    }

    public List<DefaultSlot> getDefaultSlots() {
        return defaultSlotRepository.findAll();
    }
}