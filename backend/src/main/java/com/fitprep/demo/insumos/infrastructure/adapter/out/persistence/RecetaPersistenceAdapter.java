package com.fitprep.demo.insumos.infrastructure.adapter.out.persistence;

import com.fitprep.demo.insumos.domain.model.ItemReceta;
import com.fitprep.demo.insumos.domain.port.out.RecetaRepositoryPort;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class RecetaPersistenceAdapter implements RecetaRepositoryPort {

    private final RecetaJpaRepository jpaRepository;

    public RecetaPersistenceAdapter(RecetaJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public List<ItemReceta> findByPlatoId(Long platoId) {
        return jpaRepository.findLineasByPlatoId(platoId).stream()
                .map(RecetaMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteByPlatoId(Long platoId) {
        jpaRepository.deleteByPlatoIdNative(platoId);
    }

    @Override
    public ItemReceta save(ItemReceta item) {
        RecetaEntity saved = jpaRepository.saveAndFlush(RecetaMapper.toEntity(item));
        item.setId(saved.getId());
        return item;
    }
}
