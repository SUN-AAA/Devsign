package kr.co.devsign.devsign_backend.service;

import kr.co.devsign.devsign_backend.entity.AssemblyProject;
import kr.co.devsign.devsign_backend.entity.AssemblyReport;
import kr.co.devsign.devsign_backend.repository.AssemblyProjectRepository;
import kr.co.devsign.devsign_backend.repository.AssemblyReportRepository;
import kr.co.devsign.devsign_backend.dto.assembly.AssemblyReportResponse;
import kr.co.devsign.devsign_backend.dto.assembly.MySubmissionsResponse;
import kr.co.devsign.devsign_backend.dto.assembly.SaveProjectTitleRequest;
import kr.co.devsign.devsign_backend.dto.assembly.SubmitFilesCommand;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AssemblyService {

    private final AssemblyReportRepository reportRepository;
    private final AssemblyProjectRepository projectRepository;

    public MySubmissionsResponse getMySubmissions(String loginId, int year, int semester) {
        List<AssemblyReport> reports =
                reportRepository.findByLoginIdAndYearAndSemesterOrderByMonthAsc(loginId, year, semester);

        if (reports.isEmpty()) {
            int[] months = (semester == 1) ? new int[]{3, 4, 5, 6} : new int[]{9, 10, 11, 12};
            for (int month : months) {
                AssemblyReport r = new AssemblyReport();
                r.setLoginId(loginId);
                r.setYear(year);
                r.setSemester(semester);
                r.setMonth(month);
                r.setStatus("NOT_SUBMITTED");
                r.setType(resolveType(month));
                reportRepository.save(r);
            }
            reports = reportRepository.findByLoginIdAndYearAndSemesterOrderByMonthAsc(loginId, year, semester);
        }

        String projectTitle = projectRepository.findByLoginIdAndYearAndSemester(loginId, year, semester)
                .map(AssemblyProject::getTitle)
                .orElse("");

        List<AssemblyReportResponse> reportResponses = reports.stream()
                .map(this::toReportResponse)
                .toList();

        return new MySubmissionsResponse(reportResponses, projectTitle);
    }

    public void saveProjectTitle(SaveProjectTitleRequest params) {
        String loginId = params.loginId();
        int year = params.year();
        int semester = params.semester();
        String title = params.title();

        AssemblyProject project = projectRepository.findByLoginIdAndYearAndSemester(loginId, year, semester)
                .orElse(new AssemblyProject());

        project.setLoginId(loginId);
        project.setYear(year);
        project.setSemester(semester);
        project.setTitle(title);

        projectRepository.save(project);
    }

    public String submitFiles(SubmitFilesCommand command) throws Exception {
        String loginId = command.loginId();
        String reportId = command.reportId();
        int year = command.year();
        int semester = command.semester();
        int month = command.month();
        String memo = command.memo();
        MultipartFile presentation = command.presentation();
        MultipartFile pdf = command.pdf();
        MultipartFile other = command.other();

        AssemblyReport report = null;

        if (reportId != null && !reportId.equals("0") && !reportId.startsWith("temp")) {
            report = reportRepository.findById(Long.parseLong(reportId)).orElse(null);
        }

        if (report == null) {
            List<AssemblyReport> existing =
                    reportRepository.findByLoginIdAndYearAndSemesterOrderByMonthAsc(loginId, year, semester);

            report = existing.stream()
                    .filter(r -> r.getMonth() == month)
                    .findFirst()
                    .orElse(null);
        }

        if (report == null) {
            report = new AssemblyReport();
            report.setLoginId(loginId);
            report.setYear(year);
            report.setSemester(semester);
            report.setMonth(month);
            report.setStatus("NOT_SUBMITTED");
            report.setType(resolveType(month));
        }

        String uploadBase = System.getProperty("user.dir") + File.separator + "uploads";
        String userPath = uploadBase + File.separator + loginId + File.separator + month;

        File folder = new File(userPath);
        if (!folder.exists()) {
            folder.mkdirs();
        }

        if (presentation != null && !presentation.isEmpty()) {
            String fileName = "pres_" + presentation.getOriginalFilename();
            presentation.transferTo(new File(userPath + File.separator + fileName));
            report.setPresentationPath(userPath + File.separator + fileName);
        }

        if (pdf != null && !pdf.isEmpty()) {
            String fileName = "pdf_" + pdf.getOriginalFilename();
            pdf.transferTo(new File(userPath + File.separator + fileName));
            report.setPdfPath(userPath + File.separator + fileName);
        }

        if (other != null && !other.isEmpty()) {
            String fileName = "other_" + other.getOriginalFilename();
            other.transferTo(new File(userPath + File.separator + fileName));
            report.setOtherPath(userPath + File.separator + fileName);
        }

        report.setMemo(memo);
        report.setStatus("SUBMITTED");
        report.setDate(LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy.MM.dd")));

        reportRepository.save(report);
        return "submitted";
    }

    private String resolveType(int month) {
        if (month == 3 || month == 9) {
            return "PLAN";
        }
        if (month == 6 || month == 12) {
            return "RESULT";
        }
        return "PROGRESS";
    }

    private AssemblyReportResponse toReportResponse(AssemblyReport report) {
        return new AssemblyReportResponse(
                report.getId(),
                report.getLoginId(),
                report.getYear(),
                report.getSemester(),
                report.getMonth(),
                report.getType(),
                report.getStatus(),
                report.getTitle(),
                report.getMemo(),
                report.getDate(),
                report.getDeadline(),
                report.getPresentationPath(),
                report.getPdfPath(),
                report.getOtherPath()
        );
    }
}
