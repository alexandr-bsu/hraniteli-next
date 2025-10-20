import React, { createContext, useContext, useState, useCallback, useRef, useMemo } from 'react'
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
    calculateTotalCoins: (formData: Record<string, any>) => number
}

const StageContext = createContext<StageContextType | undefined>(undefined)

interface StageProviderProps {
    children: React.ReactNode
    stages?: string[]
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
    // Generate stages from jsonData if not provided
    const generatedStages = useMemo(() => {
        if (stages && stages.length > 0) {
            return stages;
        }
        return jsonData.map(item => item.step_id);
    }, [stages, jsonData]);

    const [currentStage, setCurrentStage] = useState<string>(initialStage || generatedStages[0])
    const initialStageRef = useRef<string>(initialStage || generatedStages[0])
    const middlewareManager = useRef(new MiddlewareManager(middlewares || []))

    const calculateTotalCoins = useCallback((formData: Record<string, any>) => {
        let total = 0

        // Проходим по всем шагам в jsonData
        jsonData.forEach(step => {
            const stepValue = formData[step.step_id]

            if (stepValue) {
                if (step.step_type === 'multiple' && Array.isArray(stepValue)) {
                    // Для множественного выбора суммируем очки всех выбранных вариантов
                    stepValue.forEach(selectedTitle => {
                        const selectedItem = step.step_items.find(item => item.title === selectedTitle)
                        if (selectedItem) {
                            total += selectedItem.coins
                        }
                    })
                } else if (step.step_type === 'single' && typeof stepValue === 'string') {
                    // Для одиночного выбора добавляем очки выбранного варианта
                    const selectedItem = step.step_items.find(item => item.title === stepValue)
                    if (selectedItem) {
                        total += selectedItem.coins
                    }
                }
            }
        })

        return total
    }, [jsonData])

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
        const currentIndex = generatedStages.indexOf(currentStage);
        if (currentIndex === -1) return 0;
        return Math.round(((currentIndex + 1) / generatedStages.length) * 100);
    }, [generatedStages, currentStage]);

    /* Намеренно нет проверки на наличие этапа в массиве stages. 
    Нужно для перехода на шаги формы, которые не входят в массив stages (например, CongratsStage)
    Для корректной работы прогресбара, мы не вносим эти шаги в массив stages, т.к они не должны влиять на прогресс формы
    */
    const goTo = useCallback(async (stageName: string, formData: Record<string, any> = {}) => {
        await executeStageTransition(currentStage, stageName, formData)
    }, [generatedStages, currentStage, executeStageTransition])

    const goNext = useCallback(async (formData: Record<string, any> = {}) => {
        const currentIndex = generatedStages.indexOf(currentStage)
        if (currentIndex !== -1 && currentIndex < generatedStages.length - 1) {
            const nextStage = generatedStages[currentIndex + 1]
            await executeStageTransition(currentStage, nextStage, formData)
        }
    }, [generatedStages, currentStage, executeStageTransition])

    const goBack = useCallback(async (formData: Record<string, any> = {}) => {
        const currentIndex = generatedStages.indexOf(currentStage)
        if (currentIndex > 0) {
            const prevStage = generatedStages[currentIndex - 1]
            await executeStageTransition(currentStage, prevStage, formData)
        }
    }, [generatedStages, currentStage, executeStageTransition])

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
        availableStages: generatedStages,
        addMiddleware,
        removeMiddleware,
        getMiddlewares,
        getProgressPercentage,
        isInitialStage,
        jsonData,
        calculateTotalCoins
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