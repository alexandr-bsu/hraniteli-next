import React, { createContext, useContext, useState, useCallback, useRef } from 'react'
import type { StageMiddleware, StepItem } from './types'
import { MiddlewareManager } from './MiddlewareManager'

interface StageContextType {
    currentStage: string
    goTo: (stageName: string, formData?: Record<string, any>) => Promise<void>
    goNext: (formData?: Record<string, any>) => Promise<void>
    goBack: (formData?: Record<string, any>) => Promise<void>
    availableStages: string[]
    addMiddleware: (middleware: StageMiddleware) => void
    removeMiddleware: (name: string) => boolean
    getMiddlewares: () => StageMiddleware[]
    getProgressPercentage: () => number
    isInitialStage: () => boolean
    jsonData: StepItem[]
}

const StageContext = createContext<StageContextType | undefined>(undefined)

interface StageProviderProps {
    children: React.ReactNode
    stages: string[]
    initialStage?: string,
    middlewares?: StageMiddleware[]
    jsonData: StepItem[]
}

export const StageProvider: React.FC<StageProviderProps> = ({
    children,
    stages,
    initialStage,
    middlewares,
    jsonData
}) => {
    const [currentStage, setCurrentStage] = useState<string>(initialStage || stages[0])
    const initialStageRef = useRef<string>(initialStage || stages[0])
    const middlewareManager = useRef(new MiddlewareManager(middlewares || []))

    const executeStageTransition = useCallback(async (fromStage: string, toStage: string, formData: Record<string, any> = {}) => {
        const context = { fromStage, toStage, formData }
        
        Promise.resolve().then(async () => {
            await middlewareManager.current.executeBefore(context)  // последовательно, но не блокирует UI
        })
        
        setCurrentStage(toStage)

        Promise.resolve().then(async () => {
            await middlewareManager.current.executeAfter(context)  // последовательно, но не блокирует UI
        })

    }, [])

    const getProgressPercentage = useCallback(() => {
        const currentIndex = stages.indexOf(currentStage);
        if (currentIndex === -1) return 0;
        return Math.round(((currentIndex + 1) / stages.length) * 100);
    }, [stages, currentStage]);

    /* Намеренно нет проверки на наличие этапа в массиве stages. 
    Нужно для перехода на шаги формы, которые не входят в массив stages (например, CongratsStage)
    Для корректной работы прогресбара, мы не вносим эти шаги в массив stages, т.к они не должны влиять на прогресс формы
    */
    const goTo = useCallback(async (stageName: string, formData: Record<string, any> = {}) => {
        await executeStageTransition(currentStage, stageName, formData)
    }, [stages, currentStage, executeStageTransition])

    const goNext = useCallback(async (formData: Record<string, any> = {}) => {
        const currentIndex = stages.indexOf(currentStage)
        if (currentIndex !== -1 && currentIndex < stages.length - 1) {
            const nextStage = stages[currentIndex + 1]
            await executeStageTransition(currentStage, nextStage, formData)
        }
    }, [stages, currentStage, executeStageTransition])

    const goBack = useCallback(async (formData: Record<string, any> = {}) => {
        const currentIndex = stages.indexOf(currentStage)
        if (currentIndex > 0) {
            const prevStage = stages[currentIndex - 1]
            await executeStageTransition(currentStage, prevStage, formData)
        }
    }, [stages, currentStage, executeStageTransition])

    const addMiddleware = useCallback((middleware: StageMiddleware) => {
        middlewareManager.current.addMiddleware(middleware)
    }, [])

    const removeMiddleware = useCallback((name: string): boolean => {
        return middlewareManager.current.removeMiddleware(name)
    }, [])

    const getMiddlewares = useCallback((): StageMiddleware[] => {
        return middlewareManager.current.getMiddlewares()
    }, [])

    const isInitialStage = useCallback((): boolean => {
        return currentStage === initialStageRef.current
    }, [currentStage])

    const contextValue: StageContextType = {
        currentStage,
        goTo,
        goNext,
        goBack,
        availableStages: stages,
        addMiddleware,
        removeMiddleware,
        getMiddlewares,
        getProgressPercentage,
        isInitialStage,
        jsonData
    }

    return (
        <StageContext.Provider value={contextValue}>
            {children}
        </StageContext.Provider>
    )
}

export const useStage = () => {
    const context = useContext(StageContext)
    if (context === undefined) {
        throw new Error('useStage must be used within a StageProvider')
    }
    return context
}