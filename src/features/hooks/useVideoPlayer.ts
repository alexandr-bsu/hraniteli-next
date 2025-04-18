import { useEffect, useState } from "react";

interface IPlayerState {
    isPlaying: boolean,
    speed: number,
}

interface IPlayer{
    togglePlay: () => void;
    playerState: IPlayerState,
}

const useVideoPlayer = (videoElement: any): IPlayer => {
    const [playerState, setPlayerState] = useState<IPlayerState>({
        isPlaying: false,
        speed: 1,
    })

    const togglePlay = () => {
        setPlayerState((prev: any) => {
            return {
                ...prev,
                isPlaying: !prev.isPlaying
            }
        })
    }

    useEffect(() => {
        if (playerState.isPlaying) {
            videoElement.current.play()
        }
        else {
            videoElement.current.pause();
        }
    },[playerState.isPlaying, videoElement])

    return {
        playerState,
        togglePlay,
    }
}

export default useVideoPlayer;