import { LoggerService } from './logger.service';

export class MigrationUtils {
  static sanitizePhoneNumber(phone: string, logger: LoggerService): string {
    const cleaned = phone.replace(/[^\d]/g, '');

    if (cleaned.length > 20) {
      logger.log(`Sanitized phone truncated: ${phone} => ${cleaned.slice(0, 20)}`);
    }

    return cleaned.slice(0, 20);
  }

  static sanitizeEmail(email: string, logger: LoggerService): string {
    const cleaned = email.trim().toLowerCase();

    // Regra opcional: loga se o e-mail está fora do padrão
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned);
    if (!isValid) {
      logger.log(`Invalid email format detected and used as-is: ${email}`);
    }

    return cleaned;
  }

}
