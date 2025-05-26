type Props = {
    question: string;
};

export const QuestionBubble = ({
    question,
}: Props) => {
    return (
        <div className="relative w-full">
            <div className="absolute -top-2 left-6 w-4 h-4 bg-[#2c2c2c] transform rotate-45"></div>
            <div className="w-full p-4 rounded-xl bg-[#2c2c2c] text-[#f5f5f5] text-base lg:text-lg font-medium shadow-lg">
                {question}
            </div>
        </div>
    );
};