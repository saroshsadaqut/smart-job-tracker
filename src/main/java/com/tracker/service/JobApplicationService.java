package com.tracker.service;

import com.tracker.dto.CreateApplicationRequest;
import com.tracker.dto.JobApplicationDTO;
import com.tracker.entity.ApplicationStatus;
import com.tracker.entity.JobApplication;
import com.tracker.entity.User;
import com.tracker.repository.JobApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobApplicationService {
    private final JobApplicationRepository repository;

    public List<JobApplicationDTO> getAllApplicationsForUser(Long userId) {
        return repository.findAllByUserId(userId).stream()
                .map(app -> new JobApplicationDTO(app.getId(), app.getCompany(), app.getRole(), app.getLocation(), app.getPackageAmount(), app.getAppliedDate(), app.getStatus().name()))
                .collect(Collectors.toList());
    }

    public void addApplication(CreateApplicationRequest request, User user) {
        JobApplication app = new JobApplication();
        app.setCompany(request.company());
        app.setRole(request.role());
        app.setLocation(request.location());
        app.setPackageAmount(request.packageAmount());
        app.setAppliedDate(request.appliedDate());
        app.setStatus(ApplicationStatus.APPLIED);
        app.setUser(user);
        repository.save(app);
    }

    public void updateStatus(Long id, ApplicationStatus status) {
        JobApplication app = repository.findById(id).orElseThrow();
        app.setStatus(status);
        repository.save(app);
    }

    public void deleteApplication(Long id) {
        repository.deleteById(id);
    }
}