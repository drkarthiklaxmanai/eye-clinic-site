export const siteConfig = {
  name: "Crispr Eye Care",

  // ✅ Use final domain (IMPORTANT)
  url: "https://crispreyecare.com",

  description: "Best eye clinic in KK Nagar, Chennai for cataract surgery, LASIK, retina and glaucoma care. Evidence-based treatment with no unnecessary procedures.",

  doctor: {
    name: "Dr. Rajeswari Thangavel",
    specialization: "Ophthalmologist"
  },

  contact: {
    phone: "+91 63813 02828",
    email: "drrajeswarithangavel@gmail.com",

    address: {
      street: "3rd Floor, Baggyalakshmi Nidhi Building, 39/2, RK Shanmugam Salai",
      locality: "Goutham Colony, K. K. Nagar",
      city: "Chennai",
      state: "Tamil Nadu",
      postalCode: "600078",
      country: "India"
    },

    geo: {
      latitude: "13.0418",   // approximate KK Nagar
      longitude: "80.1960"
    },

    whatsapp: "https://wa.me/916381302828",

    // Machine-readable, schema.org format -- used ONLY in JSON-LD structured data.
    // Closed midday (11:30am-5pm gap), closed Sundays.
    workingHours: "Mo-Sa 09:30-11:30, 17:00-20:00",

    // Human-readable, used for on-page display (top bar, contact page, etc.)
    workingHoursDisplay: "Mon-Sat: 9:30-11:30 AM & 5:00-8:00 PM"
  }
};
