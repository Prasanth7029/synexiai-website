// src/pages/TechStackPage.jsx
import React, { useState } from "react";
import {
  FaReact, FaNodeJs, FaJava, FaDocker, FaAws, FaPython, FaGithub, FaGitAlt, FaMicrosoft,
  FaSolarPanel, FaWind, FaBolt, FaShieldAlt, FaChartLine, FaLink
} from "react-icons/fa";
import {
  SiSpringboot, SiPostgresql, SiMongodb, SiRedis, SiRabbitmq, SiApachekafka, SiVite,
  SiTailwindcss, SiOpenai, SiGooglecloud, SiKubernetes, SiTensorflow,
  SiApachespark, SiWeb3Dotjs, SiGraphql, SiFlask, SiGnubash, SiPytorch
} from "react-icons/si";
import { motion } from "framer-motion";

const techStack = {
  ai: {
    title: "🤖 AI & Machine Learning",
    description: "Cutting-edge AI technologies powering our self-healing databases and predictive analytics",
    tools: [
      { name: "TensorFlow", icon: <SiTensorflow />, color: "text-orange-400", description: "Machine learning framework" },
      { name: "PyTorch", icon: <SiPytorch />, color: "text-red-400", description: "Deep learning framework" },
      { name: "OpenAI API", icon: <SiOpenai />, color: "text-violet-300", description: "Advanced language models" },
      { name: "Apache Spark", icon: <SiApachespark />, color: "text-red-500", description: "Large-scale data processing" },
      { name: "Python", icon: <FaPython />, color: "text-yellow-400", description: "AI scripting language" },
      { name: "Scikit-Learn", icon: <FaChartLine />, color: "text-blue-400", description: "Machine learning library" },
      { name: "MLflow", icon: <FaChartLine />, color: "text-purple-400", description: "ML lifecycle management" },
      { name: "Kubeflow", icon: <SiKubernetes />, color: "text-blue-300", description: "ML on Kubernetes" },
    ],
  },
  infrastructure: {
    title: "💾 Sustainable Infrastructure",
    description: "Green-powered infrastructure with blockchain security and hybrid cloud solutions",
    tools: [
      { name: "AWS", icon: <FaAws />, color: "text-yellow-300", description: "Cloud provider" },
      { name: "Azure", icon: <FaMicrosoft />, color: "text-blue-300", description: "Cloud provider" },
      { name: "GCP", icon: <SiGooglecloud />, color: "text-red-300", description: "Google Cloud Platform" },
      { name: "Kubernetes", icon: <SiKubernetes />, color: "text-blue-400", description: "Container orchestration" },
      { name: "Docker", icon: <FaDocker />, color: "text-blue-300", description: "Containerization" },
      { name: "Terraform", icon: <SiGnubash />, color: "text-purple-400", description: "Infrastructure as Code" },
      { name: "Solar Energy", icon: <FaSolarPanel />, color: "text-yellow-400", description: "Renewable power source" },
      { name: "Wind Energy", icon: <FaWind />, color: "text-cyan-400", description: "Renewable power source" },
      { name: "ARM Servers", icon: <FaBolt />, color: "text-green-400", description: "Energy-efficient hardware" },
    ],
  },
  databases: {
    title: "🗄️ Database Systems",
    description: "AI-optimized database solutions with blockchain-backed security",
    tools: [
      { name: "PostgreSQL", icon: <SiPostgresql />, color: "text-blue-500", description: "Relational DB" },
      { name: "MongoDB", icon: <SiMongodb />, color: "text-green-500", description: "NoSQL DB" },
      { name: "Cassandra", icon: <SiApachekafka />, color: "text-blue-400", description: "Distributed DB" },
      { name: "Redis", icon: <SiRedis />, color: "text-red-500", description: "In-memory caching" },
      { name: "Blockchain", icon: <FaLink />, color: "text-green-400", description: "Immutable audit logs" },
      { name: "Apache Kafka", icon: <SiApachekafka />, color: "text-purple-400", description: "Distributed streaming" },
      { name: "Web3 Storage", icon: <SiWeb3Dotjs />, color: "text-amber-400", description: "Decentralized storage" },
    ],
  },
  development: {
    title: "💻 Development Stack",
    description: "Modern development tools for building innovative solutions",
    tools: [
      { name: "React.js", icon: <FaReact />, color: "text-cyan-400", description: "UI Framework" },
      { name: "Spring Boot", icon: <SiSpringboot />, color: "text-green-400", description: "Java framework" },
      { name: "Node.js", icon: <FaNodeJs />, color: "text-lime-400", description: "Backend JS" },
      { name: "GraphQL", icon: <SiGraphql />, color: "text-pink-400", description: "API query language" },
      { name: "Vite", icon: <SiVite />, color: "text-yellow-400", description: "Frontend tooling" },
      { name: "Tailwind CSS", icon: <SiTailwindcss />, color: "text-blue-400", description: "CSS framework" },
      { name: "GitHub", icon: <FaGithub />, color: "text-gray-300", description: "Version control" },
      { name: "Flask", icon: <SiFlask />, color: "text-gray-400", description: "Python framework" },
    ],
  },
};

const ArchitectureDiagram = () => (
  <div className="bg-gradient-to-br from-gray-800/30 to-gray-900 border border-cyan-500/20 rounded-2xl p-6 mb-16">
    <h3 className="text-2xl font-bold text-cyan-400 mb-6 text-center">SynexisAI Architecture Blueprint</h3>

    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
      {/* User Layer */}
      <div className="md:col-span-12 bg-gray-800/50 rounded-xl p-4 border border-cyan-500/20">
        <div className="flex items-center justify-center mb-2">
          <div className="text-cyan-400 text-xl mr-2">👤</div>
          <h4 className="font-semibold">User Interface</h4>
        </div>
        <p className="text-sm text-center text-gray-400">React.js, GraphQL, Web3 Integration</p>
      </div>

      {/* AI Layer */}
      <div className="md:col-span-4 bg-gray-800/50 rounded-xl p-4 border border-green-500/20">
        <div className="flex items-center justify-center mb-2">
          <div className="text-green-400 text-xl mr-2">🧠</div>
          <h4 className="font-semibold">AI Optimization</h4>
        </div>
        <p className="text-sm text-center text-gray-400">TensorFlow, PyTorch, Predictive Analytics</p>
      </div>

      {/* Security Layer */}
      <div className="md:col-span-4 bg-gray-800/50 rounded-xl p-4 border border-purple-500/20">
        <div className="flex items-center justify-center mb-2">
          <div className="text-purple-400 text-xl mr-2">🔒</div>
          <h4 className="font-semibold">Blockchain Security</h4>
        </div>
        <p className="text-sm text-center text-gray-400">Zero Trust Architecture, Immutable Logs</p>
      </div>

      {/* Energy Layer */}
      <div className="md:col-span-4 bg-gray-800/50 rounded-xl p-4 border border-yellow-500/20">
        <div className="flex items-center justify-center mb-2">
          <div className="text-yellow-400 text-xl mr-2">⚡</div>
          <h4 className="font-semibold">Renewable Energy</h4>
        </div>
        <p className="text-sm text-center text-gray-400">Solar/Wind Powered, ARM Efficiency</p>
      </div>

      {/* Database Layer */}
      <div className="md:col-span-12 bg-gray-800/50 rounded-xl p-4 border border-blue-500/20">
        <div className="flex items-center justify-center mb-2">
          <div className="text-blue-400 text-xl mr-2">💾</div>
          <h4 className="font-semibold">Hybrid Database System</h4>
        </div>
        <p className="text-sm text-center text-gray-400">SQL/NoSQL, Edge Computing, Self-Healing</p>
      </div>
    </div>

    <div className="flex justify-center">
      <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-medium flex items-center">
        <FaGithub className="mr-2" />
        View Architecture Repository
      </button>
    </div>
  </div>
);

const TabHeader = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-3 font-medium transition-colors ${
      active
        ? 'text-cyan-400 border-b-2 border-cyan-400'
        : 'text-gray-400 hover:text-gray-300'
    }`}
  >
    {children}
  </button>
);

const TabPanel = ({ active, children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: active ? 1 : 0 }}
    transition={{ duration: 0.3 }}
    className={active ? "block" : "hidden"}
  >
    {children}
  </motion.div>
);

export default function TechStackPage() {
  const [activeTab, setActiveTab] = useState('ai');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block bg-gradient-to-r from-cyan-600 to-teal-500 text-white px-6 py-2 rounded-full mb-6 text-sm font-medium">
            Technology Powering Innovation
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400">
              SynexisAI Technology Ecosystem
            </span>
          </h1>

          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Our cutting-edge stack combines AI optimization, sustainable infrastructure, and blockchain security to build the future of database technology.
          </p>
        </motion.div>

        <ArchitectureDiagram />

        {/* Tech Stack Tabs */}
        <div className="bg-gradient-to-br from-gray-800/30 to-gray-900 border border-cyan-500/20 rounded-2xl p-6 mb-16">
          <div className="flex flex-wrap border-b border-cyan-500/20 mb-8">
            {Object.keys(techStack).map((key) => (
              <TabHeader
                key={key}
                active={activeTab === key}
                onClick={() => setActiveTab(key)}
              >
                {techStack[key].title}
              </TabHeader>
            ))}
          </div>

          {Object.keys(techStack).map((key) => (
            <TabPanel key={key} active={activeTab === key}>
              <p className="text-gray-300 mb-8 text-center max-w-2xl mx-auto">
                {techStack[key].description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {techStack[key].tools.map((tool, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="flex flex-col items-center justify-center bg-gray-800/50 border border-cyan-500/10 rounded-xl p-5 hover:border-cyan-400/30 transition-all group"
                    whileHover={{ y: -5 }}
                  >
                    <div className={`text-4xl mb-2 ${tool.color} group-hover:scale-110 transition-transform`}>
                      {tool.icon}
                    </div>
                    <p className="text-sm text-gray-300 text-center font-medium">{tool.name}</p>
                    <p className="text-xs text-gray-500 mt-1 text-center">{tool.description}</p>
                  </motion.div>
                ))}
              </div>
            </TabPanel>
          ))}
        </div>

        {/* Future Technologies */}
        <div className="bg-gradient-to-br from-gray-800/30 to-gray-900 border border-cyan-500/20 rounded-2xl p-8">
          <h3 className="text-3xl font-bold text-cyan-400 mb-6 text-center">🚀 Future Technology Roadmap</h3>
          <p className="text-gray-300 mb-8 text-center max-w-3xl mx-auto">
            We're continuously researching and integrating emerging technologies to stay at the forefront of innovation
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-green-500/20">
              <h4 className="text-xl font-bold text-green-400 mb-4 flex items-center">
                <FaBolt className="mr-2" /> Quantum Computing
              </h4>
              <p className="text-gray-400">
                Exploring quantum algorithms for database optimization and AI model training acceleration.
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-purple-500/20">
              <h4 className="text-xl font-bold text-purple-400 mb-4 flex items-center">
                <FaLink className="mr-2" /> Decentralized AI
              </h4>
              <p className="text-gray-400">
                Developing federated learning systems that preserve privacy while training AI models across distributed nodes.
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-yellow-500/20">
              <h4 className="text-xl font-bold text-yellow-400 mb-4 flex items-center">
                <FaSolarPanel className="mr-2" /> Advanced Energy Harvesting
              </h4>
              <p className="text-gray-400">
                Researching next-gen energy solutions like piezoelectric systems and advanced solar technologies.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <button className="bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-white px-8 py-3 rounded-lg font-medium">
              Explore Our Research Papers
            </button>
          </div>
        </div>

        {/* Technology Principles */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-cyan-900/20 to-cyan-800/10 border border-cyan-500/20 rounded-2xl p-6">
            <div className="text-cyan-400 text-3xl mb-4">⚙️</div>
            <h4 className="text-xl font-bold mb-3">AI-Driven Optimization</h4>
            <p className="text-gray-300">
              Our systems continuously learn and adapt, applying machine learning to optimize database performance in real-time.
            </p>
          </div>

          <div className="bg-gradient-to-br from-teal-900/20 to-teal-800/10 border border-teal-500/20 rounded-2xl p-6">
            <div className="text-teal-400 text-3xl mb-4">♻️</div>
            <h4 className="text-xl font-bold mb-3">Sustainable Architecture</h4>
            <p className="text-gray-300">
              Every component is designed for energy efficiency, powered by renewable sources with minimal carbon footprint.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-500/20 rounded-2xl p-6">
            <div className="text-purple-400 text-3xl mb-4">🔐</div>
            <h4 className="text-xl font-bold mb-3">Blockchain Security</h4>
            <p className="text-gray-300">
              Zero-trust architecture with immutable blockchain audit trails ensures unparalleled data integrity and security.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}