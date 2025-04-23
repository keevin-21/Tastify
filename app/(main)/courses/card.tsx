type Props = {
    title: string;
    id: number;
    imageSrc: string;
    onClick: (id: number) => void;
    disabled?: boolean;
    active?: boolean;
};

export const Card = ({}: Props) => {
    return(
        <div>
            card lol
        </div>
    );
};