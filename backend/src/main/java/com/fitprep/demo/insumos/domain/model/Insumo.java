package com.fitprep.demo.insumos.domain.model;

/**
 * Modelo de dominio puro del insumo (ingrediente) de una cocina. No conoce JPA
 * ni Spring. Encapsula las reglas de negocio del insumo.
 */
public class Insumo {

    private Long id;
    private Integer negocioId;
    private String nombre;
    private String unidad;
    private Double precioUnitario;
    private Boolean activo;

    public Insumo() {
        this.activo = true;
    }

    /**
     * Regla de negocio: aplica los datos nuevos preservando identidad y tenant.
     * El nombre y la unidad son obligatorios.
     */
    public void actualizarDatos(Insumo datosNuevos) {
        validar(datosNuevos.nombre, datosNuevos.unidad);
        this.nombre = datosNuevos.nombre.trim();
        this.unidad = datosNuevos.unidad.trim();
        this.precioUnitario = datosNuevos.precioUnitario;
        this.activo = datosNuevos.activo != null ? datosNuevos.activo : true;
    }

    /** Regla de negocio: desactivar en lugar de eliminar (si está en recetas). */
    public void desactivar() {
        this.activo = false;
    }

    public void validarParaAlta() {
        validar(this.nombre, this.unidad);
    }

    private static void validar(String nombre, String unidad) {
        if (nombre == null || nombre.isBlank()) {
            throw new IllegalArgumentException("El nombre del insumo es obligatorio.");
        }
        if (unidad == null || unidad.isBlank()) {
            throw new IllegalArgumentException("La unidad del insumo es obligatoria.");
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getNegocioId() { return negocioId; }
    public void setNegocioId(Integer negocioId) { this.negocioId = negocioId; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getUnidad() { return unidad; }
    public void setUnidad(String unidad) { this.unidad = unidad; }

    public Double getPrecioUnitario() { return precioUnitario; }
    public void setPrecioUnitario(Double precioUnitario) { this.precioUnitario = precioUnitario; }

    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final Insumo i = new Insumo();
        public Builder id(Long v) { i.id = v; return this; }
        public Builder negocioId(Integer v) { i.negocioId = v; return this; }
        public Builder nombre(String v) { i.nombre = v; return this; }
        public Builder unidad(String v) { i.unidad = v; return this; }
        public Builder precioUnitario(Double v) { i.precioUnitario = v; return this; }
        public Builder activo(Boolean v) { i.activo = v; return this; }
        public Insumo build() { return i; }
    }
}
