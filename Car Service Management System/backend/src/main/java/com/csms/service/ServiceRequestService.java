package com.csms.service;

import com.csms.entity.ServiceRequest;
import com.csms.entity.User;
import com.csms.repository.ServiceRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServiceRequestService {

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private CarService carService;

    public ServiceRequest createServiceRequest(ServiceRequest serviceRequest, Long userId, Long carId) {
        User user = userService.findById(userId);
        serviceRequest.setUser(user);

        if (carId != null) {
            serviceRequest.setCar(carService.findById(carId));
        }

        return serviceRequestRepository.save(serviceRequest);
    }

    public ServiceRequest updateServiceRequest(Long id, ServiceRequest serviceRequestDetails) {
        ServiceRequest serviceRequest = findById(id);
        
        serviceRequest.setServiceType(serviceRequestDetails.getServiceType());
        serviceRequest.setStatus(serviceRequestDetails.getStatus());
        serviceRequest.setDescription(serviceRequestDetails.getDescription());
        
        return serviceRequestRepository.save(serviceRequest);
    }

    public void deleteServiceRequest(Long id) {
        ServiceRequest serviceRequest = findById(id);
        serviceRequestRepository.delete(serviceRequest);
    }

    public ServiceRequest findById(Long id) {
        return serviceRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service request not found"));
    }

    public List<ServiceRequest> findByUserId(Long userId) {
        return serviceRequestRepository.findByUserId(userId);
    }

    public List<ServiceRequest> findByStatus(ServiceRequest.ServiceStatus status) {
        return serviceRequestRepository.findByStatus(status);
    }

    public List<ServiceRequest> findByStatusAndUserId(ServiceRequest.ServiceStatus status, Long userId) {
        return serviceRequestRepository.findByStatusAndUserId(status, userId);
    }

    public List<ServiceRequest> findAllServiceRequests() {
        return serviceRequestRepository.findAllByOrderByRequestDateDesc();
    }

    public ServiceRequest updateStatus(Long id, ServiceRequest.ServiceStatus status) {
        ServiceRequest serviceRequest = findById(id);
        serviceRequest.setStatus(status);
        return serviceRequestRepository.save(serviceRequest);
    }
}
