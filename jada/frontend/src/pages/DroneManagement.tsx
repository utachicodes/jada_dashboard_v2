import DashboardHeader from "../components/Dashboard/DashBoardHeader";
import DroneFleetTable from "../components/Dashboard/DroneFleetTable";

const DroneManagement:React.FC = () => {
    return (<>
                <div className="drone_management_container">
                    <DashboardHeader />
                   <DroneFleetTable />
                </div>
    </>)
}

export default DroneManagement;