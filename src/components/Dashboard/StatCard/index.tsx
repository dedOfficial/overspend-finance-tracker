interface IStatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  subValue?: string;
  colorClass: string;
}

// TODO: create styles for the stat card

export const StatCard = ({
  icon: Icon,
  label,
  value,
  subValue,
  colorClass,
}: IStatCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {subValue && <p className="text-sm text-gray-500 mt-1">{subValue}</p>}
    </div>
  );
};
