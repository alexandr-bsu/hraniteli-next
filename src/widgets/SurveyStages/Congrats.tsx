import React from "react"
import { withForm } from "../../features/MultiStepForm/appForm"
import { useStage } from "@/features/MultiStepForm/StageContext"
import { useRouter } from "next/navigation"

interface CongratsStageContentProps {
    form: any
}

interface CongratsStageProps {
    form?: any
}

const CongratsStageContent = ({ form }: CongratsStageContentProps) => {
    const { calculateTotalCoins, getCurrentResult } = useStage()
    
    const totalCoins = calculateTotalCoins(form.state.values)
    const currentResult = getCurrentResult(totalCoins)


    return (
        <form.AppField name="is_congrats">
            {() => (
                <div className="flex flex-col items-center justify-center w-full h-full grow p-4 overflow-y-auto">
                    <div className="flex flex-col items-center justify-center gap-[30px] text-center max-w-2xl">
                        <div className="text-3xl font-bold text-[#116466] mb-4">
                            Поздравляем!
                        </div>
                        
                        <div className="text-xl text-gray-600 mb-6">
                            Ваш результат: <span className="font-semibold text-[#116466]">{totalCoins} очков</span>
                        </div>
                        
                        {currentResult ? (
                            <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-[#116466]/20">
                                <h3 className="text-2xl font-semibold text-[#116466] mb-4">
                                    {currentResult.title}
                                </h3>
                                <p className="text-lg text-gray-700 leading-relaxed">
                                    {currentResult.description}
                                </p>
                            </div>
                        ) : (
                            <div className="bg-gray-100 rounded-lg p-6">
                                <p className="text-gray-600">
                                    Результаты пока не загружены
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </form.AppField>
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