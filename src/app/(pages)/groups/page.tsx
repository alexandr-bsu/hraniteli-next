'use client'

import { useEffect, useState, Suspense } from 'react'
import { useAppDispatch } from '@/redux/store'
import { getPsychologistAll } from '@/features/actions/getPsychologistAll'
import { Psychologist_cards_groups, ApplicationForm } from '@/views'
import { fill_filtered_by_automatch_psy, setSelectedPsychologist } from '@/redux/slices/filter'
import { useSearchParams, usePathname } from 'next/navigation'

const MainContent = () => {
  const dispatch = useAppDispatch()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [isLoaded, setIsLoaded] = useState(false)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Получаем список психологов
        const psychologists = await getPsychologistAll(true)
        
        if (!psychologists?.length) {
          console.error('Не удалось получить список психологов')
          return
        }

        // Инициализируем список психологов
        dispatch(fill_filtered_by_automatch_psy(psychologists))
        
        // Проверяем, есть ли выбранный психолог
        const selectedPsychologistId = searchParams.get('selected_psychologist')
        
        if (selectedPsychologistId) {
          // Проверяем формат ID - если это не ID, а имя психолога
          let psychologist = psychologists.find(p => p.id === selectedPsychologistId)
          
          // Если не нашли по ID, пробуем найти по имени (для обратной совместимости)
          if (!psychologist) {
            psychologist = psychologists.find(p => p.name === selectedPsychologistId)
          }
          
          if (psychologist) {
            // Устанавливаем выбранного психолога для автоскролла
            dispatch(setSelectedPsychologist(psychologist))
          } else {
            console.error('Психолог с ID/именем', selectedPsychologistId, 'не найден')
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

  // Показываем анкету только на странице /application_form
  if (pathname === '/application_form') {
    return <ApplicationForm />
  }

  // На главной и других страницах показываем карточки психологов
  return (
    <div className="w-full h-full flex max-lg:items-center max-lg:flex-col min-lg:justify-center">
      <Psychologist_cards_groups isLoaded={isLoaded} />
    </div>
  )
}

export default function Home() {
  return (
    <main className='main'>
      <Suspense fallback={<div>Loading...</div>}>
        <MainContent />
      </Suspense>
    </main>
  )
}
