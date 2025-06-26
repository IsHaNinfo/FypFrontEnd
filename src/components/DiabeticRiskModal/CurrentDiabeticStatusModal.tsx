import React from "react";
import "./diabeticriskmodal.css";

interface CurrentDiabeticStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    assessmentData: any;
}

const FIELD_LABELS: Record<string, string> = {
    age: "Age",
    gender: "Gender",
    height: "Height (cm)",
    weight: "Weight (kg)",
    Waist_Circumference: "Waist Circumference (in)",
    Diet_Food_Habits: "Diet/Food Habits (per day)",
    Family_History: "Family History",
    Blood_Pressure: "Blood Pressure",
    Cholesterol_Lipid_Levels: "Cholesterol/Lipid Levels",
    Thirst: "Thirst",
    Fatigue: "Fatigue",
    Urination: "Urination",
    Vision_Changes: "Vision Changes",
    RiskLevel: "Expected Risk Level"
};

const FIELD_ORDER = [
    "age",
    "gender",
    "height",
    "weight",
    "Waist_Circumference",
    "Diet_Food_Habits",
    "Family_History",
    "Blood_Pressure",
    "Cholesterol_Lipid_Levels",
    "Thirst",
    "Fatigue",
    "Urination",
    "Vision_Changes",
    "RiskLevel"
];

function formatValue(key: string, value: any) {
    if (key === "gender") {
        if (value === "1.0") return "Male";
        if (value === "0.0") return "Female";
        return value;
    }
    if (key === "Diet_Food_Habits") {
        return value + (value === "1" ? " meal" : " meals");
    }
    return value;
}

const CurrentDiabeticStatusModal: React.FC<CurrentDiabeticStatusModalProps> = ({ isOpen, onClose, assessmentData }) => {
    if (!isOpen || !assessmentData) return null;

    const { formData, prediction, validationData, timestamp } = assessmentData;

    return (
        <div className="diabetic-modal-overlay">
            <div className="diabetic-modal-content">
                <button className="modal-close-icon" onClick={onClose} type="button">&times;</button>
                <div className="diabetic-modal-header">
                    <h2>Current Diabetic Status</h2>
                </div>
                <div className="diabetic-modal-body">
                    <p><strong>Date:</strong> {timestamp ? new Date(timestamp).toLocaleString() : "-"}</p>
                    <p><strong>Prediction:</strong> {typeof prediction === 'number' ? `${(prediction * 100).toFixed(2)}%` : prediction}</p>
                    <h3>Assessment Details:</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
                        <tbody>
                            {FIELD_ORDER.map((key) => (
                                <tr key={key}>
                                    <td style={{ fontWeight: 'bold', padding: '4px 8px', borderBottom: '1px solid #eee' }}>{FIELD_LABELS[key]}</td>
                                    <td style={{ padding: '4px 8px', borderBottom: '1px solid #eee' }}>{formatValue(key, formData?.[key] ?? "-")}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {validationData && (
                        <>
                            <h3>Validation Data:</h3>
                            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', background: '#f3f3f3', padding: '8px', borderRadius: '4px' }}>{JSON.stringify(validationData, null, 2)}</pre>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CurrentDiabeticStatusModal; 