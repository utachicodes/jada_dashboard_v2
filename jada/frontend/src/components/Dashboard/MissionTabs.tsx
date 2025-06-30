import { FaThList, FaThLarge } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setShowCreateMission: (state: boolean) => void;
  viewMode: "grid" | "list" ; 
  setViewMode: React.Dispatch<React.SetStateAction<"grid" | "list">>;
}

const MissionTabs: React.FC<Props> = ({ activeTab, setActiveTab, setShowCreateMission, viewMode, setViewMode }) => {
  const navigate = useNavigate();
  
  const handleCreateMission = () => {
    // Navigate to the new mission creator page instead of showing the modal
    navigate('/create-mission');
  };
  
  return (
    <div className="mission-tabs">
      {["all", "completed", "progress", "planned", "aborted"].map((tab) => (
        <div
          key={tab}
          className={`mission-tab ${activeTab === tab ? "active" : ""}`}
          onClick={() => setActiveTab(tab)}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </div>
      ))}
      <div className="mission-tabs-actions">
        <div className="view-toggle">
          <button
            className={`view-toggle-button ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
          >
            <FaThLarge />
          </button>
          <button
            className={`view-toggle-button ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            aria-label="List view"
          >
            <FaThList />
          </button>
        </div>
        <button className="create-mission-button" onClick={handleCreateMission}>
          + Create Mission
        </button>
      </div>
    </div>
  );
};

export default MissionTabs;