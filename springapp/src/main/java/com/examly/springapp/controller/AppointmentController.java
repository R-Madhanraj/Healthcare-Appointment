package com.examly.springapp.controller;

import com.examly.springapp.dto.AppointmentRequest;
import com.examly.springapp.model.Appointment;
import com.examly.springapp.service.AppointmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    public ResponseEntity<?> createAppointment(@RequestBody AppointmentRequest req) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(appointmentService.createAppointment(req));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Appointment>> getAll() {
        return ResponseEntity.ok(appointmentService.getAll());
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<?> getByDoctorPath(@PathVariable Long doctorId) {
        return ResponseEntity.ok(appointmentService.getByDoctorId(doctorId));
    }

    @GetMapping("/doctor")
    public ResponseEntity<?> getByDoctorQuery(@RequestParam(required = false) Long doctorId, @RequestParam(required = false) Long id) {
        Long did = doctorId != null ? doctorId : id;
        return ResponseEntity.ok(appointmentService.getByDoctorId(did));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<?> getByPatientPath(@PathVariable Long patientId) {
        return ResponseEntity.ok(appointmentService.getByPatientId(patientId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(appointmentService.updateStatus(id, body.get("status")));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAppointment(@PathVariable Long id) {
        try {
            appointmentService.deleteAppointment(id);
            return ResponseEntity.noContent().build(); // 204 No Content
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAppointment(@PathVariable Long id, @RequestBody AppointmentRequest req) {
        try {
            return ResponseEntity.ok(appointmentService.updateAppointment(id, req));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}