package com.example.cashbook.jwt;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * 🔐 JWT 인증 필터 (로그인한 사용자가 보낸 요청이 유효한 토큰을 가지고 있는지 검사)
 *
 * 💡 이 필터가 하는 일:
 * 1. HTTP 요청에서 "Authorization" 헤더를 읽는다.
 * 2. "Bearer " 로 시작하는 토큰이 있으면 JWT 유효성을 검사한다.
 * 3. 유효하면 Spring Security 인증 정보(SecurityContext)에 저장한다.
 * 4. 저장된 인증 정보는 이후 Controller에서 `Authentication auth` 로 꺼내 쓸 수 있다.
 *
 * ❗왜 OncePerRequestFilter 를 상속하나요?
 * → 같은 요청이 forward/include/async 같은 내부 호출로 인해 여러 번 필터를 탈 수 있는데,
 *   이 클래스를 쓰면 "서블릿 요청 1번당 딱 1번만 실행됨" 이 보장되어 인증이 중복 처리되는 버그를 방지한다.
 */

// /a/ -> /b/ -> /view/
// OncePerRequestFilter 로 한번 실행됐던 필터는 다시 사용하지 않음
public class JwtAuthFilter extends OncePerRequestFilter { // 유효 토큰 검사
	
    // JWT 검증, 파싱(정보 추출)을 담당하는 유틸 클래스
    // 이 클래스는 우리가 직접 만든 JwtUtil 이며, secret key 기반으로 토큰이 올바른지 검사함
    private final JwtUtil jwtUtil;
    
    // 생성자: JwtUtil 을 주입받아서 사용
    // Spring Security 설정에서 new JwtAuthFilter(jwtUtil) 이런 식으로 만들어서 등록함
    public JwtAuthFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    /**
     * 🚦 doFilterInternal()
     * → 실제 필터 로직을 작성하는 메서드 (요청이 올 때 자동 실행됨)
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                   HttpServletResponse response,
                                   FilterChain filterChain)
            throws ServletException, IOException {
    	
    	System.out.println("🔥 JwtAuthFilter path = " + request.getRequestURI());
    	
    	if("OPTIONS".equalsIgnoreCase(request.getMethod())) {
    		filterChain.doFilter(request, response);
    		return;
    	}
    	
        // 1️⃣ 현재 요청 URL(경로) 읽기
        String path = request.getRequestURI();

        // 2️⃣ "/auth/" 로 시작하는 요청은 토큰 검증을 하지 않는다. (로그인, 회원가입 API 등은 인증 불필요)
        // 예: /auth/login, /auth/signup 같은 요청
        if (path.startsWith("/api/auth/")) {
            filterChain.doFilter(request, response); // 다음 필터로 그냥 넘김
            return; // 여기서 필터 종료
        }

        // 3️⃣ HTTP 헤더에서 Authorization 값 꺼내기
        // 클라이언트가 JWT를 보낼 때 보통 이 헤더에 넣어서 보냄
        String header = request.getHeader("Authorization");

        // 4️⃣ 토큰이 없거나 "Bearer " 로 시작하지 않으면 인증 안 하고 다음으로 넘김
        // Bearer 토큰 형식이 아니라면 우리가 처리할 필요가 없음(Bearer는 이 문자가 JWT토큰 문자의 접두사)
        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 5️⃣ "Bearer " 부분을 제거하고 순수 토큰 문자열만 추출
        String token = header.replace("Bearer ", "");

        try {
            // 6️⃣ 토큰 검증 및 파싱
            // validateToken() 이 성공하면 claims(토큰 안에 저장된 정보)가 반환됨
            Claims claims = jwtUtil.validateToken(token);

            // 7️⃣ 토큰에서 사용자 아이디(username) 꺼내기
            // claims.getSubject() 는 토큰 생성 시 넣었던 .subject(username) 값
            String username = claims.getSubject();

            // 8️⃣ 토큰에서 role(권한/역할) 꺼내기
            // 토큰에 저장할 때 claim("role", "USER") 이런 식으로 넣어둔 값
            String role = claims.get("role", String.class);

            
            // 🔥 여기 붙이기 (①)
            System.out.println("🔥 JWT username = " + username);
            System.out.println("🔥 JWT role = " + role);
            
            // 9️⃣ Spring Security가 이해할 수 있는 인증 객체 생성
            // UsernamePasswordAuthenticationToken(사용자정보, 비밀번호, 권한목록)
            // 비밀번호는 JWT 기반 인증이므로 null 로 넣음
            // 권한은 "ROLE_USER" 같은 형식으로 저장해야 Spring이 인식함
            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(
                            username,
                            null,
                            List.of(new SimpleGrantedAuthority("ROLE_" + role))
                    );

            // 🔟 SecurityContext에 인증 정보 저장
            // 이후 요청 처리 동안 로그인된 사용자로 인식됨
            SecurityContextHolder.getContext().setAuthentication(auth);
            
            // 🔥 여기 붙이기 (②)
            System.out.println(
                "🔥 SecurityContext auth = " +
                SecurityContextHolder.getContext().getAuthentication()
            );
            

        } catch (Exception e) {
            // 🚫 토큰 검증 실패 시 인증 정보 삭제
            // 실패한 사용자는 로그인되지 않은 상태로 처리됨
            SecurityContextHolder.clearContext();
        }

        // 1️⃣1️⃣ 다음 필터 또는 실제 API 컨트롤러로 요청 전달
        filterChain.doFilter(request, response);
    }
}