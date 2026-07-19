package com.fitprep.demo.insumos.infrastructure.adapter.out.persistence;

import com.fitprep.demo.insumos.domain.model.Insumo;
import com.fitprep.demo.insumos.domain.port.out.InsumoRepositoryPort;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Adaptador de salida. Implementa el puerto usando Spring Data JPA y traduce
 * con {@link InsumoMapper}.
 */
@Component
public class InsumoPersistenceAdapter implements InsumoRepositoryPort {

    private final InsumoJpaRepository jpaRepository;

    public InsumoPersistenceAdapter(InsumoJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public List<Insumo> findAll() {
        return jpaRepository.findByActivoTrueOrderByNombreAsc().stream()
                .map(InsumoMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Insumo> findById(Long id) {
        return jpaRepository.findById(id).map(InsumoMapper::toDomain);
    }

    @Override
    public Insumo save(Insumo insumo) {
        InsumoEntity saved = jpaRepository.save(InsumoMapper.toEntity(insumo));
        return InsumoMapper.toDomain(saved);
    }

    @Override
    public void delete(Insumo insumo) {
        InsumoEntity entity = InsumoMapper.toEntity(insumo);
        try {
            jpaRepository.delete(entity);
            // Fuerza el flush para detectar violaciones de FK dentro de la transacción.
            jpaRepository.flush();
        } catch (DataIntegrityViolationException e) {
            // Si el insumo está usado en alguna receta, se desactiva en lugar de borrarse.
            entity.setActivo(false);
            jpaRepository.save(entity);
        }
    }
}
