package com.fitprep.demo.planificacion_semanal.domain.model;

import com.fitprep.demo.catalogo_nutricional.domain.model.Plato;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "detalle_plan")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DetallePlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_semanal_id", nullable = false)
    private PlanSemanal planSemanal;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "plato_id", nullable = false)
    private Plato plato;

    @Column(name = "dia_semana", nullable = false, length = 15)
    private String diaSemana;

    @Column(name = "tipo_comida", nullable = false, length = 20)
    private String tipoComida;

    @Column(name = "cantidad", nullable = false)
    @Builder.Default
    private Integer cantidad = 1;
}
