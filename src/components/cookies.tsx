import { useTranslation } from 'react-i18next';
import { useCookies } from 'react-cookie';
import { Button, Offcanvas } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import CookieSettingsLink from "@/components/CookieSettingsLink";

export default function CookiesPopup({ onClose }: { onClose: () => void }) {
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
    onClose();
  };

  const handleClose = () => {
    setShow(false);
    onClose();
  };

  return (
    <Offcanvas
      show={show}
      onHide={handleClose}
      placement="bottom"
      className="cookies-offcanvas"
      backdrop={false}
      style={{
        maxWidth: '100vw',
        width: '100%',
        borderRadius: '12px 12px 0 0',
        boxShadow: '0 -2px 16px rgba(0,0,0,0.15)',
        padding: 0,
        backgroundColor: '#e6e6e6',
        height: 'auto',
        overflow: 'hidden'
      }}
    >
      <Offcanvas.Body className="px-4 px-sm-5 py-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start w-100 gap-4">
          <div className="flex-grow-1 text-start">
            <h5 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#19467f' ,paddingTop: '0.75rem'}}>
              {t("CookiePolicy")}
            </h5>
            <p style={{ fontSize: '1rem', maxWidth: '800px', color: '#19467f' }}>
              {t("CookieConsent")}
            </p>
          </div>
          <div className="d-flex flex-column align-items-center gap-2 w-100" style={{ maxWidth: 320 }}>
            <Button
              onClick={handleAccept}
              style={{
                width: '100%',
                fontSize: '1rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#19467f',
                color: 'white',
                border: 'none'
              }}
            >
              {t("AcceptCookies")}
            </Button>
            <Button
              onClick={handleClose}
              style={{
                width: '100%',
                fontSize: '1rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#19467f',
                color: 'white',
                border: 'none'
              }}
            >
              {t("Rechazar Cookies")}
            </Button>
            <CookieSettingsLink />
          </div>
        </div>
      </Offcanvas.Body>

      <style>
        {`
          @media (max-width: 576px) {
            .cookies-offcanvas .offcanvas-body {
              padding: 1rem 1rem;
            }
            .cookies-offcanvas .d-flex.flex-md-row {
              flex-direction: column !important;
              align-items: stretch !important;
            }
            .cookies-offcanvas .d-flex.align-items-end {
              align-items: stretch !important;
            }
            .cookies-offcanvas .btn {
              width: 100%;
            }
          }
        `}
      </style>
    </Offcanvas>
  );
}
