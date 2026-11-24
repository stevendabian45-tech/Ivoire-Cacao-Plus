import { DepotLivraisonsMemoire } from "./donnees/DepotLivraisonsMemoire";
import { ConsoleNotificateur } from "./interface/ConsoleNotificateur";
import { Magasin } from "./metier/Magasin";
import { ServicePaiement } from "./metier/ServicePaiement";
import type { Producteur } from "./modele/types";

/**
 * Point unique d'assemblage : les classes concrètes sont instanciées ici.
 * Les règles métier restent dans le dossier metier/.
 */
function main(): void {
  const depot = new DepotLivraisonsMemoire();
  const notificateur = new ConsoleNotificateur();
  const magasin = new Magasin();
  const service = new ServicePaiement(depot, notificateur, magasin);

  const producteurs: Producteur[] = [
    { id: "P001", nom: "Aka Jean", village: "Daloa", actif: true },
    { id: "P002", nom: "Koffi Marie", village: "Soubré", actif: true },
    { id: "P003", nom: "Yao Paul", village: "Gagnoa", actif: false }
  ];

  console.log("\\n=== IVOIRE CACAO PLUS : DEMONSTRATION ===");
  const operations = [
    service.payer(producteurs[0], 120, "bonne", "Orange Money", "2026-11-22"),
    service.payer(producteurs[1], 10, "moyenne", "MTN MoMo", "2026-11-22"),
    service.payer(producteurs[0], 9, "bonne", "Orange Money", "2026-11-22"),
    service.payer(producteurs[0], 20, "rejetee", "Moov Money", "2026-11-22"),
    service.payer(producteurs[2], 30, "bonne", "Orange Money", "2026-11-22")
  ];

  for (const operation of operations) {
    if (operation.statut === "paye") {
      console.log(`PAYE : net ${operation.net} FCFA ; frais coopérative ${operation.frais} FCFA`);
    } else {
      console.log(`REFUSE : ${operation.motif}`);
    }
  }

  console.log("\\n--- STOCK DU MAGASIN ---");
  console.log(`Bonne qualité : ${magasin.stockDe("bonne")} kg`);
  console.log(`Qualité moyenne : ${magasin.stockDe("moyenne")} kg`);
  console.log(`Qualité rejetée : ${magasin.stockDe("rejetee")} kg`);

  console.log("\\n--- LIVRAISONS ENREGISTREES ---");
  for (const livraison of depot.tout()) {
    console.log(`${livraison.id} | ${livraison.producteurId} | ${livraison.poidsKg} kg | net ${livraison.net} FCFA`);
  }
}

main();
