// src/components/DiseaseSelectionModal/DiseaseSelectionModal.tsx
import React, { useState, useEffect } from 'react';
import './DiseaseSelectionModal.css';
import diseases from './diseases.json'; // Adjust path if needed

interface Disease {
    id: string;
    name: string;
    type: 'disease' | 'allergy';
    description: string;
}

interface DiseaseSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (selectedDiseases: string[]) => void;
}



const DiseaseSelectionModal: React.FC<DiseaseSelectionModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [selectedDiseases, setSelectedDiseases] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setSearchTerm(''); // Clear search term when modal opens
        }
    }, [isOpen]);

    const handleDiseaseClick = (id: string) => {
        setSelectedDiseases(prevSelected => {
            if (!prevSelected.includes(id)) {
                const updated = [...prevSelected, id];
                console.log("Updated selected diseases:", updated);
                return updated;
            }
            return prevSelected;
        });
    };

    const handleRemoveDisease = (id: string) => {
        setSelectedDiseases(selectedDiseases.filter(diseaseId => diseaseId !== id));
    };

    const handleSubmit = () => {
        console.log("Submitting selected diseases:", selectedDiseases);
        setLoading(true); // Set loading to true before the request
        onSubmit(selectedDiseases);
        setSelectedDiseases([]); // Clear selected diseases
        setTimeout(() => {
            setLoading(false); // Set loading to false after the request
            onClose();
        }, 2000);
    };

    const filteredDiseases = diseases.filter(disease =>
        disease.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="suggestion-modal-overlay">
            <div className="suggestion-modal-content">
                <button className="suggestion-modal-close-icon" onClick={onClose} type="button">
                    &times;
                </button>
                <h2 className="suggestion-modal-header">Select Diseases</h2>
                <input
                    type="text"
                    className="suggestion-modal-form-control"
                    placeholder="Search diseases..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                    <ul className="dropdown-menu">
                        {filteredDiseases.map(disease => (
                            <li key={disease.id} className="dropdown-item" onClick={() => handleDiseaseClick(disease.id)}>
                                {disease.name}
                                <span className="tooltip">{disease.type}: {disease.description}</span>
                            </li>
                        ))}
                    </ul>
                )}
                <div className="selected-diseases">
                    {selectedDiseases.map(diseaseId => (
                        <div key={diseaseId} className="disease-tag">
                            {diseases.find(disease => disease.id === diseaseId)?.name}
                            <button onClick={() => handleRemoveDisease(diseaseId)}>×</button>
                        </div>
                    ))}
                </div>
                <button className="suggestion-modal-btn-primary" onClick={handleSubmit} disabled={loading}>
                    {loading ? <span className="spinner"></span> : 'Generate'}
                </button>
            </div>
        </div>
    );
};

export default DiseaseSelectionModal;