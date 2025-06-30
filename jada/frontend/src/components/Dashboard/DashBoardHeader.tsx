const DashboardHeader: React.FC = () => (
  <header className="dashboard-header">
    <div className="header-welcome">
      <h1>Welcome, Admin</h1>
      <p>Last Login: 01:58 AM IST, Jun 28, 2023</p>
    </div>
    <div className="header-actions">
      <div className="search-bar">
        <input type="text" placeholder="Search missions, drones, reports..." />
        <button className="search-button">🔍</button>
      </div>
      <div className="notification-bell"></div>
      <div className="user-profile">John Doe</div>
    </div>
  </header>
);

export default DashboardHeader;