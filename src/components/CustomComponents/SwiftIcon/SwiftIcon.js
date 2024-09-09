import React from 'react';

function SwiftIcon({ size = 18, color = '#000000', path = '' }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill={color}
        >
            {path}
        </svg>
    )
}

export default SwiftIcon;