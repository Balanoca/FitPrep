package com.fitprep.demo.planificacion_semanal.interfaces;

import com.fitprep.demo.planificacion_semanal.application.PlanSemanalService;
import com.fitprep.demo.planificacion_semanal.domain.model.ExcesoCaloriasException;
import com.fitprep.demo.planificacion_semanal.domain.model.PlanSemanal;
import com.fitprep.demo.planificacion_semanal.interfaces.dto.ComidaProgramadaDTO;
import com.fitprep.demo.planificacion_semanal.interfaces.dto.PlanSemanalRequest;
import com.fitprep.demo.planificacion_semanal.interfaces.dto.PlanSemanalResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/planes")
public class PlanSemanalController {

    private final PlanSemanalService planSemanalService;

    public PlanSemanalController(PlanSemanalService planSemanalService) {
        this.planSemanalService = planSemanalService;
    }

    @PostMapping
    public ResponseEntity<?> guardarPlan(@RequestBody PlanSemanalRequest request) {
        try {
            PlanSemanal plan = PlanSemanal.builder()
                    .fechaInicioSemana(request.getFechaInicioSemana())
                    .montoTotal(request.getMontoTotal())
                    .build();

            List<PlanSemanalService.DetallePlanHelper> helpers = request.getComidas() == null
                    ? List.of()
                    : request.getComidas().stream()
                        .map(dto -> new PlanSemanalService.DetallePlanHelper(
                                dto.getPlatoId(),
                                dto.getDiaSemana(),
                                dto.getTipoComida(),
                                dto.getCantidad() != null ? dto.getCantidad() : 1
                        ))
                        .collect(Collectors.toList());

            PlanSemanal guardado = planSemanalService.guardarPlan(plan, request.getUsuarioId(), helpers);
            return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponse(guardado));
        } catch (IllegalArgumentException e) {
            Map<String, Object> body = new HashMap<>();
            body.put("error", "Datos no válidos");
            body.put("message", e.getMessage());
            body.put("status", HttpStatus.BAD_REQUEST.value());
            return ResponseEntity.badRequest().body(body);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlanSemanalResponse> obtenerPlan(@PathVariable Long id) {
        return planSemanalService.obtenerPlanPorId(id)
                .map(plan -> ResponseEntity.ok(mapToResponse(plan)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @ExceptionHandler(ExcesoCaloriasException.class)
    public ResponseEntity<Map<String, Object>> handleExcesoCalorias(ExcesoCaloriasException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", "Exceso de Calorías");
        body.put("message", ex.getMessage());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.badRequest().body(body);
    }

    private PlanSemanalResponse mapToResponse(PlanSemanal plan) {
        List<ComidaProgramadaDTO> comidas = plan.getComidas() == null ? List.of() : plan.getComidas().stream()
                .map(entity -> ComidaProgramadaDTO.builder()
                        .platoId(entity.getPlato() != null ? entity.getPlato().getId() : null)
                        .diaSemana(entity.getDiaSemana())
                        .tipoComida(entity.getTipoComida())
                        .cantidad(entity.getCantidad())
                        .build())
                .collect(Collectors.toList());

        return PlanSemanalResponse.builder()
                .id(plan.getId())
                .negocioId(plan.getNegocioId())
                .usuarioId(plan.getUsuario() != null ? plan.getUsuario().getId() : null)
                .fechaInicioSemana(plan.getFechaInicioSemana())
                .estadoPago(plan.getEstadoPago())
                .montoTotal(plan.getMontoTotal())
                .comidas(comidas)
                .build();
    }
}
