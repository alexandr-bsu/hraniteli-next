'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch } from '@/redux/store'
import { getPsychologistAll } from '@/features/actions/getPsychologistAll'
import { Psychologist_cards } from '@/views'
import { fill_filtered_by_automatch_psy, setSelectedPsychologist } from '@/redux/slices/filter'
import { useSearchParams } from 'next/navigation'

export default function Home() {
  const dispatch = useAppDispatch()
  const searchParams = useSearchParams()
  const [isLoaded, setIsLoaded] = useState(false)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Получаем список психологов
        const psychologists = await getPsychologistAll()
        
        if (!psychologists?.length) {
          console.error('Не удалось получить список психологов')
          return
        }

        // Инициализируем список психологов
        dispatch(fill_filtered_by_automatch_psy(psychologists))

        // Проверяем, есть ли выбранный психолог
        const selectedPsychologistId = searchParams.get('selected_psychologist')
        
        if (selectedPsychologistId) {
          const psychologist = psychologists.find(p => p.id === selectedPsychologistId)
          if (psychologist) {
            // Устанавливаем выбранного психолога для автоскролла
            dispatch(setSelectedPsychologist(psychologist))
          }
        }

        // Указываем, что данные загружены
        setIsLoaded(true)
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error)
        setIsLoaded(true)
      }
    }
    
    fetchData()
  }, [dispatch, searchParams])

  return (
    <div className="w-full h-full flex max-lg:items-center max-lg:flex-col min-lg:justify-center">
      <Psychologist_cards isLoaded={isLoaded} />
    </div>
  )
}
