export interface Capability {
  id: string;
  index: string;
  title: string;
  tagline: string;
  technologies: string[];
  description: string;
  architecturePoints: string[];
  systemMetric: string;
  systemMetricLabel: string;
}

export interface CaseStudy {
  id: string;
  category: string;
  client: string;
  title: string;
  kicker: string;
  timeline: string;
  problem: string;
  approach: string;
  systemInstalled: string;
  techStack: string[];
  metrics: { label: string; value: string }[];
  accentColor: string;
}

export interface SystemBriefPayload {
  system_need: string;
  throughput_scale: string;
  physical_integration: string;
  timeline_scale: string;
  client_entity: string;
  contact_endpoint: string;
  architectural_notes: string;
  timestamp: string;
  specification_id: string;
}
