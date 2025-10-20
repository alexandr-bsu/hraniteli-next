import React from "react"
import { withForm } from "../../features/MultiStepForm/appForm"
import { useStage } from "@/features/MultiStepForm/StageContext"
interface CongratsStageContentProps {
    form: any
}

interface CongratsStageProps {
    form?: any
}

const CongratsStageContent = ({ form }: CongratsStageContentProps) => {
    const { calculateTotalCoins } = useStage()
    return (
        <form.AppField
            name="is_congrats"
            children={() => {
                return (
                    <>
                        <div className=" flex flex-col items-center justify-center w-full h-full grow p-4 overflow-y-auto">
                            <div className="flex flex-col items-center justify-center gap-[30px]">
                                test {calculateTotalCoins(form.state.values)}
                               
                                
                            </div>
                        </div>
                    </>
                )
            }}
        />
    )
}

export const CongratsStage = (props: CongratsStageProps) => {
    // If form is passed as prop, use it directly
    if (props.form) {
        return <CongratsStageContent form={props.form} {...props} />
    }

    // Otherwise, use withForm HOC for backward compatibility
    const FormComponent = withForm({
        render: ({ form }: { form: any }) => <CongratsStageContent form={form} {...props} />
    })
    return React.createElement(FormComponent)
}
