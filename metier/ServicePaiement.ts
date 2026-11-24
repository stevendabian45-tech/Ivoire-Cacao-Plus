import type { DepotLivraisons } from "../modele/DepotLivraisons";
import type { Notificateur } from "../modele/Notificateur";
import type {
  Livraison, Operateur, Producteur, Qualite, ResultatPaiement
} from "../modele/types";
import {
  LIMITE_LIVRAISONS_JOUR, POIDS_MINIMUM_KG
} from "../modele/types";
import { calculerBrut, calculerFrais, calculerRetenue } from "./calculs";
import { Magasin } from "./Magasin";

/**
 * Orchestre les règles de paiement.
 * Le dépôt, le magasin et le notificateur sont injectés : le service ne crée
 * aucune dépendance concrète de stockage ou de présentation.
 */
export class ServicePaiement {
  private prochainId = 1;

  constructor(
    private readonly depot: DepotLivraisons,
    private readonly notificateur: Notificateur,
    private readonly magasin: Magasin
  ) {}

  /**
   * Vérifie les conditions, calcule le paiement et enregistre uniquement
   * les livraisons acceptées. Le jour est fourni pour rendre la règle
   * de limite journalière déterministe et testable.
   */
  payer(
    producteur: Producteur,
    poidsKg: number,
    qualite: Qualite,
    operateur: Operateur,
    jour: string
  ): ResultatPaiement {
    if (!producteur.actif) {
      return { statut: "refuse", motif: "producteur inactif" };
    }
    if (this.depot.parProducteur(producteur.id).filter(item => item.jour === jour).length >= LIMITE_LIVRAISONS_JOUR) {
      return { statut: "refuse", motif: "limite journaliere atteinte" };
    }
    if (!Number.isFinite(poidsKg) || poidsKg < POIDS_MINIMUM_KG) {
      return { statut: "refuse", motif: "poids insuffisant" };
    }
    if (qualite === "rejetee") {
      return { statut: "refuse", motif: "qualite rejetee" };
    }

    const brut = calculerBrut(poidsKg, qualite);
    const retenue = calculerRetenue(brut);
    const net = brut - retenue;
    const frais = calculerFrais(net);

    const livraison: Livraison = {
      id: `LIV-${String(this.prochainId++).padStart(4, "0")}`,
      producteurId: producteur.id,
      poidsKg,
      qualite,
      jour,
      brut,
      retenue,
      net,
      frais,
      operateur
    };

    this.depot.ajouter(livraison);
    this.magasin.entrer(qualite, poidsKg);
    this.notificateur.notifier(`Paiement de ${net} FCFA effectué à ${producteur.nom}.`, livraison);

    return { statut: "paye", paiement: livraison, net, frais };
  }
}
