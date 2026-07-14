package com.fitprep.demo.suscripciones.infrastructure.adapter.in.web.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PagoSuscripcionResponse {
    private Long id;
    private Double monto;
    private LocalDateTime fechaPago;
    private LocalDate periodoDesde;
    private LocalDate periodoHasta;
}
