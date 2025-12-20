// PatientService.java
package com.examly.springapp.service;

import com.examly.springapp.model.Patient;
import com.examly.springapp.repository.PatientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class PatientService {
    private final PatientRepository repo;
    public PatientService(PatientRepository repo) { this.repo = repo; }

    public Patient create(Patient p) {
        return repo.save(p);
    }

    public List<Patient> all() {
        return repo.findAll();
    }
}
