package com.example.cashbook.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.cashbook.dto.User;

@Mapper
public interface UserMapper {

    User findByUsername(@Param("username") String username);

    void insertUser(User user);
    
    void updatePasswordByUsername(User user);
    
    void deleteById(@Param("id") int id);
}