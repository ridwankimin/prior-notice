import { Button, Label, Modal, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { IoSave } from "react-icons/io5"
import { BiHide, BiShow } from "react-icons/bi";
import UserEksModel from '../../../model/UserEksModel';
import { toast } from 'react-toastify';

function ResetPassword(props) {
    import('../../../sglobal.css')

    let [loading, setLoading] = useState(false)
    let [typeCurrent, setTypeCurrent] = useState(true)
    let [typeNew, setTypeNew] = useState(true)
    let [typeConfirm, setTypeConfirm] = useState(true)
    const {
        register,
        watch,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm()

    const onSubmit = (values) => {
        setLoading(true)
        const response = new UserEksModel().reset(values)
        response
        .then((response) => {
            setLoading(false)
            reset()
            props.setOpenModalReset(false)
            toast.success(response?.data?.message)
        })
        .catch((error) => {
            setLoading(false)
            if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
                console.log(error)
            }
            toast.error(error.response.data.message || "Failed")
        })
    }
  return (
      <Modal size="sm" show={props?.openModalReset} onClose={() => props.setOpenModalReset(false)} >
          <Modal.Header>Reset Password</Modal.Header>
          <Modal.Body>
              <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid grid-cols-1 gap-4 mb-2 justify-center">
                      <div>
                          <div className="mb-0 block">
                              <Label htmlFor="password" value="Current password" />
                          </div>
                          <TextInput
                              {...register("password", {
                                  required: "The current password is required",
                              })}
                              onMouseOut={() => setTypeCurrent(true)}
                              rightIcon={() =>
                                  typeCurrent ? (
                                      <BiHide
                                          onClick={() => setTypeCurrent(!typeCurrent)}
                                          className="cursor-pointer"
                                      />
                                  ) : (
                                      <BiShow
                                          onClick={() => setTypeCurrent(!typeCurrent)}
                                          className="cursor-pointer"
                                      />
                                  )
                              }
                              helperText={
                                  <>
                                      {errors.password && <span className="font-medium">{errors.password.message}</span>}
                                  </>
                              }
                              className='w-full' placeholder='*******************' type={typeCurrent ? 'password' : 'type'} id="password" name='password' sizing="sm" color={errors.password ? "failure" : "grey"} />

                          <div className="mb-0 block">
                              <Label htmlFor="newPassword" value="New Password" />
                          </div>
                          <TextInput
                              {...register("newPassword", {
                                  required: "The password name is required",
                                  minLength: {
                                      value: 8,
                                      message: "Min length is 8"
                                  }
                              })}
                              onMouseOut={() => setTypeNew(true)}
                              rightIcon={() =>
                                  typeNew ? (
                                      <BiHide
                                          onClick={() => setTypeNew(!typeNew)}
                                          className="cursor-pointer"
                                      />
                                  ) : (
                                      <BiShow
                                          onClick={() => setTypeNew(!typeNew)}
                                          className="cursor-pointer"
                                      />
                                  )
                              }
                              helperText={
                                  <>
                                      {errors.newPassword && <span className="font-medium">{errors.newPassword.message}</span>}
                                  </>
                              } 
                              className='w-full' placeholder='*******************' type={typeNew ? 'password' : 'type'} id="newPassword" name='newPassword' sizing="sm" color={errors.newPassword ? "failure" : "grey"} />
                          <div className="mb-0 block">
                              <Label htmlFor="confirm" value="Confirm Password" />
                          </div>
                          <TextInput
                              {...register("confirm", {
                                  required: "Please comfirm your password",
                                  validate: (val) => {
                                      if (watch('newPassword') != val) {
                                          return "Your passwords do no match";
                                      }
                                  },
                              })}
                              helperText={
                                  <>
                                      {errors.confirm && <span className="font-medium">{errors.confirm.message}</span>}
                                  </>
                              }
                              rightIcon={() =>
                                  typeConfirm ? (
                                      <BiHide
                                            onClick={() => setTypeConfirm(!typeConfirm)}
                                            className="cursor-pointer"
                                      />
                                  ) : (
                                          <BiShow
                                            onClick={() => setTypeConfirm(!typeConfirm)}
                                            className="cursor-pointer"
                                      />
                                  )
                              }
                              className='w-full' onMouseOut={() => setTypeConfirm(true)} placeholder='*******************' type={typeConfirm ? 'password' : 'type'} id="confirm" name='confirm' sizing="sm" color={errors.confirm ? "failure" : "grey"} />
                      </div>
                  </div>
                  <div className="flex justify-center my-4">
                      {/* <Button type={"submit"} gradientMonochrome="info" className='me-2'><IoSave className="mr-2 h-5 w-5 " /> Save</Button> */}
                      <Button type={loading ? "button" : "submit"} disabled={loading} gradientMonochrome="info" className='me-2'> {loading ? <Spinner /> : <><IoSave className="mr-2 h-5 w-5 " /> Save</>}</Button>
                  </div>
              </form>
          </Modal.Body>
      </Modal>
  )
}

export default ResetPassword