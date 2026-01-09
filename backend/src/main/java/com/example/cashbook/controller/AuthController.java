package com.example.cashbook.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.cashbook.dto.AuthRequest;
import com.example.cashbook.dto.AuthResponse;
import com.example.cashbook.dto.SignupRequest;
import com.example.cashbook.dto.User;
import com.example.cashbook.jwt.JwtUtil;
import com.example.cashbook.service.UserService;

@CrossOrigin // 외부에서 접근
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    public AuthController(UserService userService, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
		this.userService = userService;
		this.jwtUtil = jwtUtil;
		this.passwordEncoder = passwordEncoder;
	}

	/**
     * 회원가입 API
     * POST /api/auth/signup
     */
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupRequest request) {
    	System.out.println("/api/auth/signup");
    	String username = request.getUsername().trim();
        // 1. username 중복 검사
        if (userService.findByUsername(request.getUsername()) != null) {
            return ResponseEntity
                    .badRequest() // HTTP 400 반환
                    .body("이미 존재하는 사용자입니다.");
        }

        // 2. 사용자 객체 생성 및 비밀번호 암호화
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(request.getPassword())); // 비밀번호 암호화 저장
        user.setRole("USER"); // 서버에 강제 고정

        // 3. DB 저장
        userService.insertUser(user);

        // 4. 성공 응답 반환
        return ResponseEntity
                .ok() // HTTP 200 반환
                .body("회원가입 성공 (ID=" + user.getUsername() + ")");
    }

    /**
     * 로그인 API (JWT 토큰 발급)
     * POST /auth/login
     */
    @PostMapping("/login") // res.json()
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
    	System.out.println("/api/auth/login");	
    	String username = request.getUsername().trim();
    	System.out.println("LOGIN username = [" + username + "]");
        // 1. 사용자 조회
        User user = userService.findByUsername(request.getUsername());

        // 2. 사용자가 없으면 404 반환
        if (user == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND) // HTTP 404 반환
                    .body(null);
        }

        // 3. 비밀번호 비교 matches("1234", "fasdasdgfdsgdfasdas .....암호화된문자") 비교하는 메서드
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED) // HTTP 401 반환
                    .body(null);
        }

        // 4. JWT 생성
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());

        // 5. 응답 객체 생성
        AuthResponse authResponse = new AuthResponse(token, user.getUsername(), user.getRole());

        // 6. 성공 반환
        return ResponseEntity
                .ok() // HTTP 200 + JSON 반환
                .body(authResponse);
    }
}