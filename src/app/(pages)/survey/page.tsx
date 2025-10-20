"use client"
import { Suspense, useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"

import { useAppForm } from "../../../features/MultiStepForm/appForm"
import { formOptions } from "@tanstack/react-form"
import FormBase from "../../../shared/ui/FormBase"
import { StageProvider } from "../../..//features/MultiStepForm/StageContext"
import { useStage } from "../../../features/MultiStepForm/StageContext"
import { SurveyStage } from "../../../widgets/SurveyStages/Survey"
import { StepItem, ResultItem } from "../../../features/MultiStepForm/types"
import { transformJsonToFormStructure, transformJsonToFormStagesConfig } from "../../../features/utils"
import {CongratsStage} from "../../../widgets/SurveyStages/Congrats";
import axios from "axios"

const MultiStepForm = () => {
    const { currentStage, getProgressPercentage, goTo, jsonData, calculateTotalCoins } = useStage()

    const form = useAppForm({
        ...formOptions(transformJsonToFormStructure(jsonData || [])),
        onSubmit: async ({ value }) => {
            const formData = value as Record<string, any>
            const finalTotalCoins = calculateTotalCoins(formData)
            
            const submissionData = {
                ...formData,
                total_coins: finalTotalCoins
            }
            
            goTo('congrats', submissionData)
        }
    })

    const stages = useMemo(() => {
        if (!jsonData || jsonData.length === 0) {
            console.log('Нет данных для создания этапов')
            return {}
        }

        console.log('Создание этапов из данных:', jsonData)
        const stagesConfig = transformJsonToFormStagesConfig(jsonData)
        console.log('Конфигурация этапов:', stagesConfig)

        const stages: Record<string, any> = {}
        Object.keys(stagesConfig).forEach(stepId => {
            const config = stagesConfig[stepId]
            stages[stepId] = (
                <Suspense key={stepId}>
                    <SurveyStage
                        form={form}
                        step_id={config.step_id}
                        step_name={config.step_name}
                        step_description={config.step_description}
                        step_type={config.step_type as "multiple" | "single"}
                        step_items={config.step_items}
                        to_submit={config.to_submit}
                    />
                </Suspense>
            )
        })


        stages['congrats'] = (
            <CongratsStage form={form}/>
        )

        console.log('Созданные этапы:', Object.keys(stages))
        return stages
    }, [form, jsonData])

    // Показываем форму только когда данные загружены
    if (!jsonData || jsonData.length === 0) {
        return (
            <div className="w-full flex flex-col h-screen justify-center items-center">
                <div className="text-lg">Загрузка анкеты...</div>
            </div>
        )
    }

    const renderStage = () => {
        console.log('Рендер этапа:', currentStage, 'Доступные этапы:', Object.keys(stages))
        const stage = stages[currentStage]

        if (!stage) {
            console.warn('Этап не найден:', currentStage)
            return <div>Этап &quot;{currentStage}&quot; не найден</div>
        }

        return stage
    }

    return (
        <div className="w-full flex flex-col h-screen">
            <FormBase
                title="Анкета для сооснователей"
                progress={getProgressPercentage()}
                showOnlyChildren={currentStage === 'congrats'}
            >
                <div className="flex flex-col grow">
                    {renderStage()}
                </div>
            </FormBase>
        </div>
    )
}

function SurveyContent() {
    const searchParams = useSearchParams()
    const surveySlug = searchParams.get('slug') || ""

    const [jsonData, setJsonData] = useState<StepItem[]>([])
    const [results, setResults] = useState<ResultItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {


        const fetchSurveyData = async () => {
            try {
                setLoading(true)
                setError(null)

                const response = await axios.get(`https://n8n-v2.hrani.live/webhook/get-survey`, {
                    params: { slug: surveySlug }
                })

                console.log('Полученные данные:', response.data)
                console.log('Содержимое анкеты:', response.data.content)

                const surveyData = response.data.content || []
                const resultsData = response.data.results || []

                // Проверяем, что данные имеют правильную структуру
                if (Array.isArray(surveyData) && surveyData.length > 0) {
                    // Проверяем первый элемент на наличие обязательных полей
                    const firstItem = surveyData[0]
                    if (firstItem.step_id && firstItem.step_name && firstItem.step_type && firstItem.step_items) {
                        setJsonData(surveyData)
                        setResults(resultsData)
                        console.log('Данные анкеты успешно загружены:', surveyData.length, 'этапов')
                        console.log('Результаты загружены:', resultsData.length, 'вариантов')
                    } else {
                        console.error('Неправильная структура данных:', firstItem)
                        throw new Error('Неправильная структура данных анкеты')
                    }
                } else {
                    console.error('Пустые или неправильные данные:', surveyData)
                    setError('Не удалось загрузить анкету')
                }
            } catch (err) {
                console.error('Ошибка загрузки анкеты:', err)
                setError('Не удалось загрузить анкету')
            
                
            } finally {
                setLoading(false)
            }
        }

        if (surveySlug) {
            fetchSurveyData()
        } else {
            // Если нет slug
            setError('Не удалось загрузить анкету')
            setLoading(false)
        }
    }, [surveySlug])

    if (loading) {
        return (
            <div className="w-full h-full flex flex-col justify-center items-center bg-white">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 border-4 border-[#116466] border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-[18px] text-[#116466] max-lg:text-[14px]">Загружаем анкету...</p>
                    </div>
                </div>
        )
    }

    if (error && jsonData.length === 0) {
        return (
            <div className="w-full h-full flex flex-col justify-center items-center bg-white">
                <h1 className="text-3xl font-bold text-[#116466]">404</h1>
                <p className="text-[#116466]">Анкета не найдена</p>
            </div>
        )
    }

    return (
        <StageProvider jsonData={jsonData} results={results}>
            <MultiStepForm />
        </StageProvider>
    )
}

export default function SurveyLayout() {
    return (
        <div className="w-full h-full flex justify-center items-center">
            <Suspense>
                <SurveyContent />
            </Suspense>
        </div>
    )
}