import { useEffect, useState } from "react";

function getBrowserName(): string {
  const userAgent = navigator.userAgent;

  if (/chrome|crios/i.test(userAgent) && !/edge|edgios|opr/i.test(userAgent)) return "Chrome";
  if (/firefox|fxios/i.test(userAgent)) return "Firefox";
  if (/safari/i.test(userAgent) && !/chrome|crios|android/i.test(userAgent)) return "Safari";
  if (/edg/i.test(userAgent)) return "Edge";
  if (/opr|opera/i.test(userAgent)) return "Opera";

  return "Unknown";
}

export default function CookieSettingsLink() {
  const [link, setLink] = useState("#");

  useEffect(() => {
    const browser = getBrowserName();
    switch (browser) {
      case "Chrome":
        setLink("https://support.google.com/accounts/answer/61416?hl=es");
        break;
      case "Firefox":
        setLink("https://support.mozilla.org/es/kb/activar-y-deshactivar-las-cookies");
        break;
      case "Safari":
        setLink("https://support.apple.com/es-es/105082");
        break;
      case "Edge":
        setLink("https://support.microsoft.com/es-es/microsoft-edge/eliminar-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09");
        break;
      case "Opera":
        setLink("https://help.opera.com/en/latest/web-preferences/#cookies");
        break;
      default:
        setLink("https://www.google.com/search?q=ajustar+cookies+navegador");
    }
  }, []);

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        fontSize: '0.95rem',
        color: '#fe5000',
        textDecoration: 'underline'
      }}
    >
      Ajustes de Cookies
    </a>
  );
}
