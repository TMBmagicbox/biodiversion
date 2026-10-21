import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { TELEFONO_DISPLAY, WHATSAPP_URL } from "@/lib/site";

export default function WhatsAppFloat() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Escríbenos por WhatsApp al ${TELEFONO_DISPLAY}`}
      className="fixed bottom-4 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#075E54] text-white shadow-lg transition-transform hover:scale-105 sm:w-auto sm:gap-2 sm:px-4"
    >
      <WhatsAppIcon className="h-7 w-7" />
      <span className="hidden font-extrabold sm:inline">WhatsApp</span>
    </a>
  );
}
