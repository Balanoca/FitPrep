package com.fitprep.demo.gestion_usuarios.interfaces;

import com.fitprep.demo.gestion_usuarios.application.AuthService;
import com.fitprep.demo.gestion_usuarios.domain.model.Negocio;
import com.fitprep.demo.gestion_usuarios.domain.model.Usuario;
import com.fitprep.demo.gestion_usuarios.interfaces.dto.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Error de Autenticación");
            error.put("message", e.getMessage());
            error.put("status", HttpStatus.UNAUTHORIZED.value());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    @PostMapping("/register/deportista")
    public ResponseEntity<?> registrarDeportista(@RequestBody RegisterDeportistaRequest request) {
        try {
            Usuario usuario = authService.registrarUsuario(request, "ATHLETE");
            return ResponseEntity.status(HttpStatus.CREATED).body(mapToUserResponse(usuario));
        } catch (IllegalArgumentException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Error de Registro");
            error.put("message", e.getMessage());
            error.put("status", HttpStatus.BAD_REQUEST.value());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/register/negocio")
    public ResponseEntity<?> registrarNegocio(@RequestBody RegisterNegocioRequest request) {
        try {
            Negocio negocio = authService.registrarNegocio(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(negocio);
        } catch (IllegalArgumentException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Error de Registro de Negocio");
            error.put("message", e.getMessage());
            error.put("status", HttpStatus.BAD_REQUEST.value());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> obtenerMiPerfil() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if (email == null || "anonymousUser".equals(email)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No autenticado");
        }

        try {
            Usuario usuario = authService.obtenerPerfilPorEmail(email);
            return ResponseEntity.ok(mapToUserResponse(usuario));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    private AuthResponse mapToUserResponse(Usuario usuario) {
        return AuthResponse.builder()
                .token(null)
                .id(usuario.getId())
                .negocioId(usuario.getNegocioId())
                .nombres(usuario.getNombres())
                .apellidos(usuario.getApellidos())
                .email(usuario.getEmail())
                .rol(usuario.getRol())
                .build();
    }
}
