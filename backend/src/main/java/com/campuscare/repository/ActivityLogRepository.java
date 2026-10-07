package com.campuscare.repository;

import com.campuscare.entity.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {

    List<ActivityLog> findByIssueIdOrderByChangedAtAsc(Long issueId);

    List<ActivityLog> findByIssueIdOrderByChangedAtDesc(Long issueId);
}
