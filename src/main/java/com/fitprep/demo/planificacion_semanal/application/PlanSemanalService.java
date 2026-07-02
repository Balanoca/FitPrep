package com.fitprep.demo.planificacion_semanal.application;

import com.fitprep.demo.catalogo_nutricional.domain.model.Plato;
import com.fitprep.demo.catalogo_nutricional.domain.repository.PlatoRepository;
import com.fitprep.demo.gestion_usuarios.domain.model.Usuario;
import com.fitprep.demo.gestion_usuarios.domain.repository.UsuarioRepository;
import com.fitprep.demo.planificacion_semanal.domain.model.DetallePlan;
import com.fitprep.demo.planificacion_semanal.domain.model.PlanSemanal;
import com.fitprep.demo.planificacion_semanal.domain.repository.PlanSemanalRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class PlanSemanalService {

    private final PlanSemanalRepository planSemanalRepository;
    private final UsuarioRepository usuarioRepository;
    private final PlatoRepository platoRepository;

    public PlanSemanalService(PlanSemanalRepository planSemanalRepository,
                              UsuarioRepository usuarioRepository,
                              PlatoRepository platoRepository) {
        this.planSemanalRepository = planSemanalRepository;
        this.usuarioRepository = usuarioRepository;
        this.platoRepository = platoRepository;
    }

    @Transactional
    public PlanSemanal guardarPlan(PlanSemanal plan, Long usuarioId, List<DetallePlanHelper> comidasHelper) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con ID: " + usuarioId));
        plan.setUsuario(usuario);

        for (DetallePlanHelper helper : comidasHelper) {
            Plato plato = platoRepository.findById(helper.getPlatoId())
                    .orElseThrow(() -> new IllegalArgumentException("Plato no encontrado con ID: " + helper.getPlatoId()));
            
            DetallePlan detalle = DetallePlan.builder()
                    .planSemanal(plan)
                    .plato(plato)
                    .diaSemana(helper.getDiaSemana())
                    .tipoComida(helper.getTipoComida())
                    .cantidad(helper.getCantidad())
                    .build();
            
            plan.getComidas().add(detalle);
        }

        plan.calcularYValidarMacros();

        return planSemanalRepository.save(plan);
    }

    public Optional<PlanSemanal> obtenerPlanPorId(Long id) {
        return planSemanalRepository.findById(id);
    }

    public static class DetallePlanHelper {
        private final Long platoId;
        private final String diaSemana;
        private final String tipoComida;
        private final Integer cantidad;

        public DetallePlanHelper(Long platoId, String diaSemana, String tipoComida, Integer cantidad) {
            this.platoId = platoId;
            this.diaSemana = diaSemana;
            this.tipoComida = tipoComida;
            this.cantidad = cantidad;
        }

        public Long getPlatoId() { return platoId; }
        public String getDiaSemana() { return diaSemana; }
        public String getTipoComida() { return tipoComida; }
        public Integer getCantidad() { return cantidad; }
    }
}
