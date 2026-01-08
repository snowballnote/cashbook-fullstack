package com.example.cashbook.dto;

import java.util.List;

import lombok.Data;

@Data
public class UsersSummaryResponse {
	 private int totalUsers;
	 private int todayUsers;
	 private int yesterdayUsers;
	 private int thisMonthUsers;

	 private List<DailyUserCount> last7Days;
}
