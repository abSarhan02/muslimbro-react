import "./AzkarCard.css";
// Card di un azkar con il contatore
// Il titolo serve solo per gli screen reader (aria-label)
export function AzkarCard({ index, item, title, italian, count, onCount }) {
  const completed = count === item.maxNumber;

  return (
    <article className={`card azkar-card${completed ? " is-complete" : ""}`} aria-label={title}>
      <div className="card-header">
        <span className="card-number">{index + 1}</span>
        <span className="card-type">{item.type}</span>
      </div>

      <p className="azkar-arabic" lang="ar" dir="rtl">
        {item.arabicContent}
      </p>
      <p className="azkar-transliteration" lang="ar-Latn">
        {item.transliteration}
      </p>
      <p className="azkar-italian" lang="it">
        {italian}
      </p>

      {/* Contatore: si blocca quando arriva al massimo */}
      <button
        className={`counter-button${count > 0 && !completed ? " counting" : ""}`}
        type="button"
        aria-label={`Conta le recitazioni: ${title}`}
        disabled={completed}
        onClick={onCount}
      >
        <span>
          {count} / {item.maxNumber}
        </span>
      </button>
    </article>
  );
}
