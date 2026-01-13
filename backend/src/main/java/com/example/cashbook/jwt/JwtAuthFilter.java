package com.example.cashbook.jwt;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.cashbook.dto.CustomUserDetails;
import com.example.cashbook.dto.User;
import com.example.cashbook.service.UserService;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserService userService;

    public JwtAuthFilter(JwtUtil jwtUtil, UserService userService) {
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
    	System.out.println("========== JWT FILTER START ==========");
        System.out.println("METHOD = " + request.getMethod());
        System.out.println("URI    = " + request.getRequestURI());

        String header = request.getHeader("Authorization");
        System.out.println("Authorization = " + header);
    	    
        String path = request.getRequestURI();

        // OPTIONS 요청 패스
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
        	System.out.println("OPTIONS PASS");
            filterChain.doFilter(request, response);
            return;
        }

        // 인증 제외 경로
        if (path.startsWith("/api/auth/")) {
        	System.out.println("AUTH API PASS");
            filterChain.doFilter(request, response);
            return;
        }

        if (header == null || !header.startsWith("Bearer ")) {
        	System.out.println("❌ NO JWT HEADER");
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);

        try {
            Claims claims = jwtUtil.validateToken(token);
            String username = claims.getSubject();
            System.out.println("JWT OK, username = " + username);
            
            User user = userService.findByUsername(username);
            System.out.println("USER = " + user);
            
            if (user == null) {
                SecurityContextHolder.clearContext();
                filterChain.doFilter(request, response);
                return;
            }

            CustomUserDetails userDetails = new CustomUserDetails(user);

            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(
                            userDetails,          
                            null,
                            userDetails.getAuthorities()
                    );
            auth.setDetails(userDetails);
            
            SecurityContextHolder.getContext().setAuthentication(auth);
            
            System.out.println("AUTH SET = " +
                    SecurityContextHolder.getContext().getAuthentication()
                );
                System.out.println("AUTHORITIES = " +
                    SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getAuthorities()
                );
                

        } catch (Exception e) {
        	System.out.println("❌ JWT ERROR");
            e.printStackTrace();
            SecurityContextHolder.clearContext();
            filterChain.doFilter(request, response);
            return; // ⭐⭐⭐ 핵심
        }

        filterChain.doFilter(request, response);
        System.out.println("========== JWT FILTER END ==========");
    }
    
}
