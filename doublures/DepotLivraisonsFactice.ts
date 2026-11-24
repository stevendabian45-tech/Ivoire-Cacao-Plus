import type { DepotLivraisons } from "../modele/DepotLivraisons";
import type { Livraison } from "../modele/types";

/** Doublure factice : permet d'isoler les tests du stockage réel. */
export class DepotLivraisonsFactice implements DepotLivraisons {
  private readonly elements: Livraison[] = [];

  ajouter(livraison: Livraison): void {
    this.elements.push(livraison);
  }

  tout(): Livraison[] {
    return [...this.elements];
  }

  parProducteur(producteurId: string): Livraison[] {
    return this.elements.filter(item => item.producteurId === producteurId);
  }
}
