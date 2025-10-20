import React from "react"
import FormItem from "../../shared/ui/FormItem"
import { withForm } from "../../features/MultiStepForm/appForm"
import { useStage } from "../../features/MultiStepForm/StageContext"
import { StageController } from "../../features/MultiStepForm/StageController"
import { StageError, validateStage } from "../../shared/utils"
import { CheckboxGroup } from "../../shared/ui/CheckboxGroup"
import { RadioGroup } from "../../shared/ui/RadioGroup"
import { transformArrToLabels } from "../../shared/utils"
import { checkboxSchema, radioboxSchema } from "./validation"
import { StepItemOption } from "../../features/MultiStepForm/types"

interface SurveyStageContentProps {
    form: any
    step_id: string
    step_name: string
    step_description?: string
    step_type: "multiple" | "single"
    step_items: StepItemOption[],
    to_submit?: boolean
}

interface SurveyStageProps {
    form?: any
    step_id: string
    step_name: string
    step_description?: string
    step_type: "multiple" | "single"
    step_items: StepItemOption[],
    to_submit?: boolean
}

const SurveyStageContent = ({
    form,
    step_id,
    step_name,
    step_description,
    step_type,
    step_items,
    to_submit
}: SurveyStageContentProps) => {
    const stageContext = useStage()

    const isMultiple = step_type === "multiple"
    const schema = isMultiple ? checkboxSchema : radioboxSchema
    const fieldMode = isMultiple ? "array" : undefined

    return (
        <form.AppField
            name={step_id}
            mode={fieldMode}
            validators={{
                onChange: ({ value }: { value: string[] | string }) => {
                    return validateStage(value, schema)
                }
            }}
        >
            {(field: any) => {
                const isFieldValid = schema.safeParse(field.state.value)?.success
                return (
                    <>
                        <FormItem title={step_name} description={step_description}>
                            <div>
                                {isMultiple ? (
                                    <CheckboxGroup
                                        items={transformArrToLabels(step_items)}
                                        value={field.state.value || []}
                                        onChange={(val) => field.handleChange(val)}
                                        allowCustomOption={false}
                                    />
                                ) : (
                                    <RadioGroup
                                        items={transformArrToLabels(step_items)}
                                        value={field.state.value || ""}
                                        onChange={(val) => field.handleChange(val)}
                                        allowCustomOption={false}
                                    />
                                )}
                                <StageError message={field.state.meta.errors[0]} />
                            </div>
                        </FormItem>

                        <StageController
                            onNext={() => to_submit ? form.handleSubmit() : stageContext.goNext(form.state.values)}
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

export const SurveyStage = (props: SurveyStageProps) => {
    // If form is passed as prop, use it directly
    if (props.form) {
        return <SurveyStageContent form={props.form} {...props} />
    }

    // Otherwise, use withForm HOC for backward compatibility
    const FormComponent = withForm({
        render: ({ form }: { form: any }) => <SurveyStageContent form={form} {...props} />
    })
    return React.createElement(FormComponent)
}