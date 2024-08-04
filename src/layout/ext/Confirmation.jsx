import { Alert } from 'flowbite-react'
import React, { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import bgsukses from '../../assets/bg/bg-success-2.jpg'
import barantin from '../../assets/logo/logo_barantin.png'
import bgfailed from '../../assets/bg/bg-failed.jpg'
import { HiInformationCircle } from "react-icons/hi"
import { IoMdCheckmarkCircleOutline } from "react-icons/io"

function Confirmation() {
    let [bg, setBg] = useState({})
    let [pesanKonfirmasi, setPesanKonfirmasi] = useState("")
    const { cek } = useParams()

    const getData = useCallback(() => {
        if (cek == 402) {
            setPesanKonfirmasi(values => ({
                ...values,
                color: 'failure',
                message: 'Your account is already active.',
            }));
            const retur = {
                backgroundImage: `url(${bgfailed})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                width: '100vw',
                height: '100vh'
            }
            setBg(retur)
        } else if (cek == 404) {
            setPesanKonfirmasi(values => ({
                ...values,
                color: 'failure',
                message: 'Your account or confirmation code is missing, please check your data.',
            }));
            const retur = {
                backgroundImage: `url(${bgfailed})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                width: '100vw',
                height: '100vh'
            }
            setBg(retur)
        } else {
            setPesanKonfirmasi(values => ({
                ...values,
                color: 'success',
                message: 'your account is already active, please login ',
            }));
            const retur = {
                backgroundImage: `url(${bgsukses})`,
                // backgroundPosition: "center",
                // backgroundRepeat: "no-repeat",
                // backgroundSize: "cover",
                // height: "100%"
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                width: '100vw',
                height: '100vh'
            }
            setBg(retur)
        }
    }, [cek])

    useEffect(() => {
        getData()
    }, [getData])
  return (
    <div style={bg}>
          <div className='row w-100 pt-2' style={{ backgroundImage: ("linear-gradient(to right, #123138, rgba(255,0,0,0)"), position: "sticky", height: "70px" }}>
              <div className="flex-row">
                  <div className="mx-auto">
                      <div className="flex">
                          {pesanKonfirmasi?.color == 'success' ? <IoMdCheckmarkCircleOutline className='text-green-300 ml-4 mt-2 me-3' size={30} /> : <HiInformationCircle className='text-red-300 ml-4 mt-2 me-3' size={30} />}
                          <h1 className={pesanKonfirmasi?.color == 'success' ? 'text-2xl font-bold mt-2 text-green-300' : 'text-2xl font-bold mt-2 text-red-300'}>{pesanKonfirmasi?.message} {pesanKonfirmasi.color == 'success' ?
                              <Link to="/" className='text-info'><u>here</u></Link>
                              : ""}</h1>
                          {/* <h2 className="text-2xl text-shadow-lg my-6 font-bold text-white sm:text-3xl">Badan Karantina Indonesia</h2> */}
                          <img className="justify-end" style={{ height: '55px', right:'2%', position: 'fixed' }} src={barantin} alt="" />
                      </div>
                        {/* <div className="flex justify-end mr-4">
                        </div> */}
                  </div>
              </div>
          </div>
    {/* <Alert color={pesanKonfirmasi?.color} rounded icon={pesanKonfirmasi?.color == 'success' ? IoMdCheckmarkCircleOutline : HiInformationCircle}>
              <span className="font-medium">{pesanKonfirmasi?.message} 
              {pesanKonfirmasi.color == 'success' ?
              <Link to="/" className='text-info'><u>here</u></Link>
              : ""}
              </span>
      </Alert> */}
    </div>
  )
}

export default Confirmation