import Image from "next/image";

export const FavoritesButton = () => {
    return (
        <>
            <button title="Добавить в избранное" type="button">
                <Image src={'/card/favorites_icon.svg'} alt="favorites" height={30} width={30} />
            </button>       
        </>
    );
};