package com.fitprep.demo.gestion_usuarios.application.service;

import com.fitprep.demo.gestion_usuarios.domain.model.Negocio;
import com.fitprep.demo.gestion_usuarios.domain.model.PasswordHasher;
import com.fitprep.demo.gestion_usuarios.domain.model.Usuario;
import com.fitprep.demo.gestion_usuarios.domain.port.in.AutenticacionUseCase;
import com.fitprep.demo.gestion_usuarios.domain.port.out.NegocioRepositoryPort;
import com.fitprep.demo.gestion_usuarios.domain.port.out.TokenGeneratorPort;
import com.fitprep.demo.gestion_usuarios.domain.port.out.UsuarioRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Implementación de los casos de uso de autenticación. Depende exclusivamente
 * de puertos del dominio, nunca de tecnologías concretas.
 */
@Service
@Transactional(readOnly = true)
public class AuthService implements AutenticacionUseCase {

    private final UsuarioRepositoryPort usuarioRepository;
    private final NegocioRepositoryPort negocioRepository;
    private final TokenGeneratorPort tokenGenerator;
    private final PasswordHasher passwordHasher;

    public AuthService(UsuarioRepositoryPort usuarioRepository,
                       NegocioRepositoryPort negocioRepository,
                       TokenGeneratorPort tokenGenerator,
                       PasswordHasher passwordHasher) {
        this.usuarioRepository = usuarioRepository;
        this.negocioRepository = negocioRepository;
        this.tokenGenerator = tokenGenerator;
        this.passwordHasher = passwordHasher;
    }

    @Override
    @Transactional
    public ResultadoLogin login(String email, String password) {
        // Login público: el contexto aún no tiene el tenant del usuario, así que se
        // busca el email globalmente. El token resultante lleva su negocioId.
        Usuario usuario = usuarioRepository.findByEmailGlobal(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con email: " + email));

        if (!usuario.passwordCoincide(password, passwordHasher)) {
            throw new IllegalArgumentException("Contraseña incorrecta");
        }

        String token = tokenGenerator.generateToken(
                usuario.getEmail(),
                List.of(usuario.getRol()),
                String.valueOf(usuario.getNegocioId())
        );

        return new ResultadoLogin(token, usuario);
    }

    @Override
    @Transactional
    public Usuario registrarUsuario(RegistroUsuarioCommand command, String rol) {
        // Opción B: el deportista elige su cocina al registrarse. La cocina debe
        // existir y estar activa; no hay asignación por defecto silenciosa.
        Integer negocioId = resolverCocinaActiva(command.negocioId());

        // El email es único global (entre todas las cocinas), por eso se comprueba
        // sin filtro de tenant.
        if (usuarioRepository.existsByEmailGlobal(command.email())) {
            throw new IllegalArgumentException("El email ya está registrado: " + command.email());
        }

        Usuario usuario = Usuario.builder()
                .negocioId(negocioId)
                .nombres(command.nombres())
                .apellidos(command.apellidos())
                .email(command.email())
                .passwordHash(passwordHasher.hash(command.password()))
                .rol(rol != null ? rol.toUpperCase() : "ATHLETE")
                .objetivoFitness(command.objetivoFitness())
                .requerimientoKcal(command.requerimientoKcal())
                .reqProteinasG(command.reqProteinasG())
                .reqCarbohidratosG(command.reqCarbohidratosG())
                .reqGrasasG(command.reqGrasasG())
                .build();

        // Registro cross-tenant: se inserta con SQL directo (ver puerto).
        return usuarioRepository.insertarEnCocina(usuario);
    }

    @Override
    @Transactional
    public Negocio registrarNegocio(RegistroNegocioCommand command) {
        if (negocioRepository.findBySlug(command.slug()).isPresent()) {
            throw new IllegalArgumentException("El slug del negocio ya existe: " + command.slug());
        }

        Negocio negocio = Negocio.builder()
                .nombreComercial(command.nombreComercial())
                .slug(command.slug().toLowerCase().trim())
                .ruc(command.ruc())
                .telefono(command.telefono())
                .build();

        return negocioRepository.save(negocio);
    }

    @Override
    public Usuario obtenerPerfilPorEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Perfil no encontrado para el usuario: " + email));
    }

    @Override
    @Transactional
    public Usuario actualizarObjetivos(String email, ActualizarObjetivosCommand command) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Perfil no encontrado para el usuario: " + email));

        usuario.actualizarObjetivos(
                command.objetivoFitness(),
                command.requerimientoKcal(),
                command.reqProteinasG(),
                command.reqCarbohidratosG(),
                command.reqGrasasG());

        return usuarioRepository.save(usuario);
    }

    @Override
    public List<Negocio> listarCocinasPublicas() {
        return negocioRepository.findAllActivos();
    }

    @Override
    @Transactional
    public Usuario cambiarCocina(String email, Integer negocioId) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Perfil no encontrado para el usuario: " + email));

        Integer destino = resolverCocinaActiva(negocioId);

        // Los planes ya creados conservan su negocio_id original (no se migran):
        // la cocina anterior sigue viendo los pedidos que aceptó. Solo cambia el
        // destino de los nuevos planes. Se usa UPDATE nativo porque negocio_id
        // (@TenantId) es inmutable a través de la entidad JPA.
        usuarioRepository.reasignarCocina(usuario.getId(), destino);
        usuario.setNegocioId(destino);

        return usuario;
    }

    /**
     * Valida que el id corresponda a una cocina existente y activa. Lanza
     * IllegalArgumentException si falta o no es válida (sin asignación por defecto).
     */
    private Integer resolverCocinaActiva(Integer negocioId) {
        if (negocioId == null) {
            throw new IllegalArgumentException("Debes elegir una cocina.");
        }
        Negocio negocio = negocioRepository.findById(negocioId.longValue())
                .orElseThrow(() -> new IllegalArgumentException("La cocina seleccionada no existe."));
        if (!"ACTIVO".equalsIgnoreCase(negocio.getEstado())) {
            throw new IllegalArgumentException("La cocina seleccionada no está disponible.");
        }
        return negocioId;
    }
}
