package kr.co.devsign.devsign_backend.Repository;

import kr.co.devsign.devsign_backend.Entity.AssemblyReport;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AssemblyReportRepository extends JpaRepository<AssemblyReport, Long> {
    List<AssemblyReport> findByLoginIdAndYearAndSemesterOrderByMonthAsc(String loginId, int year, int semester);
}