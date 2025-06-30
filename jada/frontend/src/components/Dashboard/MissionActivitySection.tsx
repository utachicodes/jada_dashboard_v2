import React from "react";
import MissionHeatmapGrid from "./MissionHeatmapGrid";

interface Props {
  yearOptions: number[];
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  heatmapData: any;
}

interface Props {
  yearOptions: number[];
  selectedYear: number;
  setSelectedYear: (year: number) => void;
}



const YearSelector: React.FC<Props> = ({ yearOptions, selectedYear, setSelectedYear }) => {
  const currentIndex = yearOptions.indexOf(selectedYear);
  return (
    <div className="year-selector">
      <button
        className="year-nav-button"
        onClick={() => currentIndex < yearOptions.length - 1 && setSelectedYear(yearOptions[currentIndex + 1])}
        disabled={currentIndex === yearOptions.length - 1}
      >
        &lt;
      </button>
      <select
        className="year-select"
        value={selectedYear}
        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
      >
        {yearOptions.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      <button
        className="year-nav-button"
        onClick={() => currentIndex > 0 && setSelectedYear(yearOptions[currentIndex - 1])}
        disabled={currentIndex === 0}
      >
        &gt;
      </button>
    </div>
  );
};

const HeatmapLegend: React.FC = () => (
  <div className="activity-legend">
    <div className="legend-item">
      <span className="legend-color no-missions"></span> <span>No missions</span>
    </div>
    <div className="legend-item">
      <span className="legend-color missions-1-3"></span> <span>1–3 missions</span>
    </div>
    <div className="legend-item">
      <span className="legend-color missions-4-plus"></span> <span>4+ missions</span>
    </div>
    <div className="legend-item">
      <span className="legend-color failed-missions"></span> <span>Failed missions</span>
    </div>
    <div className="legend-item">
      <span className="legend-color mixed-results"></span> <span>Mixed results</span>
    </div>
  </div>
);


const MissionActivitySection: React.FC<Props> = ({
  yearOptions,
  selectedYear,
  setSelectedYear,
  heatmapData,
}) => (
  <div className="mission-activity">
    <div className="activity-header">
      <h2 className="section-title">Mission Activity</h2>
      <YearSelector 
        heatmapData={heatmapData}
        yearOptions={yearOptions}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
      />
    </div>

    <HeatmapLegend />

    <div className="month-labels">
      {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
        (month, idx) => (
          <div key={idx} className="month-label">
            {month}
          </div>
        )
      )}
    </div>

    <MissionHeatmapGrid heatmapData={heatmapData} />
  </div>
);

export default MissionActivitySection;
