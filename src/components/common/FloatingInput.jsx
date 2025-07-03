import React from 'react';
import styles from './FloatingInput.module.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const FloatingInput = ({
  type = 'text',
  id,
  name,
  value,
  onChange,
  label,
  error,
  required = false,
  placeholder = ' ',
  showPassword,
  onTogglePassword,
  disabled = false,
  className = '',
}) => {
  const isPassword = type === 'password';
  const isTextarea = type === 'textarea';
  
  if (isTextarea) {
    return (
      <div className={styles.inputWrapper}>
        <textarea
          id={id}
          name={name}
          className={`${styles.input} ${styles.textarea} ${error ? styles.inputError : ''} ${className}`}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          disabled={disabled}
          rows={4}
        />
        <label htmlFor={id} className={styles.floatingLabel}>
          {label}
        </label>
        {error && <span className={styles.errorText}>⚠ {error}</span>}
      </div>
    );
  }
  
  return (
    <div className={styles.inputWrapper}>
      <input
        type={isPassword && showPassword ? 'text' : type}
        id={id}
        name={name}
        className={`${styles.input} ${error ? styles.inputError : ''} ${className}`}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        disabled={disabled}
      />
     <label htmlFor={id} className={styles.floatingLabel}>
      {label} {required && <span style={{ color: 'red' }}>*</span>}
    </label>
      {isPassword && (
        <span className={styles.eyeIcon} onClick={onTogglePassword}>
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      )}
      {error && <span className={styles.errorText}>⚠ {error}</span>}
    </div>
  );
};

export default FloatingInput; 