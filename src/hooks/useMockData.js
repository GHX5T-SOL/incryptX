import { useState, useEffect } from 'react';

const useMockData = (file) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`/assets/mock-data/${file}`).then(res => res.json()).then(setData);
  }, [file]);

  return data;
};

export default useMockData;
