import React, { useState } from 'react';
import "./CustomCheckbox.css"

const CustomCheckbox = ({ label, value, onChange }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    onChange(!isChecked, value);
  };

  return (
    <div className='custom-checkbox'>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          />
          <label className="custom-checkbox-label">
        {label}
      </label>
    </div>
  );
};

export default CustomCheckbox;
