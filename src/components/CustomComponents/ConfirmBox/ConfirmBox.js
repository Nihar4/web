import React, { useEffect, useRef, useState } from 'react';
import { render } from 'react-dom';
import { Cross } from '../SwiftIcon/Icons';
import Pulse from '../../Loader/Pulse';
import './ConfirmBox.css';
import { getDeviceSize } from '../../../exports/InteractiveUtils';
import { COLOR_VARS } from '../../../exports/ColorVars';

const DEVICE_SIZE = getDeviceSize();

const ConfirmBox = (config) => {
    let containerDOMNode = document.createElement('div');
    containerDOMNode.classList.add('confirm-box');
    document.body.appendChild(containerDOMNode);
    render(<ConfirmBoxComponent DOMRef={containerDOMNode} {...config} />, containerDOMNode);
}

function ConfirmBoxComponent({ DOMRef, title, description, properties, cancel = false }) {

    const BoxRef = useRef(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, []);


    const handleClickOutside = (event) => {
        if (BoxRef.current && !BoxRef.current.contains(event.target)) {
            closeConfirmBox && closeConfirmBox();
        }
    }

    function closeConfirmBox() {
        DOMRef && BoxRef && document.body.contains(DOMRef) && document.body.removeChild(DOMRef);
        setLoading(false);
    }

    function handleButtonClick(callback, args = []) {
        setLoading(true);
        setTimeout(() => {
            callback && callback(...args, closeConfirmBox);
        }, 1000);
    }

    return (
        <>
            <div ref={BoxRef} className="confirm-box-container">

                {loading && <>
                    <div className='confirm-box-loader'>
                        <Pulse />
                    </div>
                </>}

                <div className='confirm-box-header'>
                    <p className='confirm-box-title'>{title}</p>
                    <div className='confirm-box-close' onClick={closeConfirmBox}>
                        <Cross size={DEVICE_SIZE === 'S' ? 30 : 24} color={COLOR_VARS['SWIFT_COLOR4']} />
                    </div>
                </div>
                <div className='confirm-box-body'>
                    <p className='confirm-box-description'>{description}</p>
                </div>
                <div className='confirm-box-footer'>
                    {cancel && <>
                        <button className="btn" onClick={closeConfirmBox} >Cancel</button>
                    </>}
                    {properties.map((obj) => {
                        return (
                            <button key={obj.id} className="btn" onClick={() => { handleButtonClick(obj.handleFunction, obj.functionArgs) }} style={{ color: obj.color, }}>{obj.label}</button>
                        );
                    })}
                </div>

            </div>
        </>
    )
}

export default ConfirmBox;