package com.fitprep.demo.insumos.domain.port.in;

import com.fitprep.demo.insumos.domain.model.Insumo;

import java.util.List;
import java.util.Optional;

/**
 * Puerto de entrada: casos de uso del catálogo de insumos de la cocina.
 */
public interface GestionarInsumoUseCase {

    List<Insumo> listarTodos();

    Optional<Insumo> obtenerPorId(Long id);

    Insumo guardar(Insumo insumo);

    Insumo actualizar(Long id, Insumo datosNuevos);

    void eliminar(Long id);
}
