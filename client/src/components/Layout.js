// Layout.js
import React from 'react';
import TopBar from './TopBar'; // Adjust the path as needed

const Layout = ({ children }) => {
  return (
    <>
      <main>{children}</main>
    </>
  );
};

export default Layout;
