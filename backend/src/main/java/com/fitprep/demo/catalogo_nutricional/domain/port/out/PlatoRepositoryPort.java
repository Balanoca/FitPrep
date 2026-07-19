package com.fitprep.demo.catalogo_nutricional.domain.port.out;

import com.fitprep.demo.catalogo_nutricional.domain.model.Plato;

import java.util.List;
import java.util.Optional;

/**
 * Puerto de salida (driven port). El dominio expresa qué necesita de la
 * persistencia sin conocer la tecnología que lo implementa.
 */
public interface PlatoRepositoryPort {

    List<Plato> findAll();

    /**
     * Platos disponibles de una cocina concreta, ignorando el tenant del
     * contexto. Para el catálogo público que un visitante consulta antes de
     * elegir cocina.
     */
    List<Plato> findDisponiblesByNegocioId(Integer negocioId);

    Optional<Plato> findById(Long id);

    Plato save(Plato plato);

    void delete(Plato plato);
}
