package kr.co.devsign.devsign_backend.Repository;

import kr.co.devsign.devsign_backend.Entity.Comment;
import kr.co.devsign.devsign_backend.Entity.CommentLike;
import kr.co.devsign.devsign_backend.Entity.Member;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CommentLikeRepository extends JpaRepository<CommentLike, Long> {
    // 유저와 댓글로 좋아요 기록 찾기
    Optional<CommentLike> findByMemberAndComment(Member member, Comment comment);

    // 좋아요 여부 확인 (하트 표시용)
    boolean existsByMemberAndComment(Member member, Comment comment);

    // 댓글 삭제 시 좋아요 기록도 같이 삭제
    void deleteByComment(Comment comment);
}