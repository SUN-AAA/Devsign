package kr.co.devsign.devsign_backend.Repository;

import kr.co.devsign.devsign_backend.Entity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Long> {
}
