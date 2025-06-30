import React from "react";
import { useParams } from "react-router-dom";
import MissionSummaryView from "../components/MissionSummary/MissionSummaryView";
import SideBarSpaceWrapper from "../utils/components/SideBarSpaceWrapper";

const MissionSummary: React.FC = () => {
  const { id, status } = useParams<{ id: string; status: string }>();
  
  return (
    <SideBarSpaceWrapper>
      <MissionSummaryView missionId={id} status={status} />
    </SideBarSpaceWrapper>
  );
};

export default MissionSummary;