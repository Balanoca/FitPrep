package com.fitprep.demo.gestion_usuarios.infrastructure.adapter.in.web.dto;

import lombok.*;

/** Usuario para el panel del ADMIN: incluye rol y negocio. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioAdminResponse {
    private Long id;
    private Integer negocioId;
    private String nombres;
    private String apellidos;
    private String email;
    private String rol;
    private String objetivoFitness;
}
