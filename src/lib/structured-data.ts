/**
 * schema.org JSON-LD for the root layout. The application entries in the
 * CollectionPage derive from the catalog, so enabling or disabling an entry
 * there updates the structured data automatically.
 */
import { apps, tools, type CatalogEntry } from "./catalog";

const SITE_URL = "https://abdeen.dev";

function applicationNode(entry: CatalogEntry) {
  const schema = entry.schema!;
  return {
    "@type": schema.type,
    name: schema.name ?? entry.title,
    url: `${SITE_URL}${entry.href}`,
    applicationCategory: schema.applicationCategory,
    operatingSystem: schema.operatingSystem,
    ...(schema.description ? { description: schema.description } : {}),
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
}

export function buildJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "abdeen.dev",
        url: SITE_URL,
        description:
          "Free and open-source tools by Jaafar Abdeen: password generator, QR code maker, regex tester, pomodoro timer, and more.",
        author: { "@id": `${SITE_URL}/#person` },
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Abdeen Labs",
        url: SITE_URL,
        founder: { "@id": `${SITE_URL}/#person` },
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: "Jaafar Abdeen",
        url: "https://jaafar.cv",
        sameAs: [
          "https://jaafar.cv",
          "https://github.com/Cuzeth",
          "https://linkedin.com/in/jaafar-abdeen",
          "https://strobefast.app",
        ],
      },
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/#collection`,
        name: "Free Tools",
        description: "A curated collection of free and open-source tools.",
        url: SITE_URL,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: [...tools, ...apps]
          .filter((entry) => entry.schema)
          .map(applicationNode),
      },
    ],
  };
}
