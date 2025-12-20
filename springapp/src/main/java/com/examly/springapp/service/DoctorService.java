// DoctorService.java
package com.examly.springapp.service;

import com.examly.springapp.model.Doctor;
import com.examly.springapp.repository.DoctorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class DoctorService {
    private final DoctorRepository repo;
    public DoctorService(DoctorRepository repo) { this.repo = repo; }

    public Doctor create(Doctor d) {
        return repo.save(d);
    }

    public List<Doctor> all() {
        return repo.findAll();
    }
}
