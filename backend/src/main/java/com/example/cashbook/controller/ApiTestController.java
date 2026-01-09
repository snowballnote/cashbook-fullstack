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
@RequestMapping("/api")
public class ApiTestController {
    /**
     * 로그인한 사용자의 내 정보 조회 API
     * GET /api/me
     */
    @GetMapping("/me") // /api/me
    public ResponseEntity<String> me(Authentication auth) {
    		// SpringSecurity 인증되지 않으면 403
        System.out.println("/api/me");
	    	
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