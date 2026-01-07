package com.example.cashbook.dto;

import lombok.Data;

@Data
public class SignupRequest { // 회원가입 요청 DTO
    private String username;
    private String password;
    private String role;
}