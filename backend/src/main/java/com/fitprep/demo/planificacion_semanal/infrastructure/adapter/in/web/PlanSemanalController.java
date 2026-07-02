package com.fitprep.demo.planificacion_semanal.infrastructure.adapter.in.web;

import com.fitprep.demo.planificacion_semanal.domain.model.DetallePlan;
import com.fitprep.demo.planificacion_semanal.domain.model.ExcesoCaloriasException;
import com.fitprep.demo.planificacion_semanal.domain.model.PlanSemanal;
import com.fitprep.demo.planificacion_semanal.domain.port.in.GestionarPlanSemanalUseCase;
import com.fitprep.demo.planificacion_semanal.domain.port.in.GestionarPlanSemanalUseCase.ComidaCommand;
import com.fitprep.demo.planificacion_semanal.domain.port.in.GestionarPlanSemanalUseCase.CrearPlanCommand;
import com.fitprep.demo.planificacion_semanal.infrastructure.adapter.in.web.dto.ComidaProgramadaDTO;
import com.fitprep.demo.planificacion_semanal.infrastructure.adapter.in.web.dto.PlanSemanalRequest;
import com.fitprep.demo.planificacion_semanal.infrastructure.adapter.in.web.dto.PlanSemanalResponse;
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

    private final GestionarPlanSemanalUseCase gestionarPlan;

    public PlanSemanalController(GestionarPlanSemanalUseCase gestionarPlan) {
        this.gestionarPlan = gestionarPlan;
    }

    @PostMapping
    public ResponseEntity<?> guardarPlan(@RequestBody PlanSemanalRequest request) {
        try {
            List<ComidaCommand> comidas = request.getComidas() == null
                    ? List.of()
                    : request.getComidas().stream()
                        .map(dto -> new ComidaCommand(
                                dto.getPlatoId(),
                                dto.getDiaSemana(),
                                dto.getTipoComida(),
                                dto.getCantidad() != null ? dto.getCantidad() : 1))
                        .collect(Collectors.toList());

            CrearPlanCommand command = new CrearPlanCommand(
                    request.getUsuarioId(),
                    request.getFechaInicioSemana(),
                    request.getMontoTotal(),
                    comidas
            );

            PlanSemanal guardado = gestionarPlan.guardarPlan(command);
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
        return gestionarPlan.obtenerPlanPorId(id)
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
                .map(this::mapComida)
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

    private ComidaProgramadaDTO mapComida(DetallePlan detalle) {
        return ComidaProgramadaDTO.builder()
                .platoId(detalle.getPlato() != null ? detalle.getPlato().getId() : null)
                .diaSemana(detalle.getDiaSemana())
                .tipoComida(detalle.getTipoComida())
                .cantidad(detalle.getCantidad())
                .build();
    }
}
