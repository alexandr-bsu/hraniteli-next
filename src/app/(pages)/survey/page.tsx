"use client"
import { Suspense, useMemo } from "react"

import { useAppForm } from "../../../features/MultiStepForm/appForm"
import { formOptions } from "@tanstack/react-form"
import FormBase from "../../../shared/ui/FormBase"
import { StageProvider } from "../../..//features/MultiStepForm/StageContext"
import { useStage } from "../../../features/MultiStepForm/StageContext"
import { SurveyStage } from "../../../widgets/SurveyStages/Survey"
import { StepItem } from "../../../features/MultiStepForm/types"
import { transformJsonToFormStructure, transformJsonToFormStagesConfig } from "../../../features/utils"

const jsonData: StepItem[] = [
    {
        "step_id": "hiring_status",
        "step_name": "bla-bla-bla-bla?",
        "step_description": "Это слабые стороны или вы просто не хотите этим заниматься",
        "step_type": "multiple",
        "step_items": ['Разработка ПО', 'Маркетинг', 'Продажи']
    },
    {
        "step_id": "hiring_skills",
        "step_name": "Какие сферы вы хотите чтобы закрыл партнер?",
        "step_description": "Это слабые стороны или вы просто не хотите этим заниматься",
        "step_type": "multiple",
        "step_items": ['Разработка ПО', 'Маркетинг', 'Продажи']
    },
]

const MultiStepForm = () => {
    const { currentStage, getProgressPercentage, goTo, jsonData } = useStage()

    const form = useAppForm({
        ...formOptions(transformJsonToFormStructure(jsonData)),
        onSubmit: async ({ value }) => {
            // goTo('congrats', value as Record<string, any>)
            console.log(value)
        }
    })

    const stages = useMemo(() => {
        if (!jsonData) return {}

        const stagesConfig = transformJsonToFormStagesConfig(jsonData)

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

        return stages
    }, [form, jsonData])

    const renderStage = () => {
        return stages[currentStage]
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

export default function SurveyLayout() {
    return (
        <div className="w-full h-full flex justify-center items-center">
            <Suspense>
                <StageProvider
                    jsonData={jsonData}
                >
                    <MultiStepForm />
                </StageProvider>
            </Suspense>
        </div>
    )
}