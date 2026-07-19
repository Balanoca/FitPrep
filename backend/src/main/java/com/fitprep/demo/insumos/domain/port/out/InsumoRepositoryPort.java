package com.fitprep.demo.insumos.domain.port.out;

import com.fitprep.demo.insumos.domain.model.Insumo;

import java.util.List;
import java.util.Optional;

/**
 * Puerto de salida para la persistencia de insumos.
 */
public interface InsumoRepositoryPort {

    List<Insumo> findAll();

    Optional<Insumo> findById(Long id);

    Insumo save(Insumo insumo);

    void delete(Insumo insumo);
}
