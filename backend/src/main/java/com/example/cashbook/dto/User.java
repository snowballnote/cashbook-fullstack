package com.example.cashbook.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class User { // 도메인 entity
    private int id;
    private String username;
    private String password;
    private String role;
    private LocalDateTime createdAt;
}