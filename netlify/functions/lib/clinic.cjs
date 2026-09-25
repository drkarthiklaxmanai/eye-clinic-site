// netlify/functions/lib/clinic.cjs
//
// The only booking setting that differs between the CRISPR Skin and Crispr Eye Care
// websites; every other file under netlify/functions is kept identical on both.
//
// Crispr Eye Care's doctor open to online booking. The AppointmentManager database is
// shared with CRISPR Skin and Hair Clinic, so every patient-history lookup, the per-day
// limits and Manage My Appointment only look at these doctors.
module.exports = {
  CLINIC_DOCTOR_IDS: [
    "5523d5a2-855c-46a5-9bda-04a1f1563d38", // Rajeswari T
  ],
};
