import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

interface ModalParams {
  title: string;
  message: string;
  footer?: React.ReactNode;
  show: boolean;
  onHide: () => void;
}

function MessageModal({ title, message, footer, show, onHide }: ModalParams) {
  return (
    <div
      className="modal show modal-dialog-cented"
      style={{ display: 'block', position: 'initial' }}
    >
      <Modal
        show={show}
        onHide={onHide}
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

export default MessageModal;