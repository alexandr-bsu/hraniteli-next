
interface StageControllerProps {
    onNext: () => void
    onBack: () => void
    isValid: boolean
    showBack?: boolean
    showNext?: boolean
    nextButtonText?: string
    backButtonText?: string
}

export const StageController = ({
    onNext,
    onBack,
    isValid,
    showBack = true,
    showNext = true,
    nextButtonText = "Продолжить",
    backButtonText = "Назад"
}: StageControllerProps) => {

    return (

        <div className="shrink-0 py-[30px] max-lg:pb-[20px] flex gap-[10px]">
            {showBack && (
                <button
                    type="button"
                    onClick={() => onBack()}
                    className={`cursor-pointer shrink-0 w-[81px] border-[1px] border-accent min-lg:p-[12px] text-accent font-normal text-[18px] max-lg:text-[14px] rounded-[50px] max-lg:h-[47px]`}
                >
                    {backButtonText}
                </button>
            )}
            {showNext && (
                <button
                    type="button"
                    onClick={() => {
                        if (isValid) {
                            onNext()
                        }
                    }}
                    disabled={!isValid}
                    className={`cursor-pointer grow ${isValid ? 'bg-accent text-accent-foreground' : 'bg-accent/50 text-accent-foreground/50'} min-lg:p-[12px]  font-normal text-[18px] max-lg:text-[14px] rounded-[50px] max-lg:h-[47px]`}
                >
                    {nextButtonText}
                </button>
            )}
        </div>
     
    )
}