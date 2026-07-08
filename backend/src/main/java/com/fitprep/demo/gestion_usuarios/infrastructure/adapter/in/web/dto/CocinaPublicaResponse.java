package com.fitprep.demo.gestion_usuarios.infrastructure.adapter.in.web.dto;

import lombok.*;

/**
 * Vista pública mínima de una cocina (tenant), para que el deportista la elija
 * al registrarse. No expone datos sensibles como el RUC.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CocinaPublicaResponse {
    private Long id;
    private String nombreComercial;
    private String slug;
}
