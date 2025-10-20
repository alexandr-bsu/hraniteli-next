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
        hiring_status: [] as string[]
        },
})

const MultiStepForm = () => {
    const { currentStage, getProgressPercentage, goTo, formOptions } = useStage()

    const form = useAppForm({
        ...formOptions,
        onSubmit: async ({ value }) => {
            // goTo('congrats', value as Record<string, any>)
            // console.log(value)
        }
    })

    const t = [
        {
            "step_id":"hiring_skills",
            "step_name":"Какие сферы вы хотите чтобы закрыл партнер?",
            "step_description":"Это слабые стороны или вы просто не хотите этим заниматься",
            "step_type":"multiple",
            "step_items": {['Разработка ПО', 'Маркетинг', 'Продажи']}
        },
        {
            "step_id":"hiring_status",
            "step_name":"bla-bla-bla-bla?",
            "step_description":"Это слабые стороны или вы просто не хотите этим заниматься",
            "step_type":"multiple",
            "step_items": {['Разработка ПО', 'Маркетинг', 'Продажи']}
        }
    ]

    const renderStage = () => {
        switch (currentStage) {
            case 'hiring_skills':
                return (<Suspense>
                    <SurveyStage
                        form={form}
                        step_id="hiring_skills"
                        step_name="Какие сферы вы хотите чтобы закрыл партнер?"
                        step_description="Это слабые стороны или вы просто не хотите этим заниматься"
                        step_type="multiple"
                        step_items={['Разработка ПО', 'Маркетинг', 'Продажи']}
                    />
                </Suspense>)
            case 'hiring_status':
                return (<Suspense>
                    <SurveyStage
                        form={form}
                        step_id="hiring_status"
                        step_name="bla-bla-bla-bla?"
                        step_description="Это слабые стороны или вы просто не хотите этим заниматься"
                        step_type="multiple"
                        step_items={['Разработка ПО', 'Маркетинг', 'Продажи']}
                        to_submit={true}
                    />
                </Suspense>)
        }


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
        'hiring_skills',
        'hiring_status'
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