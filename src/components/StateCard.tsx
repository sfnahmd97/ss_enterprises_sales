import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: LucideIcon;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, positive, icon: Icon, color }) => {
  return (
    <div className={`bg-white shadow-md hover:shadow-lg rounded-xl p-5 flex items-center gap-4 min-w-[250px] border-t-4 border-${color}-500`}>
      {/* Icon Section */}
      <div className={`p-3 rounded-full bg-${color}-100 flex items-center justify-center`}>
        <Icon size={24} className={`text-${color}-600`} />
      </div>

      {/* Text Section */}
      <div>
        <h4 className="text-gray-600 font-medium">{title}</h4>
        <p className="text-2xl font-bold">{value}</p>
        <p className={`text-sm mt-1 ${positive ? "text-green-500" : "text-red-500"}`}>
          {change} {positive ? "↑" : "↓"}
        </p>
      </div>
    </div>
  );
};

export default StatCard;
