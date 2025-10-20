"use client"
import { Suspense } from "react"

import { useAppForm } from "../../../features/MultiStepForm/appForm"
import { formOptions } from "@tanstack/react-form"
import FormBase from "../../../shared/ui/FormBase"
import { StageProvider } from "../../..//features/MultiStepForm/StageContext"
import { useStage } from "../../../features/MultiStepForm/StageContext"
import { SurveyStage } from "../../../widgets/SurveyStages/Survey"


const defaultProfileFormOptions = formOptions({
    defaultValues: {
        hiring_skills: [] as string[],
    },
})


const MultiStepForm = () => {
    const { currentStage, getProgressPercentage, goTo, formOptions } = useStage()

    const form = useAppForm({
        ...formOptions,
        onSubmit: async ({ value }) => {
            goTo('congrats', value as Record<string, any>)
        }
    })

    const renderStage = () => {
        return (
            <Suspense>
                <SurveyStage {...formOptions} form={form} />
            </Suspense>
        )
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
    const stages: string[] = [
        'hiring_skills'
    ]


    return (
        <div className="w-full h-full flex justify-center items-center">
            <Suspense>
                <StageProvider
                    stages={stages}
                    middlewares={[]}
                    formOptions={defaultProfileFormOptions}
                >
                    <MultiStepForm />
                </StageProvider>
            </Suspense>
        </div>
    )
}