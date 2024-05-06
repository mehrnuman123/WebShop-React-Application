import React, { useEffect } from 'react';
import axios from 'axios';

const IndexPage = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/index');
        const htmlTemplate = response.data;

        // Insert the HTML template into the DOM
        const container = document.getElementById('html-container');
        container.innerHTML = htmlTemplate;

        // Find script tags in the inserted HTML and execute them
        const scripts = container.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
          const script = scripts[i];
          const newScript = document.createElement('script');
          newScript.text = script.text;
          script.parentNode.replaceChild(newScript, script);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div id="html-container">
      {/* The fetched HTML template will be inserted here */}
    </div>
  );
};

export default IndexPage;
