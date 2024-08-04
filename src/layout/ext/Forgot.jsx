import { Button, Label, TextInput } from 'flowbite-react'
import React from 'react'
import LogoBarantin from '../../assets/logo/logo_barantin.png'
import UserEksModel from '../../model/UserEksModel'
import { useForm } from 'react-hook-form'

const modelUser = new UserEksModel()

function Forgot() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const onSubmit = (values) => {
        const response = modelUser.forgot(values)
        response
            .then((response) => {
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
            })
    }
  return (
      <section className="bg-white dark:bg-gray-900">
          <div className="container flex flex-col items-center justify-center min-h-screen px-6 mx-auto">
              <div className="flex justify-center mx-auto">
                  <img className="w-auto h-7 sm:h-8 me-3" src={LogoBarantin} alt="" />
                  <h1 className='text-2xl font-bold dark:text-white'>PRIOR NOTICE</h1>
              </div>
              <hr className="w-48 h-1 mx-auto my-1 bg-gray-100 border-0 rounded md:my-2 dark:bg-gray-700" />

              <h1 className="mt-4 text-2xl font-semibold tracking-wide text-center text-gray-800 capitalize md:text-3xl dark:text-white">
                  Forgot Password
              </h1>

              <div className="w-full max-w-md mx-auto mt-6">
                  <form onSubmit={handleSubmit(onSubmit)}>
                      <div>
                          <Label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Enter your email</Label>
                          <TextInput
                              {...register("email", {
                                  required: "The email name is required",
                                  maxLength: {
                                      value: 50,
                                      message: "Max length is 50"
                                  }
                              })}
                              helperText={
                                  <>
                                      {errors.email && <span className="font-medium">{errors.email.message}</span>}
                                  </>
                              }
                              type='email' id="email" name='email' placeholder="John" color={errors.email ? "failure" : ""} />
                      </div>

                      <Button type='submit' gradientDuoTone="purpleToBlue" className='flex items-center mt-3 w-full text-center' pill>Reset Password</Button>
                  </form>
              </div>
          </div>
      </section>
  )
}

export default Forgot