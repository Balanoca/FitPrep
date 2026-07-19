package com.fitprep.demo.insumos.application.service;

import com.fitprep.demo.insumos.domain.model.Insumo;
import com.fitprep.demo.insumos.domain.port.in.GestionarInsumoUseCase;
import com.fitprep.demo.insumos.domain.port.out.InsumoRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Implementación del caso de uso del catálogo de insumos. Depende solo del
 * puerto de salida.
 */
@Service
@Transactional(readOnly = true)
public class InsumoService implements GestionarInsumoUseCase {

    private final InsumoRepositoryPort insumoRepository;

    public InsumoService(InsumoRepositoryPort insumoRepository) {
        this.insumoRepository = insumoRepository;
    }

    @Override
    public List<Insumo> listarTodos() {
        return insumoRepository.findAll();
    }

    @Override
    public Optional<Insumo> obtenerPorId(Long id) {
        return insumoRepository.findById(id);
    }

    @Override
    @Transactional
    public Insumo guardar(Insumo insumo) {
        insumo.validarParaAlta();
        return insumoRepository.save(insumo);
    }

    @Override
    @Transactional
    public Insumo actualizar(Long id, Insumo datosNuevos) {
        Insumo existente = insumoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Insumo no encontrado con ID: " + id));

        existente.actualizarDatos(datosNuevos);

        return insumoRepository.save(existente);
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        Insumo insumo = insumoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Insumo no encontrado con ID: " + id));

        insumoRepository.delete(insumo);
    }
}
