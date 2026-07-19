/** Cliente (deportista) del negocio, tal como lo expone GET /usuarios. */
export interface Cliente {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  objetivoFitness: string | null;
  requerimientoKcal: number | null;
}

/** Usuario para el panel del ADMIN (GET /usuarios/admin/todos): con rol y negocio. */
export interface UsuarioAdmin {
  id: number;
  negocioId: number;
  nombres: string;
  apellidos: string;
  email: string;
  rol: string;
  objetivoFitness: string | null;
}
