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
