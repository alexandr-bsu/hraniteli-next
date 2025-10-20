import { z } from "zod"
import { StepItemOption } from "../features/MultiStepForm/types"
 

export const validateStage = (value: any, schema: z.ZodSchema) => {
    const result = schema.safeParse(value)
    if (!result.success) {
        return result.error.issues[0]?.message
    }
    return undefined
}

export const StageError = ({ message }: { message?: string }) => {
    if (!message) return null
    return (
        <div className="mt-[10px] text-error-foreground text-sm">
            {message}
        </div>
    )
}


export const transformArrToLabels = (arr: StepItemOption[]) => {
    return arr.map(item => ({ 
        label: item.title, 
        value: item.title,
        coins: item.coins 
    }))
}