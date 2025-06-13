import { useState , useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

interface params{
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function MapModal({showModal, setShowModal} : params) {
  const [show, setShow] = useState(false);

  const handleClose = () =>{
    setShow(false)
    setShowModal(false);
  };
  const handleShow = () =>setShow(true);

    useEffect(() => {
        setShow(showModal);
    }, [showModal]);
  return (
    <>
      

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>ERROR</Modal.Title>
        </Modal.Header>
        <Modal.Body>No se puede exportar a excel o pdf si no se elije un año y departamento/municipio</Modal.Body>
        
        
      </Modal>
    </>
  );
}

