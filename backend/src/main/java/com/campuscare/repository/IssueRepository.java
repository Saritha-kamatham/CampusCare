package com.campuscare.repository;

import com.campuscare.entity.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> {

    Optional<Issue> findByIssueCode(String issueCode);

    long countByStatus(IssueStatus status);

    long countByPriority(Priority priority);

    long countByCategory(IssueCategory category);

    long countByCreatedById(Long studentId);

    long countByCreatedByIdAndStatus(Long studentId, IssueStatus status);

    long countByAssignedStaffId(Long staffId);

    long countByAssignedStaffIdAndStatus(Long staffId, IssueStatus status);

    @Query("SELECT i FROM Issue i LEFT JOIN i.assignedStaff staff LEFT JOIN i.createdBy student WHERE " +
           "(:studentId IS NULL OR student.id = :studentId) AND " +
           "(:staffId IS NULL OR (staff IS NOT NULL AND staff.id = :staffId)) AND " +
           "(:category IS NULL OR i.category = :category) AND " +
           "(:priority IS NULL OR i.priority = :priority) AND " +
           "(:status IS NULL OR i.status = :status) AND " +
           "(:search IS NULL OR LOWER(i.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(i.description) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(i.location) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(i.issueCode) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Issue> findWithFilters(
            @Param("studentId") Long studentId,
            @Param("staffId") Long staffId,
            @Param("category") IssueCategory category,
            @Param("priority") Priority priority,
            @Param("status") IssueStatus status,
            @Param("search") String search,
            Pageable pageable
    );

    @Query("SELECT i.category, COUNT(i) FROM Issue i GROUP BY i.category")
    List<Object[]> countGroupByCategory();

    @Query("SELECT i.priority, COUNT(i) FROM Issue i GROUP BY i.priority")
    List<Object[]> countGroupByPriority();

    @Query("SELECT i.status, COUNT(i) FROM Issue i GROUP BY i.status")
    List<Object[]> countGroupByStatus();

    @Query("SELECT i.assignedStaff.id, i.assignedStaff.name, COUNT(i) " +
           "FROM Issue i WHERE i.assignedStaff IS NOT NULL " +
           "GROUP BY i.assignedStaff.id, i.assignedStaff.name")
    List<Object[]> countStaffWorkload();

    List<Issue> findTop15ByOrderByCreatedAtDesc();

    List<Issue> findTop5ByOrderByCreatedAtDesc();

    List<Issue> findTop10ByStatusAndAssignedStaffIsNullOrderByCreatedAtDesc(IssueStatus status);

    List<Issue> findTop5ByCreatedByIdOrderByCreatedAtDesc(Long studentId);

    List<Issue> findTop5ByAssignedStaffIdOrderByCreatedAtDesc(Long staffId);

    long countByCreatedAtAfter(LocalDateTime date);
}
