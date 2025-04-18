'use client'

import useVideoPlayer from "@/features/hooks/useVideoPlayer";
import clsx from "clsx";
import Image from "next/image";
import { useRef, useState } from "react";

// type Props = {
//     imageUrl: string,
// }

export const ProfileCard = () => { 
    const videoElement = useRef(null) as any;

    const { togglePlay } = useVideoPlayer(videoElement);

    // const [isLoading, setLoading] = useState(false);
    const [isLoaded, setLoaded] = useState(false);


    const handleUploadingData = () => {
        // setLoading(true);
        if (videoElement.current) {
            videoElement.current.src = "/videos/video2.mp4";
            videoElement.current.load();
            videoElement.current.play();
            // setLoading(false);
            setLoaded(true);
        }
    }

    return (
        <>
            <div className="h-[351px] w-[214px] relative overflow-hidden rounded-[10px] flex justify-center">
                {
                    <div className={clsx("invisible absolute h-full w-full ", {
                        ['visible'] : isLoaded
                    })}>
                        <video className="absolute min-h-full min-w-full object-cover" ref={videoElement} />
                    </div>
                }

                {
                    !isLoaded && <Image src={'/images/person.png'} alt="person" className="absolute h-[351px] w-[214px] object-cover " height={600} width={214} />
                }
            
                <div className="relative z-20 font-normal text-[16px] leading-[22px] m-[10px] h-[42px] bg-[#116466] flex justify-center items-center mt-[10px] rounded-[10px] text-[white]">
                    Подходит больше всего
                </div>

                {
                    <div className="absolute h-full w-full flex justify-center" onClick={() => {
                            if(!isLoaded) {
                                handleUploadingData()
                            }
                            togglePlay()
                        }}>
                        <Image src={'/card/PlayVideo.svg'} alt="PlayVideo" height={42} width={42} />
                    </div>
                }
            </div>
        </>
    );
};