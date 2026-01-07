package com.example.cashbook.dto;

import lombok.Data;

@Data
public class AuthRequest { // 로그인 요청 DTO
    private String username;
    private String password;
}