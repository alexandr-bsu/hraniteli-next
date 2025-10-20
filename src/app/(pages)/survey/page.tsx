"use client"
import { Suspense } from "react"

import { useAppForm } from "../../../features/MultiStepForm/appForm"
import { formOptions } from "@tanstack/react-form"
import FormBase from "../../../shared/ui/FormBase"
import { StageProvider } from "../../..//features/MultiStepForm/StageContext"

import FormItem from "../../../shared/ui/FormItem"
import { withForm } from "../../../features/MultiStepForm/appForm"
import { useStage } from "../../../features/MultiStepForm/StageContext"
import { StageController } from "../../../features/MultiStepForm/StageController"
import { StageError, validateStage } from "../../../shared/utils"
import { CheckboxGroup } from "../../../shared/ui/CheckboxGroup"
import { transformArrToLabels } from "../../../shared/utils"
import { z } from 'zod'

export const noEmptySchemaString = z
    .string()
    .min(1, 'Поле не может быть пустым')

export const checkboxSchema = z
    .array(z.string())
    .min(1, 'Выберите хотя бы один вариант')
    .refine(
        (values) => {
            const customValue = values.find(v => v.startsWith('__custom__'))
            if (customValue) {
                // customValue указан как не пустое значение?
                return customValue.trim().replace(':', '') !== '__custom__'
            }
            return true
        },
        'Заполните поле для своего варианта'
    )

export const radioboxSchema = z
    .string()
    .min(1, 'Выберите вариант')
    .refine(
        (value) => {
            if (value.startsWith('__custom__')) {
                // customValue указан как не пустое значение?
                return value.trim().replace(':', '') !== '__custom__'
            }
            return true
        },
        'Заполните поле для своего варианта'
    )


export const defaultProfileFormOptions = formOptions({
    defaultValues: {
        hiring_skills: [],
    },
})

const SurveyStageContent = ({ form }: { form: any }) => {
    const stageContext = useStage()
    
    return (
        <form.AppField
            name="hiring_skills"
            mode="array"
            validators={{
                onChange: ({ value }) => {
                    return validateStage(value, checkboxSchema)
                }
            }}
        >
            {(field: any) => {
                const isFieldValid = checkboxSchema.safeParse(field.state.value)?.success
                return (
                    <>
                        <FormItem title="Какие сферы вы хотите чтобы закрыл партнер?" description="Это слабые стороны или вы просто не хотите этим заниматься">
                            <div>
                                <CheckboxGroup
                                    items={transformArrToLabels(['Разработка ПО', 'Маркетинг', 'Продажи', 'Производство', 'Администрирование/операционное управление', 'Управление продуктом', 'HR', 'Дизайн', 'Привлечение инвестиций'])}
                                    value={field.state.value || []}
                                    onChange={(val) => field.handleChange(val)}
                                    allowCustomOption={true}
                                    customOptionLabel="Свой вариант"
                                />
                                <StageError message={field.state.meta.errors[0]} />
                            </div>
                        </FormItem>

                        <StageController
                            onNext={() => stageContext.goNext(form.state.values)}
                            onBack={() => stageContext.goBack(form.state.values)}
                            showBack={!stageContext.isInitialStage()}
                            isValid={isFieldValid}
                        />
                    </>
                )
            }}
        </form.AppField>
    )
}

const SurveyStage = withForm({
    render: ({ form }) => <SurveyStageContent form={form} />
})




const MultiStepForm = () => {
    const { currentStage, getProgressPercentage, goTo, formOptions } = useStage()

    const form = useAppForm({
        ...formOptions,
        onSubmit: async ({ value }) => {
            goTo('congrats', value)
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