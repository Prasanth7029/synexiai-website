import React from "react";

export default function TeamMemberCard({ name, role, bio, expertise, image }) {
  return (
    <div className="bg-gray-900/40 rounded-xl p-6 border border-cyan-500/10 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-shadow duration-300">
      <div className="flex flex-col items-center text-center">
        <div className="w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-cyan-500/30 shadow-md">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/assets/team/placeholder.jpg";
            }}
          />
        </div>
        <h3 className="text-xl font-bold text-cyan-300">{name}</h3>
        <p className="text-sm text-gray-400">{role}</p>
        <p className="text-sm text-gray-300 mt-2">{bio}</p>
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-cyan-200 mb-1">Expertise:</h4>
          <ul className="text-sm text-gray-300 list-disc list-inside">
            {expertise.map((skill, index) => (
              <li key={index} className="text-sm text-gray-300">
                {skill}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
