package com.example.cashbook.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.cashbook.dto.DailyUserCount;
import com.example.cashbook.dto.UsersSummaryResponse;
import com.example.cashbook.mapper.UserStatsMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserStatsService {
	private final UserStatsMapper mapper;
	
	public UsersSummaryResponse getUsersSummary() {
		UsersSummaryResponse res = new UsersSummaryResponse();
		
		res.setTotalUsers(mapper.countTotalUsers());
        res.setTodayUsers(mapper.countTodayUsers());
        res.setYesterdayUsers(mapper.countYesterdayUsers());
        res.setThisMonthUsers(mapper.countThisMonthUsers());
        res.setLast7Days(mapper.countLast7Days());
        
        return res;
	}
	
	public List<DailyUserCount> fillLast7Days(List<DailyUserCount> dbResult) {

	    Map<LocalDate, Integer> countMap = new HashMap<>();
	    for (DailyUserCount d : dbResult) {
	        countMap.put(d.getDate(), d.getCount());
	    }

	    List<DailyUserCount> result = new ArrayList<>();

	    for (int i = 6; i >= 0; i--) {
	        LocalDate date = LocalDate.now().minusDays(i);
	        int count = countMap.getOrDefault(date, 0);
	        result.add(new DailyUserCount(date, count));
	    }

	    return result;
	}

}
