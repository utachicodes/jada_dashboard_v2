import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  FaRocket, 
  FaPlane,
  FaChartBar, 
  FaChartLine, 
  FaCog,
  FaAngleRight,
  FaAngleDown
} from "react-icons/fa";
import { RiDashboardFill } from "react-icons/ri";

const DashboardSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    operations: true,
    intelligence: true
  });

  const isActive = (path: string) => location.pathname === path;

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <aside className="dashboard-sidebar">
      <div className="dashboard-logo">
        <RiDashboardFill className="logo-icon" />
        <span>MISSION HQ</span>
      </div>

      <div className="sidebar-section">
        <div 
          className="sidebar-section-header" 
          onClick={() => toggleSection("operations")}
        >
          <h3 className="sidebar-title">OPERATIONS</h3>
          {expandedSections.operations ? <FaAngleDown /> : <FaAngleRight />}
        </div>
        
        {expandedSections.operations && (
          <ul className="sidebar-menu">
            <li 
              className={`sidebar-item ${isActive("/") ? "active" : ""}`} 
              onClick={() => navigate("/")}
            >
              <FaRocket className="sidebar-icon" />
              <span>Missions</span>
            </li>
            <li 
              className={`sidebar-item ${isActive("/drones") ? "active" : ""}`} 
              onClick={() => navigate("/drones")}
            >
              <FaPlane className="sidebar-icon" />
              <span>Drones</span>
            </li>
          </ul>
        )}
      </div>

      <div className="sidebar-section">
        <div 
          className="sidebar-section-header" 
          onClick={() => toggleSection("intelligence")}
        >
          <h3 className="sidebar-title">INTELLIGENCE</h3>
          {expandedSections.intelligence ? <FaAngleDown /> : <FaAngleRight />}
        </div>
        
        {expandedSections.intelligence && (
          <ul className="sidebar-menu">
            <li 
              className={`sidebar-item ${isActive("/reports") ? "active" : ""}`} 
              onClick={() => navigate("/reports")}
            >
              <FaChartBar className="sidebar-icon" />
              <span>Reports</span>
            </li>
            <li 
              className={`sidebar-item ${isActive("/analytics") ? "active" : ""}`} 
              onClick={() => navigate("/analytics")}
            >
              <FaChartLine className="sidebar-icon" />
              <span>Analytics</span>
            </li>
          </ul>
        )}
      </div>

      <div className="sidebar-footer">
        <div 
          className={`sidebar-item ${isActive("/settings") ? "active" : ""}`} 
          onClick={() => navigate("/settings")}
        >
          <FaCog className="sidebar-icon" />
          <span>Settings</span>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
