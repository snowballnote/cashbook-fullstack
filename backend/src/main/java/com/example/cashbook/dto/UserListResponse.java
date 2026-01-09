package com.example.cashbook.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class UserListResponse {
	private int id;
	private String username;
	private String role;
	private LocalDateTime createdAt;
}
