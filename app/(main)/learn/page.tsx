import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";

const LearnPage = () => {
    return (
        <div className="flex flex-row-reverse gap-[48px] px-6">
            <StickyWrapper /*i can use flex-row-reverse here*/>
                sticky sidebar
            </StickyWrapper>
            
            <FeedWrapper /*and here*/>
                feed for lections
            </FeedWrapper>
        </div>
    );
};

export default LearnPage;