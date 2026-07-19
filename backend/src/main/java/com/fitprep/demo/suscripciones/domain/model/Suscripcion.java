package com.fitprep.demo.suscripciones.domain.model;

import java.time.LocalDate;

/**
 * Raíz de agregado de la suscripción de un negocio al SaaS. Modelo de dominio
 * puro con las reglas de estado y renovación (pago simulado).
 */
public class Suscripcion {

    /** Estados del ciclo de vida de la suscripción. */
    public static final String PRUEBA = "PRUEBA";
    public static final String ACTIVA = "ACTIVA";
    public static final String VENCIDA = "VENCIDA";
    public static final String CANCELADA = "CANCELADA";

    private Long id;
    private Integer negocioId;
    private Long planId;
    private String estado;
    private LocalDate fechaInicio;
    private LocalDate fechaVencimiento;

    // Datos del plan resueltos, útiles para presentar sin otra consulta.
    private String planNombre;
    private Double planPrecioMensual;

    public Suscripcion() {
        this.estado = PRUEBA;
    }

    /**
     * Estado efectivo hoy: si la fecha de vencimiento ya pasó y no está cancelada,
     * se considera VENCIDA aunque en BD figure ACTIVA.
     */
    public String estadoVigente(LocalDate hoy) {
        if (CANCELADA.equals(estado)) {
            return CANCELADA;
        }
        if (fechaVencimiento != null && fechaVencimiento.isBefore(hoy)) {
            return VENCIDA;
        }
        return estado;
    }

    public boolean estaVigente(LocalDate hoy) {
        String e = estadoVigente(hoy);
        return ACTIVA.equals(e) || PRUEBA.equals(e);
    }

    /**
     * Regla de negocio: cambiar de plan. Reactiva la suscripción (no la cobra:
     * el cobro es un paso aparte vía {@link #renovarUnMes}).
     */
    public void cambiarPlan(Long nuevoPlanId) {
        if (nuevoPlanId == null) {
            throw new IllegalArgumentException("Debes elegir un plan.");
        }
        if (CANCELADA.equals(this.estado)) {
            this.estado = PRUEBA;
        }
        this.planId = nuevoPlanId;
    }

    /**
     * Regla de negocio: registrar el pago de un mes. Extiende el vencimiento un
     * mes (desde hoy o desde el vencimiento vigente, lo que sea mayor) y activa
     * la suscripción. Devuelve el período cubierto [desde, hasta].
     */
    public Periodo renovarUnMes(LocalDate hoy) {
        if (CANCELADA.equals(this.estado)) {
            throw new IllegalStateException("La suscripción está cancelada. Reactívala eligiendo un plan.");
        }
        LocalDate desde = (fechaVencimiento != null && fechaVencimiento.isAfter(hoy)) ? fechaVencimiento : hoy;
        LocalDate hasta = desde.plusMonths(1);
        this.fechaVencimiento = hasta;
        this.estado = ACTIVA;
        return new Periodo(desde, hasta);
    }

    public void cancelar() {
        this.estado = CANCELADA;
    }

    public record Periodo(LocalDate desde, LocalDate hasta) {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getNegocioId() { return negocioId; }
    public void setNegocioId(Integer negocioId) { this.negocioId = negocioId; }

    public Long getPlanId() { return planId; }
    public void setPlanId(Long planId) { this.planId = planId; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public LocalDate getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDate fechaInicio) { this.fechaInicio = fechaInicio; }

    public LocalDate getFechaVencimiento() { return fechaVencimiento; }
    public void setFechaVencimiento(LocalDate fechaVencimiento) { this.fechaVencimiento = fechaVencimiento; }

    public String getPlanNombre() { return planNombre; }
    public void setPlanNombre(String planNombre) { this.planNombre = planNombre; }

    public Double getPlanPrecioMensual() { return planPrecioMensual; }
    public void setPlanPrecioMensual(Double planPrecioMensual) { this.planPrecioMensual = planPrecioMensual; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final Suscripcion s = new Suscripcion();
        public Builder id(Long v) { s.id = v; return this; }
        public Builder negocioId(Integer v) { s.negocioId = v; return this; }
        public Builder planId(Long v) { s.planId = v; return this; }
        public Builder estado(String v) { s.estado = v; return this; }
        public Builder fechaInicio(LocalDate v) { s.fechaInicio = v; return this; }
        public Builder fechaVencimiento(LocalDate v) { s.fechaVencimiento = v; return this; }
        public Builder planNombre(String v) { s.planNombre = v; return this; }
        public Builder planPrecioMensual(Double v) { s.planPrecioMensual = v; return this; }
        public Suscripcion build() { return s; }
    }
}
