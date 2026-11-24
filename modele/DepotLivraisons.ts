import type { Livraison } from "./types";

/** Contrat de stockage des livraisons. */
export interface DepotLivraisons {
  ajouter(livraison: Livraison): void;
  tout(): Livraison[];
  parProducteur(producteurId: string): Livraison[];
}
