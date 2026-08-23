type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

const SENSITIVE_KEYS = new Set([
  "password",
  "token",
  "secret",
  "apikey",
  "api_key",
  "authorization",
  "cookie",
  "key",
]);

function resolveMinLevel(): LogLevel {
  const envLevel = process.env.LOG_LEVEL?.toUpperCase();
  if (envLevel === "INFO" || envLevel === "WARN" || envLevel === "ERROR") {
    return envLevel;
  }
  return "DEBUG";
}

function sanitizeContext(
  context?: Record<string, unknown>,
): Record<string, unknown> | undefined {
  if (!context) return undefined;

  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(context)) {
    const normalizedKey = key.toLowerCase().replace(/[-_]/g, "");
    if (SENSITIVE_KEYS.has(normalizedKey)) {
      sanitized[key] = "[REDACTED]";
      continue;
    }
    if (typeof value === "string" && value.length > 200) {
      sanitized[key] = `${value.slice(0, 200)}…`;
      continue;
    }
    sanitized[key] = value;
  }
  return sanitized;
}

function shouldLog(level: LogLevel): boolean {
  return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[resolveMinLevel()];
}

function writeLog(
  level: LogLevel,
  message: string,
  context?: Record<string, unknown>,
): void {
  if (!shouldLog(level)) return;

  const payload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(sanitizeContext(context) ?? {}),
  };

  const line = JSON.stringify(payload);

  switch (level) {
    case "ERROR":
      console.error(line);
      break;
    case "WARN":
      console.warn(line);
      break;
    default:
      console.log(line);
  }
}

export const logger = {
  debug: (message: string, context?: Record<string, unknown>) =>
    writeLog("DEBUG", message, context),
  info: (message: string, context?: Record<string, unknown>) =>
    writeLog("INFO", message, context),
  warn: (message: string, context?: Record<string, unknown>) =>
    writeLog("WARN", message, context),
  error: (message: string, context?: Record<string, unknown>) =>
    writeLog("ERROR", message, context),
};
