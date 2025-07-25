package cz.skrisjak.crew_planner.rest;

import cz.skrisjak.crew_planner.data.*;
import cz.skrisjak.crew_planner.mapper.PlanMapper;
import cz.skrisjak.crew_planner.model.ShiftPlan;
import cz.skrisjak.crew_planner.model.WorkDay;
import cz.skrisjak.crew_planner.service.PlanningService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/plan")
@PreAuthorize("isAuthenticated()")
public class PlanController {

    private PlanningService planningService;

    @Autowired
    public PlanController(PlanningService planningService) {
        this.planningService = planningService;
    }

    @GetMapping
    public ResponseEntity<Plan> getShiftPlan() {
        List<WorkDay> workDays = planningService.getWeekPlan();
        Plan plan = PlanMapper.map(workDays);
        return ResponseEntity.ok(plan);
    }

    @GetMapping(params = {"startDate","endDate"})
    public ResponseEntity<Plan> getShiftWorkDays(@RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)LocalDate startDate,@RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)LocalDate endDate) {
        List<WorkDay> workDays = planningService.getPlan(startDate, endDate);
        Plan plan = PlanMapper.map(workDays);
        return ResponseEntity.ok(plan);
    }

    @PostMapping(path = "/worker")
    public ResponseEntity<ResponseShiftPlan> createPlan(@RequestBody PostShiftPlan plan) {
        try {
            ShiftPlan sp = planningService.addUserToWorkDay(plan);
            ResponseShiftPlan rsp =PlanMapper.mapPlan(sp);
            return ResponseEntity.ok(rsp);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @PutMapping(path = "/worker")
    public ResponseEntity<Void> updatePlan(@RequestBody PostShiftPlan plan) {
        try {
            planningService.updateUserToWorkDay(plan);
            return ResponseEntity.accepted().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping(path = "/worker")
    public ResponseEntity<Void> removeWorkerFromWorkDay(@RequestParam(name="planId") Long planId) {
        try {
            planningService.removeUserFromWorkDay(planId);
            return ResponseEntity.accepted().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping(path = "/note")
    public ResponseEntity<ResponseNote> postNote(@RequestBody PostNote note) {
        try {
            return ResponseEntity.ok(PlanMapper.mapNote(planningService.addNote(note)));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping(path = "/note")
    public ResponseEntity<Void> updateNote(@RequestBody PostNote note) {
        try {
            planningService.updateNote(note);
            return ResponseEntity.accepted().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping(path = "/note")
    public ResponseEntity<Void> deleteNote(@RequestParam(name="noteId") Long noteId) {
        try {
            planningService.removeNote(noteId);
            return ResponseEntity.accepted().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }
}