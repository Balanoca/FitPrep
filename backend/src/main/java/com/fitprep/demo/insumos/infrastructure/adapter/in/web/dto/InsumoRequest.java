package com.fitprep.demo.insumos.infrastructure.adapter.in.web.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InsumoRequest {
    private String nombre;
    private String unidad;
    private Double precioUnitario;
    private Boolean activo;
}
