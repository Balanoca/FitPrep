package com.fitprep.demo.insumos.domain.model;

/**
 * Modelo de dominio puro. Una línea de la receta de un plato: qué insumo y
 * cuánta cantidad (en la unidad del insumo) lleva UNA unidad del plato.
 */
public class ItemReceta {

    private Long id;
    private Integer negocioId;
    private Long platoId;
    private Long insumoId;
    private Double cantidad;

    // Datos del insumo, útiles para presentar la receta y calcular compras sin otra consulta.
    private String insumoNombre;
    private String insumoUnidad;
    private Double insumoPrecioUnitario;

    public ItemReceta() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getNegocioId() { return negocioId; }
    public void setNegocioId(Integer negocioId) { this.negocioId = negocioId; }

    public Long getPlatoId() { return platoId; }
    public void setPlatoId(Long platoId) { this.platoId = platoId; }

    public Long getInsumoId() { return insumoId; }
    public void setInsumoId(Long insumoId) { this.insumoId = insumoId; }

    public Double getCantidad() { return cantidad; }
    public void setCantidad(Double cantidad) { this.cantidad = cantidad; }

    public String getInsumoNombre() { return insumoNombre; }
    public void setInsumoNombre(String insumoNombre) { this.insumoNombre = insumoNombre; }

    public String getInsumoUnidad() { return insumoUnidad; }
    public void setInsumoUnidad(String insumoUnidad) { this.insumoUnidad = insumoUnidad; }

    public Double getInsumoPrecioUnitario() { return insumoPrecioUnitario; }
    public void setInsumoPrecioUnitario(Double insumoPrecioUnitario) { this.insumoPrecioUnitario = insumoPrecioUnitario; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final ItemReceta r = new ItemReceta();
        public Builder id(Long v) { r.id = v; return this; }
        public Builder negocioId(Integer v) { r.negocioId = v; return this; }
        public Builder platoId(Long v) { r.platoId = v; return this; }
        public Builder insumoId(Long v) { r.insumoId = v; return this; }
        public Builder cantidad(Double v) { r.cantidad = v; return this; }
        public Builder insumoNombre(String v) { r.insumoNombre = v; return this; }
        public Builder insumoUnidad(String v) { r.insumoUnidad = v; return this; }
        public Builder insumoPrecioUnitario(Double v) { r.insumoPrecioUnitario = v; return this; }
        public ItemReceta build() { return r; }
    }
}
