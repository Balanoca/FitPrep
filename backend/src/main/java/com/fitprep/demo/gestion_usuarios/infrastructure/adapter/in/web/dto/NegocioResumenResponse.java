package com.fitprep.demo.gestion_usuarios.infrastructure.adapter.in.web.dto;

import lombok.*;

import java.time.LocalDateTime;

/** Resumen de un negocio para el panel del ADMIN. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NegocioResumenResponse {
    private Long id;
    private String nombreComercial;
    private String slug;
    private String estado;
    private LocalDateTime fechaRegistro;
    private long totalDeportistas;
    private long totalPlatos;
}
