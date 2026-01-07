package com.example.cashbook.jwt;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil { // 토큰 발급 유틸
    
    // 보안이슈로 scrret, expiration 값은 poroperties에서 의존값 주입 받음
    /**
     * @Value("${jwt.secret}") → application.properties에 있는 값을 가져와 변수에 주입합니다.
     * 예) jwt.secret = mysupersecretkey12345678901234567890
     */
    @Value("${jwt.secret}")
    private String secret;

    /**
     * @Value("${jwt.expiration}") → 토큰의 유효시간(만료시간)을 가져옵니다.
     * 예) jwt.expiration = 3600000  (1시간 = 3,600,000 ms)
     */
    @Value("${jwt.expiration}")
    private long expiration;

    /**
     * SecretKey를 만드는 함수입니다.
     * JWT는 토큰을 만들고 검증할 때 "비밀키"가 필요합니다.
     * HMAC-SHA 방식은 문자열(secret)을 바이트로 변환해서 키를 생성합니다.
     */
    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    /**
     * JWT 토큰을 생성하는 함수입니다.
     * - subject(username) → 토큰의 주인(사용자 아이디)을 저장하는 공간
     * - claim("role", role) → 추가로 저장하고 싶은 정보를 key/value 형태로 넣는 공간
     * - issuedAt → 토큰이 언제 만들어졌는지 기록
     * - expiration → 토큰이 언제 만료되는지 기록
     * - signWith → 위에서 만든 비밀키로 토큰을 암호화 서명(sign) 합니다.
     */
    public String generateToken(String username, String role) {
        return Jwts.builder()
                .subject(username)                 // 토큰 주인(사용자명)
                .claim("role", role)              // 권한(role) 정보를 추가 저장
                .issuedAt(new Date())             // 토큰 생성 시간
                .expiration(new Date(System.currentTimeMillis() + expiration)) // 만료 시간 설정
                .signWith(getKey())               // 비밀키로 서명(암호화)
                .compact();                       // 최종적으로 토큰 문자열 생성
    }

    /**
     * 토큰을 검증하고, 토큰 안에 있는 정보를 꺼내오는 함수입니다.
     * - parser() → JWT 해석(파싱) 준비
     * - verifyWith → 같은 secret key로 서명이 올바른지 체크
     * - parseSignedClaims → 토큰이 위변조되지 않았는지 + 만료되지 않았는지 확인
     * - getPayload() → 토큰 안에 저장된 실제 데이터(username, role 등)를 반환
     *
     * ※ 토큰이 잘못되었거나 만료되었으면 예외(error)가 발생합니다.
     *    입문자는 try/catch로 감싸서 예외를 처리하는 걸 추천합니다.
     */
    public Claims validateToken(String token) {
        return Jwts.parser()
                .verifyWith(getKey())             // 비밀키로 검증
                .build()
                .parseSignedClaims(token)         // 토큰 위변조/만료 검사
                .getPayload();                    // 토큰에 들어있는 데이터 반환
    }
}