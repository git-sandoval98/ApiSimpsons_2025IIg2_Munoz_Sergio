import './Loader.css';

export default function Loader({ label = 'Cargando...' }) {
  return (
    <div className="loader-wrap">
      <div className="loader-spinner" />
      <div className="loader-donut" aria-hidden>🍩</div>
      <p className="loader-text">{label}</p>
    </div>
  );
}
