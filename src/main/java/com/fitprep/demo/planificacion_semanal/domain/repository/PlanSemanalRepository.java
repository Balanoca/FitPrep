package com.fitprep.demo.planificacion_semanal.domain.repository;

import com.fitprep.demo.planificacion_semanal.domain.model.PlanSemanal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PlanSemanalRepository extends JpaRepository<PlanSemanal, Long> {
    List<PlanSemanal> findByFechaInicioSemanaAndEstadoPagoIn(LocalDate fecha, List<String> estadosPago);
}
