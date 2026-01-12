package com.example.cashbook.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import lombok.Data;

@Data
public class CashDailyResponse {
    private int cashId;
    private String kind;
    private BigDecimal money;
    private String memo;
    private LocalDate cashDate;
    
    private List<String> hashtags;
}
