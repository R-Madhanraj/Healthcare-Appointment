package com.examly.springapp.repository;

import com.examly.springapp.model.Appointment;
import com.examly.springapp.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // If Appointment has a Doctor relation, this will work. Keep it as a convenience.
    @Query("select a from Appointment a where a.doctor.id = :doctorId")
    List<Appointment> findByDoctor_Id(@Param("doctorId") Long doctorId);

    // Explicit query against the column your entity has: patientName
    @Query("select a from Appointment a where a.patientName = :patientName")
    List<Appointment> findByPatientName(@Param("patientName") String patientName);

    // fallback: list all for a given doctor entity (if you have the object)
    @Query("select a from Appointment a where a.doctor = :doctor")
    List<Appointment> findByDoctor(@Param("doctor") Doctor doctor);
}
