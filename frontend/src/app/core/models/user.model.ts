/** Roles de la plataforma (alineados con SecurityConfig del backend). */
export type Role = 'ADMIN' | 'TENANT' | 'ATHLETE';

/** Usuario autenticado tal como lo expone /auth (AuthResponse). */
export interface AuthUser {
  id: number;
  negocioId: number;
  nombres: string;
  apellidos: string;
  email: string;
  rol: Role;
  objetivoFitness?: string | null;
  requerimientoKcal?: number | null;
  reqProteinasG?: number | null;
  reqCarbohidratosG?: number | null;
  reqGrasasG?: number | null;
}

/** Respuesta de /auth/login: incluye el JWT. */
export interface AuthResponse extends AuthUser {
  token: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

/** Alta de deportista (POST /auth/register/deportista). */
export interface RegisterDeportistaRequest {
  nombres: string;
  apellidos: string;
  email: string;
  password: string;
  objetivoFitness?: string | null;
  requerimientoKcal?: number | null;
  reqProteinasG?: number | null;
  reqCarbohidratosG?: number | null;
  reqGrasasG?: number | null;
}

/** Alta de negocio/tenant (POST /auth/register/negocio). */
export interface RegisterNegocioRequest {
  nombreComercial: string;
  slug: string;
  ruc: string;
  telefono?: string | null;
}
