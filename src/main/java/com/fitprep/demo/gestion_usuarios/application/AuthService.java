package com.fitprep.demo.gestion_usuarios.application;

import com.fitprep.demo.identidad_inquilino.JwtService;
import com.fitprep.demo.identidad_inquilino.TenantContext;
import com.fitprep.demo.gestion_usuarios.domain.model.Negocio;
import com.fitprep.demo.gestion_usuarios.domain.model.Usuario;
import com.fitprep.demo.gestion_usuarios.domain.repository.NegocioRepository;
import com.fitprep.demo.gestion_usuarios.domain.repository.UsuarioRepository;
import com.fitprep.demo.gestion_usuarios.interfaces.dto.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final NegocioRepository negocioRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UsuarioRepository usuarioRepository,
                       NegocioRepository negocioRepository,
                       JwtService jwtService,
                       PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.negocioRepository = negocioRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public AuthResponse login(AuthRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con email: " + request.getEmail()));

        if (!passwordEncoder.matches(request.getPassword(), usuario.getPasswordHash())) {
            throw new IllegalArgumentException("Contraseña incorrecta");
        }

        // Generate JWT token
        String token = jwtService.generateToken(
                usuario.getEmail(),
                List.of(usuario.getRol()),
                String.valueOf(usuario.getNegocioId())
        );

        return AuthResponse.builder()
                .token(token)
                .id(usuario.getId())
                .negocioId(usuario.getNegocioId())
                .nombres(usuario.getNombres())
                .apellidos(usuario.getApellidos())
                .email(usuario.getEmail())
                .rol(usuario.getRol())
                .build();
    }

    @Transactional
    public Usuario registrarUsuario(RegisterDeportistaRequest request, String role) {
        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("El email ya está registrado: " + request.getEmail());
        }

        // Resolve active tenant from context or default
        String tenantStr = TenantContext.getCurrentTenant();
        Integer negocioId = 1;
        if (tenantStr != null) {
            try {
                negocioId = Integer.valueOf(tenantStr);
            } catch (NumberFormatException e) {
                // Keep default 1
            }
        }

        Usuario usuario = Usuario.builder()
                .negocioId(negocioId)
                .nombres(request.getNombres())
                .apellidos(request.getApellidos())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .rol(role != null ? role.toUpperCase() : "ATHLETE")
                .objetivoFitness(request.getObjetivoFitness())
                .requerimientoKcal(request.getRequerimientoKcal())
                .reqProteinasG(request.getReqProteinasG())
                .reqCarbohidratosG(request.getReqCarbohidratosG())
                .reqGrasasG(request.getReqGrasasG())
                .build();

        return usuarioRepository.save(usuario);
    }

    @Transactional
    public Negocio registrarNegocio(RegisterNegocioRequest request) {
        if (negocioRepository.findBySlug(request.getSlug()).isPresent()) {
            throw new IllegalArgumentException("El slug del negocio ya existe: " + request.getSlug());
        }

        Negocio negocio = Negocio.builder()
                .nombreComercial(request.getNombreComercial())
                .slug(request.getSlug().toLowerCase().trim())
                .ruc(request.getRuc())
                .telefono(request.getTelefono())
                .build();

        return negocioRepository.save(negocio);
    }

    public Usuario obtenerPerfilPorEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Perfil no encontrado para el usuario: " + email));
    }
}
