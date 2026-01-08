package com.example.cashbook.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.cashbook.dto.AdminUserListResponse;
import com.example.cashbook.dto.PageResponse;
import com.example.cashbook.service.AdminUserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final AdminUserService adminUserService;

    /**
     * 관리자 회원 목록 조회 (페이징)
     */
    @GetMapping
    public ResponseEntity<PageResponse<AdminUserListResponse>> getUsers(
            @RequestParam(defaultValue = "0") int currentPage,
            @RequestParam(defaultValue = "5") int size
    ) {
        return ResponseEntity.ok(
                adminUserService.getUserList(currentPage, size)
        );
    }
}