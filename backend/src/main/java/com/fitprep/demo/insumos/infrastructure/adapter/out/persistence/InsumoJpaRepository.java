package com.fitprep.demo.insumos.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

interface InsumoJpaRepository extends JpaRepository<InsumoEntity, Long> {
    List<InsumoEntity> findByActivoTrueOrderByNombreAsc();
}
