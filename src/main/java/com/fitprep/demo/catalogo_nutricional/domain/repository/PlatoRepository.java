package com.fitprep.demo.catalogo_nutricional.domain.repository;

import com.fitprep.demo.catalogo_nutricional.domain.model.Plato;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlatoRepository extends JpaRepository<Plato, Long> {
}
