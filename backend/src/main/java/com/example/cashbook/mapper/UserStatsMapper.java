package com.example.cashbook.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.cashbook.dto.DailyUserCount;


@Mapper
public interface UserStatsMapper {

    int countTotalUsers();

    int countTodayUsers();

    int countYesterdayUsers();

    int countThisMonthUsers();

    List<DailyUserCount> countLast7Days();
}
