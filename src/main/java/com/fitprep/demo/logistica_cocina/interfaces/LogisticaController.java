package com.fitprep.demo.logistica_cocina.interfaces;

import com.fitprep.demo.logistica_cocina.application.LogisticaService;
import com.fitprep.demo.logistica_cocina.interfaces.dto.ReporteProduccionItem;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/logistica")
public class LogisticaController {

    private final LogisticaService logisticaService;

    public LogisticaController(LogisticaService logisticaService) {
        this.logisticaService = logisticaService;
    }

    @GetMapping("/produccion")
    public ResponseEntity<List<ReporteProduccionItem>> obtenerProduccion(
            @RequestParam("fechaSemana") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaSemana) {
        if (fechaSemana == null) {
            return ResponseEntity.badRequest().build();
        }

        List<ReporteProduccionItem> reporte = logisticaService.obtenerConsolidadoProduccion(fechaSemana);
        return ResponseEntity.ok(reporte);
    }
}
