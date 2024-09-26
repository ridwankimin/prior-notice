import { Alert, Button, Label, Spinner, TextInput, Modal } from 'flowbite-react';
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom'
// import { IoMdSync } from "react-icons/io";
import { MdOutlineSync } from "react-icons/md";
import { HiInformationCircle } from "react-icons/hi"
import { FaBook } from "react-icons/fa";
import { IoMdCheckmarkCircleOutline } from "react-icons/io"
import { IoSearch } from "react-icons/io5";
// import { CSSTransition } from 'react-transition-group'
import LogoBarantin from '../../assets/logo/logo_barantin.png'
import BarantinTulisan from '../../assets/logo/barantin_tulisan_putih.png'
import c1 from '../../assets/captcha/1.jpg'
import c2 from '../../assets/captcha/2.jpg'
import c3 from '../../assets/captcha/3.jpg'
import c4 from '../../assets/captcha/4.jpg'
import c5 from '../../assets/captcha/5.jpg'
import c6 from '../../assets/captcha/6.jpg'
import c7 from '../../assets/captcha/7.jpg'
import c8 from '../../assets/captcha/8.jpg'
import c9 from '../../assets/captcha/9.jpg'
import UserEksModel from '../../model/UserEksModel';
import CariPrior from './CariPrior';
import Manualuser from './modal/Manualuser';
import manual from '../../assets/user_manual_prior_notice.pdf'
import("./styleLogin.css")

const modelUser = new UserEksModel()

const rand = arr => arr[Math.floor(Math.random() * arr.length)]

function randomText(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

function Login() {
    let [alert, setAlert] = useState("")
    let [openKamera, setOpenKamera] = useState(false)
    let [loading, setLoading] = useState(false)
    const [openModal, setOpenModal] = useState(false);
    let [openManual, setOpenManual] = useState(false);
    let [textCapt, setTextCapt] = useState({
        img: undefined,
        text: "",
        isLoad: false
    })
    let [bgCaptcha, setBgCaptcha] = useState(false)

    const textToImage = useCallback(() => {
        setTextCapt(values => ({ ...values, isLoad: true }))
        let text = randomText(6)
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.font = '3rem mom';
        ctx.fillText(text, 35, 80);
        setTimeout(() => {
            setTextCapt(values => ({ ...values, img: canvas.toDataURL(), text: text, isLoad: false }))
        }, 500)
    }, [])

    const styleBgCapt = useCallback(() => {
        const back = rand([c1, c2, c3, c4, c5, c6, c7, c8, c9])
        setBgCaptcha(back)
    }, [])

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const onSubmit = values => {
        if(values.captcha == textCapt.text) {
            setLoading(true)
            const response = modelUser.login(values)
            response
            .then((response) => {
                setLoading(false)
                if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
                    console.log(response)
                }
                setAlert(values => ({
                    ...values,
                    status: response?.data?.status,
                    pesan: response?.data?.message,
                }));
                localStorage.setItem("expired", JSON.stringify(response?.data?.expired))
                localStorage.setItem("userEks", JSON.stringify(response?.data?.data))
                setTimeout(() => {
                    window.location.reload();
                }, 800)
            })
            .catch((error) => {
                if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
                    console.log(error)
                }
                setLoading(false)
                setAlert(values => ({
                    ...values,
                    status: error?.response?.data?.status || false,
                    pesan: error?.response?.data?.message || 'Failed to login, please try again',
                }));
            })
        } else {
            setAlert(values => ({
                ...values,
                status: false,
                pesan: 'Wrong Captcha!',
            }));
        }
    }

    useEffect(() => {
        styleBgCapt()
        textToImage()
    }, [styleBgCapt, textToImage])
  return (
      <div className="bg-white dark:bg-gray-900">
          <div className="flex form-bg justify-center h-screen">
              <div className="hidden lg:block lg:w-2/3" style={{backgroundImage: "url(https://images.unsplash.com/photo-1616763355603-9755a640a287?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&w=1470&q=80)"}}>
                  <div className='row w-100 pt-2' style={{ backgroundImage: ("linear-gradient(to right, #123138, rgba(255,0,0,0)"), position: "sticky", height: "110px" }}>
                      <div className="flex-row">
                          <div className="mx-auto">
                            <div className="flex">
                                  <img className='my-1 mx-4' src={BarantinTulisan} alt="Badan Karantina Indonesia" width={"220px"} />
                                  {/* <h2 className="text-2xl text-shadow-lg my-6 font-bold text-white sm:text-3xl">Badan Karantina Indonesia</h2> */}
                            </div>
                          </div>
                      </div>
                  </div>
                  <div className="flex items-center h-full px-10 bg-gray-900 bg-opacity-40">
                      {/* <div>
                          <h2 className="text-2xl font-bold text-white sm:text-3xl">Meraki UI</h2>
                          
                          <p className="max-w-xl mt-3 text-gray-300">
                              Lorem ipsum dolor sit, amet consectetur adipisicing elit. In
                              autem ipsa, nulla laboriosam dolores, repellendus perferendis libero suscipit nam temporibus
                              molestiae
                              </p>
                            </div> */}
                      <CariPrior />
                  </div>
              </div>

              <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
                  <div className="flex-1">
                      {/* <div style={{ minHeight: '50px' }}><a className='text-sm text-center lg:text-gray-200 text-gray-400' href="https://karantinaindonesia.go.id" target='_blank'>https://karantinaindonesia.go.id</a></div> */}
                      <center className='lg:hidden py-6 mt-20'>
                          <Button pill outline gradientDuoTone="greenToBlue" onClick={() => setOpenModal(true)}><IoSearch className='me-2' /> Search Prior Notice</Button>
                          <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
                              <Modal.Header />
                              <Modal.Body>
                                    <CariPrior bg="" />
                              </Modal.Body>
                          </Modal>
                      </center>
                      <div className="text-center">
                          <div className="flex justify-center mx-auto">
                              <img className="w-auto sm:h-18" style={{ height:'145px' }} src={LogoBarantin} alt="" />
                          </div>
                          <h1 className='text-2xl font-bold dark:text-white'>Prior Notice</h1>
                          <p className="mt-3 text-gray-500 dark:text-gray-300">Sign in to access your account</p>
                      </div>
                          <center className='pt-6'>
                          <Button size='sm' pill gradientDuoTone="greenToBlue" onClick={() => setOpenManual(true)}><FaBook className="mr-2 h-5 w-5" /> <u>User manual</u></Button>
                            {/* <a type='button' onClick={() => setOpenManual(true)}>User manual</a> */}
                            </center>
                          <Modal position="top-center" size="6xl" show={openManual} onClose={() => setOpenManual(false)} popup>
                              <Modal.Header>User Manual - Prior Notice</Modal.Header>
                              <Modal.Body>
                                  <iframe className='h-screen' src={manual} width={'100%'} frameborder="0"></iframe>
                              </Modal.Body>
                          </Modal>

                      <div className="mt-8">
                          <form onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                  {alert ? 
                                      <Alert className='mt-4' color={alert?.status ? "success" : "failure"} icon={alert?.status ? IoMdCheckmarkCircleOutline : HiInformationCircle}>
                                          <span className="font-medium">{alert?.pesan}</span>
                                      </Alert>
                                  : ""}
                            </div>
                              <div>
                                  <Label htmlFor='email' className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Email Address</Label>
                                  <TextInput
                                      {...register("email", {
                                          required: "Please enter your email"
                                      })}
                                      helperText={
                                          <>
                                              {errors.email && <span className="font-medium">{errors.email.message}</span>}
                                          </>
                                      }
                                      type='email' autoComplete='off' name='email' id="email" placeholder="example@example.com" color={errors.email ? "failure" : ""} />
                              </div>

                              <div className="mt-6">
                                  <div className="flex justify-between">
                                      <Label htmlFor='password' className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Password</Label>
                                      <Link to="/forgot" className="text-sm text-gray-400 focus:text-blue-500 hover:text-blue-500 hover:underline">Forgot password?</Link>
                                  </div>
                                      <TextInput
                                          {...register("password", {
                                              required: "Please enter your password"
                                          })}
                                          helperText={
                                              <>
                                                  {errors.password && <span className="font-medium">{errors.password.message}</span>}
                                              </>
                                          }
                                        type='password' autoComplete='off' name='password' id="password" placeholder="Your Password.." color={errors.password ? "failure" : ""} />
                              </div>
                              <div>
                                <div className="flex">
                                      {textCapt.isLoad ?
                                      <Spinner aria-label="Default status example" />
                                          :
                                          <div className="image-wrapper">
                                              <img src={bgCaptcha ? bgCaptcha : ""} className='image' />
                                              <div className='ptext'>
                                                  {/* {textCapt.img ?  */}
                                                  <img src={textCapt.img} />
                                                  {/* : ""} */}
                                              </div>
                                          </div>
                                      }
                                  <div className="col-sm-2">
                                          <Button color="gray" className='border-0' onClick={() => textToImage()}><MdOutlineSync className="h-5 w-5" /></Button>
                                          {/* <button type='button' onClick={() => textToImage()} className='btn btn-default'><IoMdSync /></button> */}
                                  </div>
                                  <div className="col-sm-5">
                                          <TextInput
                                              {...register("captcha", {
                                                  required: "The captcha is required"
                                              })}
                                              helperText={
                                                  <>
                                                      {errors.captcha && <span className="font-medium">{errors.captcha.message}</span>}
                                                  </>
                                              }
                                              name='captcha' id="captcha" placeholder="Captcha.." color={errors.captcha ? "failure" : ""} />
                                  </div>
                                </div>
                              </div>

                              <div className="mt-6">
                                  <Button type={loading ? 'button' : 'submit'} disabled={loading} gradientDuoTone="purpleToBlue" className='flex items-center mt-3 w-full text-center' pill>{loading ? <Spinner aria-label="Default status example" /> : 'Sign In'}</Button>

                                  {/* <button className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                                      Sign in
                                  </button> */}
                              </div>

                          </form>

                          <p className="mt-6 text-sm text-center text-gray-400">Don&#x27;t have an account yet? <Link to="/register" className="text-blue-500 focus:outline-none focus:underline hover:underline">Sign up</Link> .</p>
                              {/* <CSSTransition
                                //   in={this.state.showList}
                                  timeout={400}
                                  classNames="list-transition"
                                  unmountOnExit
                                  appear
                                //   onEntered={this.listSwitch}
                                //   onExit={this.listSwitch}
                              > */}
                          
                          {/* </CSSTransition> */}
                      </div>
                  <center className='lg:hidden mt-10'><a className='text-sm text-center lg:text-gray-200 text-gray-400' href="https://karantinaindonesia.go.id" target='_blank'>https://karantinaindonesia.go.id</a></center>
                  </div>
                  <div className='hidden lg:block' style={{ minHeight: '5px', bottom: '10px', left: '10px', position: 'absolute' }}><a className='text-sm text-center lg:text-gray-200 text-gray-400' href="https://karantinaindonesia.go.id" target='_blank'>https://karantinaindonesia.go.id</a></div>
              </div>
          </div>
          {/* <Manualuser openModal={openManual} setOpenManual={setOpenManual} /> */}
      </div>
  )
}

export default Login