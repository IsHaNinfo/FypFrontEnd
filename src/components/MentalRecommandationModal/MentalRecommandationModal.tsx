import React from "react";
import "./style.css";
import { mentalRecommendationsMap } from "@/data/mentalRecommendation";
interface MentalRecommandationModalProps {
  show: boolean;
  onClose: () => void;
  scenario: string;
}

const MentalRecommandationModal: React.FC<MentalRecommandationModalProps> = ({
  show,
  onClose,
  scenario,
}) => {
  if (!show) return null;

  const data = mentalRecommendationsMap[scenario];

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <p>
          <strong>Stress Level:</strong> {data.stress}
        </p>
        <p>
          <strong>Mood:</strong> {data.mood}
        </p>
        <p>
          <strong>Recommendation:</strong> {data.recommendation}
        </p>
        <p>
          <strong>How to do it:</strong> {data.how}
        </p>
        <p>
          <strong>When:</strong> {data.when}
        </p>
        <p>
          <strong>Why it works:</strong> {data.why}
        </p>
        <p className="follow-up-note">
          <strong>Doctor Follow-up:</strong> {data.followUp}
        </p>
        <button className="modal-close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default MentalRecommandationModal;
