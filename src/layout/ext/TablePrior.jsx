import React, { useCallback, useEffect, useMemo, useState } from 'react'
import DataTable from 'react-data-table-component'
// import PelabuhanJson from '../../assets/json/pelabuhan.json';
import { Link, useNavigate } from 'react-router-dom'
import { Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DocPriorModel from '../../model/DocPriorModel';
import SessionModel from '../../model/SessionModel';
import { Badge, Button, TextInput } from 'flowbite-react';
import { FiPrinter } from "react-icons/fi";
import { IoMdReturnRight } from "react-icons/io";

const user = new SessionModel().getUserJson()

const tableCustomStyles = {
    headCells: {
      style: {
        backgroundColor: 'black',
        fontWeight: 'bold',
        color: '#C8D6BE',
        border: 'solid 1px #EEEEEE',
    },
    },
    cells: {
        style: {
            borderRightStyle: 'solid',
			borderRightWidth: '0.5px',
			borderRightColor: '#EEEEEE',
            whiteSpace: 'unset'
        }
    }
  }

  function TablePrior(props) {
    let navigate = useNavigate();
    let [loading, setLoading] = useState(false);
    let [dataTableSsm, setdataTableSsm] = useState([]);
    let model = useMemo(() => new DocPriorModel, []);
    const [filterText, setFilterText] = useState('');

    const KolomStatus = ({row}) => (
        <div>
            <Badge color={row.stat == 1 ? "info" : "warning"} size="sm">
                {row.stat == 1 ? 'Sent' : 'Pending'}
            </Badge>
            {/* <span className={row.status ? 'btn btn-xs btn-success' : ""}>{row.statusBill}</span> */}
        </div>
    )

      function handleClick(e) {
          Swal.fire({
              title: "Item selected",
              text: "No: " + e.docnbr,
              icon: "question",
              showCancelButton: true,
              confirmButtonColor: "#086b06",
              cancelButtonColor: "#d33",
              confirmButtonText: "Print",
              cancelButtonText: "Cancel",
          }).then(() => {
            toast.success("printed")
          });
      }

    const columns = useMemo (
        () => [
        {
            name: "Act",
            cell: (e) => 
            <div className='flex'>
                {e.stat == 1 ?
                        <Button href={import.meta.env.VITE_REACT_APP_BE_LINK + 'printPdf/doc/' + btoa(e.docnbr)} target='_blank' size={'sm'} pill outline gradientDuoTone="greenToBlue" title='Print'><FiPrinter/></Button>
                        : <Link to={"/create/k" + e.karantina?.toLowerCase() + e.docnbr}><Button onClick={() => handleClick(e)} size={'sm'} pill outline gradientDuoTone="purpleToBlue" title='Print'><IoMdReturnRight /></Button></Link>
        }
                    {/* <button className="btn btn-sm btn-outline-dark me-1" type="button" title='Cetak Billing' onClick={() => handleClick(e)}><i className="fa-solid fa-print"></i></button> */}
            </div>,
            ignoreRowClick: true,
            allowOverFlow: true,
            width: '80px' //14
        },
        {
            name: 'No Prior',
            selector: row => row.docnbr,
            sortable: true,
            width: '220px', //37
            wrap: true,
        },
        {
            name: 'Date Issued',
            selector: row => row.tgl_doc,
            sortable: true,
            wrap: true,
            // width: '5%' //42
        },
        {
            name: 'No Flight/Voyage',
            selector: row => row.novoyage + " (" + row.jnsangkut + ")",
            sortable: true,
            wrap: true,
            // width: '5%' //42
        },
        {
            name: 'Importer',
            selector: row => row.company_imp,
            sortable: true,
            wrap: true,
            // width: '5%' //42
        },
        {
            name: 'Destination',
            selector: row => row.port_tuju,
            sortable: true,
            wrap: true,
            // width: '5%' //42
        },
        {
            name: 'Purpose',
            selector: row => row.tujuan + (row.ket_tujuan ? (" - " + row.ket_tujuan) : ""),
            sortable: true,
            wrap: true,
            // width: '5%' //42
        },
        {
            name: 'Status',
            cell: row => <KolomStatus row={row} />,
            // selector: row => row.stat,
            sortable: true,
            wrap: true,
            // width: '5%' //42
        }
    ])

    const getListPrior = useCallback(async () => {
        setLoading(true)
        try {
            const response = await model.getListPrior(user?.regid)
            setLoading(false)
            console.log(response)
            if(response.status == 200) {
                const dataSsmRetur = response.data.data;
                if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
                    console.log(response.data.data)
                }

                if (filterText) {
                    const filteredItemSsm = dataSsmRetur.filter(
                        item => 
                            (item.docnbr && item.docnbr.toLowerCase().includes(filterText.toLowerCase())) | 
                            (item.tgl_doc && item.tgl_doc.toLowerCase().includes(filterText.toLowerCase())) | 
                            (item.novoyage && item.novoyage.toLowerCase().includes(filterText.toLowerCase())) | 
                            (item.jnsangkut && item.jnsangkut.toLowerCase().includes(filterText.toLowerCase())) |
                            (item.company_imp && item.company_imp.toLowerCase().includes(filterText.toLowerCase())) |
                            (item.port_tuju && item.port_tuju.toLowerCase().includes(filterText.toLowerCase())) |
                            (item.tujuan && item.tujuan.toLowerCase().includes(filterText.toLowerCase())) |
                            (item.ket_tujuan && item.ket_tujuan.toLowerCase().includes(filterText.toLowerCase())) |
                            (item.processing && item.processing.toLowerCase().includes(filterText.toLowerCase())) |
                            (item.processingLain && item.processingLain.toLowerCase().includes(filterText.toLowerCase())) |
                            (item.stat && item.stat.toLowerCase().includes(filterText.toLowerCase()))
                        );
                        // console.log(filteredItemSsm)
                    setdataTableSsm(filteredItemSsm)
                } else {
                    setdataTableSsm(dataSsmRetur)
                }
                
                // setdataTableSsm([]);
            } else {
                setdataTableSsm([]);
            }
        } catch (error) {
            console.log(error)
            setLoading(false)
            if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
                console.log(error)
            }
            setdataTableSsm([]);
        }
    }, [model, props.dataIn, filterText])
    
    useEffect(() => {
      getListPrior()
    }, [getListPrior])

    const subHeaderComponentMemoSsm = React.useMemo(() => {
		return (
            <TextInput
            id="search"
                type="text"
                className='w-96'
                placeholder="Search.."
                aria-label="Search Input"
                value={filterText}
                onChange={e => setFilterText(e.target.value)}
            />
		);
	}, [filterText]);

  return (
    <div style={{height: (dataTableSsm.length > 8 ? "300px" : "")}}>
        <DataTable
            title={"Doc Prior Notice - " + user?.company}
            customStyles={tableCustomStyles}
            columns={columns}
            data={dataTableSsm}
            pagination
            // paginationServer
            progressPending={loading}
            dense
            direction="center"
            fixedHeader
            fixedHeaderScrollHeight="400px"
            highlightOnHover
            pointerOnHover
            // expandableRows 
            // expandableRowsComponent={""}
            // expandableRowsComponentProps={{"someTitleProp": ""}}
            responsive
            striped
            subHeader
            clearSelectedRows
            subHeaderComponent={subHeaderComponentMemoSsm}
            // persistTableHead
        />
    </div>
    )
}

export default TablePrior