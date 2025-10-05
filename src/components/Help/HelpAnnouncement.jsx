import { BootstrapAccordion } from '@components/UI/BootstrapAccordion';
import { AnnouncementItems } from '@components/Help/AnnouncementData';

export function HelpAnnouncement() {
  return (
    <>
      <section id="announcements" className="my-4">
        <BootstrapAccordion items={AnnouncementItems} idPrefix="accordionAnnouncement" />
      </section>
    </>
  );
}