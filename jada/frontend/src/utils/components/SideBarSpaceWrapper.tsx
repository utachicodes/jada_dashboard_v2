import DashboardSidebar from "../../components/Dashboard/DashboardSidebar";

interface props {
    children : React.ReactNode
}

const SideBarSpaceWrapper:React.FC<props> = ({children})=> {
    return <>
            <DashboardSidebar />
            <div className="sidebar_space_wrapper">
                {children}
            </div>
    </>
}

export default SideBarSpaceWrapper;