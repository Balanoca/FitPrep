package com.fitprep.demo.insumos.infrastructure.adapter.out.persistence;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.TenantId;

/**
 * Entidad JPA de una línea de receta (plato ↔ insumo). Multi-tenant por
 * {@code @TenantId}.
 */
@Entity
@Table(name = "receta")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecetaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @TenantId
    @Column(name = "negocio_id", nullable = false)
    private Integer negocioId;

    @Column(name = "plato_id", nullable = false)
    private Long platoId;

    @Column(name = "insumo_id", nullable = false)
    private Long insumoId;

    @Column(name = "cantidad", nullable = false)
    private Double cantidad;
}
