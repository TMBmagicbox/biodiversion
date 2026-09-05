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
          --paper:#eef8fb;
          --paper-deep:#dcebf0;
          --ink:#0f2e37;
          --teal-deep:#1c4956;
          --teal-deeper:#123540;
          --leaf-dark:#7fa02e;
          --white:#ffffff;

          min-height:100vh;
          margin:0;
          background:var(--paper);
          font-family:'Nunito', system-ui, sans-serif;
          color:var(--ink);
          display:flex;
          justify-content:center;
          box-sizing:border-box;
        }
        .enlaces-root *{box-sizing:border-box;}

        .enlaces-page{
          position:relative;
          width:100%;
          max-width:480px;
          padding-bottom:36px;
        }

        /* ---- banner photo ---- */
        .enlaces-banner{
          position:relative;
          width:100%;
          height:264px;
          overflow:hidden;
          background:
            linear-gradient(195deg, rgba(18,53,64,0.32) 0%, rgba(18,53,64,0.7) 100%),
            url('/images/enlaces-bg.jpg') center 30% / cover no-repeat;
        }
        .enlaces-banner-mark{
          position:absolute;
          top:50%;
          left:50%;
          transform:translate(-50%,-50%);
          width:126px;
          height:auto;
          filter:drop-shadow(0 4px 10px rgba(6,20,26,0.5));
        }

        /* ---- avatar overlapping the seam ---- */
        .enlaces-avatar-row{
          display:flex;
          justify-content:center;
          margin-top:-48px;
          position:relative;
          z-index:2;
        }
        .enlaces-avatar{
          width:96px;
          height:96px;
          border-radius:50%;
          background:var(--paper);
          border:4px solid var(--paper);
          box-shadow:0 8px 20px -4px rgba(15,46,55,0.35);
          overflow:hidden;
        }
        .enlaces-avatar img{
          width:100%;
          height:100%;
          object-fit:cover;
        }

        .enlaces-content{
          position:relative;
          z-index:1;
          display:flex;
          flex-direction:column;
          align-items:center;
          padding:0 24px;
        }

        .enlaces-name{
          margin:14px 0 0;
          font-family:'Fredoka', sans-serif;
          font-weight:700;
          font-size:23px;
          letter-spacing:0.8px;
          text-transform:uppercase;
          color:var(--teal-deep);
          text-align:center;
        }

        .enlaces-sub{
          margin:8px 0 0;
          text-align:center;
          font-size:13.5px;
          font-weight:600;
          color:var(--leaf-dark);
          line-height:1.55;
          max-width:390px;
        }

        /* ---- buttons ---- */
        .enlaces-links{width:100%;display:flex;flex-direction:column;gap:12px;margin-top:24px;}

        .enlaces-btn{
          display:flex;
          align-items:center;
          gap:14px;
          width:100%;
          padding:15px 20px;
          border-radius:999px;
          text-decoration:none;
          font-family:'Fredoka',sans-serif;
          font-weight:600;
          font-size:16px;
          border:1.5px solid transparent;
          cursor:pointer;
        }
        .enlaces-btn.filled{
          background:var(--teal-deep);
          color:var(--paper);
          box-shadow:0 10px 22px -10px rgba(18,53,64,0.65);
        }
        .enlaces-btn .ico{flex:none;display:flex;align-items:center;justify-content:center;width:20px;}
        .enlaces-btn .label{flex:1;}
        .enlaces-btn .chev{flex:none;opacity:0.7;}

        .enlaces-toggle{
          border-radius:999px;
          border:1.5px solid var(--teal-deep);
          overflow:hidden;
          transition:border-radius .15s ease;
        }
        .enlaces-toggle[open]{
          border-radius:26px;
        }
        .enlaces-toggle summary{
          display:flex;
          align-items:center;
          gap:14px;
          width:100%;
          padding:15px 20px;
          font-family:'Fredoka',sans-serif;
          font-weight:600;
          font-size:16px;
          color:var(--teal-deep);
          cursor:pointer;
          list-style:none;
        }
        .enlaces-toggle summary::-webkit-details-marker{display:none;}
        .enlaces-toggle summary .ico{flex:none;display:flex;align-items:center;justify-content:center;width:20px;}
        .enlaces-toggle summary .label{flex:1;}
        .enlaces-toggle summary .chev{flex:none;transition:transform .2s ease;}
        .enlaces-toggle[open] summary .chev{transform:rotate(180deg);}

        .enlaces-panel{
          padding:6px 20px 20px;
          text-align:center;
        }
        .enlaces-panel-label{
          font-size:11px;
          font-weight:700;
          text-transform:uppercase;
          letter-spacing:1.4px;
          color:rgba(15,46,55,0.5);
          margin:6px 0 14px;
        }
        .enlaces-icon-row{
          display:flex;
          justify-content:center;
          gap:16px;
        }
        .enlaces-icon-btn{
          width:52px;
          height:52px;
          border-radius:50%;
          background:var(--paper-deep);
          color:var(--teal-deep);
          display:flex;
          align-items:center;
          justify-content:center;
          text-decoration:none;
        }

        .enlaces-footer{
          margin-top:28px;
          text-align:center;
          font-size:11.5px;
          font-weight:600;
          color:rgba(15,46,55,0.45);
          letter-spacing:0.2px;
        }

        @media (max-width:380px){
          .enlaces-banner{height:230px;}
          .enlaces-banner-mark{width:132px; top:26px;}
          .enlaces-avatar{width:84px;height:84px;}
          .enlaces-avatar-row{margin-top:-42px;}
        }
      `}</style>

      <div className="enlaces-root">
        <div className="enlaces-page">
          <div className="enlaces-banner">
            <img className="enlaces-banner-mark" src="/images/logo-white.png" alt="Biodiversión" />
          </div>

          <div className="enlaces-avatar-row">
            <div className="enlaces-avatar">
              <img src="/images/enlaces-avatar.png" alt="Biodiversión" />
            </div>
          </div>

          <div className="enlaces-content">
            <h1 className="enlaces-name">Biodiversión</h1>
            <p className="enlaces-sub">
              Guardería y estancia infantil en Cancún · SM&nbsp;50
              <br />
              Elige una opción para continuar
            </p>

            <div className="enlaces-links">
              <a className="enlaces-btn filled" href="https://www.biodiversion.baby" target="_blank" rel="noopener">
                <span className="ico" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3 3 10h2v10h5v-6h4v6h5V10h2L12 3z" fill="currentColor"/></svg>
                </span>
                <span className="label">Visitar sitio web</span>
                <span className="chev" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
              </a>

              <a
                className="enlaces-btn filled"
                href="https://wa.me/529981290100?text=Hola%2C%20vengo%20del%20c%C3%B3digo%20QR%20de%20Biodiversi%C3%B3n%20y%20me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n%20sobre%20inscripciones."
                target="_blank"
                rel="noopener"
              >
                <span className="ico" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.8 1-.2.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5l.4-.4c.1-.1.2-.3.3-.4.1-.2 0-.3 0-.4-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.7.3-.2.2-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.9 2.9 4.6 4 .6.3 1.1.4 1.5.6.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3z" fill="currentColor"/></svg>
                </span>
                <span className="label">Escríbenos por WhatsApp</span>
                <span className="chev" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
              </a>

              <details className="enlaces-toggle">
                <summary>
                  <span className="ico" aria-hidden="true">
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="2"/><circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="2"/><circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="2"/><path d="M8.6 10.6 15.4 6.9M8.6 13.4l6.8 3.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                  </span>
                  <span className="label">Otras formas de contacto</span>
                  <span className="chev" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                </summary>
                <div className="enlaces-panel">
                  <div className="enlaces-panel-label">Contáctanos</div>
                  <div className="enlaces-icon-row">
                    <a className="enlaces-icon-btn" href="https://facebook.com/biodiversion" target="_blank" rel="noopener" aria-label="Facebook">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z" fill="currentColor"/></svg>
                    </a>
                    <a className="enlaces-icon-btn" href="tel:+529981290100" aria-label="Llamar">
                      <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.2 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.2 1.1L6.6 10.8z" fill="currentColor"/></svg>
                    </a>
                    <a
                      className="enlaces-icon-btn"
                      href="https://www.google.com/maps/search/?api=1&query=Av.+Kohunlich+210%2C+SM+50%2C+Canc%C3%BAn%2C+Quintana+Roo"
                      target="_blank"
                      rel="noopener"
                      aria-label="Ubicación"
                    >
                      <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M12 22s7-7.3 7-12.5A7 7 0 0 0 5 9.5C5 14.7 12 22 12 22zm0-9.8a2.7 2.7 0 1 1 0-5.4 2.7 2.7 0 0 1 0 5.4z" fill="currentColor"/></svg>
                    </a>
                  </div>
                </div>
              </details>
            </div>

            <footer className="enlaces-footer">© 2025 · Marca y sitio por Team Magicbox Crew Studio</footer>
          </div>
        </div>
      </div>
    </>
  );
}
