import licenseText from '../../../LICENSE?raw';

export function HelpLicenseInfo() {
  return (
    <section id="license" className="mb-5">
      <h2 className="fs-3 mt-5 fw-bold">License</h2>
      <p>This software is licensed under the <a href="https://opensource.org/license/GPL-3.0" target="_blank">GNU General Public License version 3</a></p>
      <textarea className="form-control licenseText" value={licenseText} readOnly />
      <p className="mt-4">Copyright &copy; 2024&mdash;2026 Ken Dawson</p>
    </section>
  );
}
