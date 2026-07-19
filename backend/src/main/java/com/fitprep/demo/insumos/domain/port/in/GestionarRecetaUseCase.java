package com.fitprep.demo.insumos.domain.port.in;

import com.fitprep.demo.insumos.domain.model.ItemReceta;

import java.util.List;

/**
 * Puerto de entrada: gestión de la receta de un plato (sus insumos y cantidades).
 */
public interface GestionarRecetaUseCase {

    /** Receta actual del plato (líneas insumo + cantidad). */
    List<ItemReceta> obtenerReceta(Long platoId);

    /**
     * Reemplaza por completo la receta de un plato por las líneas dadas.
     * Cada línea es un par insumoId + cantidad.
     */
    List<ItemReceta> reemplazarReceta(Long platoId, List<LineaRecetaCommand> lineas);

    /** Dato mínimo para definir una línea de receta, sin acoplar a DTOs web. */
    record LineaRecetaCommand(Long insumoId, Double cantidad) {
    }
}
