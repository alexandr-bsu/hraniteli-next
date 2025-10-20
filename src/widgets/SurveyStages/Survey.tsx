import FormItem from "../../shared/ui/FormItem"
import { withForm } from "../../features/MultiStepForm/appForm"
import { useStage } from "../../features/MultiStepForm/StageContext"
import { StageController } from "../../features/MultiStepForm/StageController"
import { StageError, validateStage } from "../../shared/utils"
import { CheckboxGroup } from "../../shared/ui/CheckboxGroup"
import { transformArrToLabels } from "../../shared/utils"
import { checkboxSchema } from "./validation"

const SurveyStageContent = ({ form }: { form: any }) => {
    const stageContext = useStage()

    return (
        <form.AppField
            name="hiring_skills"
            mode="array"
            validators={{
                onChange: ({ value }: { value: string[] }) => {
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

export const SurveyStage = withForm({
    render: ({ form }) => <SurveyStageContent form={form} />
})