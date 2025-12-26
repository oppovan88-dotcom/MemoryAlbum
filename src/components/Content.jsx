import Memory from "@/components/Memory";
import Slide from "@/components/Slide";
import Mail from "@/components/Mail";
import Relationship from "@/components/Relationship";
import Plan from "@/components/Plan";
import MoneySavingYearPlan from "@/components/Moneysavingyearplan";
import Christmas from "@/components/Christmas";

const Content = ({ nightMode }) => {
    return (
        <div>
            {/* 🎄 Christmas Celebration Banner */}
            <Christmas nightMode={nightMode} />
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
