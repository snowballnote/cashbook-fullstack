package com.example.cashbook.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DailyUserCount {
    private LocalDate date; // yyyy-MM-dd
    private int count;
}