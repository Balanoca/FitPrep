package com.fitprep.demo.suscripciones.infrastructure.adapter.in.web.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SuscripcionResponse {
    private Long id;
    private Integer negocioId;
    private Long planId;
    private String planNombre;
    private Double planPrecioMensual;
    /** Estado efectivo hoy (VENCIDA si ya pasó el vencimiento). */
    private String estado;
    private LocalDate fechaInicio;
    private LocalDate fechaVencimiento;
    private boolean vigente;
}
