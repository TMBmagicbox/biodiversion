import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enlaces",
  description:
    "Sitio web, redes sociales y WhatsApp de Guardería Biodiversión, Cancún.",
};

export default function EnlacesPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:ital,wght@0,400;0,600;0,700;1,600&display=swap');

        .enlaces-root{
          --sky-top:#bfe3ef;
          --sky-mid:#3f8fb8;
          --teal-deep:#1c4956;
          --teal-deeper:#123540;
          --leaf:#a8c944;
          --leaf-dark:#7fa02e;
          --ink:#0f2e37;
          --paper:#eef8fb;
          --paper-soft:rgba(238,248,251,0.14);
          --paper-line:rgba(238,248,251,0.28);
          --white:#ffffff;

          min-height:100vh;
          margin:0;
          background:
            radial-gradient(60rem 40rem at 15% -10%, rgba(255,255,255,0.25), transparent 60%),
            linear-gradient(175deg, rgba(28,73,86,0.55) 0%, rgba(18,53,64,0.72) 45%, rgba(15,46,55,0.92) 100%),
            url('/images/enlaces-bg.jpg');
          background-size:cover, cover, cover;
          background-position:center, center, center 30%;
          background-repeat:no-repeat, no-repeat, no-repeat;
          background-attachment:fixed, fixed, fixed;
          font-family:'Nunito', system-ui, sans-serif;
          color:var(--paper);
          display:flex;
          justify-content:center;
          padding:56px 20px 40px;
          box-sizing:border-box;
        }
        .enlaces-root *{box-sizing:border-box;}

        .enlaces-page{
          position:relative;
          width:100%;
          max-width:432px;
        }

        .enlaces-bubble{
          position:absolute;
          border-radius:50%;
          background:rgba(255,255,255,0.10);
          filter:blur(0.5px);
          z-index:0;
        }
        .enlaces-bubble.b1{width:220px;height:220px;top:-40px;right:-90px;}
        .enlaces-bubble.b2{width:140px;height:140px;bottom:120px;left:-70px;background:rgba(168,201,68,0.16);}
        .enlaces-bubble.b3{width:90px;height:90px;top:230px;right:-30px;background:rgba(255,255,255,0.08);}

        .enlaces-content{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;}

        .enlaces-brand{display:flex;flex-direction:column;align-items:center;text-align:center;margin-bottom:6px;}
        .enlaces-logo-img{
          display:block;
          width:272px;
          height:auto;
          margin-top:10px;
          filter:drop-shadow(0 6px 18px rgba(6,20,26,0.55));
        }
        .enlaces-tagline{
          font-size:14.5px;
          font-weight:600;
          color:rgba(238,248,251,0.9);
          text-shadow:0 1px 4px rgba(6,26,32,0.5);
          margin-top:14px;
          max-width:280px;
        }
        .enlaces-eyebrow{
          margin-top:16px;
          font-size:11.5px;
          font-weight:700;
          text-transform:uppercase;
          letter-spacing:1.6px;
          color:rgba(238,248,251,0.75);
          text-shadow:0 1px 4px rgba(6,26,32,0.5);
        }

        .enlaces-links{width:100%;display:flex;flex-direction:column;gap:14px;margin-top:22px;}

        .enlaces-card{
          display:flex;
          align-items:center;
          gap:14px;
          width:100%;
          padding:16px 20px;
          border-radius:20px;
          text-decoration:none;
          font-family:'Fredoka',sans-serif;
          font-weight:600;
          font-size:17px;
          transition:transform .15s ease, box-shadow .15s ease;
          border:1px solid transparent;
        }
        .enlaces-card:active{transform:scale(0.98);}

        .enlaces-card .ico{
          flex:none;
          width:42px;height:42px;
          border-radius:50%;
          display:flex;align-items:center;justify-content:center;
        }
        .enlaces-card .txt{display:flex;flex-direction:column;gap:1px;flex:1;min-width:0;}
        .enlaces-card .txt small{
          font-family:'Nunito',sans-serif;
          font-weight:600;
          font-size:12.5px;
          opacity:0.75;
        }
        .enlaces-card .chev{flex:none;opacity:0.55;}

        .enlaces-card.primary{
          background:linear-gradient(180deg, #b7d955, var(--leaf) 55%, var(--leaf-dark));
          color:var(--teal-deeper);
          box-shadow:0 10px 22px -8px rgba(10,20,5,0.45), inset 0 1px 0 rgba(255,255,255,0.35);
        }
        .enlaces-card.primary .ico{background:rgba(15,46,25,0.14);color:var(--teal-deeper);}
        .enlaces-card.primary .txt small{color:rgba(15,46,25,0.68);}
        .enlaces-card.primary .chev{color:var(--teal-deeper);}

        .enlaces-card.glass{
          background:var(--paper-soft);
          border-color:var(--paper-line);
          color:var(--paper);
          backdrop-filter:blur(6px);
        }
        .enlaces-card.glass .ico{background:rgba(238,248,251,0.16);color:var(--paper);}
        .enlaces-card.glass .txt small{color:rgba(238,248,251,0.65);}
        .enlaces-card.glass .chev{color:rgba(238,248,251,0.7);}
        .enlaces-card.glass.whatsapp .ico{background:#25D366;color:#0b3b1e;}
        .enlaces-card.glass.facebook .ico{background:#1877F2;color:#fff;}

        .enlaces-secondary{
          display:flex;gap:10px;width:100%;margin-top:16px;
        }
        .enlaces-chip{
          flex:1;
          display:flex;align-items:center;justify-content:center;gap:8px;
          padding:12px 10px;
          border-radius:14px;
          background:rgba(238,248,251,0.08);
          border:1px solid rgba(238,248,251,0.18);
          color:rgba(238,248,251,0.9);
          font-family:'Nunito',sans-serif;
          font-weight:700;
          font-size:13px;
          text-decoration:none;
        }
        .enlaces-chip svg{flex:none;}

        .enlaces-footer{
          margin-top:34px;
          text-align:center;
          font-family:'Nunito',sans-serif;
          font-size:11.5px;
          font-weight:600;
          color:rgba(238,248,251,0.5);
          letter-spacing:0.2px;
        }

        @media (max-width:380px){
          .enlaces-logo-img{width:224px;}
        }
      `}</style>

      <div className="enlaces-root">
        <div className="enlaces-page">
          <div className="enlaces-bubble b1"></div>
          <div className="enlaces-bubble b2"></div>
          <div className="enlaces-bubble b3"></div>

          <div className="enlaces-content">
            <div className="enlaces-brand">
              <img className="enlaces-logo-img" src="/images/logo-white.png" alt="Biodiversión" />
              <div className="enlaces-tagline">Guardería y estancia infantil en Cancún · SM 50</div>
            </div>

            <div className="enlaces-eyebrow">¿Qué te gustaría hacer?</div>

            <div className="enlaces-links">
              <a className="enlaces-card primary" href="https://www.biodiversion.baby" target="_blank" rel="noopener">
                <span className="ico" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3 3 10h2v10h5v-6h4v6h5V10h2L12 3z" fill="currentColor"/></svg>
                </span>
                <span className="txt">Visitar nuestra página web<small>biodiversion.baby · servicios, horarios y ubicación</small></span>
                <span className="chev" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
              </a>

              <a className="enlaces-card glass facebook" href="https://facebook.com/biodiversion" target="_blank" rel="noopener">
                <span className="ico" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z" fill="currentColor"/></svg>
                </span>
                <span className="txt">Síguenos en redes sociales<small>Facebook · /biodiversion</small></span>
                <span className="chev" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
              </a>

              <a className="enlaces-card glass whatsapp" href="https://wa.me/529981290100?text=Hola%2C%20vengo%20del%20c%C3%B3digo%20QR%20de%20Biodiversi%C3%B3n%20y%20me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n%20sobre%20inscripciones." target="_blank" rel="noopener">
                <span className="ico" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.8 1-.2.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5l.4-.4c.1-.1.2-.3.3-.4.1-.2 0-.3 0-.4-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.7.3-.2.2-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.9 2.9 4.6 4 .6.3 1.1.4 1.5.6.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3z" fill="currentColor"/></svg>
                </span>
                <span className="txt">Escríbenos por WhatsApp<small>Respuesta rápida · agenda tu visita</small></span>
                <span className="chev" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
              </a>
            </div>

            <div className="enlaces-secondary">
              <a className="enlaces-chip" href="tel:+529981290100">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.2 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.2 1.1L6.6 10.8z" fill="currentColor"/></svg>
                998 129 0100
              </a>
              <a className="enlaces-chip" href="https://www.google.com/maps/search/?api=1&query=Av.+Kohunlich+210%2C+SM+50%2C+Canc%C3%BAn%2C+Quintana+Roo" target="_blank" rel="noopener">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 22s7-7.3 7-12.5A7 7 0 0 0 5 9.5C5 14.7 12 22 12 22zm0-9.8a2.7 2.7 0 1 1 0-5.4 2.7 2.7 0 0 1 0 5.4z" fill="currentColor"/></svg>
                SM 50, Cancún
              </a>
            </div>

            <footer className="enlaces-footer">© 2025 Team Magicbox Crew Studio · Cancún, QR</footer>
          </div>
        </div>
      </div>
    </>
  );
}
