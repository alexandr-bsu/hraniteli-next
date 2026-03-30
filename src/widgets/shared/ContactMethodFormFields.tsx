'use client';

import { Control, FieldPath, FieldValues, useWatch } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { COLORS } from '@/shared/constants/colors';
import { ContactBrandIcon } from '@/widgets/shared/ContactBrandIcon';
import {
  CONTACT_ICON_PATH,
  CONTACT_METHOD_FIELD_COPY,
  CONTACT_METHOD_OPTIONS,
  type ContactMethodOption,
} from '@/widgets/shared/contactMethodConfig';
import styles from '@/styles/input.module.scss';

type Props<T extends FieldValues> = {
  control: Control<T>;
  contactName: FieldPath<T>;
  contactTypeName: FieldPath<T>;
};

export function ContactMethodFormFields<T extends FieldValues>({
  control,
  contactName,
  contactTypeName,
}: Props<T>) {
  const activeType =
    (useWatch({ control, name: contactTypeName }) as ContactMethodOption | undefined) ?? 'Telegram';
  const copy = CONTACT_METHOD_FIELD_COPY[activeType];

  return (
    <>
      <FormField
        control={control}
        name={contactTypeName}
        render={({ field }) => (
          <FormItem className="mb-[20px]">
            <div className="flex flex-wrap gap-[10px] justify-start">
              {CONTACT_METHOD_OPTIONS.map((opt) => {
                const isActive = field.value === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => field.onChange(opt.value)}
                    className={`flex items-center gap-[8px] overflow-visible px-[16px] py-3 rounded-[50px] border text-[16px] leading-none max-lg:text-[14px] transition-colors ${
                      isActive
                        ? `border-[${COLORS.primary}] bg-[#F0FAFA] text-[${COLORS.primary}]`
                        : 'border-[#D4D4D4] text-[#333] hover:border-[#999]'
                    }`}
                  >
                    <ContactBrandIcon src={CONTACT_ICON_PATH[opt.value]} isActive={isActive} />
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={contactName}
        render={({ field: f, fieldState }) => (
          <div className="grow">
            <FormItem className="grow p-[30px] max-lg:max-h-none max-lg:p-[15px] border-[1px] rounded-[25px] border-[#D4D4D4]">
              <FormLabel className="text-[20px] lg:text-[20px] md:text-[14px] max-lg:text-[14px] leading-[27px] max-lg:leading-[22px] font-semibold">
                {copy.title}
              </FormLabel>
              <FormDescription className="text-neutral-500 dark:text-neutral-400 text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal">
                {copy.hint}
              </FormDescription>
              <div className={styles.input__text_container}>
                <Input
                  {...f}
                  value={f.value ?? ''}
                  placeholder=" "
                  autoComplete="off"
                  className={`${styles.input__text} text-[14px] w-full h-full px-[20px] bg-[#FAFAFA] rounded-[10px] border-none`}
                />
                <label className={`${styles.input__text_label} text-[14px]`}>
                  {copy.inputLabel}
                </label>
              </div>
              {fieldState.error?.message && (
                <span className="text-[#FF0000] text-[14px] mt-[5px]">
                  {String(fieldState.error.message)}
                </span>
              )}
            </FormItem>
          </div>
        )}
      />
    </>
  );
}
