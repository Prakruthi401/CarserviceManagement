package com.csms.repository;

import com.csms.entity.ServiceRequest;
import com.csms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {
    List<ServiceRequest> findByUser(User user);
    List<ServiceRequest> findByUserId(Long userId);
    List<ServiceRequest> findByStatus(ServiceRequest.ServiceStatus status);
    
    @Query("SELECT sr FROM ServiceRequest sr WHERE " +
           "(:status IS NULL OR sr.status = :status) AND " +
           "(:userId IS NULL OR sr.user.id = :userId)")
    List<ServiceRequest> findByStatusAndUserId(@Param("status") ServiceRequest.ServiceStatus status,
                                              @Param("userId") Long userId);
    
    List<ServiceRequest> findAllByOrderByRequestDateDesc();
}
