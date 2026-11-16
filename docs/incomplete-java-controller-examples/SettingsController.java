package com.csms.controller;

import com.csms.service.SettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "*", maxAge = 3600)
public class SettingsController {

    @Autowired
    private SettingsService settingsService;

    @GetMapping("/general")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getGeneralSettings() {
        return ResponseEntity.ok(settingsService.getGeneralSettings());
    }

    @PutMapping("/general")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateGeneralSettings(@RequestBody Map<String, Object> settings) {
        try {
            settingsService.updateGeneralSettings(settings);
            return ResponseEntity.ok(Map.of("message", "Settings updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to update settings"));
        }
    }

    @GetMapping("/service-types")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> getServiceTypes() {
        return ResponseEntity.ok(settingsService.getServiceTypes());
    }

    @PostMapping("/service-types")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addServiceType(@RequestBody Map<String, Object> serviceType) {
        try {
            settingsService.addServiceType(serviceType);
            return ResponseEntity.ok(Map.of("message", "Service type added successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to add service type"));
        }
    }

    @PutMapping("/service-types/{typeId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateServiceType(@PathVariable Long typeId, @RequestBody Map<String, Object> serviceType) {
        try {
            settingsService.updateServiceType(typeId, serviceType);
            return ResponseEntity.ok(Map.of("message", "Service type updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to update service type"));
        }
    }

    @DeleteMapping("/service-types/{typeId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteServiceType(@PathVariable Long typeId) {
        try {
            settingsService.deleteServiceType(typeId);
            return ResponseEntity.ok(Map.of("message", "Service type deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to delete service type"));
        }
    }

    @GetMapping("/pricing")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> getPricingSettings() {
        return ResponseEntity.ok(settingsService.getPricingSettings());
    }

    @PutMapping("/pricing")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updatePricingSettings(@RequestBody Map<String, Object> pricing) {
        try {
            settingsService.updatePricingSettings(pricing);
            return ResponseEntity.ok(Map.of("message", "Pricing settings updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to update pricing settings"));
        }
    }

    @GetMapping("/notifications")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> getNotificationSettings(@RequestParam Long userId) {
        return ResponseEntity.ok(settingsService.getNotificationSettings(userId));
    }

    @PutMapping("/notifications")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<?> updateNotificationSettings(@RequestParam Long userId, @RequestBody Map<String, Object> settings) {
        try {
            settingsService.updateNotificationSettings(userId, settings);
            return ResponseEntity.ok(Map.of("message", "Notification settings updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to update notification settings"));
        }
    }

    @GetMapping("/backup")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getBackupSettings() {
        return ResponseEntity.ok(settingsService.getBackupSettings());
    }

    @PostMapping("/backup/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createBackup() {
        try {
            Map<String, Object> backup = settingsService.createBackup();
            return ResponseEntity.ok(Map.of("backup", backup, "message", "Backup created successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to create backup"));
        }
    }

    @PostMapping("/backup/restore")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> restoreBackup(@RequestBody Map<String, Object> backupData) {
        try {
            settingsService.restoreBackup(backupData);
            return ResponseEntity.ok(Map.of("message", "Backup restored successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to restore backup"));
        }
    }
}
