package com.example.cashbook.controller;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.cashbook.dto.CashCalendarResponse;
import com.example.cashbook.dto.CashCreateRequest;
import com.example.cashbook.dto.CashDailyResponse;
import com.example.cashbook.dto.CashUpdateRequest;
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
	    @RequestParam("cashDate") LocalDate cashDate
	) {

	    return cashService.getDailyCash(userDetails.getId(), cashDate);
	}
	
	/**
	 * 수정
	 */
	@PatchMapping("/{cashId}")
	public ResponseEntity<Void> updateCash(
	    @PathVariable int cashId,
	    @RequestBody CashUpdateRequest request,
	    @AuthenticationPrincipal CustomUserDetails user
	) {
	    System.out.println("🔥 PATCH CONTROLLER HIT");
	    cashService.updateCash(cashId, user.getId(), request);
	    return ResponseEntity.noContent().build();
	}

	/**
	 * 삭제
	 */
	@DeleteMapping("/{cashId}")
	public ResponseEntity<Void> deleteCash(
	    @PathVariable int cashId,
	    @AuthenticationPrincipal CustomUserDetails user
	) {
	    System.out.println("🔥 DELETE CONTROLLER HIT");
	    cashService.deleteCash(cashId, user.getId());
	    return ResponseEntity.noContent().build();
	}

	@PostMapping("/add")
    public ResponseEntity<Void> addCash(
        @RequestBody CashCreateRequest request,
        @AuthenticationPrincipal CustomUserDetails user
    ) {
		System.out.println("🔥🔥🔥 ADD CASH CONTROLLER HIT");
	    System.out.println("USER ID = " + (user != null ? user.getId() : "NULL"));
	    System.out.println("REQUEST = " + request);
	    
		cashService.addCash(user.getId(), request);
        return ResponseEntity.ok().build();
    }
}
