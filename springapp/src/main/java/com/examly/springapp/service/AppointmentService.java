package com.examly.springapp.service;

import com.examly.springapp.dto.AppointmentRequest;
import com.examly.springapp.model.Appointment;
import com.examly.springapp.model.AppointmentStatus;
import com.examly.springapp.model.Doctor;
import com.examly.springapp.model.Patient;
import com.examly.springapp.repository.AppointmentRepository;
import com.examly.springapp.repository.DoctorRepository;
import com.examly.springapp.repository.PatientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepo;
    private final DoctorRepository doctorRepo;
    private final PatientRepository patientRepo;

    public AppointmentService(AppointmentRepository appointmentRepo,
                              DoctorRepository doctorRepo,
                              PatientRepository patientRepo) {
        this.appointmentRepo = appointmentRepo;
        this.doctorRepo = doctorRepo;
        this.patientRepo = patientRepo;
    }

    // --- CREATE ---
    @Transactional
    public Appointment createAppointment(AppointmentRequest req) {
        if (req == null) throw new IllegalArgumentException("Empty request");

        if (isBlank(req.getPatientId()) || isBlank(req.getDoctorId()) || isBlank(req.getAppointmentDate()) || isBlank(req.getAppointmentTime())) {
            throw new IllegalArgumentException("Required fields missing");
        }

        Long pid = Long.parseLong(req.getPatientId().trim());
        Long did = Long.parseLong(req.getDoctorId().trim());

        Patient p = patientRepo.findById(pid).orElseThrow(() -> new IllegalStateException("Patient not found"));
        Doctor d = doctorRepo.findById(did).orElseThrow(() -> new IllegalStateException("Doctor not found"));

        Appointment appt = new Appointment();
        // Use direct setters (No reflection needed)
        appt.setPatientName(p.getName());
        appt.setPatientEmail(p.getEmail());
        appt.setPatientPhone(p.getPhone());
        appt.setDoctor(d);
        
        appt.setAppointmentDate(LocalDate.parse(req.getAppointmentDate()));
        appt.setAppointmentTime(LocalTime.parse(req.getAppointmentTime()));
        appt.setReason(req.getReason());
        appt.setStatus(AppointmentStatus.REQUESTED);
        
        return appointmentRepo.save(appt);
    }

    // --- READ ---
    public List<Appointment> getAll() { return appointmentRepo.findAll(); }

    public List<Appointment> getByDoctorId(Long doctorId) { return appointmentRepo.findByDoctor_Id(doctorId); }

    public List<Appointment> getByPatientId(Long patientId) {
        Optional<Patient> p = patientRepo.findById(patientId);
        if (p.isEmpty()) return List.of();
        String name = p.get().getName();
        if (name == null || name.trim().isEmpty()) return List.of();
        return appointmentRepo.findByPatientName(name);
    }
    
    // --- UPDATE STATUS ---
    @Transactional
    public Appointment updateStatus(Long id, String status) {
        Appointment a = appointmentRepo.findById(id).orElseThrow(() -> new IllegalStateException("Not found"));
        try {
            a.setStatus(AppointmentStatus.valueOf(status));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: " + status);
        }
        return appointmentRepo.save(a);
    }

    // --- DELETE (Cancel) ---
    public void deleteAppointment(Long id) {
        if (!appointmentRepo.existsById(id)) {
            throw new IllegalStateException("Appointment with ID " + id + " not found");
        }
        appointmentRepo.deleteById(id);
    }

    // --- UPDATE (Reschedule) ---
    @Transactional
    public Appointment updateAppointment(Long id, AppointmentRequest req) {
        Appointment appt = appointmentRepo.findById(id)
                .orElseThrow(() -> new IllegalStateException("Appointment with ID " + id + " not found"));

        // Only update fields if they are provided
        if (!isBlank(req.getAppointmentDate())) {
            try {
                appt.setAppointmentDate(LocalDate.parse(req.getAppointmentDate()));
            } catch (Exception e) {
                throw new IllegalArgumentException("Invalid date format. Expected yyyy-MM-dd");
            }
        }
        if (!isBlank(req.getAppointmentTime())) {
            try {
                appt.setAppointmentTime(LocalTime.parse(req.getAppointmentTime()));
            } catch (Exception e) {
                throw new IllegalArgumentException("Invalid time format. Expected HH:mm");
            }
        }
        
        // Save and return
        return appointmentRepo.save(appt);
    }

    // Helper method to check for null/empty strings
    private boolean isBlank(String s) { 
        return s == null || s.trim().isEmpty(); 
    }
}