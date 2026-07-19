package com.fitprep.demo.insumos.infrastructure.adapter.in.web;

import com.fitprep.demo.insumos.domain.model.Insumo;
import com.fitprep.demo.insumos.domain.port.in.GestionarInsumoUseCase;
import com.fitprep.demo.insumos.infrastructure.adapter.in.web.dto.InsumoRequest;
import com.fitprep.demo.insumos.infrastructure.adapter.in.web.dto.InsumoResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Adaptador de entrada HTTP para el catálogo de insumos de la cocina.
 */
@RestController
@RequestMapping("/api/v1/insumos")
public class InsumoController {

    private final GestionarInsumoUseCase gestionarInsumo;

    public InsumoController(GestionarInsumoUseCase gestionarInsumo) {
        this.gestionarInsumo = gestionarInsumo;
    }

    @GetMapping
    public ResponseEntity<List<InsumoResponse>> listar() {
        List<InsumoResponse> response = gestionarInsumo.listarTodos().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InsumoResponse> obtener(@PathVariable Long id) {
        return gestionarInsumo.obtenerPorId(id)
                .map(i -> ResponseEntity.ok(mapToResponse(i)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody InsumoRequest request) {
        try {
            Insumo guardado = gestionarInsumo.guardar(mapToDomain(request));
            return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponse(guardado));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody InsumoRequest request) {
        try {
            Insumo actualizado = gestionarInsumo.actualizar(id, mapToDomain(request));
            return ResponseEntity.ok(mapToResponse(actualizado));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            gestionarInsumo.eliminar(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private Insumo mapToDomain(InsumoRequest r) {
        return Insumo.builder()
                .nombre(r.getNombre())
                .unidad(r.getUnidad())
                .precioUnitario(r.getPrecioUnitario())
                .activo(r.getActivo() != null ? r.getActivo() : true)
                .build();
    }

    private InsumoResponse mapToResponse(Insumo i) {
        return InsumoResponse.builder()
                .id(i.getId())
                .negocioId(i.getNegocioId())
                .nombre(i.getNombre())
                .unidad(i.getUnidad())
                .precioUnitario(i.getPrecioUnitario())
                .activo(i.getActivo())
                .build();
    }
}
