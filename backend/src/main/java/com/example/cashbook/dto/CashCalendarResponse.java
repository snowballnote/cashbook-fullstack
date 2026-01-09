package com.example.cashbook.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.Data;

@Data
public class CashCalendarResponse {
	 // 날짜 (캘린더의 하루)
    private LocalDate cashDate;

    // 해당 날짜 총 수입
    private BigDecimal incomeTotal;

    // 해당 날짜 총 지출
    private BigDecimal expenseTotal;
}
