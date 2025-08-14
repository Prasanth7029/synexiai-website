export const PROJECT_CATEGORIES = ["AI", "Cloud", "Energy", "Tools"];

export const projects = [
  {
    id: "ai-optimizer",
    title: "AI Query Optimizer",
    blurb:
      "Self-healing DB optimizer that predicts slow queries and fixes them.",
    category: "AI",
    status: "MVP",
    tech: ["Python", "LLM", "PostgreSQL", "Kubernetes"],
    tags: ["AIOps", "Optimization", "Zero-Trust"],
    links: { demo: "#", repo: "#", doc: "#" },
  },
  {
    id: "green-dc",
    title: "Green Data Center Model",
    blurb:
      "ARM-based cluster + solar-aware scheduler for carbon-aware workloads.",
    category: "Energy",
    status: "R&D",
    tech: ["Go", "ARM", "Grafana", "Prometheus"],
    tags: ["Carbon aware", "Scheduling", "Edge"],
    links: { demo: "#", repo: "#", doc: "#" },
  },
  {
    id: "synexi-cloud",
    title: "Synexi Cloud",
    blurb:
      "Multi-tenant platform with auto-scaling microservices and secure APIs.",
    category: "Cloud",
    status: "Alpha",
    tech: ["React", "Node", "Redis", "Nginx"],
    tags: ["Microservices", "Autoscale", "Observability"],
    links: { demo: "#", repo: "#", doc: "#" },
  },
  {
    id: "energy-insights",
    title: "Energy Insights",
    blurb: "Live telemetry + anomaly detection for solar/battery fleets.",
    category: "Energy",
    status: "PoC",
    tech: ["TS", "Kafka", "TimescaleDB"],
    tags: ["Streaming", "Anomaly", "IoT"],
    links: { demo: "#", repo: "#", doc: "#" },
  },
  {
    id: "stack-kit",
    title: "Stack Kit",
    blurb: "Reusable UI + DevOps templates for rapid SynexiAI apps.",
    category: "Tools",
    status: "Stable",
    tech: ["Vite", "Tailwind", "GH Actions"],
    tags: ["DX", "Boilerplate", "CI/CD"],
    links: { demo: "#", repo: "#", doc: "#" },
  },
  {
    id: "llm-dash",
    title: "LLM Ops Dashboard",
    blurb: "Latency, cost, and safety guardrails across models and providers.",
    category: "AI",
    status: "Design",
    tech: ["React", "OpenAI", "Framer Motion"],
    tags: ["Guardrails", "Monitoring"],
    links: { demo: "#", repo: "#", doc: "#" },
  },
];
