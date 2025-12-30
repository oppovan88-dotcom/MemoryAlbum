import Memory from "@/components/Memory";
import Slide from "@/components/Slide";
import Mail from "@/components/Mail";
import Relationship from "@/components/Relationship";
import Plan from "@/components/Plan";
import MoneySavingYearPlan from "@/components/Moneysavingyearplan";
import NewYear from "@/components/NewYear";

const Content = ({ nightMode }) => {
    return (
        <div>
            {/* 🎆 Happy New Year 2026 Countdown Banner */}
            <NewYear nightMode={nightMode} />
            {/* <Slide /> */}
            <Relationship nightMode={nightMode} />
            <Memory nightMode={nightMode} />
            <Plan nightMode={nightMode} />
            {/* <MoneySavingYearPlan nightMode={nightMode} /> */}
            <Mail nightMode={nightMode} />
        </div>
    );
};

export default Content;
