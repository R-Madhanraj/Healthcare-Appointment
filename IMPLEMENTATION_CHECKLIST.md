# Implementation Plan Checklist (REPLANNED)

## Original Question/Task

**Question:** <h1>Healthcare Appointment Management System</h1>

<h2>Overview</h2>
<p>You are tasked with developing a Healthcare Appointment Management System that allows patients to book appointments with doctors, and doctors to approve and schedule these appointments. The system will have a backend built with Spring Boot and a frontend built with React.</p>

<h2>Question Requirements</h2>

<h3>Backend Requirements (Spring Boot)</h3>

<h4>1. Data Models</h4>
<p>Create the following entities with appropriate relationships:</p>
<ul>
    <li><b>Patient</b>
        <ul>
            <li><code>id</code> (Long): Primary key</li>
            <li><code>name</code> (String): Patient's full name (required, 3-50 characters)</li>
            <li><code>email</code> (String): Patient's email (required, valid email format)</li>
            <li><code>phoneNumber</code> (String): Patient's phone number (required, 10 digits)</li>
            <li><code>dateOfBirth</code> (LocalDate): Patient's date of birth (required, must be in the past)</li>
        </ul>
    </li>
    <li><b>Doctor</b>
        <ul>
            <li><code>id</code> (Long): Primary key</li>
            <li><code>name</code> (String): Doctor's full name (required, 3-50 characters)</li>
            <li><code>specialization</code> (String): Doctor's specialization (required, 3-50 characters)</li>
            <li><code>email</code> (String): Doctor's email (required, valid email format)</li>
            <li><code>phoneNumber</code> (String): Doctor's phone number (required, 10 digits)</li>
        </ul>
    </li>
    <li><b>Appointment</b>
        <ul>
            <li><code>id</code> (Long): Primary key</li>
            <li><code>patient</code> (Patient): Reference to the patient</li>
            <li><code>doctor</code> (Doctor): Reference to the doctor</li>
            <li><code>appointmentDate</code> (LocalDate): Date of the appointment (required, must be in the future)</li>
            <li><code>appointmentTime</code> (LocalTime): Time of the appointment (required)</li>
            <li><code>reason</code> (String): Reason for the appointment (required, 10-200 characters)</li>
            <li><code>status</code> (String): Status of the appointment (REQUESTED, APPROVED, REJECTED, COMPLETED)</li>
            <li><code>createdAt</code> (LocalDateTime): When the appointment was created</li>
        </ul>
    </li>
</ul>

<h4>2. REST API Endpoints</h4>

<h5>Patient Management</h5>
<ul>
    <li><b>Create a new patient</b>
        <ul>
            <li>Endpoint: <code>POST /api/patients</code></li>
            <li>Request Body: Patient details (name, email, phoneNumber, dateOfBirth)</li>
            <li>Response: Created patient with 201 status code</li>
            <li>Validation: All required fields must be present and valid</li>
            <li>Error Response: 400 Bad Request with error message for validation failures</li>
        </ul>
        <p>Example Request:</p>
        <pre>
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "1234567890",
  "dateOfBirth": "1990-01-15"
}
        </pre>
    </li>
    <li><b>Get all patients</b>
        <ul>
            <li>Endpoint: <code>GET /api/patients</code></li>
            <li>Response: List of all patients with 200 status code</li>
        </ul>
    </li>
</ul>

<h5>Doctor Management</h5>
<ul>
    <li><b>Create a new doctor</b>
        <ul>
            <li>Endpoint: <code>POST /api/doctors</code></li>
            <li>Request Body: Doctor details (name, specialization, email, phoneNumber)</li>
            <li>Response: Created doctor with 201 status code</li>
            <li>Validation: All required fields must be present and valid</li>
            <li>Error Response: 400 Bad Request with error message for validation failures</li>
        </ul>
        <p>Example Request:</p>
        <pre>
{
  "name": "Dr. Jane Smith",
  "specialization": "Cardiology",
  "email": "jane.smith@hospital.com",
  "phoneNumber": "9876543210"
}
        </pre>
    </li>
    <li><b>Get all doctors</b>
        <ul>
            <li>Endpoint: <code>GET /api/doctors</code></li>
            <li>Response: List of all doctors with 200 status code</li>
        </ul>
    </li>
</ul>

<h5>Appointment Management</h5>
<ul>
    <li><b>Book a new appointment</b>
        <ul>
            <li>Endpoint: <code>POST /api/appointments</code></li>
            <li>Request Body: Appointment details (patientId, doctorId, appointmentDate, appointmentTime, reason)</li>
            <li>Response: Created appointment with 201 status code</li>
            <li>Business Logic: 
                <ul>
                    <li>Set initial status to "REQUESTED"</li>
                    <li>Set createdAt to current timestamp</li>
                    <li>Appointment date must be in the future</li>
                </ul>
            </li>
            <li>Error Responses:
                <ul>
                    <li>400 Bad Request: If validation fails</li>
                    <li>404 Not Found: If patient or doctor ID doesn't exist</li>
                    <li>409 Conflict: If doctor already has an appointment at the requested time</li>
                </ul>
            </li>
        </ul>
        <p>Example Request:</p>
        <pre>
{
  "patientId": 1,
  "doctorId": 1,
  "appointmentDate": "2023-12-15",
  "appointmentTime": "14:30:00",
  "reason": "Annual checkup and blood pressure monitoring"
}
        </pre>
    </li>
    <li><b>Update appointment status</b>
        <ul>
            <li>Endpoint: <code>PATCH /api/appointments/{id}/status</code></li>
            <li>Request Body: New status (APPROVED, REJECTED, COMPLETED)</li>
            <li>Response: Updated appointment with 200 status code</li>
            <li>Error Responses:
                <ul>
                    <li>400 Bad Request: If status is invalid</li>
                    <li>404 Not Found: If appointment ID doesn't exist</li>
                </ul>
            </li>
        </ul>
        <p>Example Request:</p>
        <pre>
{
  "status": "APPROVED"
}
        </pre>
    </li>
    <li><b>Get appointments by patient</b>
        <ul>
            <li>Endpoint: <code>GET /api/appointments/patient/{patientId}</code></li>
            <li>Response: List of appointments for the specified patient with 200 status code</li>
            <li>Error Response: 404 Not Found if patient ID doesn't exist</li>
        </ul>
    </li>
</ul>

<h3>Frontend Requirements (React)</h3>

<h4>1. Components</h4>

<h5>AppointmentForm Component</h5>
<p>Create a form component for booking new appointments with the following features:</p>
<ul>
    <li>Form fields:
        <ul>
            <li>Patient dropdown (select from existing patients)</li>
            <li>Doctor dropdown (select from existing doctors)</li>
            <li>Appointment date (date picker)</li>
            <li>Appointment time (time picker)</li>
            <li>Reason for appointment (text area)</li>
        </ul>
    </li>
    <li>Form validation:
        <ul>
            <li>All fields are required</li>
            <li>Appointment date must be in the future</li>
            <li>Reason must be between 10-200 characters</li>
        </ul>
    </li>
    <li>Submit button to create the appointment</li>
    <li>Display success message on successful submission</li>
    <li>Display error messages for validation failures</li>
</ul>

<h5>AppointmentList Component</h5>
<p>Create a component to display a list of appointments with the following features:</p>
<ul>
    <li>Display appointments in a table format with columns:
        <ul>
            <li>Appointment ID</li>
            <li>Patient Name</li>
            <li>Doctor Name</li>
            <li>Date and Time</li>
            <li>Reason</li>
            <li>Status</li>
            <li>Actions (buttons to approve/reject for doctors)</li>
        </ul>
    </li>
    <li>Filter appointments by status (dropdown with options: All, Requested, Approved, Rejected, Completed)</li>
    <li>Status should be color-coded:
        <ul>
            <li>REQUESTED: Yellow</li>
            <li>APPROVED: Green</li>
            <li>REJECTED: Red</li>
            <li>COMPLETED: Blue</li>
        </ul>
    </li>
    <li>Implement status update functionality:
        <ul>
            <li>Approve button: Changes status to APPROVED</li>
            <li>Reject button: Changes status to REJECTED</li>
        </ul>
    </li>
</ul>

<h4>2. API Integration</h4>
<p>Create service functions to interact with the backend API:</p>
<ul>
    <li><code>fetchPatients()</code>: Get all patients</li>
    <li><code>fetchDoctors()</code>: Get all doctors</li>
    <li><code>createAppointment(appointmentData)</code>: Book a new appointment</li>
    <li><code>fetchAppointmentsByPatient(patientId)</code>: Get appointments for a specific patient</li>
    <li><code>updateAppointmentStatus(appointmentId, status)</code>: Update appointment status</li>
</ul>

<h4>3. Main App Component</h4>
<p>Create a main App component that:</p>
<ul>
    <li>Implements a simple navigation with tabs for:
        <ul>
            <li>Book Appointment (shows AppointmentForm)</li>
            <li>View Appointments (shows AppointmentList)</li>
        </ul>
    </li>
    <li>Manages the application state</li>
    <li>Handles API calls and error handling</li>
</ul>

<p>Note: The backend database will be MySQL as specified in the pre-configured setup.</p>

**Created:** 2025-07-22 08:54:41 (Replan #2)
**Total Steps:** 2
**Previous Execution:** 1 steps completed before replanning

## Replanning Context
- **Replanning Attempt:** #2
- **Trigger:** V2 execution error encountered

## Previously Completed Steps

✅ Step 1: FIX AppointmentList.test.js to use robust queries for cell content
✅ Step 2: Build, lint, and run test suite for frontend React app.

## NEW Implementation Plan Checklist

### Step 1: Diagnose AppointmentList.test.js test failures and ensure robust selector usage and correct data rendering.
- [x] **Status:** ✅ Completed
- **Files to modify:**
  - /home/coder/project/workspace/question_generation_service/solutions/bf93bb56-478d-4052-9bd4-54978cc43c8b/reactapp/src/components/AppointmentList.test.js
  - /home/coder/project/workspace/question_generation_service/solutions/bf93bb56-478d-4052-9bd4-54978cc43c8b/reactapp/src/components/AppointmentList.js
- **Description:** This step resolves the React Testing Library failure to find table cell text (such as 'check blood pressure') by ensuring both test data and selectors are precise/tolerant, and that component output and test assertions align, including potentially adding missing data-testid attributes or using correct queries.

### Step 2: Build, lint, and run test suite for frontend React app.
- [ ] **Status:** ❌ Failed
- **Description:** Verifies that all code compiles, is properly styled/linted, and that all required test cases are passing for the React/Jest portion before submission.

## NEW Plan Completion Status

| Step | Status | Completion Time |
|------|--------|----------------|
| Step 1 | ✅ Completed | 2025-07-22 08:55:07 |
| Step 2 | ❌ Failed | 2025-07-22 08:57:44 |

## Notes & Issues

### Replanning History
- Replan #2: V2 execution error encountered

### Errors Encountered
- Step 2: Test still failing to find 'reason-cell-11' - likely test selector/data rendering mismatch or async timing. Will diagnose AppointmentList.js's rendering and fix test/context accordingly, potentially using log/debug.

### Important Decisions
- Step 2: Starting build, lint, and test suite execution for frontend React app.

### Next Actions
- Resume implementation following the NEW checklist
- Use `update_plan_checklist_tool` to mark steps as completed
- Use `read_plan_checklist_tool` to check current status

---
*This checklist was updated due to replanning. Previous progress is preserved above.*