import { resources } from "@/data/mentalRecommendation";

type HelpfulToolsModalProps = {
  show: boolean;
  onClose: () => void;
};

export const HelpfulToolsModal = ({ show, onClose }: HelpfulToolsModalProps) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-8 rounded-2xl max-w-2xl w-full shadow-2xl overflow-y-auto max-h-[80vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Helpful Tools to Reduce Stress</h2>
          <button
            onClick={onClose}
            className="text-white text-2xl hover:text-red-400"
          >
            &times;
          </button>
        </div>

        <ul className="space-y-4">
          {resources.map((item, index) => (
            <li
              key={index}
              className="bg-white/10 p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.type}</span>
                <div>
                  <h3 className="text-lg text-white font-semibold">
                    {item.title}
                  </h3>
                  <p className="text-white/70">{item.description}</p>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-300 underline mt-1 inline-block"
                  >
                    Open Resource
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
