package com.fitprep.demo.suscripciones.domain.port.in;

import com.fitprep.demo.suscripciones.domain.model.PagoSuscripcion;
import com.fitprep.demo.suscripciones.domain.model.PlanSuscripcion;
import com.fitprep.demo.suscripciones.domain.model.Suscripcion;

import java.util.List;

/**
 * Puerto de entrada: casos de uso de la suscripción del negocio (tenant).
 */
public interface GestionarSuscripcionUseCase {

    /** Catálogo de planes disponibles. */
    List<PlanSuscripcion> listarPlanes();

    /** Suscripción del negocio (con datos del plan resueltos). */
    Suscripcion obtenerSuscripcion(Integer negocioId);

    /** Historial de pagos de la suscripción del negocio. */
    List<PagoSuscripcion> historialPagos(Integer negocioId);

    /** Elige o cambia el plan de la suscripción del negocio. */
    Suscripcion suscribir(Integer negocioId, Long planId);

    /** Registra el pago de un mes (simulado): extiende el vencimiento y activa. */
    Suscripcion pagar(Integer negocioId);

    /** Todas las suscripciones (para el panel del ADMIN de la plataforma). */
    List<Suscripcion> listarTodas();
}
