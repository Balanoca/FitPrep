package com.fitprep.demo.gestion_usuarios.domain.port.out;

import com.fitprep.demo.gestion_usuarios.domain.model.Usuario;

import java.util.List;
import java.util.Optional;

/**
 * Puerto de salida para la persistencia de usuarios.
 */
public interface UsuarioRepositoryPort {

    Optional<Usuario> findById(Long id);

    Optional<Usuario> findByEmail(String email);

    /** Busca por email en cualquier cocina (para login público, sin tenant en contexto). */
    Optional<Usuario> findByEmailGlobal(String email);

    /** Existe un usuario con ese email en cualquier cocina (email es único global). */
    boolean existsByEmailGlobal(String email);

    /** Usuarios con el rol dado, del tenant activo. */
    List<Usuario> findByRol(String rol);

    /** Todos los usuarios de todas las cocinas (panel ADMIN, sin filtro de tenant). */
    List<Usuario> findAllGlobal();

    Usuario save(Usuario usuario);

    /**
     * Inserta un usuario en una cocina concreta. El registro es una operación
     * cross-tenant (el usuario aún no "pertenece" al tenant de la petición), por
     * lo que se persiste con SQL directo, evitando el filtro de {@code @TenantId}
     * que exigiría que el negocio_id coincida con el tenant de la sesión.
     */
    Usuario insertarEnCocina(Usuario usuario);

    /**
     * Reasigna un usuario a otra cocina. El negocio_id lleva {@code @TenantId} y
     * es inmutable vía la entidad JPA, por eso se actualiza con SQL directo.
     */
    void reasignarCocina(Long usuarioId, Integer negocioId);
}
