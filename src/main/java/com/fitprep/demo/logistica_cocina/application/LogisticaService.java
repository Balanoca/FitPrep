package com.fitprep.demo.logistica_cocina.application;

import com.fitprep.demo.logistica_cocina.interfaces.dto.ReporteProduccionItem;
import com.fitprep.demo.planificacion_semanal.domain.model.DetallePlan;
import com.fitprep.demo.planificacion_semanal.domain.model.PlanSemanal;
import com.fitprep.demo.planificacion_semanal.domain.repository.PlanSemanalRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
@Transactional(readOnly = true)
public class LogisticaService {

    private final PlanSemanalRepository planSemanalRepository;

    public LogisticaService(PlanSemanalRepository planSemanalRepository) {
        this.planSemanalRepository = planSemanalRepository;
    }

    public List<ReporteProduccionItem> obtenerConsolidadoProduccion(LocalDate fechaSemana) {
        List<PlanSemanal> planes = planSemanalRepository.findByFechaInicioSemanaAndEstadoPagoIn(
                fechaSemana, List.of("CONFIRMADO", "PAGADO")
        );

        Map<String, ReporteProduccionItem> consolidado = new HashMap<>();

        for (PlanSemanal plan : planes) {
            for (DetallePlan detalle : plan.getComidas()) {
                if (detalle.getPlato() == null) continue;

                String key = String.format("%d|%s|%s|%s",
                        detalle.getPlato().getId(),
                        detalle.getPlato().getNombre(),
                        detalle.getDiaSemana(),
                        detalle.getTipoComida()
                );

                int cantidad = detalle.getCantidad() != null ? detalle.getCantidad() : 1;

                if (consolidado.containsKey(key)) {
                    ReporteProduccionItem item = consolidado.get(key);
                    item.setCantidadTotal(item.getCantidadTotal() + cantidad);
                } else {
                    consolidado.put(key, ReporteProduccionItem.builder()
                            .platoId(detalle.getPlato().getId())
                            .platoNombre(detalle.getPlato().getNombre())
                            .diaSemana(detalle.getDiaSemana())
                            .tipoComida(detalle.getTipoComida())
                            .cantidadTotal(cantidad)
                            .build());
                }
            }
        }

        return new ArrayList<>(consolidado.values());
    }
}
