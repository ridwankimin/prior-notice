import React, { useCallback, useEffect, useState } from 'react'
import LuarModel from '../../model/LuarModel'
import { Controller, useForm } from 'react-hook-form'
import KodeNegara from '../../assets/json/kodeNegara.json'
import Select from 'react-select'
import { Button, Label, TextInput, Textarea } from 'flowbite-react'
import UserEksModel from '../../model/UserEksModel'

const modelAdd = new LuarModel()
const modelUser = new UserEksModel()

function selectNegara() {
    const data = KodeNegara.map(item => {
        return {
            value: item.dial_code,
            label: item.dial_code
        }
    })
    return data
}

function selectNegaraByCode(e) {
    const data = KodeNegara.filter(item => item.code == (e.toUpperCase()))
    return data[0]
}

function selectCountry2() {
    const data = KodeNegara.map(item => {
        return {
            value: item.code,
            label: item.code + " - " + item.name
        }
    })
    return data
}

const customStyles = {
    control: (provided, state) => ({
        ...provided,
        background: '#fff',
        borderColor: '#D4D8DD',
        cursor: 'text',
        minHeight: '30px',
        height: '42px',
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
        height: '40px',
    }),
}

function Register() {
    let [lokasi, setLokasi] = useState({
        latitude: "",
        longitude: ""
    })

    const {
        register,
        control,
        setValue,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            regId: "",
            latitude: "",
            longitude: ""
        }
    })

    const getMyLocation = useCallback(() => {
        const location = window.navigator && window.navigator.geolocation

        if (location) {
            location.getCurrentPosition((position) => {
                setLokasi(values => ({
                    ...values,
                    latitude: position?.coords?.latitude,
                    longitude: position?.coords?.longitude,
                }));
                const response = modelAdd.getAddress(position?.coords?.latitude, position.coords?.longitude)
                response
                    .then((response) => {
                        if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
                            console.log("response luar")
                            console.log(response)
                        }
                        const selectNegara = selectNegaraByCode(response?.data?.address?.country_code)
                        console.log(selectNegara)
                        setValue("latitude", position?.coords?.latitude)
                        setValue("longitude", position?.coords?.longitude)
                        setValue("address", response?.data?.display_name)
                        setValue("kodeNegTelp", selectNegara?.dial_code)
                        setValue("country", selectNegara?.code)
                        setValue("countryView", (selectNegara?.code + " - " + selectNegara?.name))
                    })
                    .catch((error) => {
                        if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
                            console.log(error)
                        }
                    })
            }, (error) => {
                setLokasi(values => ({
                    ...values,
                    latitude: 'err-latitude',
                    longitude: 'err-longitude',
                }));
            })
        }
    }, [])

    const onSubmit = (values) => {
        console.log(values)
        const response = modelUser.registrasi(values)
        response
        .then((response) => {
            console.log(response)
        })
        .catch((error) => {
            console.log(error)
        })
    }

    useEffect(() => {
        getMyLocation()
    }, [getMyLocation])
    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="flex justify-center min-h-screen">
                <div className="hidden bg-cover lg:block lg:w-2/5" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1494621930069-4fd4b2e24a11?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=715&q=80')" }}>
                </div>

                <div className="flex items-center w-full max-w-3xl p-8 mx-auto lg:px-12 lg:w-3/5">
                    <div className="w-full">
                        <h1 className="text-2xl font-semibold tracking-wider text-gray-800 capitalize dark:text-white">
                            <strong>Prior Notice</strong> account registration.
                        </h1>

                        <p className="mt-4 text-gray-500 dark:text-gray-400">
                            Lets get you all set up so you can verify your personal account and begin setting up your profile.
                        </p>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid grid-cols-1 gap-4 mt-8 mb-2 md:grid-cols-2">
                                <div>
                                    <Label htmlFor='firstname' className="block mb-2 text-sm text-gray-600 dark:text-gray-200">First Name</Label>
                                    <TextInput
                                        {...register("firstname", {
                                            required: "The first name is required",
                                            maxLength: {
                                                value: 50,
                                                message: "Max length is 50"
                                            }
                                        })}
                                        helperText={
                                            <>
                                                {errors.firstname && <span className="font-medium">{errors.firstname.message}</span>}
                                            </>
                                        }
                                        id="firstname" name='firstname' placeholder="John" color={errors.firstname ? "failure" : ""} />
                                </div>

                                <div>
                                    <Label htmlFor='lastname' className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Last name</Label>
                                    <TextInput
                                        {...register("lastname", {
                                            required: "The last name is required",
                                            maxLength: {
                                                value: 50,
                                                message: "Max length is 50"
                                            }
                                        })}
                                        helperText={
                                            <>
                                                {errors.lastname && <span className="font-medium">{errors.lastname.message}</span>}
                                            </>
                                        }
                                        id="lastname" name='lastname' placeholder="Snow" color={errors.lastname ? "failure" : ""} />
                                </div>

                                <div>
                                    <Label htmlFor='company' className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Company</Label>
                                    <TextInput
                                        {...register("company", {
                                            required: "The company name is required",
                                            maxLength: {
                                                value: 100,
                                                message: "Max length is 100"
                                            }
                                        })}
                                        helperText={
                                            <>
                                                {errors.company && <span className="font-medium">{errors.company.message}</span>}
                                            </>
                                        }
                                        id="company" name='company' placeholder="Company Name" color={errors.company ? "failure" : ""} />
                                </div>

                                <div>
                                    <Label htmlFor='country' className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Country</Label>
                                    <Controller
                                        control={control}
                                        name={"country"}
                                        rules={{ required: "The country is required" }}
                                        render={({ field: { value, onChange, ...field } }) => (
                                            <Select styles={customStyles} defaultValue={""} value={{ id: watch('country'), label: watch('countryView') }} {...field} options={selectCountry2()} onChange={(e) => setValue("country", e.value) & setValue("countryView", e.label)} />
                                        )}
                                    />
                                </div>
                            </div>
                            <div className='mb-2'>
                                <Label htmlFor='address' className="block mb-1 text-sm text-gray-600 dark:text-gray-200">Address</Label>
                                <Textarea 
                                    {...register("address", {
                                        required: "The address is required",
                                        maxLength: {
                                            value: 255,
                                            message: "Max length is 255"
                                        }
                                    })}
                                    helperText={
                                        <>
                                            {errors.address && <span className="font-medium">{errors.address.message}</span>}
                                        </>
                                    }
                                    name="address" id="address" placeholder="Address.." rows={2} color={errors.address ? "failure" : ""} />
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor='kodeNegTelp' className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Phone number</Label>
                                    <div className="flex">
                                        <Controller
                                            control={control}
                                            name={"kodeNegTelp"}
                                            rules={{ required: "The code phone number is required" }}
                                            render={({ field: { value, onChange, ...field } }) => (
                                                <Select className='w-30' styles={customStyles} defaultValue={""} value={{ id: watch('kodeNegTelp'), label: watch('kodeNegTelp') }} {...field} options={selectNegara()} onChange={(e) => setValue("kodeNegTelp", e.value)} />
                                            )}
                                        />
                                        <TextInput
                                            {...register("nomorTelp", {
                                                required: "The phone number is required",
                                                maxLength: {
                                                    value: 30,
                                                    message: "Max length is 30"
                                                }
                                            })}
                                            helperText={
                                                <>
                                                    {errors.kodeNegTelp && <span className="font-medium">{errors.kodeNegTelp.message}</span>}
                                                    {errors.nomorTelp && <span className="font-medium">{errors.nomorTelp.message}</span>}
                                                </>
                                            }
                                            name='nomorTelp' id="nomorTelp" placeholder="XXXXXXXXXXXX" color={errors.nomorTelp ? "failure" : ""} />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor='email' className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Email address</Label>
                                    <TextInput
                                        {...register("email", {
                                            required: "The email is required",
                                            pattern: {
                                                value: /\S+@\S+\.\S+/,
                                                message: "Entered value does not match email format"
                                            },
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
                                        type='email' name='email' id="email" placeholder="johnsnow@example.com" color={errors.email ? "failure" : ""} />
                                </div>

                                <div>
                                    <Label htmlFor='password' className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Password</Label>
                                    <TextInput
                                        {...register("password", {
                                            required: "The password name is required",
                                            minLength: {
                                                value: 8,
                                                message: "Min length is 8"
                                            }
                                        })}
                                        helperText={
                                            <>
                                                {errors.password && <span className="font-medium">{errors.password.message}</span>}
                                            </>
                                        }
                                        type='password' name='password' id="password" placeholder="Enter your password" color={errors.password ? "failure" : ""} />
                                </div>

                                <div>
                                    <Label htmlFor='confirmPassword' className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Confirm password</Label>
                                    <TextInput 
                                        {...register("confirmPassword", {
                                            required: "Please comfirm your password",
                                            validate: (val) => {
                                                if (watch('password') != val) {
                                                    return "Your passwords do no match";
                                                }
                                            },
                                        })}
                                        helperText={
                                            <>
                                                {errors.confirmPassword && <span className="font-medium">{errors.confirmPassword.message}</span>}
                                            </>
                                        }
                                        type='password' name='confirmPassword' id="confirmPassword" placeholder="Enter your password" color={errors.confirmPassword ? "failure" : ""} />
                                </div>
                            </div>

                            <Button type='submit' gradientDuoTone="purpleToBlue" className='flex items-center mt-3 w-full text-center' pill>Sign Up</Button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Register