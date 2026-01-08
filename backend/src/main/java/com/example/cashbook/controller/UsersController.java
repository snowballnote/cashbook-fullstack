package com.example.cashbook.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.cashbook.dto.CustomUserDetails;
import com.example.cashbook.dto.User;
import com.example.cashbook.dto.UserMeResponse;
import com.example.cashbook.dto.UserPasswordChangeRequest;
import com.example.cashbook.service.UserService;

@CrossOrigin
@RestController
@RequestMapping("/api/users")
public class UsersController {
	private final UserService userService;
	private final PasswordEncoder passwordEncoder;
	public UsersController(UserService userService, 
							PasswordEncoder passwordEncoder) {
		this.userService = userService;
		this.passwordEncoder = passwordEncoder;
	}
	
	/**
	 * 로그인 사용자 본인 정보 조회
	 */
	@GetMapping("/me")
    public ResponseEntity<UserMeResponse> me(Authentication auth) {	
        // 토큰 만료 / 위변조 등
        if (auth == null) {
	            return ResponseEntity
	                    .status(HttpStatus.UNAUTHORIZED) // 401
	                    .build();
	    }
        String username = auth.getName();
        User user = userService.findByUsername(username);
        
        // 토큰은 유효하지만 DB에 사용자가 없는 경우 (이상 케이스)
        if (user == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND) // 404
                    .build();
        }
        // 응답 전용 DTO로 변환 (비밀번호 등 민감 정보 제외)
        UserMeResponse response = new UserMeResponse(
                user.getId(),
                user.getUsername(),
                user.getRole(),
                user.getCreatedAt()
        );
        
	    return ResponseEntity.ok(response);
	}
	
	/**
	 * 로그인 사용자 본인의 비밀번호 변경
	 * - 기존 비밀번호 검증 후 변경
	 */
	@PatchMapping("/me/password")
	public ResponseEntity<String> changePassword(
	        Authentication auth,
	        @RequestBody UserPasswordChangeRequest request) {

	    // JWT 인증 실패 (토큰 없음, 만료, 위변조)
	    // SecurityContext에 인증 정보가 없으면 auth == null
	    if (auth == null) {
	    	return ResponseEntity
	                .status(HttpStatus.UNAUTHORIZED)
	                .body("인증되지 않은 사용자입니다.");
	    }

	    // JWT subject에 저장된 로그인 사용자 username
	    String username = auth.getName();

	    try {
	        // 서비스 계층에서 비밀번호 변경 처리
	        // - 기존 비밀번호 검증
	        // - 새 비밀번호 암호화
	        // - DB 업데이트
	        userService.changePassword(
	                username,
	                request.getCurrentPassword(),
	                request.getNewPassword(),
	                passwordEncoder
	        );

	        // 성공
	        return ResponseEntity.ok("비밀번호 변경 성공");

	    } catch (IllegalArgumentException e) {
	        // 기존 비밀번호 불일치 등 유효성 실패
	    	return ResponseEntity
	                .status(HttpStatus.BAD_REQUEST)
	                .body("현재 비밀번호가 일치하지 않습니다.");
	    }
	}
	
	/**
	 * 회원탈퇴 (하드 삭제)
	 */
	@DeleteMapping("/me")
	public ResponseEntity<Void> deleteMe(
	    @AuthenticationPrincipal CustomUserDetails userDetails
	) {
	    if (userDetails == null) {
	        return ResponseEntity
	                .status(HttpStatus.UNAUTHORIZED)
	                .build();
	    }

	    userService.deleteUser(userDetails.getId());
	    return ResponseEntity.noContent().build();
	}

}
