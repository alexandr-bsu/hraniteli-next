import * as React from "react"

import { cn } from "../../features/utils"


interface IRadioItem {
    label: string
    value: string
}

interface RadioGroupProps {
    items: IRadioItem[]
    value?: string
    onChange?: (value: string) => void
    name?: string
    className?: string
    disabled?: boolean
    allowCustomOption?: boolean
    customOptionLabel?: string
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
    ({ className, items, value, onChange, name, disabled, allowCustomOption = false, customOptionLabel = "Свой вариант", ...props }, ref) => {
        const [customValue, setCustomValue] = React.useState("")
        const CUSTOM_OPTION_VALUE = "__custom__"

        const handleRadioChange = (itemValue: string) => {
            if (!onChange) return
            onChange(itemValue)
        }

        const handleCustomInputChange = (inputValue: string) => {
            setCustomValue(inputValue)
            if (!onChange) return

            if (inputValue.trim()) {
                onChange(`${CUSTOM_OPTION_VALUE}:${inputValue}`)
            } else {
                onChange(CUSTOM_OPTION_VALUE)
            }
        }

        const isCustomOptionSelected = value?.startsWith(CUSTOM_OPTION_VALUE)

        React.useEffect(() => {
            if (value?.startsWith(`${CUSTOM_OPTION_VALUE}:`)) {
                setCustomValue(value.split(':')[1] || "")
            }
        }, [value])

        return (
            <div ref={ref} className={cn("flex flex-col gap-[20px]", className)} {...props}>
                {items.map((item) => (
                    <RadioItem
                        key={item.value}
                        label={item.label}
                        value={item.value}
                        checked={value === item.value}
                        onChange={() => handleRadioChange(item.value)}
                        name={name || ''}
                        disabled={disabled} />
                ))}
                {allowCustomOption && (
                    <div className="flex flex-col gap-2">
                        <RadioItem
                            label={customOptionLabel ? customOptionLabel : 'Введите свой вариант'}
                            value={CUSTOM_OPTION_VALUE}
                            checked={isCustomOptionSelected || false}
                            onChange={() => handleRadioChange(CUSTOM_OPTION_VALUE)}
                            name={name || ''}
                            disabled={disabled} />

                        {isCustomOptionSelected && (
                            <div className="mt-2">
                                {/* <LabeledInput
                                    label={customOptionLabel ? customOptionLabel : 'Введите свой вариант'}
                                    value={customValue}
                                    onChange={(e) => handleCustomInputChange(e.target.value)}
                                    disabled={disabled}
                                /> */}
                            </div>
                        )}
                    </div>
                )}
            </div>
        )
    }
)

const RadioItem = ({ label, value, checked, onChange, name, disabled }: { label: string; name: string; value: string; checked: boolean; onChange?: () => void; disabled?: boolean }) => {
    return (
        <label data-slot="form-item" className="gap-2 flex flex-row items-start space-x-3 space-y-0 cursor-pointer">
            <input disabled={disabled} onChange={onChange} type="radio" name={name} value={value} checked={checked} style={{ position: "absolute", opacity: 0, margin: 0, width: "30px", height: "30px" }} />
            <span className="peer border-input data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground data-[state=checked]:border-accent focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 aria-invalid:border-destructive size-4 shrink-0 rounded-full border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 h-[30px] w-[30px] max-lg:h-[24px] max-lg:w-[24px] flex items-center justify-center" aria-hidden="true" style={{ backgroundColor: checked ? 'var(--color-background)' : 'transparent', borderColor: 'var(--color-input-border)', color: checked ? 'var(--color-background)' : 'transparent' }}>
                <div className="w-[12px] h-[12px] max-lg:w-[8px] max-lg:h-[8px] rounded-full" style={{ backgroundColor: checked ? 'var(--color-accent)' : 'transparent', opacity: checked ? 1 : 0 }}></div>
            </span>
            <span className="flex items-center gap-2 select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal">
                {label}
            </span>
        </label>
    )
}

RadioGroup.displayName = "RadioGroup"
export { RadioGroup, type IRadioItem, type RadioGroupProps }