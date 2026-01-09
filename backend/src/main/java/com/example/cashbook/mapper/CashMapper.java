package com.example.cashbook.mapper;

import java.time.LocalDate;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.cashbook.dto.CashCalendarResponse;
import com.example.cashbook.dto.CashDailyResponse;

@Mapper
public interface CashMapper {
	List<CashCalendarResponse> selectMonthlyCalendar(
        @Param("id") int id,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
	
	List<CashDailyResponse> selectDailyCash(
            @Param("id") int id,
            @Param("date") LocalDate date
    );
}