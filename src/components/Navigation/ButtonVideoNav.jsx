
export function ButtonVideoNav() {
  return (
    <span>
      <button
        id="backBtn"
        className="btn btn-sm btn-outline-warning fw-bold ms-2 me-2"
        title="Go back to the previous page"
        onClick={() => window.history.back()}
      >
        &larr; Back
      </button>
    </span>
  );
}