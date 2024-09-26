import { Modal } from 'flowbite-react';
import React from 'react'
import { QrReader } from 'react-qr-reader';

function Kamera(props) {
  return (
      <Modal size="7xl" show={props?.openKamera} onClose={() => props.setOpenKamera(false)}>
          <Modal.Header>Scan QR</Modal.Header>
          <Modal.Body>
              <QrReader
                  onResult={(result, error) => {
                      if (!!result) {
                          console.log(result?.text);
                      }

                      if (!!error) {
                          console.info(error);
                      }
                  }}
                  style={{ width: '100%' }}
              />
          </Modal.Body>
      </Modal>
  )
}

export default Kamera