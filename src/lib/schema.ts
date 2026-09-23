import { legal } from "@/content/legal";
import { nav } from "@/content/nav";
import type { Project } from "@/content/projects";
import type { ServiceCategory, ServiceTier } from "@/content/services";
import { site } from "@/content/site";
import { fileUrl, pageUrl } from "@/lib/url";

/**
 * Разметка schema.org. Только данные, которые уже есть на сайте: никаких
 * новых формулировок — поисковики сверяют разметку с видимым текстом.
 */

const ORG_ID = `${pageUrl("/")}#organization`;
const WEBSITE_ID = `${pageUrl("/")}#website`;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        // ProfessionalService — разновидность LocalBusiness: Яндекс и Google
        // связывают её с регионом и справочниками организаций.
        "@type": "ProfessionalService",
        "@id": ORG_ID,
        name: site.name,
        legalName: legal.shortName,
        url: pageUrl("/"),
        logo: fileUrl("/icon.png"),
        image: fileUrl("/og.png"),
        description: site.description,
        email: site.email,
        telephone: site.phoneHref,
        foundingDate: String(site.foundedYear),
        taxID: legal.inn,
        identifier: { "@type": "PropertyValue", name: "ОГРНИП", value: legal.ogrnip },
        address: { "@type": "PostalAddress", addressLocality: site.city, addressCountry: "RU" },
        areaServed: { "@type": "Country", name: "Россия" },
        sameAs: site.socials.map((social) => social.href),
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: pageUrl("/"),
        name: site.name,
        inLanguage: "ru-RU",
        publisher: { "@id": ORG_ID },
      },
    ],
  };
}

/**
 * Цена из строки вида «от 59 000 ₽», «69 000–99 000 ₽/мес.», «7 900 ₽ / SKU».
 * «Индивидуально» и прочее без чисел — без цены: выдумывать её нельзя.
 */
function priceSpecification(price: string) {
  const numbers = (price.match(/\d[\d\s  ]*/g) ?? []).map((part) =>
    Number(part.replace(/\D/g, "")),
  );
  if (numbers.length === 0) return undefined;

  const monthly = /мес/i.test(price);
  const perSku = /sku/i.test(price);
  const amount =
    numbers.length > 1
      ? { minPrice: numbers[0], maxPrice: numbers[1] }
      : /^\s*от\s/i.test(price)
        ? { minPrice: numbers[0] }
        : { price: numbers[0] };

  return {
    "@type": monthly || perSku ? "UnitPriceSpecification" : "PriceSpecification",
    priceCurrency: "RUB",
    ...amount,
    ...(monthly ? { unitCode: "MON" } : {}),
    ...(perSku ? { unitText: "SKU" } : {}),
  };
}

function offer(tier: ServiceTier) {
  const specification = priceSpecification(tier.price);
  return {
    "@type": "Offer",
    name: tier.title,
    ...(specification ? { priceSpecification: specification } : {}),
  };
}

export function servicesSchema(services: ServiceCategory[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: service.title,
        description: service.summary,
        provider: { "@id": ORG_ID },
        areaServed: { "@type": "Country", name: "Россия" },
        offers: service.tiers.map(offer),
      },
    })),
  };
}

const projectsLabel = nav.find((item) => item.href === "/projects")?.label ?? "Проекты";

export function projectSchema(project: Project) {
  const url = pageUrl(`/projects/${project.slug}`);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#work`,
        name: project.title,
        headline: project.subtitle ?? project.title,
        description: project.summary,
        url,
        image: fileUrl(project.cover),
        dateCreated: project.year,
        keywords: project.tags.join(", "),
        creator: { "@id": ORG_ID },
        ...(project.url ? { sameAs: project.url } : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: site.name, item: pageUrl("/") },
          { "@type": "ListItem", position: 2, name: projectsLabel, item: pageUrl("/projects") },
          { "@type": "ListItem", position: 3, name: project.title, item: url },
        ],
      },
    ],
  };
}
