package com.fitprep.demo.insumos.application.service;

import com.fitprep.demo.insumos.domain.model.ItemReceta;
import com.fitprep.demo.insumos.domain.port.in.GestionarRecetaUseCase;
import com.fitprep.demo.insumos.domain.port.out.InsumoRepositoryPort;
import com.fitprep.demo.insumos.domain.port.out.RecetaRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * Implementación del caso de uso de recetas. Reemplaza la receta de un plato de
 * forma atómica (borra e inserta). El negocio_id lo estampa Hibernate vía
 * {@code @TenantId}, así que aquí no se maneja el tenant a mano.
 */
@Service
@Transactional(readOnly = true)
public class RecetaService implements GestionarRecetaUseCase {

    private final RecetaRepositoryPort recetaRepository;
    private final InsumoRepositoryPort insumoRepository;

    public RecetaService(RecetaRepositoryPort recetaRepository,
                         InsumoRepositoryPort insumoRepository) {
        this.recetaRepository = recetaRepository;
        this.insumoRepository = insumoRepository;
    }

    @Override
    public List<ItemReceta> obtenerReceta(Long platoId) {
        return recetaRepository.findByPlatoId(platoId);
    }

    @Override
    @Transactional
    public List<ItemReceta> reemplazarReceta(Long platoId, List<LineaRecetaCommand> lineas) {
        recetaRepository.deleteByPlatoId(platoId);

        if (lineas == null || lineas.isEmpty()) {
            return List.of();
        }

        List<ItemReceta> guardadas = new ArrayList<>();
        for (LineaRecetaCommand linea : lineas) {
            if (linea.insumoId() == null || linea.cantidad() == null) {
                throw new IllegalArgumentException("Cada línea de receta requiere insumo y cantidad.");
            }
            if (linea.cantidad() <= 0) {
                throw new IllegalArgumentException("La cantidad de un insumo debe ser mayor que cero.");
            }
            // Valida que el insumo exista y sea de esta cocina (Hibernate lo filtra por tenant).
            insumoRepository.findById(linea.insumoId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Insumo no encontrado con ID: " + linea.insumoId()));

            ItemReceta item = ItemReceta.builder()
                    .platoId(platoId)
                    .insumoId(linea.insumoId())
                    .cantidad(linea.cantidad())
                    .build();
            guardadas.add(recetaRepository.save(item));
        }
        return recetaRepository.findByPlatoId(platoId);
    }
}
