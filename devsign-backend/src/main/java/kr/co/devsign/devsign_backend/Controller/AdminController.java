package kr.co.devsign.devsign_backend.Controller;

import jakarta.servlet.http.HttpServletRequest;
import kr.co.devsign.devsign_backend.Service.AdminService;
import kr.co.devsign.devsign_backend.dto.admin.AccessLogResponse;
import kr.co.devsign.devsign_backend.dto.admin.AdminMemberResponse;
import kr.co.devsign.devsign_backend.dto.admin.HeroSettingsRequest;
import kr.co.devsign.devsign_backend.dto.admin.HeroSettingsResponse;
import kr.co.devsign.devsign_backend.dto.admin.RestoreMemberRequest;
import kr.co.devsign.devsign_backend.dto.admin.SyncDiscordResponse;
import kr.co.devsign.devsign_backend.dto.common.StatusResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/members")
    public List<AdminMemberResponse> getAllMembers() {
        return adminService.getAllMembers();
    }

    @GetMapping("/logs")
    public List<AccessLogResponse> getAllLogs() {
        return adminService.getAllLogs();
    }

    @GetMapping("/settings")
    public HeroSettingsResponse getHeroSettings() {
        return adminService.getHeroSettings();
    }

    @PostMapping("/settings")
    public StatusResponse updateHeroSettings(@RequestBody HeroSettingsRequest settings) {
        return adminService.updateHeroSettings(settings);
    }

    @GetMapping("/sync-discord")
    public SyncDiscordResponse syncDiscord() {
        return adminService.syncDiscord();
    }

    @PutMapping("/members/{id}/suspend")
    public StatusResponse toggleSuspension(@PathVariable Long id, HttpServletRequest request) {
        return adminService.toggleSuspension(id, request.getRemoteAddr());
    }

    @PostMapping("/members/restore")
    public StatusResponse restoreMember(@RequestBody RestoreMemberRequest member, HttpServletRequest request) {
        return adminService.restoreMember(member, request.getRemoteAddr());
    }

    @DeleteMapping("/members/{id}")
    public StatusResponse deleteMember(
            @PathVariable Long id,
            @RequestParam(defaultValue = "false") boolean hard,
            HttpServletRequest request
    ) {
        return adminService.deleteMember(id, hard, request.getRemoteAddr());
    }
}
