package com.example.cashbook.dto;

import lombok.Data;

@Data
public class UserPasswordChangeRequest {
	private String currentPassword; // 기존 비밀번호
	private String newPassword; // 변경할 비밀번호
}
