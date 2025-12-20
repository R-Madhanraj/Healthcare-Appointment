package com.examly.springapp.config;

import com.examly.springapp.model.Doctor;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.DoctorRepository;
import com.examly.springapp.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {
    private final DoctorRepository doctorRepo;
    private final UserRepository userRepo;

    public DataLoader(DoctorRepository doctorRepo, UserRepository userRepo) {
        this.doctorRepo = doctorRepo;
        this.userRepo = userRepo;
    }

    private String simpleHash(String s) {
        try {
            java.security.MessageDigest md = java.security.MessageDigest.getInstance("SHA-256");
            byte[] d = md.digest(s.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : d) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception e) { return ""; }
    }

    @Override
    public void run(String... args) throws Exception {
        // Only run if the database is empty
        if (doctorRepo.count() == 0) {
            
            String[] names = {
                "Dr. Smith", 
                "Dr. Patel", 
                "Dr. Williams", 
                "Dr. Jones", 
                "Dr. Brown", 
                "Dr. Davis"
            };

            String[] specs = {
                "Cardiology",
                "Dermatology",
                "Neurology",
                "Orthopedics",
                "Pediatrics",
                "Psychiatry"
            };

            for (int i = 0; i < 6; i++) {
                Doctor d = new Doctor();
                
                String fullName = names[i] + " (" + specs[i] + ")";
                d.setName(fullName);
                
                d.setSpecialization(specs[i]);
                d.setEmail("doctor" + (i + 1) + "@clinic.com");
                Doctor savedDoc = doctorRepo.save(d);

                User u = new User();
                String uname = "doctor" + (i + 1);
                u.setUsername(uname);
                u.setPasswordHash(simpleHash("docpass" + (i + 1)));
                u.setRole("DOCTOR");
                User savedUser = userRepo.save(u);

                savedDoc.setUserId(savedUser.getId());
                doctorRepo.save(savedDoc);
            }
            System.out.println("Seeded doctors with specializations.");
        }
    }
}