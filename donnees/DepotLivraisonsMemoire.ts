import type { DepotLivraisons } from "../modele/DepotLivraisons";
import type { Livraison } from "../modele/types";

/** Stockage en mémoire utilisé par le programme de démonstration. */
export class DepotLivraisonsMemoire implements DepotLivraisons {
  private readonly livraisons: Livraison[] = [];

  ajouter(livraison: Livraison): void {
    this.livraisons.push(livraison);
  }

  tout(): Livraison[] {
    return [...this.livraisons];
  }

  parProducteur(producteurId: string): Livraison[] {
    return this.livraisons.filter(item => item.producteurId === producteurId);
  }
}
