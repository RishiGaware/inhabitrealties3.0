import React from 'react';
import styles from './FloatingInput.module.css';

const FloatingSelect = ({
  id,
  name,
  value,
  onChange,
  label,
  error,
  required = false,
  options = [],
  placeholder = 'Select...',
  disabled = false,
  className = '',
}) => {
  return (
    <div className={styles.inputWrapper}>
      <select
        id={id}
        name={name}
        className={`${styles.input} ${error ? styles.inputError : ''} ${className}`}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
      >
        <option value="">{placeholder}</option>
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <label htmlFor={id} className={styles.floatingLabel}>
        {label}
      </label>
      {error && <span className={styles.errorText}>⚠ {error}</span>}
    </div>
  );
};

export default FloatingSelect; 