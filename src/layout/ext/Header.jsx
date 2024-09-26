import { Alert, Avatar, Button, Dropdown, Navbar } from 'flowbite-react'
import React, { useState } from 'react'
import BarantinLogo from '../../assets/logo/logo_barantin.png'
import { Link, useLocation } from 'react-router-dom'
import SessionModel from '../../model/SessionModel'
import ResetPassword from './modal/ResetPassword'

const user = new SessionModel().getUserJson()

function Header() {
    let location = useLocation();
    let [openModalReset, setOpenModalReset] = useState(false)

    const logout = () => {
        localStorage.clear()
        window.location.reload()

        // Swal.fire({
        //     icon: "success",
        //     title: "Sukses",
        //     text: "Logout sukses",
        //     showConfirmButton: false,
        //     timer: 700,
        //     willClose: () => {
        //         navigasi("/")
        //         window.location.reload();
        //     }
        // })
    }
    return (
        <>
            <Navbar fluid rounded>
                <Navbar.Brand>
                    <img src={BarantinLogo} className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
                    <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Prior Notice</span>
                </Navbar.Brand>
                <div className="flex md:order-2 mt-4">
                    <Navbar.Collapse className='mr-20'>
                        <Navbar.Link href="#" active={location.pathname == '' || location.pathname == '/' ? true : false}>Document List</Navbar.Link>
                        <Dropdown inline label="Create Document">
                            <Link to="/create/kh"><Dropdown.Item>Animal & Animal Product</Dropdown.Item></Link>
                            <Link to="/create/ki"><Dropdown.Item>Aquatic Animal & Product</Dropdown.Item></Link>
                            <Link to="/create/kt"><Dropdown.Item>Plant & Plant Product</Dropdown.Item></Link>
                            {/* <Dropdown.Item><Link to="/create">Prior Notice (PN1)</Link></Dropdown.Item>
                          <Dropdown.Item><Link to="/pn3">Prior Notice for Transit (PN3)</Link></Dropdown.Item> */}
                        </Dropdown>
                    </Navbar.Collapse>
                    <Dropdown
                        arrowIcon={false}
                        inline
                        label={
                            <Avatar rounded bordered size={'sm'} placeholderInitials={Array.from(user?.firstname)[0]?.toUpperCase() + Array.from(user?.lastname)[0]?.toUpperCase()} />
                        }
                    >
                        <Dropdown.Header>
                            <span className="block text-sm">{user?.company}</span>
                            <span className="block truncate text-sm font-medium">{user?.email}</span>
                        </Dropdown.Header>
                        <Dropdown.Item>Profile</Dropdown.Item>
                        <Dropdown.Item onClick={() => setOpenModalReset(true)}>Reset Password</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={() => logout()}>Sign out</Dropdown.Item>
                    </Dropdown>
                    <Navbar.Toggle />
                </div>
            </Navbar>
            <hr className="w-full h-1 mx-auto my-0 bg-gray-100 border-0 rounded md:my-2 dark:bg-gray-700" />
            {location.pathname == '' || location.pathname == '/' ?
                <Alert color="info" withBorderAccent className='mb-2'>
                    Welcome <span className="font-medium">{user?.company}</span>
                </Alert>
                : ""}
            <ResetPassword
                openModalReset={openModalReset}
                setOpenModalReset={setOpenModalReset}
            />
        </>
    )
}

export default Header