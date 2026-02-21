package kr.co.devsign.devsign_backend.repository;

import kr.co.devsign.devsign_backend.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {

    // 아이디로 회원 찾기
    Optional<Member> findByLoginId(String loginId);

    // 이름과 학번으로 회원 찾기 (아이디/비번 찾기용)
    Optional<Member> findByNameAndStudentId(String name, String studentId);

    // 디스코드 태그로 회원 찾기
    Optional<Member> findByDiscordTag(String discordTag);

    // 최신학번부터 전체 회원 목록 조회
    List<Member> findAllByOrderByStudentIdDesc();
}