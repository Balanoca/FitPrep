package com.fitprep.demo.gestion_usuarios.interfaces.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private Long id;
    private Integer negocioId;
    private String nombres;
    private String apellidos;
    private String email;
    private String rol;
}
