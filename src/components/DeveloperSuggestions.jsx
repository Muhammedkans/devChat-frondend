// src/components/DeveloperSuggestions.jsx
const DeveloperSuggestions = () => {
  const suggestions = [
    { name: "Kathryn Murphy", role: "Front-End Developer" },
    { name: "Jacob Jones", role: "Full-Stack Developer" },
    { name: "Leslie Alexander", role: "Web Developer" },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-2">Developers you may know</h2>
      {suggestions.map((dev, index) => (
        <div key={index} className="flex items-center space-x-2">
          <img
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${dev.name}`}
            alt={dev.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-medium">{dev.name}</p>
            <p className="text-sm text-gray-500">{dev.role}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DeveloperSuggestions;
