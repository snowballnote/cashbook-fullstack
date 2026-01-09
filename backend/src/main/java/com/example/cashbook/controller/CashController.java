package com.example.cashbook.controller;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.cashbook.dto.CashCalendarResponse;
import com.example.cashbook.dto.CashDailyResponse;
import com.example.cashbook.dto.CustomUserDetails;
import com.example.cashbook.service.CashService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/cash")
@RequiredArgsConstructor
public class CashController {
	private final CashService cashService;
	/**
	 * 가계부 캘린더(월별 집계)
	 * - 월 단위로 날짜별 수입/지출 합계를 조회한다.
	 */
	@GetMapping("/calendar")
	public ResponseEntity<List<CashCalendarResponse>> getMonthlyCalendar(
	        Authentication authentication,
	        @RequestParam(required = false) String month
	) {
		if (month == null || month.isBlank()) {
		    month = YearMonth.now().toString(); // 2026-01
		}
		
	    if (authentication == null) {
	        return ResponseEntity.status(401).build();
	    }

	    Object principal = authentication.getPrincipal();
	    System.out.println("principal class = " + principal.getClass());

	    if (!(principal instanceof CustomUserDetails userDetails)) {
	        throw new IllegalStateException(
	            "Principal is not CustomUserDetails: " + principal
	        );
	    }

	    int id = userDetails.getId();

	    List<CashCalendarResponse> result =
	            cashService.getMonthlyCalendar(id, month);

	    return ResponseEntity.ok(result);
	}
	
	/**
     * 가계부 일별 상세 내역 조회
     */
	@GetMapping("/daily")
    public List<CashDailyResponse> getDailyCash(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam("date") LocalDate date
    ) {
		System.out.println("🔥 DAILY CASH CONTROLLER HIT");
        int id = userDetails.getId();
        return cashService.getDailyCash(id, date);
    }
	
//	@PostMapping("/addCash") // /api/addCash
//	public ResponseEntity<String> addCash() {
//		return ResponseEntity.ok("");
//	}
	
}
