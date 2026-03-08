package com.tracker.controller;

import com.tracker.dto.CreateApplicationRequest;
import com.tracker.dto.JobApplicationDTO;
import com.tracker.entity.ApplicationStatus;
import com.tracker.security.CustomUserDetails;
import com.tracker.service.JobApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationApiController {
    private final JobApplicationService service;

    @GetMapping
    public ResponseEntity<List<JobApplicationDTO>> getApplications(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(service.getAllApplicationsForUser(userDetails.getUser().getId()));
    }

    @PostMapping
    public ResponseEntity<Void> addApplication(@RequestBody CreateApplicationRequest request, @AuthenticationPrincipal CustomUserDetails userDetails) {
        service.addApplication(request, userDetails.getUser());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> updateStatus(@PathVariable Long id, @RequestParam ApplicationStatus status) {
        service.updateStatus(id, status);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable Long id) {
        service.deleteApplication(id);
        return ResponseEntity.noContent().build();
    }
}