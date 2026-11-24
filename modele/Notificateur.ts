import type { Livraison } from "./types";

/** Contrat permettant au métier d'émettre une notification sans dépendre de l'affichage. */
export interface Notificateur {
  notifier(message: string, livraison?: Livraison): void;
}
