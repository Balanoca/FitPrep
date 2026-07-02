package com.fitprep.demo.catalogo_nutricional.application;

import com.fitprep.demo.catalogo_nutricional.domain.model.Plato;
import com.fitprep.demo.catalogo_nutricional.domain.repository.PlatoRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class PlatoService {

    private final PlatoRepository platoRepository;

    public PlatoService(PlatoRepository platoRepository) {
        this.platoRepository = platoRepository;
    }

    public List<Plato> listarTodos() {
        return platoRepository.findAll();
    }

    public Optional<Plato> obtenerPorId(Long id) {
        return platoRepository.findById(id);
    }

    @Transactional
    public Plato guardar(Plato plato) {
        return platoRepository.save(plato);
    }

    @Transactional
    public Plato actualizar(Long id, Plato datosNuevos) {
        Plato platoExistente = platoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Plato no encontrado con ID: " + id));

        platoExistente.setNombre(datosNuevos.getNombre());
        platoExistente.setDescripcion(datosNuevos.getDescripcion());
        platoExistente.setPrecio(datosNuevos.getPrecio());
        platoExistente.setCalorias(datosNuevos.getCalorias());
        platoExistente.setProteinas(datosNuevos.getProteinas());
        platoExistente.setCarbohidratos(datosNuevos.getCarbohidratos());
        platoExistente.setGrasas(datosNuevos.getGrasas());
        platoExistente.setDisponible(datosNuevos.getDisponible());

        return platoRepository.save(platoExistente);
    }

    @Transactional
    public void eliminar(Long id) {
        Plato plato = platoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Plato no encontrado con ID: " + id));

        try {
            platoRepository.delete(plato);
            // Flush changes immediately to catch foreign key violations early inside transaction
            platoRepository.flush();
        } catch (DataIntegrityViolationException e) {
            // Fallback: If it is linked to detailed plans, soft-delete instead of hard-delete
            plato.setDisponible(false);
            platoRepository.save(plato);
        }
    }
}
