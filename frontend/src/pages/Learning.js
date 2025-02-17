import React,  { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/apiService';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Learning = () => {
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
  
    useEffect(() => {
      // Use fake data instead of API call
      const fakeVideos = [
        {
          title: "Facial Expressions for Kids",
          url: "https://www.youtube.com/embed/ymrvDRofDkY?si=Fertlv8OcbEWU8Pq",
          thumbnail: "https://www.youtube.com/embed/ymrvDRofDkY?si=Fertlv8OcbEWU8Pq",
        },
        {
          title: "Swahili Pronunciation Basics",
          url: "https://www.youtube.com/embed/Iwo2Rat4EqI?si=7E1VKfifNa6LGfza" ,
          thumbnail: "https://img.youtube.com/vi/def456/0.jpg",
        },
        {
          title: "Learn Emotions with Animation",
          url: "https://www.youtube.com/embed/37w9JjUWN30?si=DeNaE-sc-P2j7t6D" ,
          thumbnail: "https://img.youtube.com/vi/ghi789/0.jpg",
        },
        {
          title: "English Words for Beginners",
          url: "https://www.youtube.com/embed/drlIUqRYM-w?si=QbYzYM_pTJRmWBW2" ,
          thumbnail: "https://img.youtube.com/vi/jkl012/0.jpg",
        },
        {
          title: "Swahili for Children",
          url: "https://www.youtube.com/embed/dWfCKdn46iE?si=MIgEPBb8lb-b7hxj" ,
          thumbnail: "https://img.youtube.com/vi/mno345/0.jpg",
        },
        {
          title: "Practice Pronouncing Words",
          url: "https://www.youtube.com/embed/4SNdy7q6b8g?si=xqSj5tI3k2daPWUn",
          thumbnail: "https://img.youtube.com/vi/pqr678/0.jpg",
        },
      ];
  
      setVideos(fakeVideos);
    }, []);
  
    return (
      <div className="container">
        <h2>Educational Videos on Facial Expressions & Pronunciation</h2>
  
        {selectedVideo && (
          <div className="overlay">
            <div className="video-player">
              <iframe
                width="100%"
                height="100%"
                src={selectedVideo}
                title="Selected Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <button className="button rounded-pill close-btn" onClick={() => setSelectedVideo(null)}>Close</button>
            </div>
          </div>
        )}
  
        <div className={`video-grid ${selectedVideo ? "blurred" : ""}`}>
          {videos.map((video, index) => (
            <div key={index} className="video-card" onClick={() => setSelectedVideo(video.url)}>
              <img src={process.env.PUBLIC_URL + '/learn.png'} alt={video.title} />
              <h4>{video.title}</h4>
            </div>
          ))}
        </div>
      </div>
    );
}

export default Learning;

 