package com.example.cashbook.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.cashbook.dto.AdminUserListResponse;

@Mapper
public interface AdminUserMapper {

    // 회원 목록 (페이징)
    List<AdminUserListResponse> selectUserList(
        @Param("offset") int offset,
        @Param("limit") int limit
    );

    // 전체 회원 수
    long countUsers();
}