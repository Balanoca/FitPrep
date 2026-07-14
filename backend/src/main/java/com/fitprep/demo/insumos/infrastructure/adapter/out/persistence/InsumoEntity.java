package com.fitprep.demo.insumos.infrastructure.adapter.out.persistence;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.TenantId;

/**
 * Entidad JPA del insumo. Vive en infraestructura, separada del modelo de
 * dominio {@code Insumo}. Multi-tenant por {@code @TenantId}.
 */
@Entity
@Table(name = "insumo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InsumoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @TenantId
    @Column(name = "negocio_id", nullable = false)
    private Integer negocioId;

    @Column(name = "nombre", nullable = false, length = 120)
    private String nombre;

    @Column(name = "unidad", nullable = false, length = 20)
    private String unidad;

    @Column(name = "precio_unitario")
    private Double precioUnitario;

    @Column(name = "activo", nullable = false)
    @Builder.Default
    private Boolean activo = true;
}
