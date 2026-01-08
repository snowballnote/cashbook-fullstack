package com.example.cashbook.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.cashbook.dto.AdminUserListResponse;
import com.example.cashbook.dto.PageResponse;
import com.example.cashbook.mapper.AdminUserMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final AdminUserMapper adminUserMapper;

    /**
     * 관리자 회원 목록 조회 (페이징)
     */
    public PageResponse<AdminUserListResponse> getUserList(int currentPage, int pageSize) {

        // offset 계산 (0-based)
        int offset = currentPage * pageSize;

        // 데이터 조회
        List<AdminUserListResponse> users =
                adminUserMapper.selectUserList(offset, pageSize);

        // 전체 개수
        long totalElements = adminUserMapper.countUsers();

        // 전체 페이지 수
        int totalPages = (int) Math.ceil((double) totalElements / pageSize);

        // PageResponse 구성
        PageResponse<AdminUserListResponse> response = new PageResponse<>();
        response.setContent(users);
        response.setCurrentPage(currentPage);
        response.setPageSize(pageSize);
        response.setTotalElements(totalElements);
        response.setTotalPages(totalPages);

        return response;
    }
}