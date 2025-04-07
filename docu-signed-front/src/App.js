import React, { useEffect } from 'react';
import axios from 'axios';

function App() {
  useEffect(() => {
    axios.get('http://localhost:5000')
      .then(response => {
        console.log('Connection successful:', response.data);
      })
      .catch(error => {
        console.error('Error during connection:', error);
      });
  }, []);

  return (
    <div style={{ textAlign: 'center', paddingTop: '50px' }}>
      <h1>Docku Signed Frontend</h1>
    </div>
  );
}

export default App;

