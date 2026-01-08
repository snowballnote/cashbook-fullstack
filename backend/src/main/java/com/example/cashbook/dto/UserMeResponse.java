package com.example.cashbook.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserMeResponse {
	private Long id; // 사용자 PK
	private String username; // 아이디
	private String role; // USER / ADMIN
	private LocalDateTime createdAt; // 가입일
}
