import watchingTV from '/assets/watchingtv.jpg';

export function SpinnerLoadingVideo({ title }) {
  return (
    // bouncing ball effect with shadow for spinner
    <div className="vidcontainer">
      <div className="floatingball">
          <div id="vidspin" className="text-center">
              <h2 className="mt-5 mb-3 fw-bold">Loading:</h2>
              <h4 className="text-success fw-bold mb-2">{title}</h4>
              <h5 className="mb-2 fst-italic text-danger">Please be patient</h5>
              <p className="text-secondary opacity-75 mb-2">(Large archives take awhile to load)</p>
              <img src={watchingTV } />
          </div>
      </div>
    </div>
  );
}