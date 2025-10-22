// components/Layout/InternalLayout.jsx
import React from 'react';

import Footer from './Footer/Footer';
import Header from './Header/Header';

const InternalLayout = ({ children }) => {
  return (
    <>
       <Header />
      {/* <StaffNavbar /> */}
      <main>{children}</main>
      <Footer />  
    </>
  );
};

export default InternalLayout;