import type { Notificateur } from "../modele/Notificateur";
import type { Livraison } from "../modele/types";

/** Doublure espion : mémorise les notifications reçues pendant un test. */
export class NotificateurEspion implements Notificateur {
  readonly messages: string[] = [];
  readonly livraisonsNotifiees: Livraison[] = [];

  notifier(message: string, livraison?: Livraison): void {
    this.messages.push(message);
    if (livraison) this.livraisonsNotifiees.push(livraison);
  }
}
