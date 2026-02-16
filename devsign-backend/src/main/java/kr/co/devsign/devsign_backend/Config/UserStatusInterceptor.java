package kr.co.devsign.devsign_backend.Config;


import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kr.co.devsign.devsign_backend.Entity.Member;
import kr.co.devsign.devsign_backend.Repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Component
public class UserStatusInterceptor implements HandlerInterceptor {

    @Autowired
    private MemberRepository memberRepository;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 헤더에서 로그인 아이디를 가져옵니다 (프론트에서 보내줘야 함)
        String loginId = request.getHeader("X-User-LoginId");

        if (loginId != null && !loginId.isEmpty()) {
            Optional<Member> memberOpt = memberRepository.findByLoginId(loginId);

            if (memberOpt.isPresent() && memberOpt.get().isSuspended()) {
                // ✨ 정지된 유저라면 요청을 차단하고 JSON 응답을 보냅니다.
                response.setStatus(HttpServletResponse.SC_FORBIDDEN); // 403 에러
                response.setContentType("application/json;charset=UTF-8");

                Map<String, Object> data = new HashMap<>();
                data.put("status", "suspended");
                data.put("message", "정지된 계정입니다. 즉시 로그아웃됩니다.");

                ObjectMapper mapper = new ObjectMapper();
                response.getWriter().write(mapper.writeValueAsString(data));

                return false; // 컨트롤러로 요청을 보내지 않음
            }
        }

        return true; // 정상 유저라면 요청 허용
    }
}