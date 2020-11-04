import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style.css';

const App = () => {
  const [pasteData, setData] = useState([]);

  useEffect(() => {
    axios.get('api/users')
      .then(({ data }) => setData(data))
      .catch((err) => console.log(err));
  }, []);
  return (
    <div>
      {pasteData.map((user, idx) => (
          <p key={user + idx}>{`${idx + 1} ${user.username} | ${user.karma}`}</p>
      ))}
    </div>
  );
};

export default App;
