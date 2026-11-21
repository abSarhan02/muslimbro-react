import "./ErrorMessage.css";
// Messaggio di errore (con pulsante Riprova se passo onRetry)
export function ErrorMessage({ message, onRetry }) {
  return (
    <>
      <p className="error-message" role="alert">
        {message}
      </p>
      {onRetry && (
        <button className="text-button" type="button" onClick={onRetry}>
          Riprova
        </button>
      )}
    </>
  );
}
