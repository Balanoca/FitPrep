package com.fitprep.demo.gestion_usuarios.domain.model;

import java.time.LocalDateTime;

/**
 * Modelo de dominio puro. Resumen de un negocio para el panel del ADMIN de la
 * plataforma: datos del negocio + conteos globales (deportistas, platos).
 */
public class NegocioResumen {

    private Long id;
    private String nombreComercial;
    private String slug;
    private String estado;
    private LocalDateTime fechaRegistro;
    private long totalDeportistas;
    private long totalPlatos;

    public NegocioResumen(Long id, String nombreComercial, String slug, String estado,
                          LocalDateTime fechaRegistro, long totalDeportistas, long totalPlatos) {
        this.id = id;
        this.nombreComercial = nombreComercial;
        this.slug = slug;
        this.estado = estado;
        this.fechaRegistro = fechaRegistro;
        this.totalDeportistas = totalDeportistas;
        this.totalPlatos = totalPlatos;
    }

    public Long getId() { return id; }
    public String getNombreComercial() { return nombreComercial; }
    public String getSlug() { return slug; }
    public String getEstado() { return estado; }
    public LocalDateTime getFechaRegistro() { return fechaRegistro; }
    public long getTotalDeportistas() { return totalDeportistas; }
    public long getTotalPlatos() { return totalPlatos; }
}
