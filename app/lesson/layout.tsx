type Props = {
    children: React.ReactNode;
}

const LessonLayout = ({ children }: Props) => {
    return (
        <div className="flex flex-col h-full min-h-screen bg-[#1e1e1e]">
            <div className="flex flex-col h-full w-full">
                {children}
            </div>
        </div>
    );
};
 
export default LessonLayout;