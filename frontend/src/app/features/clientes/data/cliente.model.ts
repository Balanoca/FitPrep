/** Cliente (deportista) del negocio, tal como lo expone GET /usuarios. */
export interface Cliente {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  objetivoFitness: string | null;
  requerimientoKcal: number | null;
}
