package com.fitprep.demo.planificacion_semanal.domain.model;

import com.fitprep.demo.gestion_usuarios.domain.model.Usuario;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.TenantId;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "plan_semanal")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlanSemanal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @TenantId
    @Column(name = "negocio_id", nullable = false)
    private Integer negocioId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(name = "fecha_inicio_semana", nullable = false)
    private LocalDate fechaInicioSemana;

    @Column(name = "estado_pago", nullable = false, length = 20)
    @Builder.Default
    private String estadoPago = "PENDIENTE";

    @Column(name = "monto_total", nullable = false)
    private Double montoTotal;

    @Column(name = "fecha_creacion", nullable = false)
    @Builder.Default
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    @OneToMany(mappedBy = "planSemanal", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<DetallePlan> comidas = new ArrayList<>();

    public void calcularYValidarMacros() {
        if (comidas == null || usuario == null || usuario.getRequerimientoKcal() == null) {
            return;
        }

        double totalCalorias = comidas.stream()
                .filter(c -> c.getPlato() != null)
                .mapToDouble(c -> c.getPlato().getCalorias() != null ? c.getPlato().getCalorias() * c.getCantidad() : 0.0)
                .sum();

        double limiteCalorias = usuario.getRequerimientoKcal();

        if (totalCalorias > limiteCalorias) {
            throw new ExcesoCaloriasException(String.format(
                    "El plan semanal excede el límite de calorías permitido. Límite: %.2f kcal, Consumo: %.2f kcal.",
                    limiteCalorias, totalCalorias));
        }
    }
}
