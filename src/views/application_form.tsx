'use client'

import { generateTicketId } from "@/redux/slices/application_form_data";
import { ModalState } from "@/redux/store";
import ActionStage from "@/widgets/ApplicationStages/ActionStage";
import AgeStageApplication from "@/widgets/ApplicationStages/AgeStage";
import ConditionStage from "@/widgets/ApplicationStages/ConditionStage";
import { DiseasesPsychologistStage } from "@/widgets/ApplicationStages/DiseasesPsychologistStage";
import { DiseasesStage } from "@/widgets/ApplicationStages/DiseasesStage";
import { FailStage } from "@/widgets/ApplicationStages/FailStage";
import { FinalStage } from "@/widgets/ApplicationStages/FinalStage";
import { GenderStageApplication } from "@/widgets/ApplicationStages/GenderStage";
import { GenderStagePsychologist } from "@/widgets/ApplicationStages/GenderStagePsychologist";
import NameStageApplication from "@/widgets/ApplicationStages/NameStage";
import PreferencesStage from "@/widgets/ApplicationStages/PreferencesStage";
import PromocodeStage from "@/widgets/ApplicationStages/PromocodeStage";
import { PsychologistStage } from "@/widgets/ApplicationStages/PsychologistStage";
import { PsychologistStageTop } from "@/widgets/ApplicationStages/PsychologistStageTop";
import RequestStage from "@/widgets/ApplicationStages/RequestStage";
import Image from "next/image";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export const ApplicationForm = () => {
    const application_stage = useSelector<ModalState>( state => state.applicationForm.application_stage) as string;

    const dispatch = useDispatch();
    const ticketID = useSelector<ModalState>(state => state.applicationFormData.ticketID);

    useEffect(() => {
        if (ticketID === '' || ticketID === undefined || ticketID === null) {
            dispatch(generateTicketId());
        }
    },[])

    return (
        <>  
            <div className="w-full overflow-hidden h-screen min-lg:max-w-[960px] min-lg:rounded-[30px] min-h-[100svh] bg-[white]  flex flex-col">
                {
                    application_stage === 'gratitude' && <FinalStage /> 
                }
                {
                    application_stage === 'error' && <FailStage /> 
                }
                
                {
                    application_stage !== 'gratitude' && application_stage !== 'error' && 
                    <div className="w-full min-lg:rounded-[30px]  pt-[50px] shrink-0">
                        <div className="w-full flex justify-between min-lg:px-[50px] pb-[20px] max-lg:px-[20px]">
                            <div className="flex flex-col gap-[10px] ">
                                <h2 className="font-semibold text-[20px] max-lg:text-[16px] max-lg:leading-[22px] leading-[27px]">
                                    Подбор психолога
                                </h2>

                                <span className="font-normal text-[18px] leading-[25px] max-[360px]:w-[192px] max-lg:text-[14px]">Среднее время заполнения заявки - 5 минут</span>
                            </div>

                            <button type="button" className="cursor-pointer w-[50px] h-[50px] rounded-full flex justify-center items-center border-[1px] border-[#D4D4D4]">
                                <Image src={'/modal/cross.svg'} alt="cross" height={15} width={15} />
                            </button>
                        </div>

                        {
                            !["psychologist", "diseases_psychologist"].includes(application_stage)  && 
                            <>
                                <ul className="mt-[10px] min-lg:px-[50px] max-lg:px-[20px] gap-[10px] max-lg:flex max-lg:flex-col grid grid-cols-2 w-full justify-items-stretch">
                                    <li className="w-auto border-[1px] max-lg:h-[59px] border-[#D4D4D4] h-[85px] rounded-[15px] flex justify-between items-center p-[20px]">
                                        <span className="font-normal max-lg:text-[14px] text-[18px] leading-[25px]">
                                            Заявка заполнена на:
                                        </span>

                                        <div className="bg-[#116466] max-lg:h-[39px] max-lg:text-[14px] p-[10px] rounded-[6px] font-normal text-[18px] text-[white]">
                                            50%
                                        </div>
                                    </li>
                                    <li className="w-auto border-[1px] max-lg:h-[59px] border-[#D4D4D4] h-[85px] rounded-[15px] flex justify-between items-center p-[20px]">
                                        <span className="font-normal max-lg:text-[14px] text-[18px] leading-[25px]">
                                            Подходящие специалисты:
                                        </span>

                                        <div className="bg-[#116466] p-[10px] max-lg:h-[39px] max-lg:text-[14px] rounded-[6px] font-normal text-[18px] text-[white]">
                                            15
                                        </div>
                                    </li>
                                </ul>
                                <hr className="w-full border-t-[2px] border-dotted mt-[30px]  #000;" />
                            </>
                        } 
                        {
                            application_stage === 'psychologist' && <PsychologistStageTop /> 
                        }

                        {
                            ["psychologist", "diseases_psychologist"].includes(application_stage) && <hr className="w-full border-t-[2px] border-dotted my-[20px]  #000;" />
                        }
                    </div>
                    }
                    {
                        application_stage === 'diseases_psychologist' && <DiseasesPsychologistStage />
                    } 
                    {
                        application_stage === 'psychologist' && <PsychologistStage />
                    } 
                    {
                        application_stage !== 'psychologist' &&            
                        <>             
                            {
                                application_stage === 'name'  &&   <NameStageApplication />             
                            }
                            {
                                application_stage === 'age' && <AgeStageApplication />
                            }
                            {
                                application_stage === 'gender' && <GenderStageApplication />
                            } 
                            {
                                application_stage === 'preferences' && <PreferencesStage />
                            }
                            {
                                application_stage === 'gender_psychologist' && <GenderStagePsychologist />
                            } 
                            {
                                application_stage === 'request' && <RequestStage />
                            }
                            {
                                application_stage === 'condition' && <ConditionStage/>
                            }
                            {
                                application_stage === 'action' && <ActionStage />
                            }
                            {
                                application_stage === 'diseases' && <DiseasesStage />
                            } 
                            {
                                application_stage === 'promocode' && <PromocodeStage />
                            }
                        </>
                    }         
            </div>
        </>
    );
};