package com.tracker.dto;

import java.time.LocalDate;

public record CreateApplicationRequest(String company, String role, String location, String packageAmount, LocalDate appliedDate) {}