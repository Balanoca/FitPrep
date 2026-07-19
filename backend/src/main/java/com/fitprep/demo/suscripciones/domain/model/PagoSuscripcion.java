package com.fitprep.demo.suscripciones.domain.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Modelo de dominio puro. Un pago (simulado) de la suscripción, con el período
 * que cubre.
 */
public class PagoSuscripcion {

    private Long id;
    private Long suscripcionId;
    private Double monto;
    private LocalDateTime fechaPago;
    private LocalDate periodoDesde;
    private LocalDate periodoHasta;

    public PagoSuscripcion() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSuscripcionId() { return suscripcionId; }
    public void setSuscripcionId(Long suscripcionId) { this.suscripcionId = suscripcionId; }

    public Double getMonto() { return monto; }
    public void setMonto(Double monto) { this.monto = monto; }

    public LocalDateTime getFechaPago() { return fechaPago; }
    public void setFechaPago(LocalDateTime fechaPago) { this.fechaPago = fechaPago; }

    public LocalDate getPeriodoDesde() { return periodoDesde; }
    public void setPeriodoDesde(LocalDate periodoDesde) { this.periodoDesde = periodoDesde; }

    public LocalDate getPeriodoHasta() { return periodoHasta; }
    public void setPeriodoHasta(LocalDate periodoHasta) { this.periodoHasta = periodoHasta; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final PagoSuscripcion p = new PagoSuscripcion();
        public Builder id(Long v) { p.id = v; return this; }
        public Builder suscripcionId(Long v) { p.suscripcionId = v; return this; }
        public Builder monto(Double v) { p.monto = v; return this; }
        public Builder fechaPago(LocalDateTime v) { p.fechaPago = v; return this; }
        public Builder periodoDesde(LocalDate v) { p.periodoDesde = v; return this; }
        public Builder periodoHasta(LocalDate v) { p.periodoHasta = v; return this; }
        public PagoSuscripcion build() { return p; }
    }
}
