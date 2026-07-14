package com.fitprep.demo.suscripciones.infrastructure.adapter.out.persistence;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

/** Entidad JPA de un pago (simulado) de la suscripción. Sin {@code @TenantId}. */
@Entity
@Table(name = "pago_suscripcion")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PagoSuscripcionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "suscripcion_id", nullable = false)
    private Long suscripcionId;

    @Column(name = "monto", nullable = false)
    private Double monto;

    @Column(name = "fecha_pago", nullable = false)
    private LocalDateTime fechaPago;

    @Column(name = "periodo_desde", nullable = false)
    private LocalDate periodoDesde;

    @Column(name = "periodo_hasta", nullable = false)
    private LocalDate periodoHasta;
}
