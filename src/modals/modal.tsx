import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

interface ModalParams {
    title: string;
    message: string;
    footer?: React.ReactNode;
}

function modal({ title, message, footer }: ModalParams) {
  return (
    <div
      className="modal show modal-dialog-cented"
      style={{ display: 'block', position: 'initial' }}
    >
      <Modal
          centered
    >
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>{message}</p>
        </Modal.Body>

        {footer && (
            <Modal.Footer>
            {footer}
        </Modal.Footer>
        )}

        
      </Modal>
    </div>
  );
}

export default modal;