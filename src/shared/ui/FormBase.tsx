import React from 'react'

/* showOnlyChildren - используется для отображения только контента, но с доступом к методам и данным формы
  (без прогресбара, заголовка и тд) (сообщениея о дальнейших действиях, сообщения об ошибках, повторные отправки, сообщения об успешной отправке и.т.д)
*/

const FormBase = ({ children, title, description, progress, showOnlyChildren }: { children: React.ReactNode, title: string, description?: string, progress?: number, isFormCompleted?: boolean, showOnlyChildren?: boolean }) => {
    return (
        <>
            {!showOnlyChildren && <div className="w-full overflow-hidden h-full bg-background text-foreground flex flex-col relative">
                <div className="w-full pt-[30px] pb-[30px] border-b border-border border-dashed">
                    <div className="w-full flex flex-col gap-[10px] justify-between min-lg:px-[50px] max-lg:px-[20px]">
                        <div className="flex flex-col md:gap-[10px] justify-center">
                            <h2 className="font-semibold text-[20px] max-lg:text-[14px] max-lg:leading-[22px] leading-[27px]">
                                {title}
                            </h2>
                            <span className="font-normal text-[18px] max-lg:text-[14px] leading-[25px] max-[360px]:w-[192px]">
                                {description}
                            </span>
                        </div>
                        {progress &&
                            <div className="w-auto border-[1px] max-lg:h-[59px] border-border h-[85px] rounded-[15px] flex justify-between items-center p-[20px] w-full">
                                <span className="font-normal max-lg:text-[14px] text-[18px] leading-[25px]">
                                    Заявка заполнена на:
                                </span>
                                <div className="bg-accent max-lg:h-[39px] max-lg:text-[14px] p-[10px] rounded-[6px] font-normal text-[18px] text-accent-foreground">
                                    {progress}%
                                </div>
                            </div>}
                    </div>
                </div>

                <div className="w-full min-lg:px-[50px] max-lg:px-[20px] pt-[30px] flex-1 flex flex-col overflow-y-auto">
                    {children}
                </div>
            </div>}
            {showOnlyChildren && <div className='w-full h-full bg-background text-foreground flex flex-col relative'>
                {children}
            </div>}
        </>
    )
}

export default FormBase