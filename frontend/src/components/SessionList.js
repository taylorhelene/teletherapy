import React, { useState, useEffect } from 'react';
import { getSessions } from '../services/apiService';

const SessionListPage = () => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchSessions = async () => {
      const response = await getSessions();
      setSessions(response.sessions);
    };
    fetchSessions();
  }, []);

  return (
    <div>
      <h1>Your Sessions</h1>
      <ul>
        {sessions.map((session) => (
          <li key={session._id}>
            <h2>{session.sessionType}</h2>
            <p>Status: {session.status}</p>
            <p>Start Date: {new Date(session.startDate).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SessionListPage;
