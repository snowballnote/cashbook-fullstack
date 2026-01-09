package com.example.cashbook.service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.cashbook.dto.CashCalendarResponse;
import com.example.cashbook.dto.CashDailyResponse;
import com.example.cashbook.mapper.CashMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CashService {

    private final CashMapper cashMapper;

    /**
     * 가계부 캘린더 (월별 집계)
     * - 프론트에서 받은 month(YYYY-MM)를 기준으로
     * - 해당 월의 시작일 / 종료일을 계산
     * - 날짜별 수입/지출 "합계만" 조회
     */
    public List<CashCalendarResponse> getMonthlyCalendar(int id, String month) {

        // month 문자열을 YearMonth로 변환
        // 예: "2026-01" → 2026년 1월
        YearMonth yearMonth = YearMonth.parse(month);

        // 해당 월의 시작일 계산 (항상 1일)
        LocalDate startDate = yearMonth.atDay(1);

        // 해당 월의 마지막 날 계산 (28~31 자동 처리)
        LocalDate endDate = yearMonth.atEndOfMonth();

        // Mapper 호출 → 날짜별 수입/지출 합계 조회
        return cashMapper.selectMonthlyCalendar(
            id,
            startDate,
            endDate
        );
    }
    
    public List<CashDailyResponse> getDailyCash(int id, LocalDate date) {
        return cashMapper.selectDailyCash(id, date);
    }
}