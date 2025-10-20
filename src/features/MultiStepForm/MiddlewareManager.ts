import { StageMiddleware, type StageTransitionContext } from './types'
import axios from 'axios'

export class MiddlewareManager {
  private middlewares: StageMiddleware[]
  constructor(middlewares: StageMiddleware[]) {
    this.middlewares = middlewares
  }
  
  addMiddleware(middleware: StageMiddleware): void {
    this.middlewares.push(middleware)
  }

  removeMiddleware(name: string): boolean {
    const index = this.middlewares.findIndex(m => m.name === name)
    if (index !== -1) {
      this.middlewares.splice(index, 1)
      return true
    }
    return false
  }

  async executeBefore(context: StageTransitionContext): Promise<void> {
    for (const middleware of this.middlewares) {
      if (middleware.before) {
        await middleware.before(context)
      }
    }
  }

  async executeAfter(context: StageTransitionContext): Promise<void> {
    for (const middleware of this.middlewares) {
      if (middleware.after) {
        await middleware.after(context)
      }
    }
  }

  getMiddlewares(): StageMiddleware[] {
    return [...this.middlewares]
  }

  clearMiddlewares(): void {
    this.middlewares = []
  }
}


export class LoggingMiddleware extends StageMiddleware {
  name = 'logging'
  private prefix: string
  private level: 'debug' | 'info' | 'warn' | 'error'
  private beforeDelay: number
  private afterDelay: number

  constructor(
    prefix: string = 'StageTransition',
    level: 'debug' | 'info' | 'warn' | 'error' = 'info',
    beforeDelay: number = 0,
    afterDelay: number = 0
  ) {
    super()
    this.prefix = prefix
    this.level = level
    this.beforeDelay = beforeDelay
    this.afterDelay = afterDelay
  }

  private log(message: string, data?: any): void {
    const logMessage = `[${this.prefix}] ${message}`
    
    switch (this.level) {
      case 'debug':
        if (data !== undefined) {
          console.debug(logMessage, data)
        } else {
          console.debug(logMessage)
        }
        break
      case 'info':
        if (data !== undefined) {
          console.info(logMessage, data)
        } else {
          console.info(logMessage)
        }
        break
      case 'warn':
        if (data !== undefined) {
          console.warn(logMessage, data)
        } else {
          console.warn(logMessage)
        }
        break
      case 'error':
        if (data !== undefined) {
          console.error(logMessage, data)
        } else {
          console.error(logMessage)
        }
        break
    }
  }

  async before(context: StageTransitionContext): Promise<void> {
    if (this.beforeDelay > 0) {
      await new Promise(resolve => setTimeout(resolve, this.beforeDelay))
    }
    
    this.log(`[BEFORE] ID формы: ${context.formData.id}`)
    this.log(`[BEFORE] Переход со стадии: ${context.fromStage} на стадию: ${context.toStage}`)
    this.log('[BEFORE] Данные формы:', context.formData)
  }

  async after(context: StageTransitionContext): Promise<void> {
    if (this.afterDelay > 0) {
      await new Promise(resolve => setTimeout(resolve, this.afterDelay))
    }
    
    this.log(`[AFTER] ID формы: ${context.formData.id}`)
    this.log(`[AFTER] Переход завершён. Текущая стадия: ${context.toStage}`)
    this.log('[AFTER] Время перехода:', new Date().toISOString())
  }
}

export class FormTrackingMiddleware extends StageMiddleware {
  name = 'form-tracking'
  private formName : string

  constructor(
    formName: string = 'main',
  ) {
    super()
    this.formName = formName
    
  }

  async before(context: StageTransitionContext): Promise<void> {
    await axios.put('https://cofounder.hrani.live/web/track', {data: context.formData, formName: this.formName,  stage: context.toStage})
  }

  async after(): Promise<void> {}
}


export const loggingMiddleware = (
  opts: { prefix?: string; level?: 'debug' | 'info' | 'warn' | 'error'; beforeDelay?: number; afterDelay?: number } = {}
) => new LoggingMiddleware(opts.prefix, opts.level, opts.beforeDelay, opts.afterDelay)

export const formTrackingMiddleware = (
  opts: { formName?: string } = {}
) => new FormTrackingMiddleware(opts.formName)