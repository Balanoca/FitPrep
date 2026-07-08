package com.fitprep.demo.gestion_usuarios.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

interface UsuarioJpaRepository extends JpaRepository<UsuarioEntity, Long> {
    Optional<UsuarioEntity> findByEmail(String email);

    List<UsuarioEntity> findByRolOrderByNombresAsc(String rol);

    /**
     * Cambio de cocina vía SQL nativo: sortea la inmutabilidad de la columna
     * {@code @TenantId} y no aplica el filtro de tenant del contexto.
     */
    @Modifying
    @Query(value = "UPDATE usuario SET negocio_id = :negocioId WHERE id = :usuarioId", nativeQuery = true)
    int updateNegocioId(@Param("usuarioId") Long usuarioId, @Param("negocioId") Integer negocioId);

    /** Existencia de email global (todas las cocinas), sin filtro de @TenantId. */
    @Query(value = "SELECT EXISTS(SELECT 1 FROM usuario WHERE email = :email)", nativeQuery = true)
    boolean existsByEmailGlobal(@Param("email") String email);

    /**
     * Busca por email en TODAS las cocinas (sin filtro de @TenantId). Necesario
     * en el login, que es público: el contexto no tiene aún el tenant del usuario.
     */
    @Query(value = "SELECT * FROM usuario WHERE email = :email", nativeQuery = true)
    Optional<UsuarioEntity> findByEmailGlobal(@Param("email") String email);

    /**
     * Alta de usuario vía SQL nativo (registro cross-tenant): evita la validación
     * de {@code @TenantId} que exige que negocio_id == tenant de la sesión.
     * Devuelve el id generado.
     */
    @Query(value = """
            INSERT INTO usuario (negocio_id, nombres, apellidos, email, password_hash, rol,
                                 objetivo_fitness, requerimiento_kcal, req_proteinas_g,
                                 req_carbohidratos_g, req_grasas_g)
            VALUES (:negocioId, :nombres, :apellidos, :email, :passwordHash, :rol,
                    :objetivoFitness, :requerimientoKcal, :reqProteinasG,
                    :reqCarbohidratosG, :reqGrasasG)
            RETURNING id
            """, nativeQuery = true)
    Long insertUsuario(@Param("negocioId") Integer negocioId,
                       @Param("nombres") String nombres,
                       @Param("apellidos") String apellidos,
                       @Param("email") String email,
                       @Param("passwordHash") String passwordHash,
                       @Param("rol") String rol,
                       @Param("objetivoFitness") String objetivoFitness,
                       @Param("requerimientoKcal") Double requerimientoKcal,
                       @Param("reqProteinasG") Double reqProteinasG,
                       @Param("reqCarbohidratosG") Double reqCarbohidratosG,
                       @Param("reqGrasasG") Double reqGrasasG);
}
