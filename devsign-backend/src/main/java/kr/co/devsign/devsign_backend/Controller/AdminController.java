package kr.co.devsign.devsign_backend.Controller;

import jakarta.servlet.http.HttpServletRequest;
import kr.co.devsign.devsign_backend.Entity.AccessLog;
import kr.co.devsign.devsign_backend.Entity.Member;
import kr.co.devsign.devsign_backend.Service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")

@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/members")
    public List<Member> getAllMembers() {
        return adminService.getAllMembers();
    }

    @GetMapping("/logs")
    public List<AccessLog> getAllLogs() {
        return adminService.getAllLogs();
    }

    @GetMapping("/settings")
    public Map<String, String> getHeroSettings() {
        return adminService.getHeroSettings();
    }

    @PostMapping("/settings")
    public Map<String, String> updateHeroSettings(@RequestBody Map<String, String> settings) {
        return adminService.updateHeroSettings(settings);
    }

    @GetMapping("/sync-discord")
    public Map<String, Object> syncDiscord() {
        return adminService.syncDiscord();
    }

    @PutMapping("/members/{id}/suspend")
    public Map<String, Object> toggleSuspension(@PathVariable Long id, HttpServletRequest request) {
        return adminService.toggleSuspension(id, request.getRemoteAddr());
    }

    @PostMapping("/members/restore")
    public Map<String, Object> restoreMember(@RequestBody Member member, HttpServletRequest request) {
        return adminService.restoreMember(member, request.getRemoteAddr());
    }

    @DeleteMapping("/members/{id}")
    public Map<String, Object> deleteMember(
            @PathVariable Long id,
            @RequestParam(defaultValue = "false") boolean hard,
            HttpServletRequest request
    ) {
        return adminService.deleteMember(id, hard, request.getRemoteAddr());
    }
}
