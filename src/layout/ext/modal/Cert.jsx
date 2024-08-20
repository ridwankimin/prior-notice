import { Button, Label, Modal, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { IoSave } from "react-icons/io5"
import { useForm } from 'react-hook-form'
import DocPriorModel from '../../../model/DocPriorModel'
import { toast } from 'react-toastify'

const docModel = new DocPriorModel()

function Cert(props) {
    let [loading, setLoading] = useState(false)
    const {
        register,
        setValue,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            nomor: "",
            issued_place: "",
            issued_date: ""
        }
    })

    const onSubmit = (values) => {
        const response = docModel.submitCert(values, props.docnbr)
        response
            .then((response) => {
                setLoading(false)
                if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
                    console.log(response)
                }
                reset()
                props.getCertPrior()
                props.setIndexCert("")
                // setValue('docnbr', response?.data?.data?.docnbr)
                // setValue('stat', 1)
                toast.success(response?.data?.message)
                props.setOpenModalCert(false)
            })
            .catch((error) => {
                setLoading(false)
                if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
                    console.log(error)
                }
                toast.error(error?.response?.data?.message || "Failed")
                props.setOpenModalCert(false)
            })
    }

    if (Number.isInteger(props.indexCert)) {
        setValue("id", props.listCert[props.indexCert]?.id)
        setValue("nomor", props.listCert[props.indexCert]?.nomor)
        setValue("issued_place", props.listCert[props.indexCert]?.issued_place)
        setValue("issued_date", props.listCert[props.indexCert]?.issued_date)
    }

    return (
        <Modal size="md" show={props?.openModalCert} onClose={() => props.setOpenModalCert(false)} >
            <Modal.Header>Input Health/Sanitary/Phytosanitary Certificate</Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <div className="mb-0 block">
                            <Label htmlFor="nomor" value="Reference Number" />
                        </div>
                        <TextInput
                            {...register("nomor", {
                                required: "The Reference Number is required",
                                maxLength: {
                                    value: 40,
                                    message: "Max length is 40"
                                }
                            })}
                            helperText={
                                <>
                                    {errors.nomor && <span className="font-medium">{errors.nomor.message}</span>}
                                </>
                            }
                            className='w-full' id="nomor" name='nomor' sizing="sm" color={errors.nomor ? "failure" : "grey"} />
                    </div>
                    <div className="grid grid-cols-1 gap-4 mb-2 md:grid-cols-2 justify-center">
                        <div>
                            <div className="mb-0 block">
                                <Label htmlFor="issued_place" value="Place of Issue" />
                            </div>
                            <TextInput
                                {...register("issued_place", {
                                    // required: "The Place of Issue is required",
                                    maxLength: {
                                        value: 40,
                                        message: "Max length is 40"
                                    }
                                })}
                                helperText={
                                    <>
                                        {errors.issued_place && <span className="font-medium">{errors.issued_place.message}</span>}
                                    </>
                                }
                                id="issued_place" name='issued_place' sizing="sm" color={errors.issued_place ? "failure" : "grey"} />
                        </div>
                        <div>
                            <div className="mb-0 block">
                                <Label htmlFor="issued_date" value="Date of Issue" />
                            </div>
                            <TextInput
                                {...register("issued_date", {
                                    // required: "The Place of Issue is required",
                                    maxLength: {
                                        value: 20,
                                        message: "Max length is 20"
                                    }
                                })}
                                helperText={
                                    <>
                                        {errors.issued_date && <span className="font-medium">{errors.issued_date.message}</span>}
                                    </>
                                }
                                type='date' id="issued_date" name='issued_date' sizing="sm" color={errors.issued_date ? "failure" : "grey"} />
                        </div>
                    </div>
                    <div className="flex justify-center my-4">
                        <Button type={loading ? "button" : "submit"} disabled={loading} gradientMonochrome="info" className='me-2'><IoSave className="mr-2 h-5 w-5 " /> {loading ? <Spinner/> : 'Save'}</Button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    )
}

export default Cert