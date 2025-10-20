import React from "react"
import { withForm } from "../../features/MultiStepForm/appForm"
import { useStage } from "@/features/MultiStepForm/StageContext"
import Image from "next/image"
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
    const router = useRouter()

    const handleContinueClick = () => {
        router.push('/application_form/?research=true')
    }

    return (
        <form.AppField name="is_congrats">
            {() => (
                <div className='relative min-lg:p-[50px] p-[20px] max-lg:px-[20px] flex-col min-h-full h-[100svh] justify-between  flex w-full grow'>
                    <div className=" flex h-full w-full flex-col px-[30px] gap-[30px] overflow-y-auto pb-[40px]">
                        <div className="grow w-full flex flex-col items-center justify-center">
                            <Image className="max-lg:w-[140px] max-lg:h-[140px] mx-auto" src={'/card/thanks.svg'} alt="Спасибо" height={210} width={210} />

                            <div className="flex flex-col items-center gap-[10px] mt-[30px]">
                                <h2 className="font-semibold text-[26px] max-lg:text-[18px] max-lg:leading-[22px]">Вы набрали {totalCoins} баллов!</h2>
                            </div>

                            <>
                                <div className=" border-[#D4D4D4] border-[2px] p-[20px] rounded-[30px] whitespace-pre-line text-[14px] mt-[30px] flex justify-center items-center leading-[25px] font-normal w-full">
                                    <p>{currentResult?.description}</p>
                                </div>
                            </>

                            <>
                                <div className="border-[#116466] border-[2px] whitespace-pre-line p-[20px] rounded-[30px] max-lg:text-[14px] mt-[30px] text-[18px] leading-[25px] font-normal w-full">
                                В знак качестве поддержки, мы бы хотели подарить вам <b className="font-bold">бесплатную сессию</b> с психологом из Хранителей. Сессия - 55 минут, онлайн, по видеосвязи. Готовы сейчас оставить запрос и выбрать время?
                                </div>
                            </>

                        </div>
                    </div>

                    <button
                        onClick={handleContinueClick}
                        className={`w-full text-[#FFFFFF] p-[14px] max-lg:text-[14px] shrink-0 bg-[#116466] rounded-[50px] font-normal text-[18px] leading-[25px] sticky bottom-[30px]`}
                    >
                        Оставить заявку
                    </button>

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