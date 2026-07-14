package com.fitprep.demo.insumos.domain.port.out;

import com.fitprep.demo.insumos.domain.model.ItemReceta;

import java.util.List;

/**
 * Puerto de salida para la persistencia de recetas (plato ↔ insumos).
 */
public interface RecetaRepositoryPort {

    /** Líneas de receta de un plato, con nombre y unidad del insumo resueltos. */
    List<ItemReceta> findByPlatoId(Long platoId);

    /** Elimina todas las líneas de receta de un plato. */
    void deleteByPlatoId(Long platoId);

    ItemReceta save(ItemReceta item);
}
