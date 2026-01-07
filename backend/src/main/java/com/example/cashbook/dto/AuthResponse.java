package com.example.cashbook.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse { // 로그인 응답 DTO
    private String token;
    private String username;
    private String role;
}