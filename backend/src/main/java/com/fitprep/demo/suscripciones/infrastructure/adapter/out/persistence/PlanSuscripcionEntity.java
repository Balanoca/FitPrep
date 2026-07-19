package com.fitprep.demo.suscripciones.infrastructure.adapter.out.persistence;

import jakarta.persistence.*;
import lombok.*;

/**
 * Entidad JPA del plan de suscripción. Es catálogo global del SaaS, NO lleva
 * {@code @TenantId}.
 */
@Entity
@Table(name = "plan_suscripcion")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlanSuscripcionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre", nullable = false, unique = true, length = 60)
    private String nombre;

    @Column(name = "precio_mensual", nullable = false)
    private Double precioMensual;

    @Column(name = "max_platos")
    private Integer maxPlatos;

    @Column(name = "max_clientes")
    private Integer maxClientes;

    @Column(name = "activo", nullable = false)
    @Builder.Default
    private Boolean activo = true;
}
