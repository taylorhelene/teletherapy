import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();  // To determine the active tab

    // Define the active tab based on the current location
    const getTabClass = (path) => {
        return location.pathname === path ? ' flex-grow-1 nav-link active' : 'flex-grow-1 nav-link';
    };

    return (
        <div className="container-fluid layout p-4">
            {/* Bootstrap Navigation with spacing */}
            <nav className="nav nav-pills justify-content-between d-flex">
                <button 
                    className={getTabClass('/learning')} 
                    onClick={() => navigate('/learning')}
                >
                    Learning
                </button>
               
                <button 
                    className={getTabClass('/webcam')} 
                    onClick={() => navigate('/webcam')}
                >
                    Webcam
                </button>

                <button 
                    className={getTabClass('/therapy')} 
                    onClick={() => navigate('/therapy')}
                >
                    Therapy
                </button>
            </nav>

            {/* Outlet renders the component of the current route */}
            <Outlet />
        </div>
    );
};

export default Layout;
