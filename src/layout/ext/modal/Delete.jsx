import { Button, Modal } from 'flowbite-react'
import React from 'react'
import { HiOutlineExclamationCircle } from "react-icons/hi";
import DocPriorModel from '../../../model/DocPriorModel';
import { toast } from 'react-toastify';

const docModel = new DocPriorModel()

function Delete(props) {
    const handleDelete = () => {
        if (props.modalDelete == "cert") {
            const response = docModel.deleteCertPrior(props.dataDelete?.id)
            response
            .then((response) => {
                if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
                    console.log(response)
                }
                props.getCertPrior()
                toast.success(response?.data?.message || "Delete success")
                props.setModalDelete(false)
            })
            .catch((error) => {
                if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
                    console.log(error)
                }
                toast.error(error.response?.data?.message || "Delete failed")
                props.setModalDelete(false)
            })
        } else if (props.modalDelete == "cont") {
            const response = docModel.deleteKontainer(props.dataDelete?.id)
            response
                .then((response) => {
                    if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
                        console.log(response)
                    }
                    props.getKontainer()
                    toast.success(response?.data?.message || "Delete success")
                    props.setModalDelete(false)
                })
                .catch((error) => {
                    if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
                        console.log(error)
                    }
                    toast.error(error.response?.data?.message || "Delete failed")
                    props.setModalDelete(false)
                })
        } else if (props.modalDelete == "kom") {
            const response = docModel.deleteKomoditas(props.dataDelete?.id)
            response
                .then((response) => {
                    if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
                        console.log(response)
                    }
                    props.getKomoditas()
                    toast.success(response?.data?.message || "Delete success")
                    props.setModalDelete(false)
                })
                .catch((error) => {
                    if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
                        console.log(error)
                    }
                    toast.error(error.response?.data?.message || "Delete failed")
                    props.setModalDelete(false)
                })
        }
    }
  return (
      <Modal show={props.modalDelete} size="md" onClose={() => props.setModalDelete(false)} popup>
          <Modal.Header />
          <Modal.Body>
              <div className="text-center">
                  <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                  <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                      Are you sure you want to delete this item?
                  </h3>
                  <div className="flex justify-center gap-4">
                      <Button color="failure" onClick={() => handleDelete()}>
                          Yes, I'm sure
                      </Button>
                      <Button color="gray" onClick={() => props.setModalDelete(false)}>
                          No, cancel
                      </Button>
                  </div>
              </div>
          </Modal.Body>
      </Modal>
  )
}

export default Delete