package com.example.cashbook.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CashDailyResponse {
    private int cashId;
    private int id;
    private String kind;
    private BigDecimal money;
    private String memo;
    private LocalDate cashDate;
}
