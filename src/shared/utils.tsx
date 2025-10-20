import { z } from "zod"
 

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
        <div className="mt-2 text-error-foreground text-sm">
            {message}
        </div>
    )
}

export const transformArrToLabels = (arr: string[]) => {
    return arr.map(item => ({ label: item, value: item }))
}