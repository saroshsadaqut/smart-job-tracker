package com.tracker.dto;

import java.time.LocalDate;

public record JobApplicationDTO(Long id, String company, String role, String location, String packageAmount, LocalDate appliedDate, String status) {}