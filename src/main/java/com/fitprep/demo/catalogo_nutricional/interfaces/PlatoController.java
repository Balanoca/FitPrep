package com.fitprep.demo.catalogo_nutricional.interfaces;

import com.fitprep.demo.catalogo_nutricional.application.PlatoService;
import com.fitprep.demo.catalogo_nutricional.domain.model.Plato;
import com.fitprep.demo.catalogo_nutricional.interfaces.dto.PlatoRequest;
import com.fitprep.demo.catalogo_nutricional.interfaces.dto.PlatoResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/platos")
public class PlatoController {

    private final PlatoService platoService;

    public PlatoController(PlatoService platoService) {
        this.platoService = platoService;
    }

    @GetMapping
    public ResponseEntity<List<PlatoResponse>> listarPlatos() {
        List<PlatoResponse> response = platoService.listarTodos().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlatoResponse> obtenerPlato(@PathVariable Long id) {
        return platoService.obtenerPorId(id)
                .map(plato -> ResponseEntity.ok(mapToResponse(plato)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<PlatoResponse> crearPlato(@RequestBody PlatoRequest request) {
        Plato nuevoPlato = Plato.builder()
                .nombre(request.getNombre())
                .descripcion(request.getDescripcion())
                .precio(request.getPrecio())
                .calorias(request.getCalorias())
                .proteinas(request.getProteinas())
                .carbohidratos(request.getCarbohidratos())
                .grasas(request.getGrasas())
                .disponible(request.getDisponible() != null ? request.getDisponible() : true)
                .build();

        Plato guardado = platoService.guardar(nuevoPlato);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponse(guardado));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarPlato(@PathVariable Long id, @RequestBody PlatoRequest request) {
        try {
            Plato datosNuevos = Plato.builder()
                    .nombre(request.getNombre())
                    .descripcion(request.getDescripcion())
                    .precio(request.getPrecio())
                    .calorias(request.getCalorias())
                    .proteinas(request.getProteinas())
                    .carbohidratos(request.getCarbohidratos())
                    .grasas(request.getGrasas())
                    .disponible(request.getDisponible() != null ? request.getDisponible() : true)
                    .build();

            Plato actualizado = platoService.actualizar(id, datosNuevos);
            return ResponseEntity.ok(mapToResponse(actualizado));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarPlato(@PathVariable Long id) {
        try {
            platoService.eliminar(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private PlatoResponse mapToResponse(Plato plato) {
        return PlatoResponse.builder()
                .id(plato.getId())
                .negocioId(plato.getNegocioId())
                .nombre(plato.getNombre())
                .descripcion(plato.getDescripcion())
                .precio(plato.getPrecio())
                .calorias(plato.getCalorias())
                .proteinas(plato.getProteinas())
                .carbohidratos(plato.getCarbohidratos())
                .grasas(plato.getGrasas())
                .disponible(plato.getDisponible())
                .build();
    }
}
