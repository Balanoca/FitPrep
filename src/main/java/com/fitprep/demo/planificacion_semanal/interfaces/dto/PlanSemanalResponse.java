package com.fitprep.demo.planificacion_semanal.interfaces.dto;

import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlanSemanalResponse {
    private Long id;
    private Integer negocioId;
    private Long usuarioId;
    private LocalDate fechaInicioSemana;
    private String estadoPago;
    private Double montoTotal;
    private List<ComidaProgramadaDTO> comidas;
}
