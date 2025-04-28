'use client';

import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { findByFavorites } from "@/redux/slices/filter";
import { useRouter } from "next/navigation";

export const FavoritesButton = () => {
    const dispatch = useDispatch();
    const favorites = useSelector((state: RootState) => state.favorites.items);
    const count = favorites.length;
    const router = useRouter();

    const handleClick = () => {
        // Включаем фильтр избранного
        dispatch(findByFavorites({ 
            favoriteIds: favorites.map(item => item.id || '').filter(Boolean), 
            enabled: true 
        }));
        
        // Перенаправляем на главную страницу, если пользователь не на ней
        router.push('/');
    };

    return (
        <div className="relative inline-block cursor-pointer" onClick={handleClick}>
            <Image 
                src={'/card/heart-outline.svg'} 
                alt="Избранное" 
                height={24} 
                width={24}
                className="hover:opacity-80 transition-opacity"
            />
            {count > 0 && (
                <div className="absolute -top-2 -right-2 bg-[#116466] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {count}
                </div>
            )}
        </div>
    );
};