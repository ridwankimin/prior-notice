import { Footer } from 'flowbite-react'
import React from 'react'
import { useLocation } from 'react-router-dom';

function FooterPage() {
    let location = useLocation();
  return (
      <Footer style={location.pathname == '' || location.pathname == '/' ? ({ position: 'fixed', bottom: 0 }) : ({ position: 'unset' })}>
          <div className="w-full text-center">
              <Footer.Divider style={{ margin: 0}} />
              <Footer.Copyright className='my-4' href="#" by="IT Barantin" year={2024} />
          </div>
      </Footer>
  )
}

export default FooterPage