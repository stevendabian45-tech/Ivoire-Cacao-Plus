import test from "node:test";
import assert from "node:assert/strict";
import { ServicePaiement } from "../metier/ServicePaiement";
import { Magasin } from "../metier/Magasin";
import { DepotLivraisonsFactice } from "./DepotLivraisonsFactice";
import { NotificateurEspion } from "./NotificateurEspion";
import type { Producteur } from "../modele/types";
import { calculerFrais } from "../metier/calculs";

const actif: Producteur = { id: "P1", nom: "Kouassi", village: "Daloa", actif: true };
const inactif: Producteur = { id: "P2", nom: "Yao", village: "Soubré", actif: false };
const jour = "2026-11-22";

function creerService() {
  const depot = new DepotLivraisonsFactice();
  const notificateur = new NotificateurEspion();
  const magasin = new Magasin();
  const service = new ServicePaiement(depot, notificateur, magasin);
  return { depot, notificateur, magasin, service };
}

test("R1 - brut : 120 kg de bonne qualité à 1 100 FCFA", () => {
  const { service } = creerService();
  const resultat = service.payer(actif, 120, "bonne", "Orange Money", jour);
  assert.equal(resultat.statut, "paye");
  if (resultat.statut === "paye") assert.equal(resultat.paiement.brut, 132_000);
});

test("R1 - brut : 10 kg de qualité moyenne à 850 FCFA", () => {
  const { service } = creerService();
  const resultat = service.payer(actif, 10, "moyenne", "MTN MoMo", jour);
  assert.equal(resultat.statut, "paye");
  if (resultat.statut === "paye") assert.equal(resultat.paiement.brut, 8_500);
});

test("R2 - une qualité rejetée est refusée", () => {
  const { service, depot, magasin } = creerService();
  const resultat = service.payer(actif, 20, "rejetee", "Moov Money", jour);
  assert.deepEqual(resultat, { statut: "refuse", motif: "qualite rejetee" });
  assert.equal(depot.tout().length, 0);
  assert.equal(magasin.stockDe("rejetee"), 0);
});

test("R3 - retenue de 4 % arrondie à l'entier", () => {
  const { service } = creerService();
  const resultat = service.payer(actif, 10, "bonne", "Orange Money", jour);
  assert.equal(resultat.statut, "paye");
  if (resultat.statut === "paye") {
    assert.equal(resultat.paiement.brut, 11_000);
    assert.equal(resultat.paiement.retenue, 440);
    assert.equal(resultat.net, 10_560);
  }
});

test("R4 - frais calculés sur le net : seuil inférieur", () => {
  assert.equal(calculerFrais(50_000), 250);
});

test("R4 - frais calculés sur le net : juste au-dessus de 50 000", () => {
  assert.equal(calculerFrais(50_001), 500);
});

test("R4 - frais : seuil de 200 000", () => {
  assert.equal(calculerFrais(200_000), 500);
});

test("R4 - frais : juste au-dessus de 200 000", () => {
  assert.equal(calculerFrais(200_001), 2_000);
});

test("R5 - un producteur inactif est refusé sans enregistrement", () => {
  const { service, depot, magasin } = creerService();
  const resultat = service.payer(inactif, 20, "bonne", "Orange Money", jour);
  assert.deepEqual(resultat, { statut: "refuse", motif: "producteur inactif" });
  assert.equal(depot.tout().length, 0);
  assert.equal(magasin.stockDe("bonne"), 0);
});

test("R6 - 10 kg sont acceptés", () => {
  const { service } = creerService();
  assert.equal(service.payer(actif, 10, "bonne", "Orange Money", jour).statut, "paye");
});

test("R6 - 9 kg sont refusés", () => {
  const { service, depot, magasin } = creerService();
  const resultat = service.payer(actif, 9, "bonne", "Orange Money", jour);
  assert.deepEqual(resultat, { statut: "refuse", motif: "poids insuffisant" });
  assert.equal(depot.tout().length, 0);
  assert.equal(magasin.stockDe("bonne"), 0);
});

test("Règle supplémentaire - trois livraisons le même jour sont acceptées", () => {
  const { service } = creerService();
  for (let i = 0; i < 3; i++) {
    assert.equal(service.payer(actif, 10, "bonne", "Orange Money", jour).statut, "paye");
  }
});

test("Règle supplémentaire - la quatrième livraison du jour est refusée", () => {
  const { service, depot, magasin } = creerService();
  for (let i = 0; i < 3; i++) service.payer(actif, 10, "bonne", "Orange Money", jour);
  const resultat = service.payer(actif, 10, "bonne", "Orange Money", jour);
  assert.deepEqual(resultat, { statut: "refuse", motif: "limite journaliere atteinte" });
  assert.equal(depot.tout().length, 3);
  assert.equal(magasin.stockDe("bonne"), 30);
});

test("La limite journalière est indépendante d'un autre jour", () => {
  const { service } = creerService();
  for (let i = 0; i < 3; i++) service.payer(actif, 10, "bonne", "Orange Money", jour);
  assert.equal(service.payer(actif, 10, "bonne", "Orange Money", "2026-11-23").statut, "paye");
});

test("Une livraison acceptée alimente le dépôt et le stock", () => {
  const { service, depot, magasin } = creerService();
  service.payer(actif, 15, "moyenne", "MTN MoMo", jour);
  assert.equal(depot.parProducteur("P1").length, 1);
  assert.equal(magasin.stockDe("moyenne"), 15);
});

test("Le notificateur espion reçoit une notification après paiement", () => {
  const { service, notificateur } = creerService();
  service.payer(actif, 10, "bonne", "Orange Money", jour);
  assert.equal(notificateur.messages.length, 1);
  assert.equal(notificateur.livraisonsNotifiees.length, 1);
});

test("Un refus ne déclenche aucune notification", () => {
  const { service, notificateur } = creerService();
  service.payer(inactif, 10, "bonne", "Orange Money", jour);
  assert.equal(notificateur.messages.length, 0);
});

test("Le magasin refuse une entrée nulle ou négative", () => {
  const magasin = new Magasin();
  assert.throws(() => magasin.entrer("bonne", 0));
  assert.throws(() => magasin.entrer("bonne", -2));
});
