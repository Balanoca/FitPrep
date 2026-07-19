package com.fitprep.demo.logistica_cocina.infrastructure.adapter.in.web;

import com.fitprep.demo.logistica_cocina.domain.model.ItemCompraInsumo;
import com.fitprep.demo.logistica_cocina.domain.model.ReporteProduccionItem;
import com.fitprep.demo.logistica_cocina.domain.port.in.ConsultarListaCompraUseCase;
import com.fitprep.demo.logistica_cocina.domain.port.in.ConsultarProduccionUseCase;
import com.fitprep.demo.logistica_cocina.infrastructure.adapter.in.web.dto.ListaCompraItemResponse;
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
    private final ConsultarListaCompraUseCase consultarListaCompra;

    public LogisticaController(ConsultarProduccionUseCase consultarProduccion,
                               ConsultarListaCompraUseCase consultarListaCompra) {
        this.consultarProduccion = consultarProduccion;
        this.consultarListaCompra = consultarListaCompra;
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

    @GetMapping("/insumos")
    public ResponseEntity<List<ListaCompraItemResponse>> obtenerListaCompra(
            @RequestParam("fechaSemana") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaSemana) {
        if (fechaSemana == null) {
            return ResponseEntity.badRequest().build();
        }

        List<ListaCompraItemResponse> lista = consultarListaCompra.obtenerListaCompra(fechaSemana).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(lista);
    }

    private ListaCompraItemResponse mapToResponse(ItemCompraInsumo item) {
        return ListaCompraItemResponse.builder()
                .insumoId(item.getInsumoId())
                .insumoNombre(item.getInsumoNombre())
                .unidad(item.getUnidad())
                .cantidadTotal(item.getCantidadTotal())
                .precioUnitario(item.getPrecioUnitario())
                .costoEstimado(item.getCostoEstimado())
                .build();
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
