
export interface StageTransitionContext {
  fromStage: string
  toStage: string
  formData: Record<string, any>
}

export abstract class StageMiddleware {
  abstract name: string

  before?(context: StageTransitionContext): Promise<void> | void
  after?(context: StageTransitionContext): Promise<void> | void
}
