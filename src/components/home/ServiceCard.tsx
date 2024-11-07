interface ServiceCardProps {
    title: string;
    description: string;
  }
  
  export function ServiceCard({ title, description }: ServiceCardProps) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    );
  }