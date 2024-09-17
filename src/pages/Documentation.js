import React from 'react';

const Documentation = () => {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <iframe
        src="/docs/index.html"
        title="Documentation"
        width="100%"
        height="100%"
        style={{ border: 'none' }}
      />
    </div>
  );
};

export default Documentation;