import Memory from "@/components/Memory";
import Slide from "@/components/Slide";
import Mail from "@/components/Mail";
import Relationship from "@/components/Relationship";
import Plan from "@/components/Plan";
import MoneySavingYearPlan from "@/components/Moneysavingyearplan";
import NewYear from "@/components/NewYear";
import UpcomingCelebrations from "@/components/UpcomingCelebrations";

const Content = ({ nightMode, currentTheme, appearance }) => {
    return (
        <div>
            {/* 🎆 Happy New Year 2026 Countdown Banner */}
            {/* <NewYear nightMode={nightMode} currentTheme={currentTheme} appearance={appearance} /> */}

            {/* 🎉 Upcoming Celebrations - Birthdays, Anniversary, Khmer New Year, etc. */}
            <UpcomingCelebrations nightMode={nightMode} currentTheme={currentTheme} appearance={appearance} />

            {/* <Slide /> */}
            <Relationship nightMode={nightMode} currentTheme={currentTheme} appearance={appearance} />
            <Memory nightMode={nightMode} currentTheme={currentTheme} appearance={appearance} />
            <Plan nightMode={nightMode} currentTheme={currentTheme} appearance={appearance} />
            {/* <MoneySavingYearPlan nightMode={nightMode} /> */}
            <Mail nightMode={nightMode} currentTheme={currentTheme} appearance={appearance} />
        </div>
    );
};

export default Content;
