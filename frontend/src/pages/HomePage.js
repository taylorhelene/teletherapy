import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className='home-page'>
            <h1 className="text-center mt-3">Welcome to the Teletherapy Platform</h1>
            <div className="row p-4 d-flex justify-content-center level" onClick={() => navigate('/learning')}>
                <h4 className="col-sm-4">Level</h4>
                 <DotLottieReact
                          src={process.env.PUBLIC_URL + '/one.lottie'}
                          loop
                          autoplay
                          className="col-sm-2"/>
            </div>
            <div className="row p-4 d-flex justify-content-center level" onClick={() => navigate('/webcam')}>
                <h4 className="col-sm-4">Level</h4>
                 <DotLottieReact
                          src={process.env.PUBLIC_URL + '/two.lottie'}
                          loop
                          autoplay
                          className="col-sm-2"/>
            </div>
            <div className="row p-4 d-flex justify-content-center level" onClick={() => navigate('/therapy')}>
                <h4 className="col-sm-4">Level</h4>
                 <DotLottieReact
                          src={process.env.PUBLIC_URL + '/three.lottie'}
                          loop
                          autoplay
                          className="col-sm-2"/>
            </div>
        </div>
    );
};

export default HomePage;