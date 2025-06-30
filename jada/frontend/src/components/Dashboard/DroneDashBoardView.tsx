import type React from "react";
import DroneFleetTable from "./DroneFleetTable";
import WeeklyMissionActivity from "./WeeklyMissionActivity";
import ResourceAllocation from "./ResourceAllocation";

const DroneDashBoardView:React.FC = () => {
    return (
        <>
            <DroneFleetTable />
            <div className="dashboard-analytics-row">
            <WeeklyMissionActivity />
            <ResourceAllocation />
            </div>
        </>
    )
}

export default DroneDashBoardView