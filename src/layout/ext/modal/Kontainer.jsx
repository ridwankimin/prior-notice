import { Button, Label, Modal, Select, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { IoSave } from "react-icons/io5"
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import DocPriorModel from '../../../model/DocPriorModel'

const docModel = new DocPriorModel()

const sizeKontainer = ["20 feet", "40 feet", "40 feet", "42 feet", "43 feet", "45 feet", "50 feet"]

function Kontainer(props) {
    let [loading, setLoading] = useState(false)
    const {
        register,
        setValue,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            no_kont: "",
            size: ""
        }
    })

    const onSubmit = (values) => {
        setLoading(true)
        const response = docModel.submitKontainer(values, props.docnbr)
        response
            .then((response) => {
                setLoading(false)
                if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
                    console.log(response)
                }
                reset()
                props.getKontainer()
                props.setIndexCont("")
                // setValue('docnbr', response?.data?.data?.docnbr)
                // setValue('stat', 1)
                toast.success(response?.data?.message)
                props.setOpenModalCont(false)
            })
            .catch((error) => {
                setLoading(false)
                if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
                    console.log(error)
                }
                toast.error(error?.response?.data?.message || "Failed")
                props.setOpenModalCont(false)
            })
    }
    if (Number.isInteger(props.indexCont)) {
        setValue("id", props.listKontainer[props.indexCont]?.id)
        setValue("no_kont", props.listKontainer[props.indexCont]?.no_kont)
        setValue("size", props.listKontainer[props.indexCont]?.size)
    }

    return (
        <Modal size="md" show={props?.openModalCont} onClose={() => props.setOpenModalCont(false)} >
            <Modal.Header>Input Container</Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 gap-4 mb-2 md:grid-cols-2 justify-center">
                        <div>
                            <div className="mb-0 block">
                                <Label htmlFor="no_kont" value="Container Number" />
                            </div>
                            <TextInput
                                {...register("no_kont", {
                                    required: "The comodity is required",
                                    maxLength: {
                                        value: 11,
                                        message: "Max length is 11"
                                    }
                                })}
                                helperText={
                                    <>
                                        {errors.no_kont && <span className="font-medium">{errors.no_kont.message}</span>}
                                    </>
                                }
                                className='w-full' id="no_kont" name='no_kont' sizing="sm" color={errors.no_kont ? "failure" : "grey"} />
                        </div>
                        <div>
                            <div className="mb-0 block">
                                <Label htmlFor="size" value="Size" />
                            </div>
                            <Select {...register("size", {
                                maxLength: {
                                    value: 7,
                                    message: "Max length is 7"
                                }
                            })}
                                helperText={
                                    <>
                                        {errors.size && <span className="font-medium">{errors.size.message}</span>}
                                    </>
                                }
                                id="size" name='size' className='w-20' sizing="sm" color={errors.size ? "failure" : "grey"}>
                                <option value="">--</option>
                                {sizeKontainer.map((item, index) => (
                                    <option value={item} key={index}>{item}</option>
                                ))}
                            </Select>
                        </div>
                    </div>
                    <div className="flex justify-center my-4">
                        {/* <Button type={"submit"} gradientMonochrome="info" className='me-2'><IoSave className="mr-2 h-5 w-5 " /> Save</Button> */}
                        <Button type={loading ? "button" : "submit"} disabled={loading} gradientMonochrome="info" className='me-2'><IoSave className="mr-2 h-5 w-5 " /> {loading ? <Spinner/> : 'Save'}</Button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    )
}

export default Kontainer