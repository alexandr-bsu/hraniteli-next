
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

// Define the type for our JSON structure
export interface StepItem {
  step_id: string
  step_name: string
  step_description: string
  step_type: string
  step_items: string[]
}

export interface FormDefaultValues {
  [key: string]: string | string[]
}

export interface FormStructure {
  defaultValues: FormDefaultValues
}
