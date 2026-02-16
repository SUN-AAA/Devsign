package kr.co.devsign.devsign_backend.Repository;

import kr.co.devsign.devsign_backend.Entity.Event;
import kr.co.devsign.devsign_backend.Entity.EventView;
import kr.co.devsign.devsign_backend.Entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventViewRepository extends JpaRepository<EventView, Long> {

    boolean existsByMemberAndEvent(Member member, Event event);

    void deleteByEvent(Event event);
}