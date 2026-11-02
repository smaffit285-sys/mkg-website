export const GOOGLE_REVIEW_URL = "https://www.google.com/search?q=Miami+Knife+Guy&ludocid=11418040362576623957#lrd=0xa7ab485ee4b470eb:0x9e750736e273b955,3,,,,";
export const GOOGLE_REVIEW_COUNT = 20;

// Existing MKG business identity; add other profiles only after verifying ownership.
export const businessProfiles = ["https://www.google.com/maps?cid=11418040362576623957"];
export const sharpenerSchema = {
  "@context": "https://schema.org", "@type": "Person",
  "@id": "https://www.miamiknifeguy.com/about/#sean-maffit",
  name: "Sean Maffit", jobTitle: "Knife sharpener",
  url: "https://www.miamiknifeguy.com/about/",
  worksFor: { "@id": "https://www.miamiknifeguy.com/#business" },
};
