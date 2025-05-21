import Image from "next/image";

type Props = {
    question: string;
};

export const QuestionBubble = ({ question }: Props) => {
    return (
        <div className="flex items-center gap-x-4 mb-6">
            <Image
                src="/mascot.jpg"
                alt="mascot"
                width={60}
                height={60}
                className="hidden lg:block"
            />
            
            <Image
                src="/mascot.jpg"
                alt="mascot"
                width={40}
                height={40}
                className="block lg:hidden"
            />

            <div className="relative py-2 px-4 border-2 rounded-xl text-sm lg:text-base bg-[#232323] border-[#FF6F1F] text-[#f5f5f5]">
                {question}
                <div
                className="absolute -left-4 top-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-[#FF6F1F] transform -translate-y-1/2 rotate-90"
                />
            </div>

        </div>
    )
}