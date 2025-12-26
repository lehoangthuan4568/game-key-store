import React, { useState, useRef, useEffect } from 'react';
import { HiEye, HiEyeOff } from 'react-icons/hi';

const FloatingInput = ({ 
    id, 
    label, 
    type = 'text', 
    value, 
    onChange, 
    error, 
    required = false,
    showPasswordToggle = false,
    autoFocus = false,
    placeholder
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const inputRef = useRef(null);

    const hasValue = value && value.length > 0;
    const isActive = isFocused || hasValue;

    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    const inputType = showPasswordToggle && type === 'password' 
        ? (showPassword ? 'text' : 'password')
        : type;

    return (
        <div className="relative mb-6">
            <div className="relative">
                <input
                    ref={inputRef}
                    id={id}
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`
                        w-full bg-gray-800/50 border-2 rounded-lg px-4 pt-6 pb-2 
                        text-white transition-all duration-300
                        ${isFocused ? 'border-cyan-500 shadow-lg shadow-cyan-500/20' : 'border-gray-700'}
                        ${error ? 'border-red-500' : ''}
                        ${isActive ? 'bg-gray-800/70' : ''}
                        focus:outline-none focus:ring-0
                        placeholder-transparent
                    `}
                    placeholder={placeholder || label}
                    required={required}
                />
                <label
                    htmlFor={id}
                    className={`
                        absolute left-4 transition-all duration-300 pointer-events-none
                        ${isActive 
                            ? 'top-2 text-xs text-cyan-400 font-medium' 
                            : 'top-4 text-base text-gray-400'
                        }
                    `}
                >
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
                
                {showPasswordToggle && type === 'password' && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors"
                    >
                        {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                    </button>
                )}
            </div>
            
            {error && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1 animate-fade-in">
                    <span>⚠</span> {error}
                </p>
            )}
        </div>
    );
};

export default FloatingInput;

