import React from "react";

interface MissionExportOptionsProps {
  missionId: string;
}

const MissionExportOptions: React.FC<MissionExportOptionsProps> = ({ missionId }) => {
  const handleExportPDF = () => {
    console.log(`Exporting PDF report for mission ${missionId}`);
    // In a real app, this would trigger a PDF export
  };
  
  const handleExportJSON = () => {
    console.log(`Exporting JSON data for mission ${missionId}`);
    // In a real app, this would trigger a JSON export
  };
  
  return (
    <div className="mission-export-options">
      <h2>Export Options</h2>
      <div className="export-buttons">
        <button className="export-button pdf" onClick={handleExportPDF}>
          <span className="export-icon"></span>
          Export PDF Report
        </button>
        <button className="export-button json" onClick={handleExportJSON}>
          <span className="export-icon"></span>
          Download JSON
        </button>
      </div>
    </div>
  );
};

export default MissionExportOptions;