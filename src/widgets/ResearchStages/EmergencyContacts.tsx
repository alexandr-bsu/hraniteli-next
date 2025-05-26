import { COLORS } from '@/shared/constants/colors';
import axios from 'axios';
import { useEffect } from 'react';
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from 'react-redux';

interface EmergencyContactsProps {
    onClose: () => void;
}

const EMERGENCY_CONTACTS = {
    universal: [
        {
            title: 'Горячая линия Центра экстренной психологической помощи МЧС России',
            phone: '+7 495 989-50-50'
        },
        {
            title: 'Телефон экстренной психологической помощи для детей и взрослых Института «Гармония»',
            phone: '+7 800 500-22-87'
        },
        {
            title: 'Горячая линия психологической помощи Московского института психоанализа',
            phone: '+7 800 500-22-87'
        }
    ],
    severe: [
        {
            title: 'Горячая линия Центра экстренной психологической помощи МЧС России',
            phone: '+7 495 989-50-50'
        },
        {
            title: 'Горячая линия службы «Ясное утро»',
            phone: '+7 800 100-01-91'
        },
        {
            title: 'Горячая линия помощи неизлечимо больным людям',
            phone: '+7 800 700-84-36'
        }
    ],
    women: [
        {
            title: 'Центр «Насилию.нет»',
            phone: '+7 495 916-30-00'
        },
        {
            title: 'Телефон доверия для женщин, пострадавших от домашнего насилия кризисного Центра «АННА»',
            phone: '8 800 7000 600'
        }
    ],
    children: [
        {
            title: 'Телефон доверия для детей, подростков и их родителей',
            phone: '8 800 2000 122'
        },
        {
            title: 'Проект группы кризисных психологов из Петербурга «Твоя территория.онлайн»',
            phone: '+7 800 200-01-22'
        }
    ]
};

export const EmergencyContacts = ({ onClose }: EmergencyContactsProps) => {

    const dispatch = useDispatch();
    const ticketID = useSelector<RootState, string>(
            state => state.applicationFormData.ticketID
        );
    
    useEffect(()=>{
    axios({
      method: "PUT",
      url: "https://n8n-v2.hrani.live/webhook/update-tracking-step",
      data: { step: "Контакты экстренных служб", ticket_id:ticketID },
    });
    }, [])

    return (
        <div className="flex flex-col w-full h-full px-[50px] py-[30px] max-lg:px-[20px]">
            <h2 className="text-[20px] font-semibold mb-[20px]">
                Контакты экстренной психологической помощи
            </h2>

            <div className="flex flex-col gap-[30px] overflow-y-auto max-h-[calc(100vh-300px)] min-lg:max-h-[450px]">
                <section>
                    <h3 className="text-[18px] font-semibold mb-[15px]">
                        Универсальные службы:
                    </h3>
                    <div className="flex flex-col gap-[15px]">
                        {EMERGENCY_CONTACTS.universal.map((contact, index) => (
                            <div key={index} className="p-[20px] border rounded-[15px]">
                                <p className="text-[16px] mb-[10px]">{contact.title}</p>
                                <p className="text-[18px] font-semibold">{contact.phone}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h3 className="text-[18px] font-semibold mb-[15px]">
                        Помощь людям с тяжёлыми заболеваниями:
                    </h3>
                    <div className="flex flex-col gap-[15px]">
                        {EMERGENCY_CONTACTS.severe.map((contact, index) => (
                            <div key={index} className="p-[20px] border rounded-[15px]">
                                <p className="text-[16px] mb-[10px]">{contact.title}</p>
                                <p className="text-[18px] font-semibold">{contact.phone}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h3 className="text-[18px] font-semibold mb-[15px]">
                        Помощь женщинам в кризисе:
                    </h3>
                    <div className="flex flex-col gap-[15px]">
                        {EMERGENCY_CONTACTS.women.map((contact, index) => (
                            <div key={index} className="p-[20px] border rounded-[15px]">
                                <p className="text-[16px] mb-[10px]">{contact.title}</p>
                                <p className="text-[18px] font-semibold">{contact.phone}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h3 className="text-[18px] font-semibold mb-[15px]">
                        Помощь детям и подросткам:
                    </h3>
                    <div className="flex flex-col gap-[15px]">
                        {EMERGENCY_CONTACTS.children.map((contact, index) => (
                            <div key={index} className="p-[20px] border rounded-[15px]">
                                <p className="text-[16px] mb-[10px]">{contact.title}</p>
                                <p className="text-[18px] font-semibold">{contact.phone}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <div className="shrink-0 mt-[30px]">
                <button
                    onClick={onClose}
                    className={`w-full border-[1px] bg-[${COLORS.primary}] p-[12px] text-[${COLORS.white}] font-normal text-[18px] rounded-[50px]`}
                >
                    Закрыть
                </button>
            </div>
        </div>
    );
}; 