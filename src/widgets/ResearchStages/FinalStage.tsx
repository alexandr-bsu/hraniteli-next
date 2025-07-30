"use client"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { useDispatch } from "react-redux"
import { setRid, setBid, setApplicationStage } from "@/redux/slices/application_form"
import axios from "axios"
import { useEffect } from "react"
import { TextTooltip } from "@/shared/ui/Tooltip/TextTooltip";


export const FinalStage = () => {
  const dispatch = useDispatch()

  const occupation = typeof window !== 'undefined' ? localStorage.getItem('app_occupation') : null;

  const ticketID = useSelector<RootState, string>(
    state => state.applicationFormData.ticketID
  );

  const searchParams = useSearchParams()

  const utm_client = searchParams.get('utm_client')
  const utm_campaign = searchParams.get('utm_campaign')
  const utm_content = searchParams.get('utm_content')
  const utm_medium = searchParams.get('utm_medium')
  const utm_source = searchParams.get('utm_source')
  const utm_term = searchParams.get('utm_term')

  useEffect(() => {
    axios({
      method: "PUT",
      url: "https://n8n-v2.hrani.live/webhook/update-tracking-step",
      data: { step: "Исследовательская часть отправлена", ticket_id: ticketID },
    });
  }, [])

  const router = useRouter()


  const handleClose = () => {
    // Очищаем localStorage
    if (typeof window !== 'undefined') {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('app_')) {
          localStorage.removeItem(key)
        }
      })
    }

    // Возвращаемся на главную
    router.push('/')
  }
  

  const handleContinueClick = () => {
    // Открываем телеграм бота с тикетом
    // window.open(`https://psy.hrani.live/application_form`)
    dispatch(setApplicationStage('name'))
    router.push('/application_form/?research=true'+'&utm_client='+utm_client+'&utm_campaign='+utm_campaign+'&utm_content='+utm_content+'&utm_medium='+utm_medium+'&utm_source='+utm_source+'&utm_term='+utm_term)
  }

  useEffect(() => {
    const request = {
      "age": "",
      "city": localStorage.getItem('app_city') || '',
      "sex": "",
      "psychoEducated": localStorage.getItem('app_psychologist_education') === 'practic' ? 'Да, я практикующий специалист' :
        localStorage.getItem('app_psychologist_education') === 'other_speciality' ? 'Да, но работаю в другой сфере' :
          localStorage.getItem('app_psychologist_education') === 'student' ? 'В процессе получения' :
            localStorage.getItem('app_psychologist_education') === 'no' ? 'Нет' : '',

      "anxieties": [],
      "customAnexiety": "",
      "hasPsychoExperience": localStorage.getItem('app_experience') === 'earlier' ? 'Да, я работал(а) с психологом/психотерапевтом' :
        localStorage.getItem('app_experience') === 'supposed' ? 'Нет, но рассматривал(а) такую возможность' : '',

      "meetType": localStorage.getItem('app_meeting_type') === 'online' ? 'Онлайн' :
        localStorage.getItem('app_meeting_type') === 'offline' ? 'Оффлайн' :
          localStorage.getItem('app_meeting_type') === 'both' ? 'И так и так' : '',

      "selectionСriteria": localStorage.getItem('app_choose_preferences') === 'friends' ? 'По рекомендациям знакомых' :
        localStorage.getItem('app_choose_preferences') === 'self' ? 'Самостоятельно просматривал(а) анкеты в интернете или читал(а) отзывы' :
          localStorage.getItem('app_choose_preferences') === 'service' ? 'Через сервис, который сам подбирает подходящего специалиста' : '',

      "custmCreteria": "",
      "importancePsycho": [],
      "customImportance": "",
      "agePsycho": "",
      "sexPsycho": "",

      "priceLastSession": localStorage.getItem('app_experience') == 'earlier' ?
        localStorage.getItem('app_last_session_price') === 'free' ? 'Бесплатно' :
          localStorage.getItem('app_last_session_price') === '<1000' ? 'Меньше 1000 руб.' :
            localStorage.getItem('app_last_session_price') === '<3000' ? 'Меньше 3000 руб.' :
              localStorage.getItem('app_last_session_price') === '<5000' ? 'Меньше 5000 руб.' :
                localStorage.getItem('app_last_session_price') === '5000+' ? '5000 руб. и более' : ''
        : '',

      "durationSession": localStorage.getItem('app_experience') == 'earlier' ?
        localStorage.getItem('app_session_duration') === '<1 month' ? 'До месяца' :
          localStorage.getItem('app_session_duration') === '2-3 months' ? '2-3 месяца' :
            localStorage.getItem('app_session_duration') === '<1 year' ? 'До года' :
              localStorage.getItem('app_session_duration') === '>1 year' ? 'Более года' : ''
        : '',

      "reasonCancel": localStorage.getItem('app_experience') == 'earlier' ?
        localStorage.getItem('app_cancel_reason') === 'solved' ? 'Помогло, проблема была решена' :
          localStorage.getItem('app_cancel_reason') === 'new_psychologist' ? 'Не помогло, выбрал(а) нового' :
            localStorage.getItem('app_cancel_reason') === 'full_cancel' ? 'Не помогло, вообще прекратил(а)' :
              localStorage.getItem('app_cancel_reason') === 'expensive' ? 'Дорого' :
                localStorage.getItem('app_cancel_reason') === 'uncomfortable' ? 'Неудобно по времени/формату/месту' :
                  localStorage.getItem('app_cancel_reason') === 'in_therapy' ? 'Я всё еще в терапии' : ''
        : '',

      "pricePsycho": localStorage.getItem('app_experience') == 'supposed' ?
        localStorage.getItem('app_last_session_price') === 'free' ? 'Бесплатно' :
          localStorage.getItem('app_last_session_price') === '<1000' ? 'Меньше 1000 руб.' :
            localStorage.getItem('app_last_session_price') === '<3000' ? 'Меньше 3000 руб.' :
              localStorage.getItem('app_last_session_price') === '<5000' ? 'Меньше 5000 руб.' :
                localStorage.getItem('app_last_session_price') === '5000+' ? '5000 руб. и более' : ''
        : '',

      "reasonNonApplication": localStorage.getItem('app_experience') == 'supposed' ?
        localStorage.getItem('app_cancel_reason') === 'solved' ? 'Проблемы сами разрешились' :
          localStorage.getItem('app_cancel_reason') === 'no trust' ? 'Не было доверия' :
            localStorage.getItem('app_cancel_reason') === 'expensive' ? 'Дорого' :
              localStorage.getItem('app_cancel_reason') === 'other' ? 'Другая причина' : ''
        : '',

      "contactType": "",
      "contact": "",
      "name": "",
      "is_adult": false,
      "is_last_page": false,
      "occupation": localStorage.getItem('app_occupation') === 'fulltime' ? 'Постоянная работа в найме' :
        localStorage.getItem('app_occupation') === 'freelance' ? 'Фрилансер/самозанятый/работаю на себя' :
          localStorage.getItem('app_occupation') === 'business' ? 'Предприниматель' :
            localStorage.getItem('app_occupation') === 'additional income' ? 'Не работаю, есть доп. источник дохода' :
              localStorage.getItem('app_occupation') === 'no income' ? 'Не работаю, нет доп. источников доходов' : 'Постоянная работа в найме',

      "utm_client": utm_client || 'null',
      "utm_campaign": utm_campaign || 'null',
      "utm_content": utm_content || 'null',
      "utm_medium": utm_medium || 'null',
      "utm_source": utm_source || 'null',
      "utm_term": utm_term || 'null',
      "referer": "https://hrani.live/psy-client-info"
    }

    axios({
      method: 'POST',
      data: { ...request },
      url: 'https://n8n-v2.hrani.live/webhook/research-tilda-zayavka'
    }).then(resp => {
      axios({
        method: 'get',
        url: 'https://n8n-v2.hrani.live/webhook/get-sheets-row-number'
      }).then(
        resp_row => {
          console.log('resp_row', resp_row)
          dispatch(setRid(resp_row.data.rowId))
          dispatch(setBid(resp_row.data.baserowId))
        }
      )
    })
  }, [])



  return (
    <div className='relative min-lg:p-[50px] p-[20px] max-lg:px-[20px] flex-col min-h-full h-[100svh] justify-between  flex w-full grow'>
      <div className=" flex h-full w-full justify-center items-center flex-col px-[30px] gap-[30px]">
        <div className="grow w-full flex flex-col items-center justify-center">
          <Image className="max-lg:w-[140px] max-lg:h-[140px]" src={'/card/thanks.svg'} alt="Спасибо" height={210} width={210} />

          <div className="flex flex-col items-center gap-[10px]">
            <h2 className="font-semibold text-[26px] max-lg:text-[14px] max-lg:leading-[22px]">Спасибо!</h2>
          </div>

          {occupation === 'no income' ? (
            <>
              <div className="border-[#D4D4D4] border-[2px] p-[20px] text-center rounded-[30px] max-lg:text-[14px] mt-[30px] flex flex-col justify-center items-center text-[18px] leading-[25px] font-normal w-full">
                <span>Сейчас мы не можем подобрать подходящего для вас психолога 🙏 Вы можете подать заявку в Руку Помощи
                  <TextTooltip text="В рамках проекта вы можете найти психолога для длительной терапии со стоимостью 8 сессий (2 месяца терапии) бесплатно или по своей цене">
                    <span className="inline-flex align-middle ml-1"><img src='card/hint.svg' width={20} height={20} /></span>
                  </TextTooltip>
                  , и мы сообщим вам, когда психолог освободится
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="border-[#D4D4D4] border-[2px] p-[20px] text-center rounded-[30px] max-lg:text-[14px] mt-[30px] flex justify-center items-center text-[18px] leading-[25px] font-normal w-full">
                В знак благодарности мы обещали подарить бесплатную сессию с аналитическим психологом из Хранителей. Сессия - 55 минут, онлайн, по видеосвязи. Первая сессия - бесплатная, вторая и последующие - по цене психолога на карточке. Готовы сейчас оставить запрос и выбрать время?
              </div>
            </>
          )}
        </div>
      </div>
      {occupation === 'no income' ? (
        <a
          href="https://hrani.live/help-hand-registration"
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full text-[#FFFFFF] p-[14px] max-lg:text-[14px] shrink-0 bg-[#116466] rounded-[50px] font-normal text-[18px] leading-[25px] flex items-center justify-center text-center`}
        >
          Оставить заявку
        </a>
      ) : (
        <button
          onClick={handleContinueClick}
          className={`w-full text-[#FFFFFF] p-[14px] max-lg:text-[14px] shrink-0 bg-[#116466] rounded-[50px] font-normal text-[18px] leading-[25px]`}
        >
          Да
        </button>
      )}
    </div>
  )
}
