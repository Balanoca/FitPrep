package com.fitprep.demo.logistica_cocina.domain.model;

/**
 * Modelo de dominio puro. Línea de la lista de compra: cuánto de un insumo hay
 * que comprar para cubrir todos los pedidos de la semana.
 */
public class ItemCompraInsumo {

    private Long insumoId;
    private String insumoNombre;
    private String unidad;
    private double cantidadTotal;
    private Double precioUnitario;

    public ItemCompraInsumo(Long insumoId, String insumoNombre, String unidad, Double precioUnitario) {
        this.insumoId = insumoId;
        this.insumoNombre = insumoNombre;
        this.unidad = unidad;
        this.precioUnitario = precioUnitario;
        this.cantidadTotal = 0.0;
    }

    public void acumular(double cantidad) {
        this.cantidadTotal += cantidad;
    }

    /** Costo estimado de comprar la cantidad total (null si el insumo no tiene precio). */
    public Double getCostoEstimado() {
        if (precioUnitario == null) {
            return null;
        }
        return precioUnitario * cantidadTotal;
    }

    public Long getInsumoId() { return insumoId; }
    public String getInsumoNombre() { return insumoNombre; }
    public String getUnidad() { return unidad; }
    public double getCantidadTotal() { return cantidadTotal; }
    public Double getPrecioUnitario() { return precioUnitario; }
}
