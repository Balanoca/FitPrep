package com.fitprep.demo.suscripciones.domain.model;

/**
 * Modelo de dominio puro. Un plan del catálogo de suscripción del SaaS.
 */
public class PlanSuscripcion {

    private Long id;
    private String nombre;
    private Double precioMensual;
    private Integer maxPlatos;
    private Integer maxClientes;
    private Boolean activo;

    public PlanSuscripcion() {
        this.activo = true;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public Double getPrecioMensual() { return precioMensual; }
    public void setPrecioMensual(Double precioMensual) { this.precioMensual = precioMensual; }

    public Integer getMaxPlatos() { return maxPlatos; }
    public void setMaxPlatos(Integer maxPlatos) { this.maxPlatos = maxPlatos; }

    public Integer getMaxClientes() { return maxClientes; }
    public void setMaxClientes(Integer maxClientes) { this.maxClientes = maxClientes; }

    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final PlanSuscripcion p = new PlanSuscripcion();
        public Builder id(Long v) { p.id = v; return this; }
        public Builder nombre(String v) { p.nombre = v; return this; }
        public Builder precioMensual(Double v) { p.precioMensual = v; return this; }
        public Builder maxPlatos(Integer v) { p.maxPlatos = v; return this; }
        public Builder maxClientes(Integer v) { p.maxClientes = v; return this; }
        public Builder activo(Boolean v) { p.activo = v; return this; }
        public PlanSuscripcion build() { return p; }
    }
}
