package com.campuscare.seeder;

import com.campuscare.entity.*;
import com.campuscare.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseSeeder.class);

    private final UserRepository userRepository;
    private final IssueRepository issueRepository;
    private final AssignmentRepository assignmentRepository;
    private final IssueHistoryRepository issueHistoryRepository;
    private final CommentRepository commentRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DatabaseSeeder(UserRepository userRepository,
                          IssueRepository issueRepository,
                          AssignmentRepository assignmentRepository,
                          IssueHistoryRepository issueHistoryRepository,
                          CommentRepository commentRepository,
                          NotificationRepository notificationRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.issueRepository = issueRepository;
        this.assignmentRepository = assignmentRepository;
        this.issueHistoryRepository = issueHistoryRepository;
        this.commentRepository = commentRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            logger.info("Database already seeded. Skipping initial data population.");
            return;
        }

        logger.info("Starting CampusCare database seeding...");

        // 1. Create Admin
        User admin = new User("Dr. Evelyn Reed", "admin@campuscare.com", passwordEncoder.encode("admin123"), Role.ROLE_ADMIN);
        admin.setDepartment("Campus Administration");
        admin.setPhone("+1 (555) 019-2831");
        admin = userRepository.save(admin);

        // 2. Create 3 Staff members
        User staff1 = new User("Marcus Vance", "staff1@campuscare.com", passwordEncoder.encode("staff123"), Role.ROLE_STAFF);
        staff1.setDepartment("Electrical & Hardware Maintenance");
        staff1.setPhone("+1 (555) 014-9921");
        staff1 = userRepository.save(staff1);

        User staff2 = new User("Priya Sharma", "staff2@campuscare.com", passwordEncoder.encode("staff123"), Role.ROLE_STAFF);
        staff2.setDepartment("IT Infrastructure & Networks");
        staff2.setPhone("+1 (555) 018-4432");
        staff2 = userRepository.save(staff2);

        User staff3 = new User("David Chen", "staff3@campuscare.com", passwordEncoder.encode("staff123"), Role.ROLE_STAFF);
        staff3.setDepartment("Facilities & Hostel Operations");
        staff3.setPhone("+1 (555) 012-7789");
        staff3 = userRepository.save(staff3);

        // 3. Create 5 Students
        User student1 = new User("Alex Rivera", "student1@campuscare.com", passwordEncoder.encode("student123"), Role.ROLE_STUDENT);
        student1.setDepartment("Computer Science & Eng.");
        student1.setPhone("+1 (555) 011-3321");
        student1 = userRepository.save(student1);

        User student2 = new User("Samantha Brooke", "student2@campuscare.com", passwordEncoder.encode("student123"), Role.ROLE_STUDENT);
        student2.setDepartment("Electrical Engineering");
        student2.setPhone("+1 (555) 013-4412");
        student2 = userRepository.save(student2);

        User student3 = new User("Rohan Patel", "student3@campuscare.com", passwordEncoder.encode("student123"), Role.ROLE_STUDENT);
        student3.setDepartment("Mechanical Engineering");
        student3.setPhone("+1 (555) 015-6671");
        student3 = userRepository.save(student3);

        User student4 = new User("Emily Zhang", "student4@campuscare.com", passwordEncoder.encode("student123"), Role.ROLE_STUDENT);
        student4.setDepartment("Biotechnology");
        student4.setPhone("+1 (555) 017-8891");
        student4 = userRepository.save(student4);

        User student5 = new User("Jordan Hayes", "student5@campuscare.com", passwordEncoder.encode("student123"), Role.ROLE_STUDENT);
        student5.setDepartment("Business Administration");
        student5.setPhone("+1 (555) 019-1142");
        student5 = userRepository.save(student5);

        // 4. Create Sample Issues across categories, priorities, and statuses

        // --- REPORTED Issues (New, unassigned) ---
        createIssue("CC-2026-1001", "Wi-Fi not working in CSE Lab 2",
                "Students are unable to connect to the campus Wi-Fi network 'CampusCare-Secure' in lab 2. Gateway appears unresponsive.",
                IssueCategory.WIFI_INTERNET, Priority.HIGH, IssueStatus.REPORTED, "Turing Block, Room 204 (CSE Lab 2)",
                student1, null, null, null, null,
                LocalDateTime.now().minusHours(2));

        createIssue("CC-2026-1002", "Projector bulb burnt out during lecture",
                "Ceiling-mounted Epson projector in Seminar Hall B flickers violently and shut down mid-lecture.",
                IssueCategory.CLASSROOM, Priority.MEDIUM, IssueStatus.REPORTED, "Academic Hall B, 3rd Floor",
                student2, null, null, null, null,
                LocalDateTime.now().minusHours(4));

        createIssue("CC-2026-1003", "Main water cooler leaking in East Wing",
                "Continuous water overflow near the stairwell posing a severe slip hazard for students.",
                IssueCategory.HOSTEL, Priority.CRITICAL, IssueStatus.REPORTED, "Oak Residence Hall, 1st Floor East Wing",
                student3, null, null, null, null,
                LocalDateTime.now().minusHours(5));

        createIssue("CC-2026-1004", "Centrifuge #3 vibrating excessively in Bio Lab",
                "Centrifuge unit 3 displays error E-04 and vibrates loudly during high-speed RPM cycles.",
                IssueCategory.LABORATORY, Priority.HIGH, IssueStatus.REPORTED, "Franklin Life Sciences Building, Lab 102",
                student4, null, null, null, null,
                LocalDateTime.now().minusHours(8));

        // --- ASSIGNED Issues (Assigned to staff, pending acceptance) ---
        createIssue("CC-2026-1005", "Exposed wiring on workbench electrical outlet",
                "Faceplate cracked and live neutral wire slightly visible on station table 7.",
                IssueCategory.ELECTRICAL, Priority.CRITICAL, IssueStatus.ASSIGNED, "Robotics Lab, Station 7",
                student1, staff1, admin, null, null,
                LocalDateTime.now().minusDays(1));

        createIssue("CC-2026-1006", "Access switch port packet loss in Library 2nd Floor",
                "Study carrels on second floor experiencing 40% packet drops to research databases.",
                IssueCategory.WIFI_INTERNET, Priority.HIGH, IssueStatus.ASSIGNED, "Main Library, Level 2 East",
                student5, staff2, admin, null, null,
                LocalDateTime.now().minusDays(1).minusHours(3));

        createIssue("CC-2026-1007", "Hostel Room 314 door lock jammed",
                "RFID card reader blinks red continuously and manual override key mechanism is sticking.",
                IssueCategory.HOSTEL, Priority.MEDIUM, IssueStatus.ASSIGNED, "Pine Residence Hall, Room 314",
                student3, staff3, admin, null, null,
                LocalDateTime.now().minusDays(1).minusHours(6));

        createIssue("CC-2026-1008", "Air conditioning unit leaking water in Server Room Annex",
                "Condensation drip tray overflowing directly above network cable trays.",
                IssueCategory.CLEANING, Priority.CRITICAL, IssueStatus.ASSIGNED, "IT Infrastructure Building, Server Room B",
                student2, staff3, admin, null, null,
                LocalDateTime.now().minusDays(1).minusHours(10));

        // --- IN_PROGRESS Issues (Staff actively working) ---
        createIssue("CC-2026-1009", "Campus Shuttle Bus 4 hydraulic lift malfunction",
                "Wheelchair access lift on Shuttle 4 failed safety check before morning campus route.",
                IssueCategory.TRANSPORT, Priority.HIGH, IssueStatus.IN_PROGRESS, "Central Transit Depot",
                student4, staff3, admin, "Technician currently replacing the primary hydraulic pressure valve.", null,
                LocalDateTime.now().minusDays(2));

        createIssue("CC-2026-1010", "Main auditorium audio feedback & microphone static",
                "Wireless lavalier microphones producing heavy 60Hz hum through front line array speakers.",
                IssueCategory.CLASSROOM, Priority.MEDIUM, IssueStatus.IN_PROGRESS, "University Auditorium",
                student5, staff1, admin, "Auditorium sound board re-grounded, checking RF frequency band interference.", null,
                LocalDateTime.now().minusDays(2).minusHours(4));

        createIssue("CC-2026-1011", "DNS resolution failure on Guest Wi-Fi portal",
                "Captive portal splash page does not redirect properly on iOS devices.",
                IssueCategory.WIFI_INTERNET, Priority.MEDIUM, IssueStatus.IN_PROGRESS, "Campus-Wide Guest Portal",
                student1, staff2, admin, "Updated SSL certificate bindings on captive portal controller.", null,
                LocalDateTime.now().minusDays(2).minusHours(8));

        createIssue("CC-2026-1012", "Broken window latch on 4th floor reading room",
                "High winds causing window to rattle loose and allow rain spray into book stacks.",
                IssueCategory.LIBRARY, Priority.LOW, IssueStatus.IN_PROGRESS, "Main Library, Rare Books Section",
                student3, staff3, admin, "Temporary seal installed, replacement hinge assembly on order.", null,
                LocalDateTime.now().minusDays(3));

        // --- RESOLVED Issues ---
        createIssue("CC-2026-1013", "Flickering fluorescent tubes in Chemistry Lab 3",
                "Overhead ballast humming loudly and four light tubes flickering constantly.",
                IssueCategory.ELECTRICAL, Priority.LOW, IssueStatus.RESOLVED, "Mendeleev Chemistry Complex, Lab 3",
                student2, staff1, admin, "Replaced magnetic ballast with electronic high-efficiency ballast and installed 4 new LED T8 tubes. Tested operational.", null,
                LocalDateTime.now().minusDays(4));

        createIssue("CC-2026-1014", "Emergency call box #7 solar battery depleted",
                "North perimeter emergency blue light call box not illuminating after dusk.",
                IssueCategory.SECURITY, Priority.HIGH, IssueStatus.RESOLVED, "North Perimeter Jogging Trail, Station 7",
                student4, staff1, admin, "Replaced 12V deep-cycle solar storage battery and cleaned photovoltaic surface. Full cellular telemetry restored.", null,
                LocalDateTime.now().minusDays(5));

        createIssue("CC-2026-1015", "Corrupted firmware on 3D Printer in Prototyping Lab",
                "Ultimaker 3D printer stuck in boot loop after scheduled campus power maintenance.",
                IssueCategory.LABORATORY, Priority.MEDIUM, IssueStatus.RESOLVED, "Engineering Workshop 105",
                student1, staff2, admin, "Reflashed Marlin firmware via ISP programmer and recalibrated bed leveling sensors. Completed test bench print.", null,
                LocalDateTime.now().minusDays(6));

        createIssue("CC-2026-1016", "Card reader at North Campus gate cycling offline",
                "Student ID turnstile intermittently rejecting valid student RFID credentials.",
                IssueCategory.SECURITY, Priority.CRITICAL, IssueStatus.RESOLVED, "North Campus Turnstile Gate B",
                student5, staff2, admin, "Re-terminated PoE Ethernet line and reset door access controller cache. 100% swipe pass rate confirmed.", null,
                LocalDateTime.now().minusDays(7));

        // --- CLOSED Issues ---
        createIssue("CC-2026-1017", "Fume hood exhaust flow rate alarm triggered",
                "Sensor beeping continuously indicating face velocity below 80 FPM threshold.",
                IssueCategory.LABORATORY, Priority.CRITICAL, IssueStatus.CLOSED, "Chemistry Annex, Hood #2",
                student2, staff1, admin, "V-belt on rooftop exhaust fan was slipping. Re-tensioned belt and calibrated pressure transducer. Certified at 105 FPM.", null,
                LocalDateTime.now().minusDays(10));

        createIssue("CC-2026-1018", "Spill of motor oil in campus parking lot 3",
                "Oil puddle near parking bay 42 posing environmental and slip safety risk.",
                IssueCategory.CLEANING, Priority.MEDIUM, IssueStatus.CLOSED, "West Student Parking Structure, Bay 42",
                student3, staff3, admin, "Applied absorbent granules, scrubbed surface with bio-degreaser, and power-washed area safely.", null,
                LocalDateTime.now().minusDays(12));

        logger.info("CampusCare database seeded successfully with 1 admin, 3 staff, 5 students, and 18 complete issues with audit histories!");
    }

    private void createIssue(String code, String title, String description,
                             IssueCategory category, Priority priority, IssueStatus status, String location,
                             User student, User staff, User admin, String resolutionNotes, String imageUrl,
                             LocalDateTime reportedTime) {

        Issue issue = new Issue();
        issue.setIssueCode(code);
        issue.setTitle(title);
        issue.setDescription(description);
        issue.setCategory(category);
        issue.setPriority(priority);
        issue.setStatus(status);
        issue.setLocation(location);
        issue.setCreatedBy(student);
        issue.setAssignedStaff(staff);
        issue.setAssignedAdmin(admin);
        issue.setCreatedAt(reportedTime);
        issue.setUpdatedAt(reportedTime);
        issue.setResolutionNotes(resolutionNotes);
        issue.setImageUrl(imageUrl);

        if (status == IssueStatus.RESOLVED) {
            issue.setResolvedAt(reportedTime.plusHours(6));
            issue.setUpdatedAt(reportedTime.plusHours(6));
        } else if (status == IssueStatus.CLOSED) {
            issue.setResolvedAt(reportedTime.plusHours(6));
            issue.setClosedAt(reportedTime.plusHours(24));
            issue.setUpdatedAt(reportedTime.plusHours(24));
        }

        issue = issueRepository.save(issue);

        // 1. Initial reported history
        IssueHistory h1 = new IssueHistory(issue, student, null, IssueStatus.REPORTED, "Issue reported by student " + student.getName());
        h1.setChangedAt(reportedTime);
        issueHistoryRepository.save(h1);

        // 2. Assignment history if assigned or further
        if (staff != null && admin != null) {
            LocalDateTime assignTime = reportedTime.plusHours(1);
            Assignment assignment = new Assignment(issue, staff, admin, "Assigned based on domain expertise in " + staff.getDepartment());
            assignment.setAssignedAt(assignTime);
            assignmentRepository.save(assignment);

            IssueHistory h2 = new IssueHistory(issue, admin, IssueStatus.REPORTED, IssueStatus.ASSIGNED,
                    "Assigned to staff " + staff.getName() + " by Admin " + admin.getName());
            h2.setChangedAt(assignTime);
            issueHistoryRepository.save(h2);

            // 3. In Progress history
            if (status == IssueStatus.IN_PROGRESS || status == IssueStatus.RESOLVED || status == IssueStatus.CLOSED) {
                LocalDateTime startWorkTime = assignTime.plusHours(2);
                IssueHistory h3 = new IssueHistory(issue, staff, IssueStatus.ASSIGNED, IssueStatus.IN_PROGRESS,
                        "Staff member " + staff.getName() + " accepted assignment and initiated troubleshooting.");
                h3.setChangedAt(startWorkTime);
                issueHistoryRepository.save(h3);

                // Add a sample comment
                Comment comment1 = new Comment(issue, staff, "Inspecting the site now. Diagnostics in progress.");
                comment1.setCreatedAt(startWorkTime.plusMinutes(15));
                commentRepository.save(comment1);

                // 4. Resolved history
                if (status == IssueStatus.RESOLVED || status == IssueStatus.CLOSED) {
                    LocalDateTime resolvedTime = startWorkTime.plusHours(3);
                    IssueHistory h4 = new IssueHistory(issue, staff, IssueStatus.IN_PROGRESS, IssueStatus.RESOLVED,
                            "Work completed: " + (resolutionNotes != null ? resolutionNotes : "Issue resolved."));
                    h4.setChangedAt(resolvedTime);
                    issueHistoryRepository.save(h4);

                    Comment comment2 = new Comment(issue, staff, "Issue has been resolved. Please verify on your end.");
                    comment2.setCreatedAt(resolvedTime);
                    commentRepository.save(comment2);

                    // 5. Closed history
                    if (status == IssueStatus.CLOSED) {
                        LocalDateTime closedTime = resolvedTime.plusHours(18);
                        IssueHistory h5 = new IssueHistory(issue, student, IssueStatus.RESOLVED, IssueStatus.CLOSED,
                                "Verified resolution. Everything is working normally. Closing ticket.");
                        h5.setChangedAt(closedTime);
                        issueHistoryRepository.save(h5);

                        Comment comment3 = new Comment(issue, student, "Confirmed working. Thank you for the quick fix!");
                        comment3.setCreatedAt(closedTime);
                        commentRepository.save(comment3);
                    }
                }
            }
        }

        // Add a sample notification for student
        Notification notif = new Notification(student, issue, "Issue Update",
                "Your issue #" + issue.getIssueCode() + " status is currently " + status.name(),
                NotificationType.STATUS_CHANGED);
        notif.setCreatedAt(reportedTime.plusMinutes(30));
        notificationRepository.save(notif);
    }
}
