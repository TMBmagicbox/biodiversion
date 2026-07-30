"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Video, RefreshCw, Settings, Wifi, WifiOff, X, Maximize2, Minimize2 } from "lucide-react";

const SERVER = process.env.NEXT_PUBLIC_CCTV_SERVER || "http://localhost:3001";
const TOTAL = 8;
const REFRESH_MS = 500; // Reducido para menos delay
const AULAS = ["Entrada","Patio","Maternal A","Maternal B","Pre-Kínder A","Pre-Kínder B","Kínder","Salida"];

type Estatus = Record<number, "activo" | "sin-senal" | "cargando">;
type DvrFields = { ip: string; port: string; user: string; pass: string; channels: string; };

export default function CamarasPage() {
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [logging, setLogging] = useState(false);
  const [dvrOk, setDvrOk] = useState(false);
  const [dvrModal, setDvrModal] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [dvrFields, setDvrFields] = useState<DvrFields>({ ip: "", port: "80", user: "admin", pass: "", channels: "8" });
  const [estatus, setEstatus] = useState<Estatus>({});
  const [layout, setLayout] = useState<1 | 4 | 8>(8);
  const [clock, setClock] = useState("");
  const [fullscreenCam, setFullscreenCam] = useState<number | null>(null);
  const timers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString("es-MX", { hour12: false, timeZone: "America/Cancun" }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("cctv_token");
    if (saved) verificarToken(saved);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cerrar fullscreen con ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setFullscreenCam(null); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const verificarToken = async (t: string) => {
    try {
      const r = await fetch(`${SERVER}/api/me`, { headers: { Authorization: `Bearer ${t}` } });
      const d = await r.json();
      if (d.success) { setToken(t); checkDVR(t); }
      else localStorage.removeItem("cctv_token");
    } catch { localStorage.removeItem("cctv_token"); }
  };

  const checkDVR = async (t: string) => {
    try {
      const r = await fetch(`${SERVER}/api/dvr`, { headers: { Authorization: `Bearer ${t}` } });
      const d = await r.json();
      setDvrOk(d.configured);
      if (d.dvr) setDvrFields(f => ({ ...f, ip: d.dvr.ip || "", port: String(d.dvr.port || 80), user: d.dvr.user || "admin", channels: String(d.dvr.channels || 8) }));
    } catch {}
  };

  const doLogin = async () => {
    if (!userId || !password) { setLoginErr("Completa todos los campos"); return; }
    setLogging(true); setLoginErr("");
    try {
      const r = await fetch(`${SERVER}/api/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId, password }) });
      const d = await r.json();
      if (d.success) { localStorage.setItem("cctv_token", d.token); setToken(d.token); checkDVR(d.token); }
      else setLoginErr(d.message || "Credenciales incorrectas");
    } catch { setLoginErr(`No se puede conectar al servidor CCTV (${SERVER})`); }
    finally { setLogging(false); }
  };

  const logout = () => { localStorage.removeItem("cctv_token"); stopAll(); setToken(""); setFullscreenCam(null); };

  const stopAll = useCallback(() => { Object.values(timers.current).forEach(clearTimeout); timers.current = {}; }, []);

  const loadCam = useCallback((ch: number, t: string) => {
    if (timers.current[ch]) clearTimeout(timers.current[ch]);
    const img = document.getElementById(`bio-cam-${ch}`) as HTMLImageElement | null;
    if (!img) return;
    setEstatus(s => ({ ...s, [ch]: "cargando" }));
    const reload = () => {
      const newImg = new Image();
      newImg.onload = () => {
        img.src = newImg.src;
        setEstatus(s => ({ ...s, [ch]: "activo" }));
      };
      newImg.onerror = () => setEstatus(s => ({ ...s, [ch]: "sin-senal" }));
      newImg.src = `${SERVER}/api/cameras/snapshot/${ch}?token=${t}&t=${Date.now()}`;
      timers.current[ch] = setTimeout(reload, REFRESH_MS);
    };
    reload();
  }, []);

  useEffect(() => {
    if (!token) return;
    stopAll();
    for (let ch = 1; ch <= TOTAL; ch++) loadCam(ch, token);
    return stopAll;
  }, [token, loadCam, stopAll]);

  const refreshAll = () => { stopAll(); for (let ch = 1; ch <= TOTAL; ch++) loadCam(ch, token); };

  const saveDVR = async () => {
    await fetch(`${SERVER}/api/dvr`, { method: "PUT", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ ip: dvrFields.ip, port: parseInt(dvrFields.port)||80, user: dvrFields.user, pass: dvrFields.pass, channels: parseInt(dvrFields.channels)||8 }) });
  };

  const testDVR = async () => {
    setTestResult(null); await saveDVR();
    try {
      const r = await fetch(`${SERVER}/api/dvr/test`, { headers: { Authorization: `Bearer ${token}` } });
      const d = await r.json();
      setTestResult(d);
      if (d.success) { setDvrOk(true); refreshAll(); }
    } catch { setTestResult({ success: false, message: "Error de conexión" }); }
  };

  const gridCols = layout === 1 ? "grid-cols-1" : layout === 4 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

  // ── Login ──────────────────────────────────────────────
  if (!token) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-sm rounded-2xl bg-white/80 p-8 shadow-lg backdrop-blur">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-brand-blue-light p-2"><Video className="h-6 w-6 text-brand-blue" /></div>
          <div><h2 className="text-lg font-bold text-brand-blue-dark">Acceso CCTV</h2><p className="text-xs text-gray-500">Sistema de videovigilancia</p></div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">Usuario</label>
            <input type="text" value={userId} onChange={e => setUserId(e.target.value)} onKeyDown={e => e.key === "Enter" && doLogin()} placeholder="biodiversion-goodmode" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">Contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && doLogin()} placeholder="••••••••" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20" />
          </div>
          {loginErr && <p className="rounded-xl bg-red-50 px-4 py-2 text-xs font-bold text-red-600">{loginErr}</p>}
          <button onClick={doLogin} disabled={logging} className="w-full rounded-xl bg-brand-blue py-3 text-sm font-bold text-white transition hover:bg-brand-blue-dark disabled:opacity-50">{logging ? "Verificando…" : "Entrar →"}</button>
        </div>
        <p className="mt-4 text-center text-xs text-gray-400">Servidor: <span className="font-mono">{SERVER}</span></p>
      </div>
    </div>
  );

  // ── Fullscreen ─────────────────────────────────────────
  if (fullscreenCam !== null) return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      {/* Header */}
      <div className="flex items-center justify-between bg-gray-900/95 px-4 py-2">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-bold text-brand-blue">CAM {String(fullscreenCam).padStart(2,"0")}</span>
          <span className="text-sm text-gray-400">{AULAS[fullscreenCam-1]}</span>
          {estatus[fullscreenCam] === "activo" && <span className="flex items-center gap-1 text-xs text-green-400"><span className="h-1.5 w-1.5 rounded-full bg-green-400" />En vivo</span>}
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-gray-400">{clock}</span>
          <button onClick={() => setFullscreenCam(null)} className="flex items-center gap-2 rounded-lg bg-gray-800 px-3 py-1.5 text-sm font-bold text-white hover:bg-gray-700">
            <Minimize2 className="h-4 w-4" /> Salir (ESC)
          </button>
        </div>
      </div>
      {/* Imagen */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img id={`bio-cam-${fullscreenCam}`} alt={`CAM ${fullscreenCam}`} className="flex-1 w-full object-contain" />
      {/* Navegación entre cámaras */}
      <div className="flex items-center justify-center gap-2 bg-gray-900/95 py-2 px-4 flex-wrap">
        {Array.from({ length: TOTAL }, (_, i) => i+1).map(ch => (
          <button key={ch} onClick={() => { stopAll(); setFullscreenCam(ch); setTimeout(() => { for(let i=1;i<=TOTAL;i++) loadCam(i,token); }, 100); }}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${fullscreenCam === ch ? "bg-brand-blue text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}>
            CAM {String(ch).padStart(2,"0")}
          </button>
        ))}
      </div>
    </div>
  );

  // ── Vista normal ───────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-brand-blue-dark">📹 Cámaras en Vivo</h1>
          <span className="flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-600">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-red-500" />EN VIVO
          </span>
          {!dvrOk && <span className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700"><WifiOff className="h-3 w-3" />Modo demo</span>}
          {dvrOk && <span className="flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700"><Wifi className="h-3 w-3" />DVR conectado</span>}
          <span className="font-mono text-sm text-gray-400">{clock}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-white">
            {([1,4,8] as const).map(n => (
              <button key={n} onClick={() => setLayout(n)} className={`px-3 py-1.5 text-xs font-bold transition ${layout===n?"bg-brand-blue text-white":"text-gray-500 hover:bg-gray-50"}`}>{n}</button>
            ))}
          </div>
          <button onClick={refreshAll} className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-600 transition hover:border-brand-blue hover:text-brand-blue"><RefreshCw className="h-3.5 w-3.5" />Refrescar</button>
          <button onClick={() => { setTestResult(null); setDvrModal(true); checkDVR(token); }} className="flex items-center gap-2 rounded-xl bg-brand-blue px-3 py-1.5 text-xs font-bold text-white transition hover:bg-brand-blue-dark"><Settings className="h-3.5 w-3.5" />DVR</button>
          <button onClick={logout} className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-100">Salir</button>
        </div>
      </div>

      {/* Grid */}
      <div className={`grid gap-3 ${gridCols}`}>
        {Array.from({ length: TOTAL }, (_, i) => i+1).map(ch => (
          <div key={ch} className="group overflow-hidden rounded-xl border border-gray-200 bg-black shadow-sm transition hover:border-brand-blue hover:shadow-md cursor-pointer" onClick={() => setFullscreenCam(ch)}>
            <div className="flex items-center justify-between bg-gray-900/90 px-3 py-1.5">
              <span className="font-mono text-xs font-bold text-brand-blue">CAM {String(ch).padStart(2,"0")}</span>
              <div className="flex items-center gap-2">
                {estatus[ch]==="activo" && <span className="flex items-center gap-1 text-xs text-green-400"><span className="h-1.5 w-1.5 rounded-full bg-green-400" />Activo</span>}
                {estatus[ch]==="sin-senal" && <span className="flex items-center gap-1 text-xs text-red-400"><span className="h-1.5 w-1.5 rounded-full bg-red-400" />Sin señal</span>}
                {(!estatus[ch]||estatus[ch]==="cargando") && <span className="text-xs text-gray-500">Conectando…</span>}
                <Maximize2 className="h-3 w-3 text-gray-600 opacity-0 group-hover:opacity-100 transition" />
              </div>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img id={`bio-cam-${ch}`} alt={`Cámara ${ch}`} className="aspect-video w-full object-cover" />
            <div className="bg-gray-900/80 px-3 py-1">
              <span className="font-mono text-xs text-gray-400">{AULAS[ch-1]}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal DVR */}
      {dvrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={e => e.target===e.currentTarget&&setDvrModal(false)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-brand-blue-dark">⚙️ Configurar DVR Dahua</h3>
              <button onClick={() => setDvrModal(false)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="mb-4 rounded-xl bg-brand-blue-light p-3 text-xs text-brand-blue-dark">Las credenciales se guardan en el servidor. Mismo protocolo que EasyViewer Pro.</div>
            <div className="grid grid-cols-2 gap-3">
              {[{ label:"IP del DVR *",key:"ip",placeholder:"192.168.100.108"},{label:"Puerto HTTP",key:"port",placeholder:"80"},{label:"Usuario",key:"user",placeholder:"admin"},{label:"Contraseña",key:"pass",placeholder:"••••••••",type:"password"}].map(f=>(
                <div key={f.key}>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">{f.label}</label>
                  <input type={f.type||"text"} placeholder={f.placeholder} value={dvrFields[f.key as keyof DvrFields]} onChange={e=>setDvrFields(d=>({...d,[f.key]:e.target.value}))} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"/>
                </div>
              ))}
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">N° de cámaras</label>
                <select value={dvrFields.channels} onChange={e=>setDvrFields(d=>({...d,channels:e.target.value}))} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-blue">
                  <option value="4">4 cámaras</option><option value="8">8 cámaras</option><option value="16">16 cámaras</option>
                </select>
              </div>
            </div>
            {testResult&&<div className={`mt-3 rounded-xl px-4 py-2.5 text-sm font-bold ${testResult.success?"bg-green-50 text-green-700":"bg-red-50 text-red-600"}`}>{testResult.message}</div>}
            <div className="mt-4 flex gap-3">
              <button onClick={()=>{saveDVR();setDvrModal(false);refreshAll();}} className="flex-1 rounded-xl bg-brand-blue py-2.5 text-sm font-bold text-white hover:bg-brand-blue-dark">Guardar</button>
              <button onClick={testDVR} className="flex-1 rounded-xl border border-brand-blue/30 bg-brand-blue-light py-2.5 text-sm font-bold text-brand-blue hover:bg-brand-blue/10">Probar conexión</button>
              <button onClick={()=>setDvrModal(false)} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-50">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
