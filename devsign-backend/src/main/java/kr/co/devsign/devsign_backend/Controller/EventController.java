package kr.co.devsign.devsign_backend.Controller;

import jakarta.servlet.http.HttpServletRequest;
import kr.co.devsign.devsign_backend.Entity.Event;
import kr.co.devsign.devsign_backend.Service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping
    public List<Event> getAllEvents() {
        return eventService.getAllEvents();
    }

    @PostMapping
    public Event createEvent(@RequestBody Map<String, Object> payload, HttpServletRequest request) {
        return eventService.createEvent(payload, request.getRemoteAddr());
    }

    @PutMapping("/{id}")
    public Event updateEvent(@PathVariable Long id, @RequestBody Map<String, Object> payload, HttpServletRequest request) {
        return eventService.updateEvent(id, payload, request.getRemoteAddr());
    }

    @GetMapping("/{id}")
    public Map<String, Object> getEventDetail(
            @PathVariable Long id,
            @RequestParam(required = false) String loginId
    ) {
        return eventService.getEventDetail(id, loginId);
    }

    @PostMapping("/{id}/like")
    public Map<String, Object> toggleLike(
            @PathVariable Long id,
            @RequestBody Map<String, String> requestData
    ) {
        // 기존 프론트 연동 그대로: body에서 loginId 받음
        String loginId = requestData.get("loginId");
        return eventService.toggleLike(id, loginId);
    }

    @DeleteMapping("/{id}")
    public Map<String, String> deleteEvent(
            @PathVariable Long id,
            @RequestParam String loginId,
            HttpServletRequest request
    ) {
        return eventService.deleteEvent(id, loginId, request.getRemoteAddr());
    }
}
