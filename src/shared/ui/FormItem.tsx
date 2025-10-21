import React from 'react'


const FormItem = ({ children, title, description }: { children: React.ReactNode, title: string, description?: string }) => {
  return (
    <div className='grow'>
                <div className='grow p-[30px] max-lg:max-h-none max-lg:p-[15px] border-[1px] border-border rounded-[25px]'>
                    <h2 className='text-[20px] lg:text-[20px] md:text-[16px] max-lg:text-[14px] leading-[27px] max-lg:leading-[22px] font-semibold'>
                        {title}
                    </h2>
                    {description && <p className='text-secondary-foreground text-[18px] lg:text-[18px] mt-1 md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal'>
                        {description}
                    </p>}
                    <div className="relative mt-5">
                        {children}
                    </div>

                </div>

            </div>
  )
}

export default FormItem