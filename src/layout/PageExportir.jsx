import React from 'react'
import SessionModel from '../model/SessionModel'
import Home from './ext/Home'
import Login from './ext/Login'
import { ToastContainer } from 'react-toastify'

const model = new SessionModel()
const userpj = model.getUserJson()

export default function PageExportir(props) {
    let pageLanding
    if (userpj) {
        pageLanding = <Home />
    } else {
        pageLanding = <Login/>
    }
  return (
    <>
      <ToastContainer />
    {pageLanding}
    </>
  )
}
