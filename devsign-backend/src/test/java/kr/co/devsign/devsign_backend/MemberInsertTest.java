package kr.co.devsign.devsign_backend;

import kr.co.devsign.devsign_backend.Entity.Member;
import kr.co.devsign.devsign_backend.Repository.MemberRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootTest
class MemberInsertTest {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Test
    void insertMembers() {
        // 1) 일반 유저
        Member user = new Member();
        user.setLoginId("user"); // ★ unique
        user.setPassword(passwordEncoder.encode("user1234@")); // 평문 금지, 반드시 인코딩
        user.setName("테스트유저");
        user.setStudentId("20251234");
        user.setDept("AI소프트웨어학부 컴퓨터공학 전공");
        user.setInterests("Spring, React");
        user.setDiscordTag("testuser#0001");
        user.setUserStatus("재학생");
        user.setRole("USER");
        user.setSuspended(false);
        user.setProfileImage(null);

        memberRepository.save(user);

        // 2) 관리자
        Member admin = new Member();
        admin.setLoginId("admin"); // ★ unique
        admin.setPassword(passwordEncoder.encode("admin1234@"));
        admin.setName("정선아");
        admin.setStudentId("20253049");
        admin.setDept("AI소프트웨어학부 컴퓨터공학 전공");
        admin.setInterests("web");
        admin.setDiscordTag("admin#0001");
        admin.setUserStatus("ADMIN");
        admin.setRole("ADMIN");
        admin.setSuspended(false);
        admin.setProfileImage(null);

        memberRepository.save(admin);
    }
}
