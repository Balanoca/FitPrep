package com.fitprep.demo.gestion_usuarios.domain.port.in;

import com.fitprep.demo.gestion_usuarios.domain.model.Negocio;

/**
 * Puerto de entrada: gestión del propio negocio (tenant).
 */
public interface GestionarNegocioUseCase {

    /** Obtiene el negocio por su id. */
    Negocio obtenerNegocio(Long negocioId);

    /** Actualiza los datos editables del negocio (nombre comercial, teléfono). */
    Negocio actualizarNegocio(Long negocioId, ActualizarNegocioCommand command);

    /** Datos editables del negocio. */
    record ActualizarNegocioCommand(
            String nombreComercial,
            String telefono
    ) {
    }
}
