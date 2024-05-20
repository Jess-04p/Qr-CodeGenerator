import React, { useState } from 'react';
import axios from 'axios';
import './QrCodeGenerator.css';

const QrCodeGenerator = () => {
    const [type, setType] = useState('url');
    const [inputData, setInputData] = useState({
        url: '',
        contact: {
            name: '',
            organization: '',
            title: '',
            phone: '',
            email: '',
            address: ''
        },
        wifi: {
            ssid: '',
            password: '',
            encryption: 'WPA'
        },
        text: ''
    });
    const [size, setSize] = useState(256);
    const [color, setColor] = useState({ dark: '#000000', light: '#ffffff' });
    const [errorCorrectionLevel, setErrorCorrectionLevel] = useState('M');
    const [qrCode, setQrCode] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = inputData[type];

        try {
            const response = await axios.post('http://localhost:5000/api/generate', {
                type,
                data,
                size,
                color,
                errorCorrectionLevel
            });
            setQrCode(response.data.qrCode);
        } catch (error) {
            console.error('Error generating QR code', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputData(prevState => ({
            ...prevState,
            [type]: {
                ...prevState[type],
                [name]: value
            }
        }));
    };

    const renderInputFields = () => {
        switch (type) {
            case 'url':
                return (
                    <div>
                        <input
                            type="text"
                            name="url"
                            value={inputData.url}
                            onChange={(e) => setInputData({ ...inputData, url: e.target.value })}
                            placeholder="Enter URL"
                            required
                        />
                    </div>
                );
            case 'contact':
                return (
                    <div>
                        <input
                            type="text"
                            name="name"
                            value={inputData.contact.name}
                            onChange={handleChange}
                            placeholder="Name"
                            required
                        />
                        <input
                            type="text"
                            name="organization"
                            value={inputData.contact.organization}
                            onChange={handleChange}
                            placeholder="Organization"
                        />
                        <input
                            type="text"
                            name="title"
                            value={inputData.contact.title}
                            onChange={handleChange}
                            placeholder="Title"
                        />
                        <input
                            type="tel"
                            name="phone"
                            value={inputData.contact.phone}
                            onChange={handleChange}
                            placeholder="Phone"
                        />
                        <input
                            type="email"
                            name="email"
                            value={inputData.contact.email}
                            onChange={handleChange}
                            placeholder="Email"
                        />
                        <input
                            type="text"
                            name="address"
                            value={inputData.contact.address}
                            onChange={handleChange}
                            placeholder="Address"
                        />
                    </div>
                );
            case 'wifi':
                return (
                    <div>
                        <input
                            type="text"
                            name="ssid"
                            value={inputData.wifi.ssid}
                            onChange={handleChange}
                            placeholder="SSID"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            value={inputData.wifi.password}
                            onChange={handleChange}
                            placeholder="Password"
                            required
                        />
                        <select
                            name="encryption"
                            value={inputData.wifi.encryption}
                            onChange={handleChange}
                        >
                            <option value="WPA">WPA/WPA2</option>
                            <option value="WEP">WEP</option>
                            <option value="nopass">No encryption</option>
                        </select>
                    </div>
                );
            case 'text':
                return (
                    <div>
                        <textarea
                            name="text"
                            value={inputData.text}
                            onChange={(e) => setInputData({ ...inputData, text: e.target.value })}
                            placeholder="Enter text"
                            rows="4"
                            required
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="form-container">
        <div className='bb'>
            <form onSubmit={handleSubmit}>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="url">URL</option>
                    <option value="contact">Contact</option>
                    <option value="wifi">Wi-Fi</option>
                    <option value="text">Text</option>
                </select>
                {renderInputFields()}
                <div className='aa'>
                <div>
                    <label>Size:</label>
                    <input
                        type="number"
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        min="100"
                        max="1000"
                    />
                </div>
                <div>
                    <label>Dark Color:</label>
                    <input
                        type="color"
                        value={color.dark}
                        onChange={(e) => setColor({ ...color, dark: e.target.value })}
                    />
                </div>
                <div>
                    <label>Light Color:</label>
                    <input
                        type="color"
                        value={color.light}
                        onChange={(e) => setColor({ ...color, light: e.target.value })}
                    />
                </div>
                <div>
                    <label>Error Correction Level:</label>
                    <select
                        value={errorCorrectionLevel}
                        onChange={(e) => setErrorCorrectionLevel(e.target.value)}
                    >
                        <option value="L">L (Low)</option>
                        <option value="M">M (Medium)</option>
                        <option value="Q">Q (Quartile)</option>
                        <option value="H">H (High)</option>
                    </select>
                </div>
                </div>
                <button type="submit">Generate</button>
            </form>
            </div>
            {qrCode && (
                <div className="qr-code">
                    <img src={qrCode} alt="Generated QR Code" />
                    <a href={qrCode} download="qr-code.png">
                        <button>Download</button>
                    </a>
                </div>
            )}
        </div>
    );
};

export default QrCodeGenerator;
