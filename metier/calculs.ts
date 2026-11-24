import type { Qualite } from "../modele/types";
import { TARIFS_PAR_QUALITE, TAUX_RETENUE } from "../modele/types";

/** Calcule le montant brut d'une livraison. */
export function calculerBrut(poidsKg: number, qualite: Qualite): number {
  return poidsKg * TARIFS_PAR_QUALITE[qualite];
}

/** Calcule la retenue en arrondissant à l'entier le plus proche. */
export function calculerRetenue(brut: number): number {
  return Math.round(brut * TAUX_RETENUE);
}

/** Calcule les frais Mobile Money sur le net versé au producteur. */
export function calculerFrais(net: number): number {
  if (net <= 50_000) return 250;
  if (net <= 200_000) return 500;
  return Math.round(net * 0.01);
}
