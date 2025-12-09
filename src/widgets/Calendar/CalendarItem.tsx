type Modality = 'Юнгианство' | 'КПТ' | 'Гештальт' | 'Психоанализ' | 'Общие';

interface CardItemProps {
    title: string;
    counter: string;
    author: string;
    modality?: Modality;
    is_registered?: boolean;
}

const CardItem: React.FC<CardItemProps> = ({
    title,
    counter,
    author,
    modality,
    is_registered = false,
}) => {

    const getBackgroundColor = (modality?: Modality) => {
        const colors: Record<Modality, string> = {
            'Юнгианство': '#8B5CF6',
            'КПТ': '#FCD34D',
            'Гештальт': '#1c9140',
            'Психоанализ': '#3B82F6',
            'Общие': '#10B981'
        }

        return modality ? colors[modality] : '#1c9140';
    }

    const getTextColor = (modality?: Modality) => {
        return modality === 'КПТ' ? 'text-gray-800' : 'text-white';
    }

    const getBadgeOpacity = (modality?: Modality) => {
        return modality === 'КПТ' ? 'bg-white/20' : 'bg-white/10';
    }

    const formatAuthor = (author: string) => {
        if (author.includes(',')) {
            return author.split(',').map((part, index) => (
                <div key={index} className='truncate' title={part.trim()}>
                    {part.trim()}
                </div>
            ));
        }
        return <div className='truncate' title={author}>{author}</div>;
    }
    return (
        <div className={`min-h-[100px] max-md:min-h-[80px] rounded-[30px] max-md:rounded-[20px] p-3 max-md:p-2 flex flex-col justify-between gap-4 max-md:gap-2 max-md:max-w-[200px] ${getTextColor(modality)} relative cursor-pointer hover:opacity-90 transition-opacity`}
            style={{ backgroundColor: getBackgroundColor(modality) }}>

            <div>
                <div className='flex justify-between items-start mb-1 max-md:mb-0.5'>
                    <div className='font-bold text-base max-md:text-sm'>{title}</div>
                    {is_registered && (
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className='opacity-80 flex-shrink-0 max-md:w-4 max-md:h-4'
                        >
                            <path d="m18 2 4 4-14 14H4v-4L18 2z" />
                            <path d="m14.5 5.5 4 4" />
                        </svg>
                    )}
                </div>
                <div className='text-base max-md:text-xs opacity-90'>{counter}</div>
            </div>
            <div className='flex justify-between items-center gap-2 min-w-0'>
                <div className='text-sm max-md:text-[10px] opacity-80 flex-1 min-w-0 overflow-hidden'>
                    {formatAuthor(author)}
                </div>
                {modality && (
                    <div className={`${getBadgeOpacity(modality)} rounded-full px-2 max-md:px-1.5 py-1 max-md:py-0.5 text-sm max-md:text-[10px] flex items-center justify-center flex-shrink-0`}>
                        {modality}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CardItem;
