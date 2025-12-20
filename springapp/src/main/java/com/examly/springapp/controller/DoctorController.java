package com.examly.springapp.controller;

import com.examly.springapp.model.Doctor;
import com.examly.springapp.service.*;
import com.examly.springapp.repository.DoctorRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin
public class DoctorController {
    private final DoctorRepository repo;
    public DoctorController(DoctorRepository repo) { this.repo = repo; }

    @GetMapping
    public List<Doctor> all() { return repo.findAll(); }
}
