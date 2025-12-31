import Memory from "@/components/Memory";
import Slide from "@/components/Slide";
import Mail from "@/components/Mail";
import Relationship from "@/components/Relationship";
import Plan from "@/components/Plan";
import MoneySavingYearPlan from "@/components/Moneysavingyearplan";
import NewYear from "@/components/NewYear";

const Content = ({ nightMode, appearance }) => {
    return (
        <div>
            {/* 🎆 Happy New Year 2026 Countdown Banner */}
            <NewYear nightMode={nightMode} appearance={appearance} />
            {/* <Slide /> */}
            <Relationship nightMode={nightMode} appearance={appearance} />
            <Memory nightMode={nightMode} appearance={appearance} />
            <Plan nightMode={nightMode} appearance={appearance} />
            {/* <MoneySavingYearPlan nightMode={nightMode} /> */}
            <Mail nightMode={nightMode} appearance={appearance} />
        </div>
    );
};

export default Content;
