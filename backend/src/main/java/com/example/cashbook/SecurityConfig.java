package com.example.cashbook;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.example.cashbook.jwt.JwtAuthFilter;
import com.example.cashbook.jwt.JwtUtil;

@Configuration
public class SecurityConfig {

    private final JwtUtil jwtUtil;
    public SecurityConfig(JwtUtil jwtUtil) {
		this.jwtUtil = jwtUtil;
	}

	@Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
            		// method = options 방식 요청 모두 허용
            		// API 서버를 접근시 클라이언트는 get/post/patch/delete등의 요청전에  
            		// 예비 요청을 성공적으로 마치고 서버의 응답을 받을 준비를 하게 되는데,
            		// 이러한 예비 요청(options 요청)을 인증 없이 통과 허용
            		.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
            		// swagger API명세서 출력 페이지 인증 없이 통과 허용
            		.requestMatchers("/swagger-ui/**", "/v3/**").permitAll()
                .requestMatchers("/auth/**").permitAll() 
                .anyRequest().authenticated() //  권한이 없는 접속시 403 응답
            )
            .addFilterBefore(new JwtAuthFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}