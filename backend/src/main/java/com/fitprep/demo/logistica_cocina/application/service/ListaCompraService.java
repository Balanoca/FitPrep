package com.fitprep.demo.logistica_cocina.application.service;

import com.fitprep.demo.insumos.domain.model.ItemReceta;
import com.fitprep.demo.insumos.domain.port.out.RecetaRepositoryPort;
import com.fitprep.demo.logistica_cocina.domain.model.ItemCompraInsumo;
import com.fitprep.demo.logistica_cocina.domain.port.in.ConsultarListaCompraUseCase;
import com.fitprep.demo.planificacion_semanal.domain.model.DetallePlan;
import com.fitprep.demo.planificacion_semanal.domain.model.PlanSemanal;
import com.fitprep.demo.planificacion_semanal.domain.port.out.PlanSemanalRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Caso de uso de logística: consolida la lista de compra de insumos de la
 * semana. Recorre los pedidos producibles y, por cada plato, multiplica la
 * receta (insumo × cantidad por plato) por las unidades a cocinar.
 */
@Service
@Transactional(readOnly = true)
public class ListaCompraService implements ConsultarListaCompraUseCase {

    private static final List<String> ESTADOS_PRODUCIBLES = List.of("CONFIRMADO", "PAGADO");

    private final PlanSemanalRepositoryPort planSemanalRepository;
    private final RecetaRepositoryPort recetaRepository;

    public ListaCompraService(PlanSemanalRepositoryPort planSemanalRepository,
                              RecetaRepositoryPort recetaRepository) {
        this.planSemanalRepository = planSemanalRepository;
        this.recetaRepository = recetaRepository;
    }

    @Override
    public List<ItemCompraInsumo> obtenerListaCompra(LocalDate fechaSemana) {
        List<PlanSemanal> planes = planSemanalRepository
                .findByFechaInicioSemanaAndEstadoPagoIn(fechaSemana, ESTADOS_PRODUCIBLES);

        // Cuántas unidades de cada plato hay que cocinar en la semana.
        Map<Long, Integer> unidadesPorPlato = new HashMap<>();
        for (PlanSemanal plan : planes) {
            for (DetallePlan detalle : plan.getComidas()) {
                if (detalle.getPlato() == null || detalle.getPlato().getId() == null) {
                    continue;
                }
                int cantidad = detalle.getCantidad() != null ? detalle.getCantidad() : 1;
                unidadesPorPlato.merge(detalle.getPlato().getId(), cantidad, Integer::sum);
            }
        }

        // Por cada plato, su receta × unidades → acumular por insumo.
        Map<Long, ItemCompraInsumo> consolidado = new HashMap<>();
        for (Map.Entry<Long, Integer> entry : unidadesPorPlato.entrySet()) {
            Long platoId = entry.getKey();
            int unidades = entry.getValue();

            for (ItemReceta linea : recetaRepository.findByPlatoId(platoId)) {
                ItemCompraInsumo item = consolidado.computeIfAbsent(
                        linea.getInsumoId(),
                        k -> new ItemCompraInsumo(
                                linea.getInsumoId(),
                                linea.getInsumoNombre(),
                                linea.getInsumoUnidad(),
                                linea.getInsumoPrecioUnitario()));
                double cantidad = (linea.getCantidad() != null ? linea.getCantidad() : 0.0) * unidades;
                item.acumular(cantidad);
            }
        }

        return new ArrayList<>(consolidado.values());
    }
}
