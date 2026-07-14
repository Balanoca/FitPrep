package com.fitprep.demo.suscripciones.infrastructure.adapter.in.web.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlanSuscripcionResponse {
    private Long id;
    private String nombre;
    private Double precioMensual;
    private Integer maxPlatos;
    private Integer maxClientes;
}
