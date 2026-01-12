package com.example.cashbook.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface HashtagMapper {
	int insertHashtag(
		@Param("cashId") int cashId, 
		@Param("tag") String tag
	);
	
	int delelteByCashId(@Param("cashId") int cashId);
	
	List<String> selectTagsBCashId(@Param("cashId") int cashId);
}
