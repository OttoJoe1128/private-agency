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

export interface MetricItem {
  label: string;
  value: string;
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
  metrics: MetricItem[];
  accentColor: string;
  deepDive?: {
    summary: string;
    keyDeliverables: string[];
    technicalArchitecture: string[];
    terminalLogs: string[];
    hardwareOrProtocolSpecs?: { label: string; value: string }[];
  };
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
  receiptId?: string;
  sha256_checksum?: string;
  status?: string;
  sla_level?: string;
  pipeline_verdict?: string;
}
