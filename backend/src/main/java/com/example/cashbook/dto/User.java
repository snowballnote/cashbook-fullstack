package com.example.cashbook.dto;

import lombok.Data;

@Data
public class User { // 도메인 entity
    private Long id;
    private String username;
    private String password;
    private String role;
}