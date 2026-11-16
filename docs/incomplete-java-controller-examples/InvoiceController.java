package com.csms.controller;

import com.csms.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "*", maxAge = 3600)
public class InvoiceController {

    @Autowired
    private InvoiceService invoiceService;

    @PostMapping("/generate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> generateInvoice(@RequestBody Map<String, Object> invoiceData) {
        try {
            Long serviceRequestId = (Long) invoiceData.get("serviceRequestId");
            Map<String, Object> invoice = invoiceService.generateInvoice(serviceRequestId, invoiceData);
            return ResponseEntity.ok(Map.of("invoice", invoice, "message", "Invoice generated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to generate invoice"));
        }
    }

    @GetMapping("/service-request/{serviceRequestId}")
    @PreAuthorize("hasRole('ADMIN') or @invoiceService.isOwner(#serviceRequestId, authentication.name)")
    public ResponseEntity<Map<String, Object>> getInvoiceByServiceRequest(@PathVariable Long serviceRequestId) {
        try {
            Map<String, Object> invoice = invoiceService.getInvoiceByServiceRequest(serviceRequestId);
            return ResponseEntity.ok(invoice);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invoice not found"));
        }
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.id")
    public ResponseEntity<List<Map<String, Object>>> getUserInvoices(@PathVariable Long userId) {
        return ResponseEntity.ok(invoiceService.getUserInvoices(userId));
    }

    @PutMapping("/{invoiceId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateInvoiceStatus(@PathVariable Long invoiceId, @RequestParam String status) {
        try {
            invoiceService.updateInvoiceStatus(invoiceId, status);
            return ResponseEntity.ok(Map.of("message", "Invoice status updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to update invoice status"));
        }
    }

    @PostMapping("/{invoiceId}/payment")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<?> processPayment(@PathVariable Long invoiceId, @RequestBody Map<String, Object> paymentData) {
        try {
            Map<String, Object> paymentResult = invoiceService.processPayment(invoiceId, paymentData);
            return ResponseEntity.ok(Map.of("payment", paymentResult, "message", "Payment processed successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to process payment"));
        }
    }

    @GetMapping("/{invoiceId}/download")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<byte[]> downloadInvoice(@PathVariable Long invoiceId) {
        try {
            byte[] pdfData = invoiceService.generateInvoicePDF(invoiceId);
            return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=invoice_" + invoiceId + ".pdf")
                .header("Content-Type", "application/pdf")
                .body(pdfData);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getPendingInvoices() {
        return ResponseEntity.ok(invoiceService.getPendingInvoices());
    }

    @GetMapping("/overdue")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getOverdueInvoices() {
        return ResponseEntity.ok(invoiceService.getOverdueInvoices());
    }
}
