// Site-specific settings for BookingCalendar.astro. The component itself is kept identical
// on the CRISPR Skin and Crispr Eye Care websites; only this file differs.
import { siteConfig } from './site.js';

const address = siteConfig.contact.address;
const addressLine = [address.street, address.locality, address.city, address.postalCode].filter(Boolean).join(', ');

export const bookingConfig = {
  clinicName: siteConfig.name,
  clinicPhone: siteConfig.contact.phone,
  addressLine,
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${siteConfig.name}, ${addressLine}`)}`,
  // Doctors open to online booking; must match netlify/functions/lib/clinic.cjs.
  doctors: [{ id: '5523d5a2-855c-46a5-9bda-04a1f1563d38', name: siteConfig.doctor.name }],
  services: [
    { group: null, items: [
      ['General Checkup', 'General Eye Checkup'], ['Cataract Evaluation'], ['LASIK Screening'], ['Retina Care'],
      ['Glaucoma Screening'], ['Squint Treatment'], ['Neuro-Ophthalmology'], ['Pediatric Eye Care'],
      ['Blurred Vision'], ['Eye Pain'], ['Sudden Vision Loss'],
    ] },
  ],
  defaultService: 'General Checkup',
};
