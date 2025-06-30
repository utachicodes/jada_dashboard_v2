import React, { useEffect, useState } from "react";
import HomeDashBoardView from "../components/Dashboard/HomeDashBoardView";
import { getAllMissions } from "../api/missionApi";

const Dashboard: React.FC = () => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        setLoading(true);
        const response = await getAllMissions();
        setMissions(response.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    fetchMissions();
  }, []);

  return (
    <>
      <HomeDashBoardView missions={missions} loading={loading} />
    </>
  );
};

export default Dashboard;
