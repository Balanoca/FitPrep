package com.fitprep.demo.insumos.infrastructure.adapter.in.web;

import com.fitprep.demo.insumos.domain.model.ItemReceta;
import com.fitprep.demo.insumos.domain.port.in.GestionarRecetaUseCase;
import com.fitprep.demo.insumos.domain.port.in.GestionarRecetaUseCase.LineaRecetaCommand;
import com.fitprep.demo.insumos.infrastructure.adapter.in.web.dto.RecetaItemResponse;
import com.fitprep.demo.insumos.infrastructure.adapter.in.web.dto.RecetaRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Adaptador de entrada HTTP para la receta de un plato. Se monta bajo el plato
 * porque la receta pertenece a un plato concreto.
 */
@RestController
@RequestMapping("/api/v1/platos/{platoId}/receta")
public class RecetaController {

    private final GestionarRecetaUseCase gestionarReceta;

    public RecetaController(GestionarRecetaUseCase gestionarReceta) {
        this.gestionarReceta = gestionarReceta;
    }

    @GetMapping
    public ResponseEntity<List<RecetaItemResponse>> obtener(@PathVariable Long platoId) {
        List<RecetaItemResponse> response = gestionarReceta.obtenerReceta(platoId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<?> reemplazar(@PathVariable Long platoId, @RequestBody RecetaRequest request) {
        try {
            List<LineaRecetaCommand> lineas = request.getLineas() == null ? List.of()
                    : request.getLineas().stream()
                    .map(l -> new LineaRecetaCommand(l.getInsumoId(), l.getCantidad()))
                    .collect(Collectors.toList());

            List<RecetaItemResponse> response = gestionarReceta.reemplazarReceta(platoId, lineas).stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private RecetaItemResponse mapToResponse(ItemReceta i) {
        return RecetaItemResponse.builder()
                .id(i.getId())
                .insumoId(i.getInsumoId())
                .insumoNombre(i.getInsumoNombre())
                .insumoUnidad(i.getInsumoUnidad())
                .cantidad(i.getCantidad())
                .build();
    }
}
