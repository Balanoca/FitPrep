package com.fitprep.demo.gestion_usuarios.infrastructure.adapter.out.persistence;

import com.fitprep.demo.gestion_usuarios.domain.model.Negocio;
import com.fitprep.demo.gestion_usuarios.domain.model.NegocioResumen;
import com.fitprep.demo.gestion_usuarios.domain.port.out.NegocioRepositoryPort;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

@Component
public class NegocioPersistenceAdapter implements NegocioRepositoryPort {

    private final NegocioJpaRepository jpaRepository;

    public NegocioPersistenceAdapter(NegocioJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public Optional<Negocio> findById(Long id) {
        return jpaRepository.findById(id).map(NegocioMapper::toDomain);
    }

    @Override
    public Optional<Negocio> findBySlug(String slug) {
        return jpaRepository.findBySlug(slug).map(NegocioMapper::toDomain);
    }

    @Override
    public List<Negocio> findAllActivos() {
        return jpaRepository.findByEstadoOrderByNombreComercialAsc("ACTIVO").stream()
                .map(NegocioMapper::toDomain)
                .toList();
    }

    @Override
    public List<NegocioResumen> findAllResumen() {
        return jpaRepository.findAllResumen().stream()
                .map(r -> new NegocioResumen(
                        r.getId(),
                        r.getNombreComercial(),
                        r.getSlug(),
                        r.getEstado(),
                        r.getFechaRegistro() == null ? null
                                : LocalDateTime.ofInstant(r.getFechaRegistro(), ZoneId.systemDefault()),
                        r.getTotalDeportistas(),
                        r.getTotalPlatos()))
                .toList();
    }

    @Override
    public Negocio save(Negocio negocio) {
        NegocioEntity saved = jpaRepository.save(NegocioMapper.toEntity(negocio));
        return NegocioMapper.toDomain(saved);
    }
}
