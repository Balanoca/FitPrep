package com.fitprep.demo.suscripciones.application.service;

import com.fitprep.demo.suscripciones.domain.model.PagoSuscripcion;
import com.fitprep.demo.suscripciones.domain.model.PlanSuscripcion;
import com.fitprep.demo.suscripciones.domain.model.Suscripcion;
import com.fitprep.demo.suscripciones.domain.port.in.GestionarSuscripcionUseCase;
import com.fitprep.demo.suscripciones.domain.port.out.PlanSuscripcionRepositoryPort;
import com.fitprep.demo.suscripciones.domain.port.out.SuscripcionRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Implementación de los casos de uso de suscripción. El cobro es simulado: al
 * pagar se registra un {@link PagoSuscripcion} y se extiende el vencimiento.
 */
@Service
@Transactional(readOnly = true)
public class SuscripcionService implements GestionarSuscripcionUseCase {

    private final SuscripcionRepositoryPort suscripcionRepository;
    private final PlanSuscripcionRepositoryPort planRepository;

    public SuscripcionService(SuscripcionRepositoryPort suscripcionRepository,
                              PlanSuscripcionRepositoryPort planRepository) {
        this.suscripcionRepository = suscripcionRepository;
        this.planRepository = planRepository;
    }

    @Override
    public List<PlanSuscripcion> listarPlanes() {
        return planRepository.findAllActivos();
    }

    /** Días de prueba gratis para un negocio recién registrado. */
    private static final int DIAS_PRUEBA = 14;

    @Override
    @Transactional
    public Suscripcion obtenerSuscripcion(Integer negocioId) {
        return suscripcionRepository.findByNegocioId(negocioId)
                .orElseGet(() -> crearSuscripcionPrueba(negocioId));
    }

    /**
     * Crea una suscripción de PRUEBA para un negocio que aún no tiene (p. ej.
     * recién registrado): plan más barato, vigente unos días. Evita acoplar el
     * registro de negocios con este contexto.
     */
    private Suscripcion crearSuscripcionPrueba(Integer negocioId) {
        PlanSuscripcion plan = planRepository.findAllActivos().stream().findFirst()
                .orElseThrow(() -> new IllegalStateException("No hay planes de suscripción configurados."));
        LocalDate hoy = LocalDate.now();
        Suscripcion nueva = Suscripcion.builder()
                .negocioId(negocioId)
                .planId(plan.getId())
                .estado(Suscripcion.PRUEBA)
                .fechaInicio(hoy)
                .fechaVencimiento(hoy.plusDays(DIAS_PRUEBA))
                .build();
        return suscripcionRepository.save(nueva);
    }

    @Override
    public List<PagoSuscripcion> historialPagos(Integer negocioId) {
        Suscripcion s = obtenerSuscripcion(negocioId);
        return suscripcionRepository.findPagosBySuscripcionId(s.getId());
    }

    @Override
    @Transactional
    public Suscripcion suscribir(Integer negocioId, Long planId) {
        PlanSuscripcion plan = planRepository.findById(planId)
                .orElseThrow(() -> new IllegalArgumentException("El plan seleccionado no existe."));
        if (Boolean.FALSE.equals(plan.getActivo())) {
            throw new IllegalArgumentException("El plan seleccionado no está disponible.");
        }

        Suscripcion suscripcion = obtenerSuscripcion(negocioId);

        suscripcion.cambiarPlan(planId);
        return suscripcionRepository.save(suscripcion);
    }

    @Override
    @Transactional
    public Suscripcion pagar(Integer negocioId) {
        Suscripcion suscripcion = obtenerSuscripcion(negocioId);

        PlanSuscripcion plan = planRepository.findById(suscripcion.getPlanId())
                .orElseThrow(() -> new IllegalArgumentException("El plan de la suscripción no existe."));

        // Regla de dominio: extiende el vencimiento un mes y activa.
        Suscripcion.Periodo periodo = suscripcion.renovarUnMes(LocalDate.now());
        Suscripcion guardada = suscripcionRepository.save(suscripcion);

        // Registra el pago simulado que cubre ese período.
        PagoSuscripcion pago = PagoSuscripcion.builder()
                .suscripcionId(guardada.getId())
                .monto(plan.getPrecioMensual())
                .fechaPago(LocalDateTime.now())
                .periodoDesde(periodo.desde())
                .periodoHasta(periodo.hasta())
                .build();
        suscripcionRepository.savePago(pago);

        return guardada;
    }

    @Override
    public List<Suscripcion> listarTodas() {
        return suscripcionRepository.findAll();
    }
}
