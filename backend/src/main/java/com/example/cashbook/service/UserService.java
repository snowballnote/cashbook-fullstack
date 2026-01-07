package com.example.cashbook.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.cashbook.dto.User;
import com.example.cashbook.mapper.UserMapper;

@Service
@Transactional
public class UserService { // 회원가입
	private final UserMapper userMapper;
	public UserService(UserMapper userMapper) {
		this.userMapper = userMapper;
	}
	
	// 아이디(username) 중복확인
	public User findByUsername(String username) {
		return userMapper.findByUsername(username);
	}
	
	public void insertUser(User user) {
		userMapper.insertUser(user);
	}
}