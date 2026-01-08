package com.example.cashbook.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class AdminUserListResponse {
	private Long id;
	private String username;
	private String role;
	private LocalDateTime createdAt;
}
