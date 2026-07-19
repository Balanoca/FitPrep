package com.fitprep.demo.gestion_usuarios.domain.port.out;

import com.fitprep.demo.gestion_usuarios.domain.model.Negocio;
import com.fitprep.demo.gestion_usuarios.domain.model.NegocioResumen;

import java.util.List;
import java.util.Optional;

/**
 * Puerto de salida para la persistencia de negocios (tenants).
 */
public interface NegocioRepositoryPort {

    Optional<Negocio> findById(Long id);

    Optional<Negocio> findBySlug(String slug);

    /** Todas las cocinas en estado ACTIVO, para el catálogo público de selección. */
    List<Negocio> findAllActivos();

    /** Todos los negocios con conteos de deportistas y platos (panel ADMIN). */
    List<NegocioResumen> findAllResumen();

    Negocio save(Negocio negocio);
}
