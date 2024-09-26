import React from 'react'
import { Card, Button, TextInput, Spinner } from 'flowbite-react';
import DocPriorModel from '../../model/DocPriorModel';
import { useState } from 'react';
import { IoSearch } from "react-icons/io5";
import { BsQrCodeScan } from "react-icons/bs"
import { QrReader } from 'react-qr-reader';
import Kamera from './modal/Kamera';

const modelDoc = new DocPriorModel()

function CariPrior() {
    import('../../sglobal.css')
    let[loading, setLoading] = useState(false)
    let [openKamera, setOpenKamera] = useState(false)
    let[docNmr, setDocNmr] = useState("")
    let [cekDocument, setCekDocument] = useState("")

    const onSubmit = () => {
        setLoading(true)
        const response = modelDoc.getDocPriorNumber(docNmr)
        response
        .then((response) => {
            setLoading(false)
            if(response.data.data[0].stat == 1) {
                setCekDocument(response?.data?.message || "Data found")
            } else if (response.data.data[0].stat == 0) {
                setCekDocument("Document not submitted yet")
            }
        })
        .catch((error) => {
            setLoading(false)
            if(error.response.status == 404) {
                setCekDocument(error.response?.data?.message || "Document not found")
            } else {
                setCekDocument(error.response?.data?.message || "Failed to search")
            }
        })
    }
  return (
      <Card className="max-w-xl bg-opacity-50 border-white lg:w-96">
          <h5 className="text-2xl font-bold tracking-tight text-white-900 dark:text-white">
              Search Prior Notice
          </h5>
          {openKamera ?
          <>
            <QrReader
                onResult={(result, error) => {
                    if (!!result) {
                        const id = result?.text.split("/")
                        window.open(
                            import.meta.env.VITE_REACT_APP_BE_LINK + 'printPdf/view/' + id[id.length - 1],
                            '_blank' // <- This is what makes it open in a new window.
                        );
                        setOpenKamera(false)
                        // window.location.assign(import.meta.env.VITE_REACT_APP_BE_LINK + 'printPdf/view/' + id[id.length - 1])
                        //   console.log(result?.text);
                    }

                    if (!!error) {
                        //   console.log(error);
                    }
                }}
                constraints={{ aspectRatio: 1, facingMode: { ideal: "environment" } }}
                // videoConstraints={{ aspectRatio: 1 }}
                // style={{height: '80px'}}
                style={{ width: '100%' }}
            />
          </>
              //   <Kamera openKamera={openKamera} setOpenKamera={setOpenKamera} />
              : ""}
          <TextInput 
              rightIcon={() =>
                <BsQrCodeScan
                    onClick={() => setOpenKamera(!openKamera)}
                    className="cursor-pointer"
                />
              } 
              id='docnbr' name='docnbr' value={docNmr} onChange={(e) => setDocNmr(e.target.value)} placeholder='Insert Prior Notice Number..' />
          <Button pill disabled={loading} gradientDuoTone="greenToBlue" onClick={() => onSubmit()}>
              {loading ? <Spinner aria-label="Default status example" /> : <><IoSearch className='me-2' /> Search</>}
          </Button>
          <center style={{ display: (cekDocument ? "block" : "none")}}>
            <hr className='py-1' />
              <h5 className={"text-xl py-2 rounded-3xl border-zinc-50 font-bold text-center" + (cekDocument == "Data found" ? " text-green-700 dark:green-100 bg-green-200" : " text-red-700 dark:red-100 bg-red-200")}>
                  {cekDocument}
              </h5>
              {cekDocument == "Data found" ?
                  <Button className='w-32 mt-4' href={import.meta.env.VITE_REACT_APP_BE_LINK + 'printPdf/doc/' + btoa(docNmr)} target='_blank' size="xs" pill gradientDuoTone="redToYellow">View document</Button>
              : ""}
          </center>
      </Card>
  )
}

export default CariPrior