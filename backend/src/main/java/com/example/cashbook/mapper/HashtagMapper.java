package com.example.cashbook.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.cashbook.dto.HashtagRankResponse;

@Mapper
public interface HashtagMapper {
	int insertHashtag(
		@Param("cashId") int cashId, 
		@Param("tag") String tag
	);
	
	int deleteByCashId(@Param("cashId") int cashId);
	
	List<String> selectTagsBCashId(@Param("cashId") int cashId);
	
	// 전체 해시태그 랭킹
    List<HashtagRankResponse> selectAllHashtagRank();

 // 내 해시태그 랭킹
    List<HashtagRankResponse> selectMyHashtagRank(
        @Param("id") int id
    );
}
