package kr.co.devsign.devsign_backend.Service;

import kr.co.devsign.devsign_backend.Entity.Member;
import kr.co.devsign.devsign_backend.Repository.AccessLogRepository;
import kr.co.devsign.devsign_backend.Repository.MemberRepository;
import kr.co.devsign.devsign_backend.dto.admin.AccessLogResponse;
import kr.co.devsign.devsign_backend.dto.admin.AdminMemberResponse;
import kr.co.devsign.devsign_backend.dto.admin.HeroSettingsRequest;
import kr.co.devsign.devsign_backend.dto.admin.HeroSettingsResponse;
import kr.co.devsign.devsign_backend.dto.admin.RestoreMemberRequest;
import kr.co.devsign.devsign_backend.dto.admin.SyncDiscordResponse;
import kr.co.devsign.devsign_backend.dto.common.StatusResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final MemberRepository memberRepository;
    private final AccessLogRepository accessLogRepository;
    private final AccessLogService accessLogService;
    private final DiscordBotClient discordBotClient;

    private static final Map<String, String> heroSettings = new ConcurrentHashMap<>();
    static {
        heroSettings.put("recruitmentText", "2026 recruitment open");
        heroSettings.put("applyLink", "https://open.kakao.com/o/example");
    }

    public List<AdminMemberResponse> getAllMembers() {
        return memberRepository.findAllByOrderByStudentIdDesc().stream()
                .map(this::toAdminMemberResponse)
                .toList();
    }

    public List<AccessLogResponse> getAllLogs() {
        return accessLogRepository.findAllByOrderByTimestampDesc().stream()
                .map(log -> new AccessLogResponse(
                        log.getId(),
                        log.getName(),
                        log.getStudentId(),
                        log.getType(),
                        log.getIp(),
                        log.getTimestamp()
                ))
                .toList();
    }

    public HeroSettingsResponse getHeroSettings() {
        return new HeroSettingsResponse(heroSettings.get("recruitmentText"), heroSettings.get("applyLink"));
    }

    public StatusResponse updateHeroSettings(HeroSettingsRequest settings) {
        heroSettings.put("recruitmentText", settings.recruitmentText());
        heroSettings.put("applyLink", settings.applyLink());
        return StatusResponse.success();
    }

    public SyncDiscordResponse syncDiscord() {
        try {
            Map<String, Object> botRes = discordBotClient.syncAllMembers();

            if (botRes != null && "success".equals(botRes.get("status"))) {
                List<Map<String, String>> discordMembers =
                        (List<Map<String, String>>) botRes.get("members");

                int updateCount = 0;

                for (Map<String, String> d : discordMembers) {
                    String tag = d.get("discordTag");

                    Optional<Member> opt = memberRepository.findByDiscordTag(tag);
                    if (opt.isPresent()) {
                        Member m = opt.get();
                        m.setName(d.get("name"));
                        m.setStudentId(d.get("studentId"));
                        m.setUserStatus(d.get("userStatus"));
                        m.setRole(d.get("role"));
                        m.setProfileImage(d.get("avatarUrl"));
                        memberRepository.save(m);
                        updateCount++;
                    }
                }

                return new SyncDiscordResponse("success", updateCount + " members synchronized");
            }

            return new SyncDiscordResponse("fail", "failed to receive data from bot server");

        } catch (Exception e) {
            return new SyncDiscordResponse("error", "sync error: " + e.getMessage());
        }
    }

    public StatusResponse toggleSuspension(Long id, String ip) {
        return memberRepository.findById(id)
                .map(m -> {
                    m.setSuspended(!m.isSuspended());
                    memberRepository.save(m);

                    accessLogService.logByMember(
                            m,
                            m.isSuspended() ? "ACCOUNT_SUSPEND" : "ACCOUNT_UNSUSPEND",
                            ip
                    );
                    return StatusResponse.success();
                })
                .orElseGet(() -> StatusResponse.fail("member not found"));
    }

    public StatusResponse restoreMember(RestoreMemberRequest request, String ip) {
        try {
            Member member = new Member();
            member.setId(null);
            member.setLoginId(request.loginId());
            member.setPassword(request.password());
            member.setName(request.name());
            member.setStudentId(request.studentId());
            member.setDept(request.dept());
            member.setInterests(request.interests());
            member.setDiscordTag(request.discordTag());
            member.setUserStatus(request.userStatus());
            member.setRole(request.role());
            member.setSuspended(request.suspended());
            member.setProfileImage(request.profileImage());

            Member saved = memberRepository.save(member);
            accessLogService.logByMember(saved, "ACCOUNT_RESTORE", ip);
            return StatusResponse.success();

        } catch (Exception e) {
            return StatusResponse.fail("restore failed: " + e.getMessage());
        }
    }

    public StatusResponse deleteMember(Long id, boolean hard, String ip) {
        return memberRepository.findById(id)
                .map(m -> {
                    accessLogService.logByMember(
                            m,
                            hard ? "ACCOUNT_PERMANENT_DELETE" : "ACCOUNT_DELETE",
                            ip
                    );

                    memberRepository.deleteById(id);
                    return StatusResponse.success();
                })
                .orElseGet(() -> StatusResponse.fail("member not found"));
    }

    private AdminMemberResponse toAdminMemberResponse(Member member) {
        return new AdminMemberResponse(
                member.getId(),
                member.getLoginId(),
                member.getName(),
                member.getStudentId(),
                member.getDept(),
                member.getInterests(),
                member.getDiscordTag(),
                member.getUserStatus(),
                member.getRole(),
                member.isSuspended(),
                member.getProfileImage()
        );
    }
}
