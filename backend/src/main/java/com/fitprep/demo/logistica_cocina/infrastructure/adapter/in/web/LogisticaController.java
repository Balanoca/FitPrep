package com.fitprep.demo.logistica_cocina.infrastructure.adapter.in.web;

import com.fitprep.demo.logistica_cocina.domain.model.ReporteProduccionItem;
import com.fitprep.demo.logistica_cocina.domain.port.in.ConsultarProduccionUseCase;
import com.fitprep.demo.logistica_cocina.infrastructure.adapter.in.web.dto.ReporteProduccionResponse;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/logistica")
public class LogisticaController {

    private final ConsultarProduccionUseCase consultarProduccion;

    public LogisticaController(ConsultarProduccionUseCase consultarProduccion) {
        this.consultarProduccion = consultarProduccion;
    }

    @GetMapping("/produccion")
    public ResponseEntity<List<ReporteProduccionResponse>> obtenerProduccion(
            @RequestParam("fechaSemana") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaSemana) {
        if (fechaSemana == null) {
            return ResponseEntity.badRequest().build();
        }

        List<ReporteProduccionResponse> reporte = consultarProduccion.obtenerConsolidadoProduccion(fechaSemana).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(reporte);
    }

    private ReporteProduccionResponse mapToResponse(ReporteProduccionItem item) {
        return ReporteProduccionResponse.builder()
                .platoId(item.getPlatoId())
                .platoNombre(item.getPlatoNombre())
                .diaSemana(item.getDiaSemana())
                .tipoComida(item.getTipoComida())
                .cantidadTotal(item.getCantidadTotal())
                .build();
    }
}
