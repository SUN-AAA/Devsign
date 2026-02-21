package kr.co.devsign.devsign_backend.Controller;

import kr.co.devsign.devsign_backend.Service.AssemblyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/assembly")

@RequiredArgsConstructor
public class AssemblyController {

    private final AssemblyService assemblyService;

    @GetMapping("/my-submissions")
    public ResponseEntity<?> getMySubmissions(
            @RequestParam String loginId,
            @RequestParam int year,
            @RequestParam int semester
    ) {
        Map<String, Object> result = assemblyService.getMySubmissions(loginId, year, semester);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/project-title")
    public ResponseEntity<?> saveProjectTitle(@RequestBody Map<String, Object> params) {
        assemblyService.saveProjectTitle(params);
        return ResponseEntity.ok(Map.of("status", "success"));
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitFiles(
            @RequestParam String loginId,
            @RequestParam String reportId,
            @RequestParam int year,
            @RequestParam int semester,
            @RequestParam int month,
            @RequestParam String memo,
            @RequestParam(required = false) MultipartFile presentation,
            @RequestParam(required = false) MultipartFile pdf,
            @RequestParam(required = false) MultipartFile other
    ) {
        try {
            String message = assemblyService.submitFiles(
                    loginId, reportId, year, semester, month, memo,
                    presentation, pdf, other
            );
            return ResponseEntity.ok(Map.of("status", "success", "message", message));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "fail",
                    "message", "제출 중 오류 발생: " + e.getMessage()
            ));
        }
    }
}
