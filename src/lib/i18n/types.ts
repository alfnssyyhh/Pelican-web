export type Locale = "en" | "id";

export interface Dictionary {
  nav: {
    home: string;
    services: string;
    rents: string;
    products: string;
    works: string;
    insights: string;
    contact: string;
  };
  footer: {
    tagline: string;
    address_title: string;
    address_body: string;
    col_divisions: string;
    div_marine_auto: string;
    div_odme_ows: string;
    div_diesel_overhaul: string;
    div_hydraulic: string;
    div_comm_nav: string;
    div_power_rental: string;
    col_navigation: string;
    all_services: string;
    generator_rental: string;
    parts_catalog: string;
    technical_insights: string;
    contact_rfq: string;
    col_hotline: string;
    office_call_center: string;
    marine_hotline: string;
    commercial_email: string;
    operational_hours: string;
    hours_detail: string;
    emergency_standby: string;
    copyright: string;
    certified_tag: string;
  };
  common: {
    read_article: string;
    back_to_insights: string;
    related_articles: string;
    related_topics: string;
    rfq_title: string;
    rfq_desc: string;
    request_rfq: string;
    whatsapp_team: string;
    rapid_mobilization: string;
    technical_doc: string;
    back_to_home: string;
    inquire_services: string;
    all: string;
  };
  insights: {
    eyebrow: string;
    title: string;
    description: string;
  };
}
