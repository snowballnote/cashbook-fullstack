package com.example.cashbook.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
@RequestMapping("/users")
public class UserController {
	// 개인정보 보기, 수정(password), 탈퇴
	// 개인정보 보기
	@GetMapping("/me")
    public ResponseEntity<String> me(Authentication auth) {	
        // SpringSecurity 인증되었지만 토큰만료,변조 파싱실패 등으로 auth == null이 되면
        if (auth == null) {
	            return ResponseEntity
	                    .status(HttpStatus.UNAUTHORIZED) // 401
	                    .body("인증되지 않은 사용자입니다.");
	    }
	
	    String moreInfo = "내정보 조회 → " + auth.getName();
	
	    return ResponseEntity.ok(moreInfo);
	}
}
