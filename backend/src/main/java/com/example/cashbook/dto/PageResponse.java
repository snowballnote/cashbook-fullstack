package com.example.cashbook.dto;

import java.util.List;

import lombok.Data;

@Data
public class PageResponse<T> {
	// 실제 데이터
    private List<T> content;

    // 페이징 정보
    private int currentPage;     // 0-based
    private int pageSize;        // 페이지당 개수
    private int totalPages;      // 전체 페이지 수
    private long totalElements;  // 전체 데이터 수
	
}
