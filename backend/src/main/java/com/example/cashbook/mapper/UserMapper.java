package com.example.cashbook.mapper;

import org.apache.ibatis.annotations.Mapper;
import com.example.cashbook.dto.User;

@Mapper
public interface UserMapper {

    User findByUsername(String username);

    void insertUser(User user);
    
    void updatePasswordByUsername(User user);
}