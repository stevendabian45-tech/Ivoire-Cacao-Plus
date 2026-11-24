/** Qualité reconnue par la coopérative. */
export type Qualite = "bonne" | "moyenne" | "rejetee";

/** Opérateurs Mobile Money autorisés. */
export type Operateur = "Orange Money" | "MTN MoMo" | "Moov Money";

export interface Producteur {
  readonly id: string;
  readonly nom: string;
  readonly village: string;
  readonly actif: boolean;
}

export interface Livraison {
  readonly id: string;
  readonly producteurId: string;
  readonly poidsKg: number;
  readonly qualite: Qualite;
  readonly jour: string;
  readonly brut: number;
  readonly retenue: number;
  readonly net: number;
  readonly frais: number;
  readonly operateur: Operateur;
}

export interface PaiementReussi {
  readonly statut: "paye";
  readonly paiement: Livraison;
  readonly net: number;
  readonly frais: number;
}

export interface PaiementRefuse {
  readonly statut: "refuse";
  readonly motif: "qualite rejetee" | "producteur inactif" | "poids insuffisant" | "limite journaliere atteinte";
}

export type ResultatPaiement = PaiementReussi | PaiementRefuse;

export const TARIFS_PAR_QUALITE: Readonly<Record<Qualite, number>> = {
  bonne: 1100,
  moyenne: 850,
  rejetee: 0
};

export const TAUX_RETENUE = 0.04;
export const POIDS_MINIMUM_KG = 10;
export const LIMITE_LIVRAISONS_JOUR = 3;
