import { Button, Label, Modal, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { IoSave } from "react-icons/io5"
import { BiHide, BiShow } from "react-icons/bi";
import UserEksModel from '../../../model/UserEksModel';
import { toast } from 'react-toastify';
import manual from '../../../assets/user_manual_prior_notice.pdf'

function Manualuser(props) {
  return (
      <Modal size="sm" show={props?.openManual} onClose={() => props.setOpenManual(false)} popup>
          <Modal.Header>User Manual - Prior Notice</Modal.Header>
          <Modal.Body>
            asd
              {/* <iframe src={manual} frameborder="0"></iframe> */}
          </Modal.Body>
      </Modal>
  )
}
export default Manualuser