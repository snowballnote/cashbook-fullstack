package com.example.cashbook.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.cashbook.dto.UsersSummaryResponse;
import com.example.cashbook.service.UserStatsService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/charts")
@RequiredArgsConstructor
public class ChartController {
	private final UserStatsService userStatsService;
	
	// 회원 통계 요약(ADMIN)
	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping("/users/summary")
	public ResponseEntity<UsersSummaryResponse> usersSummary() {
		return ResponseEntity.ok(userStatsService.getUsersSummary());
	}
}
