package com.example.cashbook.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.Data;

@Data
public class CashUpdateRequest {
	private LocalDate cashDate;
	private String kind;          // INCOME | EXPENSE 
	private BigDecimal money;
	private String memo;
	
	private String hashtags;
}
