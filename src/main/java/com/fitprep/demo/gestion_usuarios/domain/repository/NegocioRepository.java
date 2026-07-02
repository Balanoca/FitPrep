package com.fitprep.demo.gestion_usuarios.domain.repository;

import com.fitprep.demo.gestion_usuarios.domain.model.Negocio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface NegocioRepository extends JpaRepository<Negocio, Long> {
    Optional<Negocio> findBySlug(String slug);
}
