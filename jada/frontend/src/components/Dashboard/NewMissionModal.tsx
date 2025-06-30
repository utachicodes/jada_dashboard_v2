
import React, { useState, type FormEvent } from "react";
import "../../styles/MissionModal.scss"; // Update this line

interface NewMissionModalProps {
  setShowCreateMission: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FormData {
  name: string;
  type: string;
  startDate: string;
  endDate: string;
  assignedDrones: string[];
  description: string;
}

interface FormErrors {
  name?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

const NewMissionModal: React.FC<NewMissionModalProps> = ({ setShowCreateMission }) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    type: "Surveillance",
    startDate: "",
    endDate: "",
    assignedDrones: [],
    description: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Mission name is required";
    }
    
    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }
    
    if (formData.startDate && formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = "End date must be after start date";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Mission description is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDroneSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      assignedDrones: selectedOptions
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Here you would typically make an API call to create the mission
      // For example: await api.createMission(formData);
      console.log("Mission data to submit:", formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Close modal on success
      setShowCreateMission(false);
    } catch (error) {
      console.error("Error creating mission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-mission-modal" role="dialog" aria-labelledby="mission-modal-title">
      <div className="modal-content">
        <h2 id="mission-modal-title">Create New Mission</h2>
        <form className="mission-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="mission-name">Mission Name</label>
            <input 
              id="mission-name"
              type="text" 
              name="name"
              placeholder="Enter mission name" 
              value={formData.name}
              onChange={handleInputChange}
              aria-required="true"
              aria-invalid={!!errors.name}
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="mission-type">Mission Type</label>
            <select 
              id="mission-type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
            >
              <option value="Surveillance">Surveillance</option>
              <option value="Delivery">Delivery</option>
              <option value="Inspection">Inspection</option>
              <option value="Mapping">Mapping</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="start-date">Start Date</label>
            <input 
              id="start-date"
              type="date" 
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              aria-required="true"
              aria-invalid={!!errors.startDate}
            />
            {errors.startDate && <div className="error-message">{errors.startDate}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="end-date">End Date</label>
            <input 
              id="end-date"
              type="date" 
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              aria-invalid={!!errors.endDate}
            />
            {errors.endDate && <div className="error-message">{errors.endDate}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="assigned-drones">Assigned Drones</label>
            <select 
              id="assigned-drones"
              multiple
              name="assignedDrones"
              onChange={handleDroneSelection}
              value={formData.assignedDrones}
            >
              <option value="Drone-001">Drone-001</option>
              <option value="Drone-002">Drone-002</option>
              <option value="Drone-003">Drone-003</option>
              <option value="Drone-004">Drone-004</option>
            </select>
            <small className="help-text">Hold Ctrl/Cmd to select multiple drones</small>
          </div>

          <div className="form-group">
            <label htmlFor="mission-description">Mission Description</label>
            <textarea 
              id="mission-description"
              name="description"
              placeholder="Enter mission details"
              value={formData.description}
              onChange={handleInputChange}
              aria-required="true"
              aria-invalid={!!errors.description}
            ></textarea>
            {errors.description && <div className="error-message">{errors.description}</div>}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() => setShowCreateMission(false)}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Mission"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewMissionModal;