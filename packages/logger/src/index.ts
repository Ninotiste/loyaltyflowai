type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogContext {
  [key: string]: unknown
}

export interface Logger {
  debug(msg: string, ctx?: LogContext): void
  info(msg: string, ctx?: LogContext): void
  warn(msg: string, ctx?: LogContext): void
  error(msg: string, ctx?: LogContext): void
  child(ctx: LogContext): Logger
}

function formatEntry(level: LogLevel, name: string, msg: string, baseCtx: LogContext, ctx?: LogContext): string {
  return JSON.stringify({
    level,
    name,
    msg,
    time: new Date().toISOString(),
    ...(Object.keys(baseCtx).length > 0 && baseCtx),
    ...(ctx !== undefined && ctx),
  })
}

export function createLogger(name: string, parentCtx: LogContext = {}): Logger {
  const isDev = process.env.NODE_ENV !== 'production'

  return {
    debug(msg, ctx) {
      if (isDev) console.debug(formatEntry('debug', name, msg, parentCtx, ctx))
    },
    info(msg, ctx) {
      console.info(formatEntry('info', name, msg, parentCtx, ctx))
    },
    warn(msg, ctx) {
      console.warn(formatEntry('warn', name, msg, parentCtx, ctx))
    },
    error(msg, ctx) {
      console.error(formatEntry('error', name, msg, parentCtx, ctx))
    },
    child(ctx: LogContext): Logger {
      return createLogger(name, { ...parentCtx, ...ctx })
    },
  }
}
