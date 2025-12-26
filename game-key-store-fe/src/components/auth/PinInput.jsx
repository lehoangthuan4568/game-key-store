import React, { useRef, useEffect } from 'react';

const PinInput = ({ value, onChange, length = 6, error, disabled }) => {
    const inputRefs = useRef([]);

    useEffect(() => {
        // Auto-focus first input
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (index, e) => {
        const inputValue = e.target.value.replace(/[^0-9]/g, '');
        
        if (inputValue.length > 1) {
            // Handle paste
            const pastedValue = inputValue.slice(0, length);
            const newValue = pastedValue.split('');
            onChange(pastedValue);
            
            // Focus next empty input
            const nextIndex = Math.min(pastedValue.length, length - 1);
            if (inputRefs.current[nextIndex]) {
                inputRefs.current[nextIndex].focus();
            }
            return;
        }

        const newPin = value.split('');
        newPin[index] = inputValue;
        const newPinString = newPin.join('');
        onChange(newPinString);

        // Auto-focus next input
        if (inputValue && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !value[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, length);
        onChange(pastedData);
        
        // Focus next empty or last input
        const nextIndex = Math.min(pastedData.length, length - 1);
        if (inputRefs.current[nextIndex]) {
            inputRefs.current[nextIndex].focus();
        }
    };

    return (
        <div className="flex justify-center gap-3 mb-6">
            {Array.from({ length }).map((_, index) => {
                const digit = value[index] || '';
                const isFilled = !!digit;
                const isActive = index === value.length;
                
                return (
                    <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        disabled={disabled}
                        className={`
                            w-14 h-14 text-center text-3xl font-bold rounded-lg
                            border-2 transition-all duration-300
                            ${error 
                                ? 'border-red-500 bg-red-500/10 text-red-400' 
                                : isFilled
                                    ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400 shadow-lg shadow-cyan-500/30'
                                    : 'border-gray-700 bg-gray-800/50 text-gray-400'
                            }
                            ${isActive ? 'ring-2 ring-cyan-500/50' : ''}
                            focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500
                            disabled:opacity-50 disabled:cursor-not-allowed
                        `}
                    />
                );
            })}
        </div>
    );
};

export default PinInput;

