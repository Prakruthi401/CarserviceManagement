package com.csms.controller;

import com.csms.entity.ServiceRequest;
import com.csms.service.ServiceRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/service-requests")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ServiceRequestController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @PostMapping
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<?> createServiceRequest(@RequestBody ServiceRequest serviceRequest, 
                                                 @RequestParam Long userId, 
                                                 @RequestParam(required = false) Long carId) {
        try {
            ServiceRequest newRequest = serviceRequestService.createServiceRequest(serviceRequest, userId, carId);
            Map<String, Object> response = com.csms.util.Dto.map(
                "message", "Service request created successfully",
                "serviceRequest", com.csms.util.Dto.map(
                    "id", newRequest.getId(),
                    "serviceType", newRequest.getServiceType(),
                    "description", newRequest.getDescription(),
                    "status", newRequest.getStatus(),
                    "requestDate", newRequest.getRequestDate(),
                    "userId", newRequest.getUser().getId(),
                    "userName", newRequest.getUser().getName(),
                    "carId", newRequest.getCar() != null ? newRequest.getCar().getId() : null,
                    "carNumber", newRequest.getCar() != null ? newRequest.getCar().getCarNumber() : null
                )
            );
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(com.csms.util.Dto.map("error", e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.id")
    public ResponseEntity<List<Map<String, Object>>> getServiceRequestsByUserId(@PathVariable Long userId) {
        List<ServiceRequest> requests = serviceRequestService.findByUserId(userId);
        return ResponseEntity.ok(convertToDTOList(requests));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getServiceRequestsByStatus(@PathVariable ServiceRequest.ServiceStatus status) {
        List<ServiceRequest> requests = serviceRequestService.findByStatus(status);
        return ResponseEntity.ok(convertToDTOList(requests));
    }

    @GetMapping("/filter")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> filterServiceRequests(
            @RequestParam(required = false) ServiceRequest.ServiceStatus status,
            @RequestParam(required = false) Long userId) {
        List<ServiceRequest> requests = serviceRequestService.findByStatusAndUserId(status, userId);
        return ResponseEntity.ok(convertToDTOList(requests));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> getServiceRequestById(@PathVariable Long id) {
        ServiceRequest request = serviceRequestService.findById(id);
        return ResponseEntity.ok(convertToDTO(request));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getAllServiceRequests() {
        List<ServiceRequest> requests = serviceRequestService.findAllServiceRequests();
        return ResponseEntity.ok(convertToDTOList(requests));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<?> updateServiceRequest(@PathVariable Long id, @RequestBody ServiceRequest serviceRequestDetails) {
        try {
            ServiceRequest updatedRequest = serviceRequestService.updateServiceRequest(id, serviceRequestDetails);
            Map<String, Object> response = com.csms.util.Dto.map(
                "message", "Service request updated successfully",
                "serviceRequest", convertToDTO(updatedRequest)
            );
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(com.csms.util.Dto.map("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateServiceRequestStatus(@PathVariable Long id, 
                                                       @RequestParam ServiceRequest.ServiceStatus status) {
        try {
            ServiceRequest updatedRequest = serviceRequestService.updateStatus(id, status);
            Map<String, Object> response = com.csms.util.Dto.map(
                "message", "Service request status updated successfully",
                "serviceRequest", convertToDTO(updatedRequest)
            );
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(com.csms.util.Dto.map("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteServiceRequest(@PathVariable Long id) {
        try {
            serviceRequestService.deleteServiceRequest(id);
            return ResponseEntity.ok(com.csms.util.Dto.map("message", "Service request deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(com.csms.util.Dto.map("error", e.getMessage()));
        }
    }

    private Map<String, Object> convertToDTO(ServiceRequest request) {
        return com.csms.util.Dto.map(
            "id", request.getId(),
            "serviceType", request.getServiceType(),
            "description", request.getDescription(),
            "status", request.getStatus(),
            "requestDate", request.getRequestDate(),
            "updatedDate", request.getUpdatedDate(),
            "userId", request.getUser().getId(),
            "userName", request.getUser().getName(),
            "userEmail", request.getUser().getEmail(),
            "carId", request.getCar() != null ? request.getCar().getId() : null,
            "carNumber", request.getCar() != null ? request.getCar().getCarNumber() : null,
            "carBrand", request.getCar() != null ? request.getCar().getCarBrand() : null,
            "carModel", request.getCar() != null ? request.getCar().getCarModel() : null
        );
    }

    private List<Map<String, Object>> convertToDTOList(List<ServiceRequest> requests) {
        return requests.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
}
