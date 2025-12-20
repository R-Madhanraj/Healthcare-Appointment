// // File: springapp/src/main/java/com/examly/springapp/controller/PatientController.java
// package com.examly.springapp.controller;

// import com.examly.springapp.model.Patient;
// import com.examly.springapp.repository.PatientRepository;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// @RestController
// @RequestMapping("/api/patients")
// @CrossOrigin // dev convenience
// public class PatientController {

//     private final PatientRepository patientRepo;

//     public PatientController(PatientRepository patientRepo) {
//         this.patientRepo = patientRepo;
//     }

//     // Create patient. Frontend sends { "name": "Alice" }
//     @PostMapping
//     public ResponseEntity<?> createPatient(@RequestBody Patient patient) {
//         if (patient == null || patient.getName() == null || patient.getName().trim().isEmpty()) {
//             return ResponseEntity.badRequest().body("Name is required");
//         }
//         // strip whitespace and set name
//         patient.setName(patient.getName().trim());
//         Patient saved = patientRepo.save(patient);
//         return ResponseEntity.status(HttpStatus.CREATED).body(saved);
//     }
// }



package com.examly.springapp.controller;

import com.examly.springapp.model.Patient;
import com.examly.springapp.service.PatientService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    // ✅ THIS WAS MISSING: Handles GET /api/patients
    @GetMapping
    public ResponseEntity<List<Patient>> getAllPatients() {
        return ResponseEntity.ok(patientService.all());
    }

    // Handles POST /api/patients
    @PostMapping
    public ResponseEntity<?> createPatient(@RequestBody Patient patient) {
        if (patient == null || patient.getName() == null || patient.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Name is required");
        }
        patient.setName(patient.getName().trim());
        Patient saved = patientService.create(patient);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}