package com.example.cashbook.service;

import org.springframework.security.crypto.password.PasswordEncoder;
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
	
	public void changePassword(String username,
	            String currentPassword,
	            String newPassword,
	            PasswordEncoder passwordEncoder) {
	
		User user = userMapper.findByUsername(username);
		
		if (user == null) {
		throw new IllegalArgumentException("사용자를 찾을 수 없습니다.");
		}
		
		// 기존 비밀번호 검증
		if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
			throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
		}
		
		// 새 비밀번호 암호화
		user.setPassword(passwordEncoder.encode(newPassword));
		
		// DB 업데이트
		userMapper.updatePasswordByUsername(user);
	}
	
	public void deleteUser(int id) {
        userMapper.deleteById(id);
    }
}