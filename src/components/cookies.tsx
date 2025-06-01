import { useTranslation } from 'react-i18next';
import { useCookies } from 'react-cookie';
import { Button, Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';

export default function CookiesPopup() {
  const { t } = useTranslation('common');
  const [cookies, setCookies] = useCookies(["cookieConsent"]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!cookies.cookieConsent) {
      setShow(true);
    }
  }, [cookies.cookieConsent]);

  const handleAccept = () => {
    setCookies("cookieConsent", "true", { path: "/" });
    setShow(false);
  };

  const handleClose = () => {
    setShow(false);
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>{t("CookiePolicy")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{t("CookieConsent")}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleAccept}>
          {t("AcceptCookies")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}