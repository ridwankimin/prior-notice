import { Button, Card, Label, Radio, Spinner, Table, TextInput, Textarea } from 'flowbite-react'
import React, { useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { IoSend, IoSave, IoPrint } from "react-icons/io5";
import { CiCirclePlus } from "react-icons/ci";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoMdSync } from "react-icons/io";
import Komoditas from './modal/Komoditas';
import { useParams } from 'react-router-dom';
import SessionModel from '../../model/SessionModel';
import Kontainer from './modal/Kontainer';
import Cert from './modal/Cert';
import DocPriorModel from '../../model/DocPriorModel';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Delete from './modal/Delete';
import UserEksModel from '../../model/UserEksModel';
import KemasanJson from '../../assets/json/jenisKemasan.json'
import SatuanJson from '../../assets/json/satuan.json'
import PelabuhanJson from '../../assets/json/pelabuhan.json'
import NegaraJson from '../../assets/json/kodeNegara.json'
import Select from 'react-select';

function getKemasanByID(id) {
    return KemasanJson.filter(item => item.id == id)[0]
}

function getSatuanByID(id) {
    return SatuanJson.filter(item => item.id == id)[0]
}

const kodePsat = ['R017', 'A012', 'B001', 'B011', 'B015', 'B029', 'B085', 'B136', 'B140', 'B165', 'B319', 'B447', 'B448', 'B449', 'B450', 'B451', 'B452', 'B453', 'B454', 'B455', 'B456', 'B457', 'B458', 'B459', 'B460', 'B461', 'B462', 'B463', 'B464', 'B465', 'B466', 'B467', 'B468', 'B472', 'B475', 'B476', 'B480', 'B483', 'B484', 'B485', 'B486', 'B487', 'B490', 'B491', 'B493', 'B494', 'B495', 'B496', 'B498', 'B499', 'B500', 'B501', 'B505', 'B506', 'B749', 'B753', 'B755', 'B756', 'B757', 'B758', 'B759', 'C001', 'C004', 'C005', 'G004', 'G005', 'G006', 'G007', 'G008', 'J011', 'K012', 'K013', 'K014', 'K020', 'K021', 'K022', 'K089', 'K101', 'K109', 'K112', 'K141', 'L002', 'L016', 'L018', 'L019', 'N003', 'O005', 'O006', 'P013', 'P014', 'P015', 'R012', 'S009', 'S012', 'S014', 'S015', 'S020', 'S021', 'S022', 'S029', 'S033', 'S034', 'S035', 'S036', 'S037', 'S058', 'T011', 'T024', 'T038', 'T039', 'U001', 'U002', 'U003', 'K019', 'K007', 'K002', 'K017', 'J005', 'S059']

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

const user = new SessionModel().getUserJson()
const docModel = new DocPriorModel()
const eksModel = new UserEksModel()

const getPelabuhan = (kd) => {
    const array = PelabuhanJson.filter(item => item.kode?.slice(0, 2) == kd)
    let balikan = array.map(e => {
        return {
            value: e.kode,
            label: e.kode + " - " + e.nama_en,
            data: e
        }
    })
    return balikan
}

const getNegara = (kd) => {
    let array = NegaraJson
    if(kd) {
        array = NegaraJson.filter(item => item.code == kd)
    }
    let balikan = array.map(e => {
        return {
            value: e.code,
            label: e.code + " - " + e.name,
            data: e
        }
    })
    return balikan
}

function CreatePN1() {
    let { param } = useParams()
    let karantina = ""
    let idPrior = ""
    if (param.length > 2) {
        idPrior = atob(param.slice(2))
        karantina = param.slice(1, 2)?.toUpperCase()
    } else {
        karantina = param?.slice(1, 2)?.toUpperCase()
    }
    let [loading, setLoading] = useState(false)
    let [dataSelect, setDataSelect] = useState({
        komoditas: [],
        kodehs: [],
        reglab: []
    })
    let [dataDelete, setDataDelete] = useState(false)
    let [modalDelete, setModalDelete] = useState(false)
    let [openModal, setOpenModal] = useState(false)
    let [indexCont, setIndexCont] = useState("")
    let [indexCert, setIndexCert] = useState("")
    let [indexKom, setIndexKom] = useState("")
    let [openModalCont, setOpenModalCont] = useState(false)
    let [openModalCert, setOpenModalCert] = useState(false)
    let [listKomoditas, setListKomoditas] = useState([])
    let [listKontainer, setListKontainer] = useState([])
    let [listCert, setListCert] = useState([])
    const {
        register,
        control,
        setValue,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm({
        docnbr: "",
        karantina: karantina,
        regid: user?.regid,
        email: user?.email,
        stat: 0
    })

    const setExporter = useCallback(() => {
        setValue('name', user?.firstname + " " + user?.lastname)
        setValue('company', user?.company)
        setValue('kdneg', user?.country)
        setValue('kdneg_origin', user?.country)
        const namaneg = getNegara(user?.country)
        setValue('kdneg_originView', namaneg[0]?.label)
        setValue('telp', user?.phone)
        setValue('alamat', user?.address)
        setValue('karantina', karantina)
        setValue('regid', user?.regid)
        setValue('email', user?.email)
        setValue('stat', (watch('docnbr') ? 1 : 0))
    }, [setValue, user])

    const onSubmit = values => {
        if (values.docnbr && (listCert?.length == 0 || listKomoditas?.length == 0)) {
            if (listKomoditas?.length == 0) {
                toast.error("Detail commodity is required")
            }
            if (listCert?.length == 0) {
            toast.error("Health/Sanitary/Phytosanitary Certificate is required")
            }
        } else {
            setLoading(true)
            const response = docModel.submitDocument(values)
            response
                .then((response) => {
                    setLoading(false)
                    if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
                        console.log(response)
                    }
                    setValue('docnbr', response?.data?.data?.docnbr)
                    setValue('stat', 1)
                    toast.success(response?.data?.message)
                })
                .catch((error) => {
                    setLoading(false)
                    if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
                        console.log(error)
                    }
                    toast.error(error?.response?.data?.message || "Failed")
                })
            if (values.docnbr) {
                window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: "smooth"
                });
            }
        }
    }

    const getKomoditas = () => {
        if (watch('docnbr')) {
            const response = docModel.getKomoditas(watch('docnbr'))
            response
                .then((response) => {
                    setLoading(false)
                    if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
                        console.log(response)
                    }
                    setListKomoditas(response.data.data)
                    toast.success(response?.data?.message)
                })
                .catch((error) => {
                    setLoading(false)
                    if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
                        console.log(error)
                    }
                    if (error?.response?.status == 404) {
                        setListKomoditas([])
                        toast.success("Data Empty")
                    } else {
                        toast.error(error?.response?.data?.message || "Failed")
                    }
                })
        } else {
            toast.success("Data Empty")
        }
    }

    const getKontainer = () => {
        if (watch('docnbr')) {
            const response = docModel.getKontainer(watch('docnbr'))
            response
                .then((response) => {
                    setLoading(false)
                    if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
                        console.log(response)
                    }
                    setListKontainer(response.data.data)
                    toast.success(response?.data?.message)
                })
                .catch((error) => {
                    setLoading(false)
                    if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
                        console.log(error)
                    }
                    if (error?.response?.status == 404) {
                        setListKontainer([])
                        toast.success("Data Empty")
                    } else {
                        toast.error(error?.response?.data?.message || "Failed")
                    }
                })
        } else {
            toast.success("Data Empty")
        }
    }

    const getCertPrior = () => {
        if (watch('docnbr')) {
            const response = docModel.getCertPrior(watch('docnbr'))
            response
                .then((response) => {
                    setLoading(false)
                    if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
                        console.log(response)
                    }
                    setListCert(response.data.data)
                    toast.success(response?.data?.message)
                })
                .catch((error) => {
                    setLoading(false)
                    if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
                        console.log(error)
                    }
                    if (error?.response?.status == 404) {
                        setListCert([])
                        toast.success("Data Empty")
                    } else {
                        toast.error(error?.response?.data?.message || "Failed")
                    }
                })
        } else {
            toast.success("Data Empty")
        }
    }

    const getMasterKomBarantin = () => {
        const response = eksModel.getMasterKomoditas(karantina)
        response
            .then((response) => {
                setLoading(false)
                if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
                    console.log(response)
                }
                let arraykom = response?.data?.data?.map(item => {
                    return {
                        value: (karantina == "T" ? item.kode_komoditas : item.id),
                        label: item.nama_en,
                        latin: item.nama_latin,
                        data: item
                    }
                })
                if(karantina == "T") {
                    arraykom = arraykom.filter(function (x) {
                        return !kodePsat.some(function (y) {
                            return JSON.stringify(x.value) == JSON.stringify(y);
                        })
                    });
                    // arraykom = arraykom.filter(f => kodePsat.includes(f.value))
                }
                setDataSelect(values => ({ ...values, komoditas: arraykom }))
            })
            .catch((error) => {
                setLoading(false)
                if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
                    console.log(error)
                }
            })
    }

    const getMasterKomoditas = (jenis) => {
        console.log(jenis)
        if (karantina) {
            if (karantina == "T") {
                if (jenis == "PSAT") {
                    const response = docModel.getMasterKomoditas(watch('negaraStat') == 3 ? '00' : user?.country)
                    response
                        .then((response) => {
                            setLoading(false)
                            if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
                                console.log(response)
                            }
                            const arraykom = response?.data?.data?.map(item => {
                                return {
                                    value: item.kode_komoditas,
                                    label: item.nama_ing,
                                    latin: item.nama_latin,
                                    data: item
                                }
                            })
                            setDataSelect(values => ({ ...values, komoditas: arraykom }))
                        })
                        .catch((error) => {
                            setLoading(false)
                            if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
                                console.log(error)
                            }
                            if(error.response.data.status == 404) {
                                setDataSelect(values => ({ ...values, komoditas: [] }))
                                // getMasterKomBarantin()
                            }
                        })
                } else if (jenis == "NON") {
                    console.log("jalankom")
                    getMasterKomBarantin()
                }
            } else {
                getMasterKomBarantin()
            }
        } else {
            toast.error("Type of quarantine is empty")
        }
    }
    
    const getMasterRegLab = () => {
        const response = docModel.getRegLab('CN', karantina)
        // const response = docModel.getRegLab(user?.country, karantina)
        response
            .then((response) => {
                setLoading(false)
                if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
                    console.log(response)
                }
                const arraykom = response?.data?.data?.map(item => {
                    return {
                        value: item.kd_reg,
                        label: item.nama_lab,
                        data: item
                    }
                })
                setDataSelect(values => ({ ...values, reglab: arraykom }))
            })
            .catch((error) => {
                setLoading(false)
                if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
                    console.log(error)
                }
            })
    }
    
    const getMasterKodeHs = () => {
        if (karantina) {
            const response = eksModel.getMasterKodeHs(karantina)
            response
                .then((response) => {
                    setLoading(false)
                    if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
                        console.log(response)
                    }
                    const arraykom = response?.data?.data?.map(item => {
                        return {
                            value: item.kode,
                            label: item.kode + " - " + item.nama_en,
                            isDisabled: item.kode ? false : true,
                            data: item
                        }
                    })
                    setDataSelect(values => ({ ...values, kodehs: arraykom }))
                })
                .catch((error) => {
                    setLoading(false)
                    if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
                        console.log(error)
                    }
                })
        } else {
            toast.error("Type of quarantine is empty")
        }
    }

    const getNegaraStat = useCallback(() => {
        const response = docModel.getNegaraStat(user?.country)
        response
        .then((response) => {
            console.log(response)
            setValue('negaraStat', response.data?.data?.stat)
        })
        .catch((error) => {
            if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
                console.log(error)
            }
        })
    }, [setValue])

    const getDocPrior = useCallback(() => {
        if (idPrior) {
            const response = docModel.getDocPriorAll(idPrior)
            response
                .then((response) => {
                    setLoading(false)
                    if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
                        console.log(response)
                    }
                    setValue('docnbr', response?.data?.data?.docnbr)
                    setValue('regid', response?.data?.data?.regid)
                    setValue('tgl_doc', response?.data?.data?.tgl_doc)
                    setValue('karantina', response?.data?.data?.karantina)
                    setValue('name', response?.data?.data?.name)
                    setValue('company', response?.data?.data?.company)
                    setValue('alamat', response?.data?.data?.alamat)
                    setValue('email', response?.data?.data?.email)
                    setValue('kdneg', response?.data?.data?.kdneg)
                    setValue('kdneg_origin', response?.data?.data?.kdneg)
                    const namaneg = getNegara(response?.data?.data?.kdneg)
                    setValue('kdneg_originView', namaneg[0]?.label)
                    setValue('telp', response?.data?.data?.telp)
                    setValue('name_imp', response?.data?.data?.name_imp)
                    setValue('company_imp', response?.data?.data?.company_imp)
                    setValue('alamat_imp', response?.data?.data?.alamat_imp)
                    setValue('email_imp', response?.data?.data?.email_imp)
                    setValue('telp_imp', response?.data?.data?.telp_imp)
                    setValue('gmo', response?.data?.data?.gmo)
                    setValue('processing', response?.data?.data?.processing)
                    setValue('processingLain', response?.data?.data?.processingLain)
                    setValue('jnsangkut', response?.data?.data?.jnsangkut)
                    setValue('bulk', response?.data?.data?.bulk)
                    setValue('novoyage', response?.data?.data?.novoyage)
                    setValue('port_asal', response?.data?.data?.port_asal)
                    setValue('tgl_loading', response?.data?.data?.tgl_loading)
                    setValue('kota_tuju', response?.data?.data?.kota_tuju)
                    setValue('port_tuju', response?.data?.data?.port_tuju)
                    setValue('tgl_tiba', response?.data?.data?.tgl_tiba)
                    setValue('tujuan', response?.data?.data?.tujuan)
                    setValue('ket_tujuan', response?.data?.data?.ket_tujuan)
                    setValue('place_issued', response?.data?.data?.place_issued)
                    setValue('keterangan', response?.data?.data?.keterangan)
                    setValue('stat', response?.data?.data?.stat)
                    setListKomoditas(response.data.data.listKomoditas)
                    setListKontainer(response.data.data.listKontainer)
                    setListCert(response.data.data.listCert)
                    // toast.success(response?.data?.message)
                })
                .catch((error) => {
                    setLoading(false)
                    if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
                        console.log(error)
                    }
                    if (error?.response?.status == 404) {
                        setListCert([])
                    }
                    toast.error(error?.response?.data?.message || "Failed")
                })
        }
    }, [idPrior, setValue])

    useEffect(() => {
        setExporter()
        getDocPrior()
        getNegaraStat()
    }, [setExporter, getDocPrior, getNegaraStat])

    return (
        <div className="w-full bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex justify-between">
                    <h5 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">E-Prior Notice - {karantina == 'I' ? 'Aquatic Animal & Product' : (karantina == 'T' ? 'Plant & Plant Product' : (karantina == 'H' ? 'Animal & Animal Product' : ""))}</h5>
                    <div className="flex">
                        <h5 className="mr-4 text-2xl text-gray-900 dark:text-white">No</h5>
                        <TextInput className='w-80' id='docnbr' name='docnbr' {...register("docnbr")} disabled />
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4 mt-8 mb-2 md:grid-cols-2">
                    <Card>
                        <h5 className="text-xl font-bold text-gray-900 dark:text-white"><u>Exporter</u></h5>
                        <div className="grid grid-cols-1 gap-4 mt-8 md:grid-cols-2">
                            <div>
                                <div className="mb-1 block">
                                    <Label htmlFor="name" value="Name" />
                                </div>
                                <TextInput disabled
                                    {...register("name", {
                                        required: "The name is required",
                                        maxLength: {
                                            value: 30,
                                            message: "Max length is 30"
                                        }
                                    })}
                                    helperText={
                                        <>
                                            {errors.name && <span className="font-medium">{errors.name.message}</span>}
                                        </>
                                    }
                                    id="name" name='name' color={errors.name ? "failure" : "grey"} />
                            </div>
                            <div>
                                <div className="mb-1 block">
                                    <Label htmlFor="company" value="Company Name" />
                                </div>
                                <TextInput disabled
                                    {...register("company", {
                                        required: "The company is required",
                                        maxLength: {
                                            value: 255,
                                            message: "Max length is 255"
                                        }
                                    })}
                                    helperText={
                                        <>
                                            {errors.company && <span className="font-medium">{errors.company.message}</span>}
                                        </>
                                    }
                                    id="company" name='company' color={errors.company ? "failure" : "grey"} />
                            </div>
                            <div>
                                <div className="mb-1 block">
                                    <Label htmlFor="kdneg" value="Country" />
                                </div>
                                <TextInput disabled
                                    {...register("kdneg", {
                                        required: "The country is required",
                                        maxLength: {
                                            value: 2,
                                            message: "Max length is 2"
                                        }
                                    })}
                                    helperText={
                                        <>
                                            {errors.kdneg && <span className="font-medium">{errors.kdneg.message}</span>}
                                        </>
                                    }
                                    id="kdneg" name='kdneg' color={errors.kdneg ? "failure" : "grey"} />
                            </div>
                            <div>
                                <div className="mb-1 block">
                                    <Label htmlFor="telp" value="Phone Number" />
                                </div>
                                <TextInput disabled
                                    {...register("telp", {
                                        required: "The phone number is required",
                                        maxLength: {
                                            value: 50,
                                            message: "Max length is 50"
                                        }
                                    })}
                                    helperText={
                                        <>
                                            {errors.telp && <span className="font-medium">{errors.telp.message}</span>}
                                        </>
                                    }
                                    id="telp" name='telp' color={errors.telp ? "failure" : "grey"} />
                            </div>
                        </div>
                        <div>
                            <div className="mb-1 block">
                                <Label htmlFor="alamat" value="Address" />
                            </div>
                            <Textarea disabled
                                {...register("alamat", {
                                    required: "The address is required",
                                    maxLength: {
                                        value: 500,
                                        message: "Max length is 500"
                                    }
                                })}
                                helperText={
                                    <>
                                        {errors.alamat && <span className="font-medium">{errors.alamat.message}</span>}
                                    </>
                                }
                                name="alamat" id="alamat" placeholder="Address.." rows={2} color={errors.alamat ? "failure" : "grey"} />
                        </div>
                    </Card>
                    <Card>
                        <h5 className="text-xl font-bold text-gray-900 dark:text-white"><u>Importer</u></h5>
                        <div className="grid grid-cols-1 gap-4 mt-8 md:grid-cols-2">
                            <div>
                                <div className="mb-1 block">
                                    <Label htmlFor="name_imp" value="Name" />
                                </div>
                                <TextInput
                                    {...register("name_imp", {
                                        required: "The name of importer is required",
                                        maxLength: {
                                            value: 30,
                                            message: "Max length is 30"
                                        }
                                    })}
                                    helperText={
                                        <>
                                            {errors.name_imp && <span className="font-medium">{errors.name_imp.message}</span>}
                                        </>
                                    }
                                    id="name_imp" name='name_imp' color={errors.name_imp ? "failure" : "grey"} />
                            </div>
                            <div>
                                <div className="mb-1 block">
                                    <Label htmlFor="company_imp" value="Company Name" />
                                </div>
                                <TextInput
                                    {...register("company_imp", {
                                        required: "The company of importer is required",
                                        maxLength: {
                                            value: 255,
                                            message: "Max length is 255"
                                        }
                                    })}
                                    helperText={
                                        <>
                                            {errors.company_imp && <span className="font-medium">{errors.company_imp.message}</span>}
                                        </>
                                    }
                                    id="company_imp" name='company_imp' color={errors.company_imp ? "failure" : "grey"} />
                            </div>
                            <div>
                                <div className="mb-1 block">
                                    <Label htmlFor="telp_imp" value="Phone Number" />
                                </div>
                                <TextInput
                                    {...register("telp_imp", {
                                        required: "The phone number of importer is required",
                                        maxLength: {
                                            value: 50,
                                            message: "Max length is 50"
                                        }
                                    })}
                                    helperText={
                                        <>
                                            {errors.telp_imp && <span className="font-medium">{errors.telp_imp.message}</span>}
                                        </>
                                    }
                                    id="telp_imp" name='telp_imp' color={errors.telp_imp ? "failure" : "grey"} />
                            </div>
                            <div>
                                <div className="mb-1 block">
                                    <Label htmlFor="email_imp" value="Email" />
                                </div>
                                <TextInput
                                    {...register("email_imp", {
                                        required: "The email is required",
                                        maxLength: {
                                            value: 50,
                                            message: "Max length is 50"
                                        }
                                    })}
                                    helperText={
                                        <>
                                            {errors.email_imp && <span className="font-medium">{errors.email_imp.message}</span>}
                                        </>
                                    }
                                    type='email' id="email_imp" name='email_imp' color={errors.email_imp ? "failure" : "grey"} />
                            </div>
                        </div>
                        <div>
                            <div className="mb-1 block">
                                <Label htmlFor="alamat_imp" value="Address" />
                            </div>
                            <Textarea
                                {...register("alamat_imp", {
                                    required: "The address of importer is required",
                                    maxLength: {
                                        value: 500,
                                        message: "Max length is 500"
                                    }
                                })}
                                helperText={
                                    <>
                                        {errors.alamat_imp && <span className="font-medium">{errors.alamat_imp.message}</span>}
                                    </>
                                }
                                name="alamat_imp" id="alamat_imp" placeholder="Address.." rows={2} color={errors.alamat_imp ? "failure" : "grey"} />
                        </div>
                    </Card>
                    <Card>
                        <h5 className="text-xl font-bold text-gray-900 dark:text-white"><u>Description of Consignment</u></h5>
                        <div className='flex'>
                            <div className="mb-2 block me-8">
                                <Label htmlFor="jnsangkut" value="Mean of Conveyance " />
                            </div>
                            <div className="flex items-center gap-2 me-8">
                                <Radio id="air" name="jnsangkut" value="air" {...register("jnsangkut", {
                                    required: "The field is required"
                                })} />
                                <Label htmlFor="air" className='me-4'>Aircraft</Label>

                                <Radio id="sea" name="jnsangkut" value="sea" {...register("jnsangkut")} />
                                <Label htmlFor="sea">Ocean vessel</Label>
                            </div>
                            <div style={{ display: (watch('jnsangkut') == 'sea' ? "block" : "none") }}>
                                <div className="flex items-center gap-2">
                                    <Radio id="bulk" name="bulk" value="Y" {...register("bulk", {
                                        required: (watch('jnsangkut') == 'sea' ? "The field is required" : false)
                                    })} />
                                    <Label htmlFor="bulk" className='me-3'>Bulk</Label>

                                    <Radio id="nonbulk" name="bulk" value="N" {...register("bulk")} />
                                    <Label htmlFor="nonbulk">Non Bulk</Label>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 mb-2 md:grid-cols-2">
                            <div>
                                <div className="mb-1 block">
                                    <Label htmlFor="novoyage" value="No Voyage/Flight" />
                                </div>
                                <TextInput
                                    {...register("novoyage", {
                                        maxLength: {
                                            value: 15,
                                            message: "Max length is 15"
                                        }
                                    })}
                                    helperText={
                                        <>
                                            {errors.novoyage && <span className="font-medium">{errors.novoyage.message}</span>}
                                        </>
                                    }
                                    id="novoyage" name='novoyage' color={errors.novoyage ? "failure" : "grey"} />
                            </div>
                            <div>
                                <div className="mb-1 block">
                                    <Label htmlFor="kota_tuju" value="Destination (city)" />
                                </div>
                                <TextInput
                                    {...register("kota_tuju", {
                                        required: "The destination is required",
                                        maxLength: {
                                            value: 25,
                                            message: "Max length is 25"
                                        }
                                    })}
                                    helperText={
                                        <>
                                            {errors.kota_tuju && <span className="font-medium">{errors.kota_tuju.message}</span>}
                                        </>
                                    }
                                    id="kota_tuju" name='kota_tuju' color={errors.kota_tuju ? "failure" : "grey"} />
                            </div>
                            <div>
                                <div className="mb-1 block">
                                    <Label htmlFor="port_asal" value="Port of loading" />
                                </div>
                                <Controller
                                    control={control}
                                    name={"port_asal"}
                                    rules={{ required: "The field is required" }}
                                    render={({ field: { value, onChange, ...field } }) => (
                                        <Select className='w-60' styles={customStyles} defaultValue={""} value={{ id: watch('port_asal'), label: watch('port_asalView') }} {...field} options={getPelabuhan(user?.country)} onChange={(e) => setValue("port_asal", e.value) & setValue("port_asalView", e.label)} />
                                    )}
                                />
                                {/* <TextInput
                                    {...register("port_asal", {
                                        required: "The port of loading is required",
                                        maxLength: {
                                            value: 15,
                                            message: "Max length is 15"
                                        }
                                    })}
                                    helperText={
                                        <>
                                            {errors.port_asal && <span className="font-medium">{errors.port_asal.message}</span>}
                                        </>
                                    }
                                    id="port_asal" name='port_asal' color={errors.port_asal ? "failure" : "grey"} /> */}
                            </div>
                            <div>
                                <div className="mb-1 block">
                                    <Label htmlFor="port_tuju" value="Port of unloading" />
                                </div>
                                <Controller
                                    control={control}
                                    name={"port_tuju"}
                                    rules={{ required: "The field is required" }}
                                    render={({ field: { value, onChange, ...field } }) => (
                                        <Select className='w-60' styles={customStyles} defaultValue={""} value={{ id: watch('port_tuju'), label: watch('port_tujuView') }} {...field} options={getPelabuhan('ID')} onChange={(e) => setValue("port_tuju", e.value) & setValue("port_tujuView", e.label)} />
                                    )}
                                />
                                {/* <TextInput
                                    {...register("port_tuju", {
                                        required: "The port of unloading is required",
                                        maxLength: {
                                            value: 15,
                                            message: "Max length is 15"
                                        }
                                    })}
                                    helperText={
                                        <>
                                            {errors.port_tuju && <span className="font-medium">{errors.port_tuju.message}</span>}
                                        </>
                                    }
                                    id="port_tuju" name='port_tuju' color={errors.port_tuju ? "failure" : "grey"} /> */}
                            </div>
                            <div>
                                <div className="mb-1 block">
                                    <Label htmlFor="tgl_loading" value="Date of loading" />
                                </div>
                                <TextInput
                                    {...register("tgl_loading", {
                                        required: "The date of loading is required",
                                        maxLength: {
                                            value: 20,
                                            message: "Max length is 20"
                                        }
                                    })}
                                    helperText={
                                        <>
                                            {errors.tgl_loading && <span className="font-medium">{errors.tgl_loading.message}</span>}
                                        </>
                                    }
                                    type='date' id="tgl_loading" name='tgl_loading' color={errors.tgl_loading ? "failure" : "grey"} />
                            </div>
                            <div>
                                <div className="mb-1 block">
                                    <Label htmlFor="tgl_tiba" value="Date of unloading" />
                                </div>
                                <TextInput
                                    {...register("tgl_tiba", {
                                        required: "The date of unloading is required",
                                        maxLength: {
                                            value: 20,
                                            message: "Max length is 20"
                                        }
                                    })}
                                    helperText={
                                        <>
                                            {errors.tgl_tiba && <span className="font-medium">{errors.tgl_tiba.message}</span>}
                                        </>
                                    }
                                    type='date' id="tgl_tiba" name='tgl_tiba' color={errors.tgl_tiba ? "failure" : "grey"} />
                            </div>
                        </div>
                    </Card>
                    <Card>
                        {/* <h5 className="text-xl font-bold text-gray-900 dark:text-white"><u>Export Purpose</u></h5> */}
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="processing" value="Degree of Processing" />
                            </div>
                            <div className="flex items-center gap-2 me-8">
                                <Radio id="fresh" name="processing" value="Fresh" {...register("processing", {
                                    required: "The field is required"
                                })} />
                                <Label htmlFor="fresh" className='me-4'>Fresh</Label>

                                <Radio id="min" name="processing" value="Min" {...register("processing")} />
                                <Label htmlFor="min">Minimal processed</Label>

                                <Radio id="full" name="processing" value="Full" {...register("processing")} />
                                <Label htmlFor="full">Full processed</Label>

                                <Radio id="other" name="processing" value="Other" {...register("processing")} />
                                <Label htmlFor="other">Other</Label>

                                <TextInput style={{ display: (watch('processing') == "Other" ? "block" : "none") }}
                                    {...register("processingLain", {
                                        required: (watch('processing') == "Other" ? true : false),
                                        maxLength: {
                                            value: 100,
                                            message: "Max length is 100"
                                        }
                                    })}
                                    helperText={
                                        <>
                                            {errors.processingLain && <span className="font-medium">{errors.processingLain.message}</span>}
                                        </>
                                    }
                                    className='w-60' id="processingLain" name='processingLain' placeholder='Please specify..' color={errors.tujuan ? "failure" : "grey"} />
                            </div>
                        </div>
                        <hr />
                        {/* <div className="grid grid-cols-1 gap-4 mb-2 md:grid-cols-2"> */}
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="tujuan" value="Purpose" />
                            </div>
                            <div className="flex items-center gap-2 me-8">
                                <Radio id="Consumption" name="tujuan" value="Consumption" {...register("tujuan", {
                                    required: "The field is required"
                                })} />
                                <Label htmlFor="Consumption" className='me-4'>Consumption</Label>

                                <Radio id="Raw" name="tujuan" value="Raw" {...register("tujuan")} />
                                <Label htmlFor="Raw">Raw Material/Industry</Label>

                                <Radio id="Other" name="tujuan" value="Other" {...register("tujuan")} />
                                <Label htmlFor="Other">Other</Label>
                                {/* <div style={{ display: (watch('tujuan') == "Other" ? "block" : "none") }}> */}
                                {/* <div className="mb-2 block">
                                            <Label htmlFor="ket_tujuan" value="Other Purpose" />
                                        </div> */}
                                <TextInput style={{ display: (watch('tujuan') == "Other" ? "block" : "none") }}
                                    {...register("ket_tujuan", {
                                        required: (watch('tujuan') == "Other" ? "The other purpose is required" : false),
                                        maxLength: {
                                            value: 255,
                                            message: "Max length is 255"
                                        }
                                    })}
                                    helperText={
                                        <>
                                            {errors.ket_tujuan && <span className="font-medium">{errors.ket_tujuan.message}</span>}
                                        </>
                                    }
                                    id="ket_tujuan" name='ket_tujuan' placeholder='Please specify..' color={errors.ket_tujuan ? "failure" : "grey"} />
                                {/* </div> */}
                            </div>
                        </div>
                        {/* </div> */}
                        <hr />
                        <div className="grid grid-cols-1 gap-4 mb-2 md:grid-cols-2">
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="gmo" value="Genetically Modified Organism" />
                                </div>
                                <div className="flex items-center gap-2 me-8">
                                    <Radio id="gmoN" name="gmo" value="N" {...register("gmo", {
                                        required: "The field is required"
                                    })} />
                                    <Label htmlFor="gmoN" className='me-4'>Non GMO</Label>

                                    <Radio id="gmoY" name="gmo" value="Y" {...register("gmo")} />
                                    <Label htmlFor="gmoY">GMO: the CoA`s reference no & date</Label>
                                </div>
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="keterangan" value="Additional Information" />
                                </div>
                                <TextInput
                                    {...register("keterangan", {
                                        maxLength: {
                                            value: 500,
                                            message: "Max length is 500"
                                        }
                                    })}
                                    helperText={
                                        <>
                                            {errors.keterangan && <span className="font-medium">{errors.keterangan.message}</span>}
                                        </>
                                    }
                                    id="keterangan" name='keterangan' color={errors.keterangan ? "failure" : "grey"} />
                            </div>
                        </div>
                        <hr />
                        <div className="grid grid-cols-1 gap-4 mb-2 md:grid-cols-2">
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="place_issued" value="Place of issue" />
                                </div>
                                <TextInput
                                    {...register("place_issued", {
                                        required: "The place of issued is required",
                                        maxLength: {
                                            value: 50,
                                            message: "Max length is 50"
                                        }
                                    })}
                                    helperText={
                                        <>
                                            {errors.place_issued && <span className="font-medium">{errors.place_issued.message}</span>}
                                        </>
                                    }
                                    id="place_issued" name='place_issued' color={errors.place_issued ? "failure" : "grey"} />
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="tgl_doc" value="Date of issue" />
                                </div>
                                <TextInput
                                    {...register("tgl_doc", {
                                        required: "The date of issued is required",
                                        maxLength: {
                                            value: 20,
                                            message: "Max length is 20"
                                        }
                                    })}
                                    helperText={
                                        <>
                                            {errors.tgl_doc && <span className="font-medium">{errors.tgl_doc.message}</span>}
                                        </>
                                    }
                                    type='date' id="tgl_doc" name='tgl_doc' color={errors.tgl_doc ? "failure" : "grey"} />
                            </div>
                        </div>
                    </Card>
                </div>
                <Card style={{ display: (watch('docnbr') ? "block" : "none") }}>
                    <h5 className="text-xl font-bold text-gray-900 dark:text-white"><u>Description of Commodity</u></h5>
                    <div className='flex'>
                        <div className="mb-2 block me-8">
                            <Label htmlFor="place_issued" value="Country of Origin" />
                        </div>
                        <Controller
                            control={control}
                            name={"kdneg_origin"}
                            rules={{ required: "The field is required" }}
                            render={({ field: { value, onChange, ...field } }) => (
                                <Select className='w-80' styles={customStyles} defaultValue={""} value={{ id: watch('kdneg_origin'), label: watch('kdneg_originView') }} {...field} options={getNegara('')} onChange={(e) => setValue("kdneg_origin", e.value) & setValue("kdneg_originView", e.label)} />
                            )}
                        />
                        {/* <TextInput
                            {...register("place_issued", {
                                required: "The place of issued is required",
                                maxLength: {
                                    value: 50,
                                    message: "Max length is 50"
                                }getNegara
                            })}
                            helperText={
                                <>
                                    {errors.place_issued && <span className="font-medium">{errors.place_issued.message}</span>}
                                </>
                            }
                            className='w-60' id="place_issued" name='place_issued' color={errors.place_issued ? "failure" : "grey"} /> */}
                    </div>
                    <div className="overflow-x-auto">
                        <div className="flex justify-between">
                            <Button onClick={() => setOpenModal(true) & getMasterKodeHs() & getMasterRegLab() & getMasterKomoditas()} type="button" className='mb-2' gradientMonochrome="info" size={'xs'}><CiCirclePlus className="mr-2 h-5 w-5" /> Input</Button>
                            <Button onClick={() => getKomoditas()} type="button" className='mb-2' gradientMonochrome="info" size={'xs'}><IoMdSync className="h-5 w-5" /></Button>
                        </div>
                        <Table striped hoverable>
                            <Table.Head>
                                {/* <Table.HeadCell>Comodity</Table.HeadCell> */}
                                <Table.HeadCell>Scientific name</Table.HeadCell>
                                <Table.HeadCell>HS Code</Table.HeadCell>
                                <Table.HeadCell>Quantity</Table.HeadCell>
                                <Table.HeadCell>Packaging</Table.HeadCell>
                                <Table.HeadCell>COA/HC Ref No</Table.HeadCell>
                                <Table.HeadCell>Reg Lab/NFSCA</Table.HeadCell>
                                <Table.HeadCell>Act</Table.HeadCell>
                            </Table.Head>
                            {listKomoditas?.length > 0 ?
                                <>
                                    <Table.Body className="divide-y">
                                        {listKomoditas.map((item, index) => (
                                            <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                {/* <Table.Cell className="font-medium text-gray-900 dark:text-white">{item.komoditas ?? ""}</Table.Cell> */}
                                                <Table.Cell>{item.nama_ilmiah}</Table.Cell>
                                                <Table.Cell>{item.hscode}</Table.Cell>
                                                <Table.Cell>{item.jumlah + " " + getSatuanByID(item.satuan)?.nama_en}</Table.Cell>
                                                <Table.Cell>{item.jumlahKemasan + " " + getKemasanByID(item.satuanKemasan)?.deskripsi}</Table.Cell>
                                                <Table.Cell>{item.coa + (item.datecoa ? " (" + item.datecoa + ")" : "")}</Table.Cell>
                                                <Table.Cell>{item.reglab}</Table.Cell>
                                                <Table.Cell>
                                                    <div className="flex">
                                                        {/* <Button onClick={() => setOpenModal(true) & setIndexKom(index)} size={'xs'} className='me-2' color="warning" pill ><FaEdit /></Button> */}
                                                        <Button onClick={() => setModalDelete("kom") & setDataDelete(item)} size={'xs'} color="failure" pill ><MdDelete /></Button>
                                                    </div>
                                                </Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </>
                                : ""}

                        </Table>
                    </div>
                </Card>
                <div className="grid grid-cols-1 gap-4 mt-8 mb-2 md:grid-cols-2">
                    <Card style={{ display: (watch('docnbr') && watch('bulk') == "N" ? "block" : "none") }}>
                        <h5 className="text-xl font-bold text-gray-900 dark:text-white"><u>Description of Container</u></h5>
                        <div className="overflow-x-auto">
                            <div className="flex justify-between">
                                <Button onClick={() => setOpenModalCont(true)} type="button" className='mb-2' gradientMonochrome="info" size={'xs'}><CiCirclePlus className="mr-2 h-5 w-5" /> Input</Button>
                                <Button onClick={() => getKontainer()} type="button" className='mb-2' gradientMonochrome="info" size={'xs'}><IoMdSync className="h-5 w-5" /></Button>
                            </div>
                            <Table striped hoverable>
                                <Table.Head>
                                    <Table.HeadCell>Container Number</Table.HeadCell>
                                    <Table.HeadCell>Size</Table.HeadCell>
                                    <Table.HeadCell>Act</Table.HeadCell>
                                </Table.Head>
                                {listKontainer?.length > 0 ?
                                    <>
                                        <Table.Body className="divide-y">
                                            {listKontainer.map((item, index) => (
                                                <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                    <Table.Cell className="font-medium text-gray-900 dark:text-white">{item.no_kont ?? ""}</Table.Cell>
                                                    <Table.Cell>{item.size ?? ""}</Table.Cell>
                                                    <Table.Cell>
                                                        <div className="flex">
                                                            <Button onClick={() => setOpenModalCont(true) & setIndexCont(index)} size={'xs'} className='me-2' color="warning" pill ><FaEdit /></Button>
                                                            <Button onClick={() => setModalDelete("cont") & setDataDelete(item)} size={'xs'} color="failure" pill ><MdDelete /></Button>
                                                        </div>
                                                    </Table.Cell>
                                                </Table.Row>
                                            ))}
                                        </Table.Body>
                                    </>
                                    : ""}

                            </Table>
                        </div>
                    </Card>
                    <Card style={{ display: (watch('docnbr') ? "block" : "none") }}>
                        <h5 className="text-xl font-bold text-gray-900 dark:text-white"><u>Health/Sanitary/Phytosanitary Certificate</u></h5>

                        <div className="overflow-x-auto">
                            <div className="flex justify-between">
                                <Button onClick={() => setOpenModalCert(true)} type="button" className='mb-2' gradientMonochrome="info" size={'xs'}><CiCirclePlus className="mr-2 h-5 w-5" /> Input</Button>
                                <Button onClick={() => getCertPrior()} type="button" className='mb-2' gradientMonochrome="info" size={'xs'}><IoMdSync className="h-5 w-5" /></Button>
                            </div>
                            <Table striped hoverable>
                                <Table.Head>
                                    <Table.HeadCell>Reference Number</Table.HeadCell>
                                    <Table.HeadCell>Place of Issue</Table.HeadCell>
                                    <Table.HeadCell>Date of Issue</Table.HeadCell>
                                    <Table.HeadCell>Act</Table.HeadCell>
                                </Table.Head>
                                {listCert?.length > 0 ?
                                    <>
                                        <Table.Body className="divide-y">
                                            {listCert.map((item, index) => (
                                                <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                    <Table.Cell className="font-medium text-gray-900 dark:text-white">{item.nomor ?? ""}</Table.Cell>
                                                    <Table.Cell>{item.issued_place ?? ""}</Table.Cell>
                                                    <Table.Cell>{item.issued_date ?? ""}</Table.Cell>
                                                    <Table.Cell>
                                                        <div className="flex">
                                                            <Button onClick={() => setOpenModalCert(true) & setIndexCert(index)} size={'xs'} className='me-2' color="warning" pill ><FaEdit /></Button>
                                                            <Button onClick={() => setModalDelete("cert") & setDataDelete(item)} size={'xs'} color="failure" pill ><MdDelete /></Button>
                                                        </div>
                                                    </Table.Cell>
                                                </Table.Row>
                                            ))}
                                        </Table.Body>
                                    </>
                                    : ""}
                            </Table>
                        </div>
                    </Card>
                </div>
                <div className="flex justify-center my-4">
                    <Button type={loading ? "button" : "submit"} disabled={loading} gradientDuoTone="greenToBlue" className='me-2'>{watch('docnbr') ? <IoSend className="mr-2 h-5 w-5 " /> : <IoSave className="mr-2 h-5 w-5 " />}{loading ? <Spinner aria-label="Default status example" /> : (watch('docnbr') ? 'Submit' : 'Save')}</Button>
                    <Button style={{ display: (watch('docnbr') ? "block" : "none")}} href={import.meta.env.VITE_REACT_APP_BE_LINK + 'printPdf/doc/' + btoa(watch('docnbr'))} target='_blank' type="button" gradientMonochrome="info"><IoPrint className="mr-2 h-5 w-5" /> Print</Button>
                </div>
            </form>
            <Komoditas
                openModal={openModal}
                karantina={karantina}
                setOpenModal={setOpenModal}
                getMasterKomoditas={getMasterKomoditas}
                getMasterKodeHs={getMasterKodeHs}
                getMasterRegLab={getMasterRegLab}
                dataSelect={dataSelect}
                getKomoditas={getKomoditas}
                listKomoditas={listKomoditas}
                setIndexKom={setIndexKom}
                indexKom={indexKom}
                docnbr={watch('docnbr')}
                negaraStat={watch('negaraStat')}
            />
            <Kontainer
                openModalCont={openModalCont}
                setOpenModalCont={setOpenModalCont}
                getKontainer={getKontainer}
                listKontainer={listKontainer}
                docnbr={watch('docnbr')}
                setIndexCont={setIndexCont}
                indexCont={indexCont}
            />
            <Cert
                openModalCert={openModalCert}
                setOpenModalCert={setOpenModalCert}
                getCertPrior={getCertPrior}
                listCert={listCert}
                docnbr={watch('docnbr')}
                setIndexCert={setIndexCert}
                indexCert={indexCert}
            />
            <Delete
                modalDelete={modalDelete}
                setModalDelete={setModalDelete}
                getKomoditas={getKomoditas}
                getKontainer={getKontainer}
                getCertPrior={getCertPrior}
                setDataDelete={setDataDelete}
                dataDelete={dataDelete}
            />
        </div>
    )
}

export default CreatePN1