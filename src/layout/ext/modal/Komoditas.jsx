import { Button, Label, Modal, Radio, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { IoSave } from "react-icons/io5"
import { Controller, useForm } from 'react-hook-form'
import SatuanJson from '../../../assets/json/satuan.json'
import KemasanJson from '../../../assets/json/jenisKemasan.json'
import Select from 'react-select'
import DocPriorModel from '../../../model/DocPriorModel'
import { toast } from 'react-toastify'
import ReactSelect from 'react-select'

const docModel = new DocPriorModel()

const customStyles = {
    menuPortal: base => ({ ...base, zIndex: 9999 }),
    control: (provided, state) => ({
        ...provided,
        background: '#fff',
        borderColor: '#6B7280',
        borderRadius: '0.5rem',
        cursor: 'text',
        minHeight: '30px',
        height: '35px',
        boxShadow: state.isFocused ? null : null,
    }),

    valueContainer: (provided, state) => ({
        ...provided,
        height: '30px',
        padding: '0 6px'
    }),

    input: (provided, state) => ({
        ...provided,
        margin: '0px',
    }),
    indicatorSeparator: state => ({
        display: 'none',
    }),
    indicatorsContainer: (provided, state) => ({
        ...provided,
        height: '35px',
    }),
}

function Komoditas(props) {
    let [loading, setLoading] = useState(false)
    const kar = props?.karantina
    const {
        register,
        control,
        setValue,
        watch,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            kd_komoditi: "",
            nama_ilmiah: "",
            jumlah: "",
            coa: "",
            reglab: "",
            nopc: "",
            issued_place: "",
            issued_date: "",
        }
    })

    const masterSatuan = () => {
        const retur = SatuanJson.filter(item => (kar == "H" ? item.sat_kh = 'Y' : (kar == "I" ? item.sat_ki = 'Y' : (kar == "T" ? item.sat_kt = 'Y' : ""))))
        const balik = retur.map(item => {
            return {
                value: item.id,
                label: item.kode_en + " - " + item.nama_en,
                data: item
            }
        })
        return balik
    }
    
    const masterKemasan = () => {
        const balik = KemasanJson.map(item => {
            return {
                value: item.id,
                label: item.kode + " - " + item.deskripsi,
                data: item
            }
        })
        return balik
    }

    const onError = (values) => {
        console.log(values)
    }

    const onSubmit = (values) => {
        setLoading(true)
        const response = docModel.submitKomoditas(values, props.docnbr)
        response
            .then((response) => {
                setLoading(false)
                if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
                    console.log(response)
                }
                reset()
                props.getKomoditas()
                // setValue('docnbr', response?.data?.data?.docnbr)
                // setValue('stat', 1)
                toast.success(response?.data?.message)
                props.setOpenModal(false)
            })
            .catch((error) => {
                setLoading(false)
                if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
                    console.log(error)
                }
                toast.error(error?.response?.data?.message || "Failed")
                props.setOpenModal(false)
            })
    }

    // if (Number.isInteger(props.indexKom)) {
    //     setValue("id", props.listKomoditas[props.indexKom].id)
    //     setValue("kd_komoditi", props.listKomoditas[props.indexKom].kd_komoditi)
    //     // setValue("kd_komoditiView", props.dataSelect?.komoditas?.filter(item => item.value == props.listKomoditas[props.indexKom].kd_komoditi)[0]?.label)
    //     setValue("nama_ilmiah", props.listKomoditas[props.indexKom].nama_ilmiah)
    //     setValue("jumlah", props.listKomoditas[props.indexKom].jumlah)
    //     setValue("satuan", props.listKomoditas[props.indexKom].satuan)
    //     // setValue("satuanView", masterSatuan()?.filter(item => item.value == props.listKomoditas[props.indexKom].satuan)[0]?.label)
    //     setValue("hscode", props.listKomoditas[props.indexKom].hscode)
    //     // setValue("hscodeView", props.dataSelect?.kodehs?.filter(item => item.value == props.listKomoditas[props.indexKom].hscode)[0]?.label)
    //     setValue("jumlahKemasan", props.listKomoditas[props.indexKom].jumlahKemasan)
    //     setValue("satuanKemasan", props.listKomoditas[props.indexKom].satuanKemasan)
    //     // setValue("satuanKemasanView", masterKemasan()?.filter(item => item.value == props.listKomoditas[props.indexKom].satuanKemasan)[0]?.label)
    //     setValue("reglab", props.listKomoditas[props.indexKom].reglab)
    //     // setValue("reglabView", props.dataSelect?.reglab?.filter(item => item.value == props.listKomoditas[props.indexKom].reglab)[0]?.label)
    //     setValue("coa", props.listKomoditas[props.indexKom].coa)
    //     setValue("datecoa", props.listKomoditas[props.indexKom].datecoa)
    // }

    return (
        <Modal show={props?.openModal} onClose={() => props.setOpenModal(false)} >
            <Modal.Header>Input Commodity</Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit(onSubmit, onError)}>
                {/* <div className="space-y-6"> */}
                    <div style={{ display: (kar == "T" ? "block" : "none")}}>
                        <div className="mb-0 block">
                            <Label htmlFor="karantina" value="Type of commodity" />
                        </div>
                        <div className="flex items-center gap-2 me-8">
                            <Radio id="psat1" name="is_psat" onClick={() => props.getMasterKomoditas('PSAT') & setValue('kd_komoditi', '') & setValue('kd_komoditiView', '') & setValue("nama_ilmiah", '')} value="1" {...register("is_psat", {
                                required: (props.karantina == "T" ? "The field is required" : false)
                            })} />
                            <Label htmlFor="psat1" className='me-4'>PSAT</Label>

                            <Radio id="psat0" name="is_psat" value="0" onClick={() => props.getMasterKomoditas('NON') & setValue('kd_komoditi', '') & setValue('kd_komoditiView', '') & setValue("nama_ilmiah", '')} {...register("is_psat")} />
                            <Label htmlFor="psat0">Non PSAT</Label>
                        </div>
                        {/* <Select className='w-40' id="karantina" name='karantina' sizing="sm" color={errors.karantina ? "failure" : "grey"}
                            {...register("karantina", {
                                required: "The comodity is required",
                                maxLength: {
                                    value: 1,
                                    message: "Max length is 1"
                                }
                            })}
                            helperText={
                                <>
                                    {errors.karantina && <span className="font-medium">{errors.karantina.message}</span>}
                                </>
                            }>
                            <option value="">--</option>
                            <option value="H">Animal</option>
                            <option value="I">Fish</option>
                            <option value="T">Plant</option>
                        </Select> */}
                    <hr />
                    </div>
                <div className="grid grid-cols-1 gap-4 mb-2 md:grid-cols-2">
                    <div>
                        <div className="mb-0 block">
                            <Label htmlFor="kd_komoditi" value="Comodity" />
                        </div>
                            <Controller
                                control={control}
                                name={"kd_komoditi"}
                                rules={{ required: "The comodity is required" }}
                                render={({ field: { value, onChange, ...field } }) => (
                                    <ReactSelect styles={customStyles} defaultValue={""} value={{ id: watch('kd_komoditi'), label: watch('kd_komoditiView') }} {...field} options={props.dataSelect?.komoditas} onChange={(e) => setValue("kd_komoditi", e.value) & setValue("kd_komoditiView", e.label) & setValue("nama_ilmiah", e.latin)} />
                                )}
                            />
                        {/* <TextInput
                            {...register("kd_komoditi", {
                                required: "The comodity is required",
                                maxLength: {
                                    value: 10,
                                    message: "Max length is 10"
                                }
                            })}
                            helperText={
                                <>
                                    {errors.kd_komoditi && <span className="font-medium">{errors.kd_komoditi.message}</span>}
                                </>
                            }
                            id="kd_komoditi" name='kd_komoditi' sizing="sm" color={errors.kd_komoditi ? "failure" : "grey"} /> */}
                    </div>
                    <div>
                        <div className="mb-0 block">
                            <Label htmlFor="nama_ilmiah" value="Scientific name" />
                        </div>
                        <TextInput
                            {...register("nama_ilmiah", {
                                required: "The scientific name is required",
                                maxLength: {
                                    value: 255,
                                    message: "Max length is 255"
                                }
                            })}
                            helperText={
                                <>
                                    {errors.nama_ilmiah && <span className="font-medium">{errors.nama_ilmiah.message}</span>}
                                </>
                            }
                            id="nama_ilmiah" name='nama_ilmiah' sizing="sm" color={errors.nama_ilmiah ? "failure" : "grey"} />
                    </div>
                        <div>
                            <div className="mb-0 block">
                                <Label htmlFor="jumlah" value="Quantity" />
                            </div>
                            <div className="inline-flex rounded-md shadow-sm" role="group">
                                <TextInput
                                    {...register("jumlah", {
                                        required: "The quantity is required",
                                        // valueAsNumber: true,
                                        min: 0,
                                        // pattern: {
                                        //     value: /^(0|[1-9]\d*)(\.\d+)?$/,
                                        //     message: "value must be a number"
                                        //     // value: /^[0-9]+$/
                                        // }
                                    })}
                                    helperText={
                                        <>
                                            {errors.jumlah && <span className="font-medium">{errors.jumlah.message}</span>}
                                        </>
                                    }
                                    type='number' min={0} id="jumlah" name='jumlah' sizing="sm" color={errors.jumlah ? "failure" : "grey"} />
                                <Controller
                                    control={control}
                                    name={"satuan"}
                                    rules={{ required: "The field is required" }}
                                    render={({ field: { value, onChange, ...field } }) => (
                                        <Select className='w-60' styles={customStyles} defaultValue={""} value={{ id: watch('satuan'), label: watch('satuanView') }} {...field} options={masterSatuan()} onChange={(e) => setValue("satuan", e.value) & setValue("satuanView", e.label)} />
                                    )}
                                />
                            </div>
                        </div>
                    <div>
                        <div className="mb-0 block">
                            <Label htmlFor="hscode" value="HS Code" />
                        </div>
                            <Controller
                                control={control}
                                name={"hscode"}
                                rules={{ required: "The HS Code is required" }}
                                render={({ field: { value, onChange, ...field } }) => (
                                    <ReactSelect styles={customStyles} defaultValue={""} value={{ id: watch('hscode'), label: watch('hscodeView') }} {...field} options={props.dataSelect?.kodehs} onChange={(e) => setValue("hscode", e.value) & setValue("hscodeView", e.label)} />
                                )}
                            />
                        {/* <TextInput
                                {...register("hscode", {
                                required: "The HS Code name is required",
                                maxLength: {
                                    value: 15,
                                    message: "Max length is 15"
                                }
                            })}
                            helperText={
                                <>
                                    {errors.hscode && <span className="font-medium">{errors.hscode.message}</span>}
                                </>
                            }
                                id="hscode" name='hscode' sizing="sm" color={errors.hscode ? "failure" : "grey"} /> */}
                    </div>
                        <div>
                            <div className="mb-0 block">
                                <Label htmlFor="jumlahKemasan" value="Packaging" />
                            </div>
                            <div className="inline-flex rounded-md shadow-sm" role="group">
                                <TextInput
                                    {...register("jumlahKemasan", {
                                        required: "The Packaging is required",
                                        valueAsNumber: true,
                                        pattern: {
                                            value: /^(0|[1-9]\d*)(\.\d+)?$/
                                        }
                                    })}
                                    helperText={
                                        <>
                                            {errors.jumlahKemasan && <span className="font-medium">{errors.jumlahKemasan.message}</span>}
                                        </>
                                    }
                                    type='number' id="jumlahKemasan" name='jumlahKemasan' sizing="sm" color={errors.jumlahKemasan ? "failure" : "grey"} />
                                <Controller
                                    control={control}
                                    name={"satuanKemasan"}
                                    rules={{ required: "The field is required" }}
                                    render={({ field: { value, onChange, ...field } }) => (
                                        <Select className='w-60' styles={customStyles} defaultValue={""} value={{ id: watch('satuanKemasan'), label: watch('satuanKemasanView') }} {...field} options={masterKemasan()} onChange={(e) => setValue("satuanKemasan", e.value) & setValue("satuanKemasanView", e.label)} />
                                    )}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="mb-0 block">
                                <Label htmlFor="reglab" value="Reg lab/NFSCA" />
                            </div>
                            {props.dataSelect?.reglab?.length > 0 ?
                                <Controller
                                    control={control}
                                    name={"reglab"}
                                    rules={{ required: false }}
                                    render={({ field: { value, onChange, ...field } }) => (
                                        <ReactSelect styles={customStyles} defaultValue={""} value={{ id: watch('reglab'), label: watch('reglabView') }} {...field} options={props.dataSelect?.reglab} onChange={(e) => setValue("reglab", e.value) & setValue("reglabView", e.label)} />
                                    )}
                                />
                            :
                            <TextInput
                                {...register("reglab", {
                                    // required: "The Reg lab/NFSCA is required",
                                    maxLength: {
                                        value: 20,
                                        message: "Max length is 20"
                                    }
                                })}
                                helperText={
                                    <>
                                        {errors.reglab && <span className="font-medium">{errors.reglab.message}</span>}
                                    </>
                                }
                                id="reglab" name='reglab' sizing="sm" color={errors.reglab ? "failure" : "grey"} />
                            }
                        </div>
                    <div>
                        <div className="mb-0 block">
                            <Label htmlFor="coa" value="COA/HC Ref No" />
                        </div>
                        <TextInput
                            {...register("coa", {
                                required: (props.negaraStat == 2 ? "The COA/HC Ref number is required" : false),
                                maxLength: {
                                    value: 30,
                                    message: "Max length is 30"
                                }
                            })}
                            helperText={
                                <>
                                    {errors.coa && <span className="font-medium">{errors.coa.message}</span>}
                                </>
                            }
                            id="coa" name='coa' sizing="sm" color={errors.coa ? "failure" : "grey"} />
                    </div>
                    <div>
                        <div className="mb-0 block">
                                <Label htmlFor="datecoa" value="Issued Date" />
                        </div>
                        <TextInput
                                {...register("datecoa", {
                                required: "This filed is required",
                                maxLength: {
                                    value: 20,
                                    message: "Max length is 20"
                                }
                            })}
                            helperText={
                                <>
                                    {errors.datecoa && <span className="font-medium">{errors.datecoa.message}</span>}
                                </>
                            }
                                type='date' id="datecoa" name='datecoa' sizing="sm" color={errors.datecoa ? "failure" : "grey"} />
                    </div>
                    
                    {/* <div>
                        <div className="mb-0 block">
                            <Label htmlFor="nopc" value="PC Number" />
                        </div>
                        <TextInput
                            {...register("nopc", {
                                required: "The PC Number is required",
                                maxLength: {
                                    value: 40,
                                    message: "Max length is 40"
                                }
                            })}
                            helperText={
                                <>
                                    {errors.nopc && <span className="font-medium">{errors.nopc.message}</span>}
                                </>
                            }
                            id="nopc" name='nopc' sizing="sm" color={errors.nopc ? "failure" : "grey"} />
                    </div>
                    <div>
                        <div className="mb-0 block">
                            <Label htmlFor="issued_place" value="Place of issue PC" />
                        </div>
                        <TextInput
                            {...register("issued_place", {
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
                            <Label htmlFor="issued_date" value="Date of issue PC" />
                        </div>
                        <TextInput
                            {...register("issued_date", {

                            })}
                            //   helperText={
                            //       <>
                            //           {errors.issued_place && <span className="font-medium">{errors.issued_place.message}</span>}
                            //       </>
                            //   }
                            type='date' id="issued_date" name='issued_date' sizing="sm" color={errors.issued_date ? "failure" : "grey"} />
                    </div> */}
                </div>
                <div className="flex justify-center my-4">
                        <Button type={loading ? "button" : "submit"} disabled={loading} gradientMonochrome="info" className='me-2'><IoSave className="mr-2 h-5 w-5 " /> {loading ? <Spinner className="mr-2 h-5 w-5 "/> : 'Save'}</Button>
                </div>
                </form>
            </Modal.Body>
        </Modal>
    )
}

export default Komoditas