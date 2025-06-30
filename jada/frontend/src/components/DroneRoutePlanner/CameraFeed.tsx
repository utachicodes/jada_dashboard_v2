import "../../styles/CameraFeed.scss"
import { FaExpand } from "react-icons/fa";
import InputBox from "../../utils/components/InputBox";
import { useState } from "react";

interface droneItem {
  droneName : string,
  URL : string
}

const DroneList: droneItem[] = [
  {
    droneName : "Drone 1",
    URL : ""
  },
    {
    droneName : "Drone 2",
    URL : ""
  }
  ,
    {
    droneName : "Drone 3",
    URL : ""
  }
]

const CameraFeed:React.FC = () => {
  const [currentURL, setCurrentURL] = useState<Record<string, string>>(
  () =>
    DroneList.reduce((acc, drone) => {
      acc[drone.droneName] = "";
      return acc;
    }, {} as Record<string, string>)
);
  const [selectedDrone, setSelectedDrone] = useState<string>(DroneList[0].droneName);

  const handleURLchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentURL(info => ({
      ...info,
      [selectedDrone]: e.target.value,
    }));
  };

  const handleDroneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDrone(e.target.value);
  };


  return (<>
     <div className="camera-feed_main_container" >
      <header>
          <h3>Camera Feed</h3>
           <button className="map-control-button" aria-label="Full screen">
                <FaExpand />
           </button>
      </header>
      <div className="camera-feed-content">
        <div className="camera-placeholder">
          <span>Live feed will appear here when drone is in flight</span>
        </div>
      </div>
      <select className="input_box_component_wrapper" value={selectedDrone} onChange={handleDroneChange}>
          {DroneList.map((item)=>{
            return <option key={item.droneName}>{item.droneName}</option>
          })}
      </select>
      <InputBox placeholder="RTSP URL" changeEvent={handleURLchange} value={currentURL[selectedDrone]}/>
    </div>
  </>)
}

export default CameraFeed