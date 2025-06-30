const DashboardStats: React.FC = () => (
  <div className="dashboard-stats">
    {[
      { title: "Active Missions", value: "8", change: "+12%" },
      { title: "Deployed Drones", value: "24", change: "+5%" },
      { title: "Success Rate", value: "92%", change: "+3%" },
      { title: "Pending Reports", value: "7", change: "-2", negative: true }
    ].map((stat, idx) => (
      <div key={idx} className="stat-card">
        <div className="stat-title">{stat.title}</div>
        <div className="stat-value">{stat.value}</div>
        <div className={`stat-change ${stat.negative ? "negative" : "positive"}`}>
          {stat.change} from last week
        </div>
      </div>
    ))}
  </div>
);


export default DashboardStats;