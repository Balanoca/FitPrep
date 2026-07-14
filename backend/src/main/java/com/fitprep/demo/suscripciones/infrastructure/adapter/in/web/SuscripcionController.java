package com.fitprep.demo.suscripciones.infrastructure.adapter.in.web;

import com.fitprep.demo.gestion_usuarios.domain.model.Usuario;
import com.fitprep.demo.gestion_usuarios.domain.port.in.AutenticacionUseCase;
import com.fitprep.demo.suscripciones.domain.model.PagoSuscripcion;
import com.fitprep.demo.suscripciones.domain.model.PlanSuscripcion;
import com.fitprep.demo.suscripciones.domain.model.Suscripcion;
import com.fitprep.demo.suscripciones.domain.port.in.GestionarSuscripcionUseCase;
import com.fitprep.demo.suscripciones.infrastructure.adapter.in.web.dto.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Adaptador de entrada HTTP para la suscripción del negocio al SaaS.
 */
@RestController
@RequestMapping("/api/v1/suscripciones")
public class SuscripcionController {

    private final GestionarSuscripcionUseCase gestionarSuscripcion;
    private final AutenticacionUseCase autenticacion;

    public SuscripcionController(GestionarSuscripcionUseCase gestionarSuscripcion,
                                 AutenticacionUseCase autenticacion) {
        this.gestionarSuscripcion = gestionarSuscripcion;
        this.autenticacion = autenticacion;
    }

    /** Catálogo de planes disponibles. */
    @GetMapping("/planes")
    public ResponseEntity<List<PlanSuscripcionResponse>> listarPlanes() {
        List<PlanSuscripcionResponse> planes = gestionarSuscripcion.listarPlanes().stream()
                .map(this::mapPlan)
                .toList();
        return ResponseEntity.ok(planes);
    }

    /** Suscripción del negocio autenticado. */
    @GetMapping("/mi-suscripcion")
    public ResponseEntity<?> miSuscripcion() {
        Integer negocioId = negocioIdActual();
        if (negocioId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No autenticado");
        }
        try {
            return ResponseEntity.ok(mapSuscripcion(gestionarSuscripcion.obtenerSuscripcion(negocioId)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /** Historial de pagos de la suscripción del negocio. */
    @GetMapping("/mi-suscripcion/pagos")
    public ResponseEntity<?> misPagos() {
        Integer negocioId = negocioIdActual();
        if (negocioId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No autenticado");
        }
        try {
            List<PagoSuscripcionResponse> pagos = gestionarSuscripcion.historialPagos(negocioId).stream()
                    .map(this::mapPago)
                    .toList();
            return ResponseEntity.ok(pagos);
        } catch (IllegalArgumentException e) {
            return errorBody("Sin suscripción", e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    /** Elige o cambia el plan de la suscripción. */
    @PostMapping("/suscribir")
    public ResponseEntity<?> suscribir(@RequestBody SuscribirRequest request) {
        Integer negocioId = negocioIdActual();
        if (negocioId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No autenticado");
        }
        try {
            Suscripcion s = gestionarSuscripcion.suscribir(negocioId, request.getPlanId());
            return ResponseEntity.ok(mapSuscripcion(s));
        } catch (IllegalArgumentException e) {
            return errorBody("No se pudo cambiar el plan", e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    /** Registra el pago (simulado) del período: extiende el vencimiento un mes. */
    @PostMapping("/pagar")
    public ResponseEntity<?> pagar() {
        Integer negocioId = negocioIdActual();
        if (negocioId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No autenticado");
        }
        try {
            Suscripcion s = gestionarSuscripcion.pagar(negocioId);
            return ResponseEntity.ok(mapSuscripcion(s));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return errorBody("No se pudo procesar el pago", e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    /** Panel del ADMIN de la plataforma: todas las suscripciones. */
    @GetMapping("/admin/todas")
    public ResponseEntity<List<SuscripcionResponse>> listarTodas() {
        List<SuscripcionResponse> todas = gestionarSuscripcion.listarTodas().stream()
                .map(this::mapSuscripcion)
                .toList();
        return ResponseEntity.ok(todas);
    }

    // --- helpers ---

    private Integer negocioIdActual() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if (email == null || "anonymousUser".equals(email)) {
            return null;
        }
        Usuario usuario = autenticacion.obtenerPerfilPorEmail(email);
        return usuario.getNegocioId();
    }

    private PlanSuscripcionResponse mapPlan(PlanSuscripcion p) {
        return PlanSuscripcionResponse.builder()
                .id(p.getId())
                .nombre(p.getNombre())
                .precioMensual(p.getPrecioMensual())
                .maxPlatos(p.getMaxPlatos())
                .maxClientes(p.getMaxClientes())
                .build();
    }

    private SuscripcionResponse mapSuscripcion(Suscripcion s) {
        LocalDate hoy = LocalDate.now();
        return SuscripcionResponse.builder()
                .id(s.getId())
                .negocioId(s.getNegocioId())
                .planId(s.getPlanId())
                .planNombre(s.getPlanNombre())
                .planPrecioMensual(s.getPlanPrecioMensual())
                .estado(s.estadoVigente(hoy))
                .fechaInicio(s.getFechaInicio())
                .fechaVencimiento(s.getFechaVencimiento())
                .vigente(s.estaVigente(hoy))
                .build();
    }

    private PagoSuscripcionResponse mapPago(PagoSuscripcion p) {
        return PagoSuscripcionResponse.builder()
                .id(p.getId())
                .monto(p.getMonto())
                .fechaPago(p.getFechaPago())
                .periodoDesde(p.getPeriodoDesde())
                .periodoHasta(p.getPeriodoHasta())
                .build();
    }

    private ResponseEntity<Map<String, Object>> errorBody(String error, String message, HttpStatus status) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", error);
        body.put("message", message);
        body.put("status", status.value());
        return ResponseEntity.status(status).body(body);
    }
}
