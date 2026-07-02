package com.fitprep.demo.logistica_cocina.interfaces.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReporteProduccionItem {
    private Long platoId;
    private String platoNombre;
    private String diaSemana;
    private String tipoComida;
    private Integer cantidadTotal;
}
