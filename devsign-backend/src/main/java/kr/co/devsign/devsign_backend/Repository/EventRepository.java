package kr.co.devsign.devsign_backend.Repository;

import kr.co.devsign.devsign_backend.Entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
}
