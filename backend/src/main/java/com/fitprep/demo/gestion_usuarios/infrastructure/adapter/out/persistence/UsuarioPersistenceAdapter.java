package com.fitprep.demo.gestion_usuarios.infrastructure.adapter.out.persistence;

import com.fitprep.demo.gestion_usuarios.domain.model.Usuario;
import com.fitprep.demo.gestion_usuarios.domain.port.out.UsuarioRepositoryPort;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class UsuarioPersistenceAdapter implements UsuarioRepositoryPort {

    private final UsuarioJpaRepository jpaRepository;

    public UsuarioPersistenceAdapter(UsuarioJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public Optional<Usuario> findById(Long id) {
        return jpaRepository.findById(id).map(UsuarioMapper::toDomain);
    }

    @Override
    public Optional<Usuario> findByEmail(String email) {
        return jpaRepository.findByEmail(email).map(UsuarioMapper::toDomain);
    }

    @Override
    public Optional<Usuario> findByEmailGlobal(String email) {
        return jpaRepository.findByEmailGlobal(email).map(UsuarioMapper::toDomain);
    }

    @Override
    public boolean existsByEmailGlobal(String email) {
        return jpaRepository.existsByEmailGlobal(email);
    }

    @Override
    public List<Usuario> findByRol(String rol) {
        return jpaRepository.findByRolOrderByNombresAsc(rol).stream()
                .map(UsuarioMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Usuario> findAllGlobal() {
        return jpaRepository.findAllGlobal().stream()
                .map(UsuarioMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Usuario save(Usuario usuario) {
        UsuarioEntity saved = jpaRepository.save(UsuarioMapper.toEntity(usuario));
        return UsuarioMapper.toDomain(saved);
    }

    @Override
    public Usuario insertarEnCocina(Usuario u) {
        Long id = jpaRepository.insertUsuario(
                u.getNegocioId(), u.getNombres(), u.getApellidos(), u.getEmail(),
                u.getPasswordHash(), u.getRol(), u.getObjetivoFitness(),
                u.getRequerimientoKcal(), u.getReqProteinasG(),
                u.getReqCarbohidratosG(), u.getReqGrasasG());
        u.setId(id);
        return u;
    }

    @Override
    public void reasignarCocina(Long usuarioId, Integer negocioId) {
        jpaRepository.updateNegocioId(usuarioId, negocioId);
    }
}
