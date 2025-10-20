import * as React from "react"

import { cn } from "../../features/utils"

interface ICheckboxItem {
    label: string
    value: string
}

interface CheckboxGroupProps {
    items: ICheckboxItem[]
    value?: string[]
    onChange?: (values: string[]) => void
    name?: string
    className?: string
    disabled?: boolean
    allowCustomOption?: boolean
    customOptionLabel?: string
}

const CheckboxGroup = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(
    ({ className, items, value = [], onChange, name, disabled, allowCustomOption = false, customOptionLabel = "Свой вариант", ...props }, ref) => {
        const [customValue, setCustomValue] = React.useState("")
        const CUSTOM_OPTION_VALUE = "__custom__"

        const handleCheckboxChange = (itemValue: string, checked: boolean) => {
            if (!onChange) return

            if (checked) {
                if (itemValue === CUSTOM_OPTION_VALUE) {
                    onChange([...value.filter(v => !v.startsWith(CUSTOM_OPTION_VALUE)), itemValue])
                } else {
                    onChange([...value, itemValue])
                }
            } else {
                if (itemValue === CUSTOM_OPTION_VALUE) {
                    onChange(value.filter(v => !v.startsWith(CUSTOM_OPTION_VALUE)))
                    setCustomValue("")
                } else {
                    onChange(value.filter(v => v !== itemValue))
                }
            }
        }

        const handleCustomInputChange = (inputValue: string) => {
            setCustomValue(inputValue)
            if (!onChange) return

            const newValue = value.filter(v => !v.startsWith(CUSTOM_OPTION_VALUE))
            if (inputValue.trim()) {
                newValue.push(`${CUSTOM_OPTION_VALUE}:${inputValue}`)
            } else if (value.some(v => v === CUSTOM_OPTION_VALUE)) {
                newValue.push(CUSTOM_OPTION_VALUE)
            }
            onChange(newValue)
        }

        const isCustomOptionSelected = value.some(v => v.startsWith(CUSTOM_OPTION_VALUE))

        React.useEffect(() => {
            const customItem = value.find(v => v.startsWith(`${CUSTOM_OPTION_VALUE}:`))
            if (customItem) {
                setCustomValue(customItem.split(':')[1] || "")
            }
        }, [value])

        return (
            <div ref={ref} className={cn("flex flex-col gap-[10px]", className)} {...props}>
                {items.map((item) => (

                    <CheckboxItem
                        key={item.value}
                        label={item.label}
                        value={item.value}
                        checked={value.includes(item.value)}
                        onChange={(e) => handleCheckboxChange(item.value, e.target.checked)}
                        name={name || ''}
                        disabled={disabled} />
                ))}
                {allowCustomOption && (
                    <div className="flex flex-col gap-2">

                        <CheckboxItem
                            label={customOptionLabel ? customOptionLabel : 'Введите свой вариант'}
                            value={CUSTOM_OPTION_VALUE}
                            checked={isCustomOptionSelected}
                            onChange={(e) => handleCheckboxChange(CUSTOM_OPTION_VALUE, e.target.checked)}
                            name={name || ''}
                            disabled={disabled} />

                        {isCustomOptionSelected && (
                            <div className="mt-2">
                                {/* <LabeledInput */}
                                {/* label={customOptionLabel ? customOptionLabel : 'Введите свой вариант'} */}
                                {/* value={customValue} */}
                                {/* onChange={(e) => handleCustomInputChange(e.target.value)} */}
                                {/* disabled={disabled} */}
                                {/* /> */}
                            </div>
                        )}
                    </div>
                )}
            </div>
        )
    }
)

const CheckboxItem = ({ label, value, checked, onChange, name, disabled }: { label: string; name: string; value: string; checked: boolean; onChange?: React.ChangeEventHandler<HTMLInputElement>; disabled?: boolean }) => {
    return (
        <label data-slot="form-item" className="gap-2 flex flex-row items-start space-x-3 space-y-0 cursor-pointer">
            <input disabled={disabled} onChange={onChange} type="checkbox" name={name} value={value} checked={checked} style={{ position: "absolute", opacity: 0, margin: 0, width: "30px", height: "30px" }} />
            <span className="peer border-input data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground data-[state=checked]:border-accent focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 h-[30px] w-[30px] max-lg:h-[24px] max-lg:w-[24px] flex items-center justify-center" aria-hidden="true" style={{ backgroundColor: checked ? 'var(--color-accent)' : 'transparent', borderColor: 'var(--color-accent)', color: checked ? 'var(--color-accent-foreground)' : 'transparent' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check">
                    <path d="M20 6 9 17l-5-5"></path>
                </svg>
            </span>
            <span className="flex items-center gap-2 select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal">
                {label}
            </span>
        </label>
    )
}

CheckboxGroup.displayName = "CheckboxGroup"

export { CheckboxGroup, type ICheckboxItem, type CheckboxGroupProps }