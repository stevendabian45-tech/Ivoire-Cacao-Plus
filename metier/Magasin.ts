import type { Qualite } from "../modele/types";

/** Gère le stock de cacao séparément pour chaque qualité. */
export class Magasin {
  private readonly stocks = new Map<Qualite, number>([
    ["bonne", 0],
    ["moyenne", 0],
    ["rejetee", 0]
  ]);

  /** Ajoute une quantité positive au stock de la qualité concernée. */
  entrer(qualite: Qualite, kg: number): void {
    if (!Number.isFinite(kg) || kg <= 0) {
      throw new Error("La quantité ajoutée doit être positive.");
    }
    this.stocks.set(qualite, this.stockDe(qualite) + kg);
  }

  /** Retourne le stock courant d'une qualité. */
  stockDe(qualite: Qualite): number {
    return this.stocks.get(qualite) ?? 0;
  }
}
