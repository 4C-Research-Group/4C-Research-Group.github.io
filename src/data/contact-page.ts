/** Static contact page content (from 4c-research-group defaults). */
export type ContactPageContent = {
  address: string;
  phone: string;
  email: string;
  research_coordinator_name: string;
  research_coordinator_email: string;
  hours: string;
  hero_title: string;
  hero_description: string;
  map_embed_url: string;
};

export const contactPageContent: ContactPageContent = {
  address: "800 Commissioners Rd E., London, ON N6A 5W9",
  phone: "(519) 685-8500 Ext. 74702",
  email: "rishi.ganesan@lhsc.on.ca",
  research_coordinator_name: "Ms. Maysaa Assaf",
  research_coordinator_email: "Maysaa.Assaf@lhsc.on.ca",
  hours: "Monday–Friday: 9:00 AM–5:00 PM, Saturday–Sunday: Closed",
  hero_title: "Get In Touch",
  hero_description:
    "Let us know if you are interested in learning more about our research, collaborating with our team, or contributing to our mission.",
  map_embed_url:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5979841.431727101!2d-90.98107327499999!3d42.960482299999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882ef0fa90d42453%3A0x1e8dae5de3acaae!2sVictoria%20Hospital%20%26%20Children's%20Hospital!5e0!3m2!1sen!2sca!4v1751160990375!5m2!1sen!2sca",
};
