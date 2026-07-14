package com.fitprep.demo.suscripciones.infrastructure.adapter.out.persistence;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

/**
 * Entidad JPA de la suscripción de un negocio. Referencia al negocio (tenant)
 * por negocio_id, pero NO lleva {@code @TenantId}: es un registro sobre el
 * tenant, no dentro de él (igual que la tabla negocio).
 */
@Entity
@Table(name = "suscripcion")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SuscripcionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "negocio_id", nullable = false, unique = true)
    private Integer negocioId;

    @Column(name = "plan_id", nullable = false)
    private Long planId;

    @Column(name = "estado", nullable = false, length = 20)
    @Builder.Default
    private String estado = "PRUEBA";

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;

    @Column(name = "fecha_vencimiento", nullable = false)
    private LocalDate fechaVencimiento;
}
