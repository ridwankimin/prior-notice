import React, { Fragment } from 'react'
import { Outlet } from 'react-router-dom'
import FooterPage from './FooterPage'
import Header from './Header'
import SessionModel from '../../model/SessionModel'

const usertoken = new SessionModel().getTokenJson()

function Home() {
  const now = (new Date()).toLocaleString('en-CA', { hourCycle: 'h24' }).replace(',', '').slice(0, 19)
  if (usertoken < now) {
    localStorage.clear()
    window.location.reload()
  }
  return (
    <Fragment>
        <Header />
        <Outlet />
        <FooterPage />
    </Fragment>
  )
}

export default Home