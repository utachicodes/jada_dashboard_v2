import React from "react";
import url from "../../assets/FRAME.png"

interface CameraFeedItem {
  id: string;
  timestamp: string;
  imageUrl: string;
}

interface MissionCameraFeedProps {
  feedItems: CameraFeedItem[];
}

const MissionCameraFeed: React.FC<MissionCameraFeedProps> = ({ feedItems }) => {
  return (
    <div className="mission-camera-feed">
      <h2>Camera Feed Archive</h2>
      <div className="camera-feed-grid">
        {feedItems.map((item) => (
          <div key={item.id} className="camera-feed-item">
            <div className="feed-image-container">
              <img src={url} alt={`Camera feed at ${item.timestamp}`} />
              <div className="feed-timestamp">{item.timestamp}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MissionCameraFeed;