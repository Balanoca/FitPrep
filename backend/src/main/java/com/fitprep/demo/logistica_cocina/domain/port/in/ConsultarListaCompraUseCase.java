package com.fitprep.demo.logistica_cocina.domain.port.in;

import com.fitprep.demo.logistica_cocina.domain.model.ItemCompraInsumo;

import java.time.LocalDate;
import java.util.List;

/**
 * Puerto de entrada: lista de compra de insumos consolidada para una semana.
 */
public interface ConsultarListaCompraUseCase {

    List<ItemCompraInsumo> obtenerListaCompra(LocalDate fechaSemana);
}
