package com.fitprep.demo.gestion_usuarios.infrastructure.adapter.in.web.dto;

import lombok.*;

/** Cambio de cocina del deportista autenticado (PUT /auth/mi-cocina). */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CambiarCocinaRequest {
    private Integer negocioId;
}
