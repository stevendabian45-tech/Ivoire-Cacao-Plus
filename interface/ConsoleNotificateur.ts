import type { Notificateur } from "../modele/Notificateur";
import type { Livraison } from "../modele/types";

/** Adaptateur de notification vers la console. */
export class ConsoleNotificateur implements Notificateur {
  notifier(message: string, _livraison?: Livraison): void {
    console.log(`[NOTIFICATION] ${message}`);
  }
}
