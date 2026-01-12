package com.example.cashbook.service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.cashbook.dto.CashCalendarResponse;
import com.example.cashbook.dto.CashCreateRequest;
import com.example.cashbook.dto.CashDailyResponse;
import com.example.cashbook.dto.CashUpdateRequest;
import com.example.cashbook.mapper.CashMapper;
import com.example.cashbook.mapper.HashtagMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CashService {

    private final CashMapper cashMapper;
    private final HashtagMapper hashtagMapper;

    /**
     * 가계부 캘린더 (월별 집계)
     * - 프론트에서 받은 month(YYYY-MM)를 기준으로
     * - 해당 월의 시작일 / 종료일을 계산
     * - 날짜별 수입/지출 "합계만" 조회
     */
    public List<CashCalendarResponse> getMonthlyCalendar(int id, String month) {

        // month 문자열을 YearMonth로 변환
        // 예: "2026-01" → 2026년 1월
        YearMonth yearMonth = YearMonth.parse(month);

        // 해당 월의 시작일 계산 (항상 1일)
        LocalDate startDate = yearMonth.atDay(1);

        // 해당 월의 마지막 날 계산 (28~31 자동 처리)
        LocalDate endDate = yearMonth.atEndOfMonth();

        // Mapper 호출 → 날짜별 수입/지출 합계 조회
        return cashMapper.selectMonthlyCalendar( 
            id,
            startDate,
            endDate
        );
    }
    
    public List<CashDailyResponse> getDailyCash(int id, LocalDate cashDate) {
    	List<CashDailyResponse> list =
    	        cashMapper.selectDailyCash(id, cashDate);

    	    for (CashDailyResponse item : list) {
    	        List<String> tags =
    	            hashtagMapper.selectTagsBCashId(item.getCashId());
    	        item.setHashtags(tags);
    	    }

    	    return list;
    }
    
    public void updateCash(int cashId, int id, CashUpdateRequest req) {

        System.out.println("🔥 UPDATE TRY");
        System.out.println("cashId = " + cashId);
        System.out.println("id = " + id);
        System.out.println("cashDate = " + req.getCashDate());

        int updated = cashMapper.updateCash(
            cashId,
            id,
            req.getCashDate(),
            req.getKind(),
            req.getMoney(),
            req.getMemo()
        );

        System.out.println("🔥 UPDATE RESULT = " + updated);

        if (updated == 0) {
            throw new IllegalArgumentException("수정할 가계부 내역이 없습니다.");
        }
        
        // 해시태그 처리
        // 기존 해시태그 전부 삭제
        hashtagMapper.delelteByCashId(cashId);
        
        // 새 해시태그 파싱
        List<String> tags = parseHashtags(req.getHashtags());
        
        // 재삽입
        for(String tag : tags) {
        	hashtagMapper.insertHashtag(cashId, tag);
        }
        
    }
    
    public void deleteCash(int cashId, int id) {

    	int deleted = cashMapper.deleteCash(cashId, id);

    	if (deleted == 0) {
    		throw new IllegalArgumentException("삭제할 가계부 내역이 없습니다.");
    	}
    }
    
    public void addCash(int id, CashCreateRequest req) {
        System.out.println("🔥 SERVICE addCash HIT");
        System.out.println("userId = " + id);
        System.out.println("request = " + req);

        int result = cashMapper.insertCash(
            id,
            req.getCashDate(),
            req.getKind(),
            req.getMoney(),
            req.getMemo()
        );

        System.out.println("🔥 INSERT RESULT = " + result);

        if (result != 1) {
            throw new IllegalStateException("❌ cash insert 실패");
        }
    }

    private List<String>  parseHashtags(String raw) {
        if (raw == null || raw.isBlank()) {
            return List.of();
        }

        return Arrays.stream(raw.split("[,\\s]+"))
            .map(tag -> tag.replace("#", "").trim())
            .filter(tag -> !tag.isBlank())
            .distinct()
            .toList();
    }

}