package com.fitprep.demo.gestion_usuarios.interfaces.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterDeportistaRequest {
    private String nombres;
    private String apellidos;
    private String email;
    private String password;
    private String objetivoFitness;
    private Double requerimientoKcal;
    private Double reqProteinasG;
    private Double reqCarbohidratosG;
    private Double reqGrasasG;
}
