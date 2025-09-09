package cz.skrisjak.crew_planner.rest;

import cz.skrisjak.crew_planner.data.*;
import cz.skrisjak.crew_planner.mapper.PlanMapper;
import cz.skrisjak.crew_planner.model.*;
import cz.skrisjak.crew_planner.service.PlanningService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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

    @GetMapping(path="/defaultSlots")
    public ResponseEntity<List<ResponseSlot>> getDefaultSlots() {
        return ResponseEntity.ok(planningService.getDefaultSlots().stream().map(PlanMapper::mapSlot).toList());
    }

    @PostMapping(path="/defaultSlot")
    public ResponseEntity<ResponseSlot> createDefaultSlot(@RequestBody PostSlot slot) {
        DefaultSlot newSlot = planningService.addDefaultSlot(slot);
        return ResponseEntity.ok(PlanMapper.mapSlot(newSlot));
    }

    @PutMapping(path="/defaultSlot")
    public ResponseEntity<Void> updateDefaultSlot(@RequestBody PostSlot slot) {
        try {
            planningService.updateDefaultSlot(slot);
            return ResponseEntity.accepted().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping(path="/defaultSlot")
    public ResponseEntity<Void> deleteDefaultSlot(@RequestParam(name="slotId") Long slotId) {
        try {
            planningService.deleteDefaultSlot(slotId);
            return ResponseEntity.accepted().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping(path="/slot")
    public ResponseEntity<ResponseSlot> createSlot(@RequestBody PostSlot slot, @AuthenticationPrincipal User user) {
        try {
            return ResponseEntity.ok(PlanMapper.mapSlot(planningService.createSlot(slot, user)));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping(path="/slot")
    public ResponseEntity<Void> updateSlot(@RequestBody PostSlot slot) {
        try {
            planningService.updateSlot(slot);
            return ResponseEntity.accepted().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping(path="/slot")
    public ResponseEntity<Void> deleteSlot(@RequestParam(name="slotId") Long slotId) {
        try {
            planningService.deleteSlot(slotId);
            return ResponseEntity.accepted().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping(path = "/slot/user")
    public ResponseEntity<Void> putUserToSlot(@RequestBody PostSlotPlan slot) {
        try {
            planningService.addUserToSlot(slot);
            return ResponseEntity.accepted().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping(path = "/slot/user")
    public ResponseEntity<Void> deleteUserFromSlot(@RequestParam(name="slotId") Long slotId) {
        try {
            planningService.deleteUserFromSlot(slotId);
            return ResponseEntity.accepted().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }
}