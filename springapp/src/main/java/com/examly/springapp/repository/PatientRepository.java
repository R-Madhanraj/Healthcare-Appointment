// PatientRepository.java
package com.examly.springapp.repository;

import com.examly.springapp.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository extends JpaRepository<Patient, Long> {
}
