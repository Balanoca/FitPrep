package com.fitprep.demo.catalogo_nutricional.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio Spring Data sobre la entidad JPA. Detalle de infraestructura.
 */
interface PlatoJpaRepository extends JpaRepository<PlatoEntity, Long> {
}
