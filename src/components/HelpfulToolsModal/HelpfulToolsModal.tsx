import { resources } from "@/data/mentalRecommendation";

type HelpfulToolsModalProps = {
  show: boolean;
  onClose: () => void;
  scenario?: string; // Add scenario prop to customize recommendations
};

export const HelpfulToolsModal = ({
  show,
  onClose,
  scenario,
}: HelpfulToolsModalProps) => {
  if (!show) return null;

  // Enhanced resources with scenario-specific recommendations
  const enhancedResources = [
    ...resources,
    // Meditation tools
    {
      title:
        scenario?.includes("High") || scenario?.includes("Severe")
          ? "Emergency Calm (5-min Meditation)"
          : "Mindful Moments (10-min Meditation)",
      description:
        scenario?.includes("High") || scenario?.includes("Severe")
          ? "Quick crisis meditation for immediate relief"
          : "Gentle guided meditation for daily practice",
      link:
        scenario?.includes("High") || scenario?.includes("Severe")
          ? "https://youtu.be/4EaMJOo1jks"
          : "https://youtu.be/6p_yaNFSYao",
      type: "🧘",
      category: "meditation",
    },
    {
      title: "Sleep Meditation",
      description: "Guided meditation to improve sleep quality",
      link: "https://youtu.be/aEqlQvczMJQ",
      type: "😴",
      category: "meditation",
    },

    // Breathing tools
    {
      title: scenario?.includes("High")
        ? "4-7-8 Breathing (Emergency)"
        : "Coherent Breathing",
      description: scenario?.includes("High")
        ? "Fast-acting breathing pattern for acute stress"
        : "Balanced 5 breaths/minute for daily practice",
      link: scenario?.includes("High")
        ? "https://youtu.be/gz4G31LGyog"
        : "https://youtu.be/tEmt1Znux58",
      type: "🌬️",
      category: "breathing",
    },
    {
      title: "Alternate Nostril Breathing",
      description: "Balancing breath technique for stress relief",
      link: "https://youtu.be/8VwufJrUhic?si=av0y1G0oLQWeRXo1",
      type: "👃",
      category: "breathing",
    },

    // Affirmation tools
    {
      title: scenario?.includes("Unstable")
        ? "Self-Compassion Affirmations"
        : "Confidence Boost Affirmations",
      description: scenario?.includes("Unstable")
        ? "Gentle reminders for difficult emotional moments"
        : "Positive statements to reinforce self-worth",
      link: scenario?.includes("Unstable")
        ? "https://youtu.be/hKqjSiM38uM?si=ZPauhgNXlpcFP7_5"
        : "https://youtu.be/yo1pJ_D-H3M?si=fZPugM8Fk9j6HJUj",
      type: "💬",
      category: "affirmation",
    },
    {
      title: "Morning Affirmation Routine",
      description: "5-minute positive start to your day",
      link: "https://youtu.be/uT6ASPy2Dbs?si=r_CumKYL76F87eg5",
      type: "🌅",
      category: "affirmation",
    },

    // Nature sounds
    {
      title:
        scenario?.includes("High") || scenario?.includes("Severe")
          ? "Instant Calm (Heavy Rain)"
          : "Forest Stream Ambience",
      description:
        scenario?.includes("High") || scenario?.includes("Severe")
          ? "Powerful rain sounds for immediate stress relief"
          : "Gentle nature sounds for focus and relaxation",
      link:
        scenario?.includes("High") || scenario?.includes("Severe")
          ? "https://youtu.be/xNN7iTA57jM?si=nq5Y2SS1oDoP5zoE"
          : "https://youtu.be/8myYyMg1fFE?si=2PewQv4fiTv-1r0p",
      type: "🌲",
      category: "nature",
    },
    {
      title: "Ocean Waves for Sleep",
      description: "8-hour deep ocean sounds for restful sleep",
      link: "https://youtu.be/bn9F19Hi1Lk?si=4pkuiDPYPRgyq3Xa",
      type: "🌊",
      category: "nature",
    },

    // Support contacts (static list)
    {
      title: "National Mental Health Helpline (1926)",
      description: "Free 24/7 support in Sinhala, Tamil, and English by NIMH.",
      link: "tel:1926",
      type: "📞",
      category: "support",
    },
    {
      title: "Sumithrayo Emotional Support",
      description: "Confidential emotional support via call or chat.",
      link: "https://sumithrayo.lk",
      type: "🤝",
      category: "support",
    },
    {
      title: "CCCline (1333 Hotline)",
      description: "Toll-free mental health support across Sri Lanka.",
      link: "tel:1333",
      type: "📱",
      category: "support",
    },
    {
      title: "Women in Need (WIN)",
      description: "Support for women facing violence or distress.",
      link: "tel:+94775676555",
      type: "👩‍⚖️",
      category: "support",
    },
    {
      title: "HappyMind.lk (Online Therapy)",
      description: "Online therapy in Sinhala, Tamil, or English.",
      link: "https://happymind.lk",
      type: "💻",
      category: "support",
    },

    // Additional scenario-specific tools
    ...(scenario?.includes("Low")
      ? [
          {
            title: "Gratitude Soundscapes",
            description: "Combines affirmations with nature sounds",
            link: "https://youtu.be/z6-5aX0m7RU",
            type: "🙏",
            category: "combo",
          },
        ]
      : []),

    ...(scenario?.includes("Moderate")
      ? [
          {
            title: "Desk Yoga Sequence",
            description: "5-minute stretches you can do at your workspace",
            link: "https://youtu.be/tAUf7aajBWE",
            type: "🧘‍♂️",
            category: "movement",
          },
        ]
      : []),

    ...(scenario?.includes("Severe")
      ? [
          {
            title: "Crisis Stabilization Audio",
            description: "Clinical psychologist-guided emergency calm",
            link: "https://youtu.be/x9A8u03s7rI",
            type: "🆘",
            category: "emergency",
          },
        ]
      : []),
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-8 rounded-2xl max-w-2xl w-full shadow-2xl overflow-y-auto max-h-[80vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            Helpful Tools to Reduce Stress
          </h2>
          <button
            onClick={onClose}
            className="text-white text-2xl hover:text-red-400"
          >
            &times;
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">
            Quick Access
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <a
              href="#meditation"
              className="bg-indigo-500/20 text-indigo-100 px-3 py-2 rounded-lg text-center text-sm"
            >
              Meditation
            </a>
            <a
              href="#breathing"
              className="bg-teal-500/20 text-teal-100 px-3 py-2 rounded-lg text-center text-sm"
            >
              Breathing
            </a>
            <a
              href="#affirmation"
              className="bg-amber-500/20 text-amber-100 px-3 py-2 rounded-lg text-center text-sm"
            >
              Affirmations
            </a>
            <a
              href="#nature"
              className="bg-emerald-500/20 text-emerald-100 px-3 py-2 rounded-lg text-center text-sm"
            >
              Nature Sounds
            </a>
            <a
              href="#support"
              className="bg-pink-500/20 text-pink-100 px-3 py-2 rounded-lg text-center text-sm"
            >
              Helplines
            </a>
          </div>
        </div>

        <div className="space-y-6">
          <section id="meditation">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <span className="mr-2">🧘</span> Meditation Tools
            </h3>
            <ul className="space-y-4">
              {enhancedResources
                .filter((r) => r.category === "meditation")
                .map((item, index) => (
                  <ResourceItem key={`med-${index}`} item={item} />
                ))}
            </ul>
          </section>

          <section id="breathing">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <span className="mr-2">🌬️</span> Breathing Exercises
            </h3>
            <ul className="space-y-4">
              {enhancedResources
                .filter((r) => r.category === "breathing")
                .map((item, index) => (
                  <ResourceItem key={`breath-${index}`} item={item} />
                ))}
            </ul>
          </section>

          <section id="affirmation">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <span className="mr-2">💪</span> Positive Affirmations
            </h3>
            <ul className="space-y-4">
              {enhancedResources
                .filter((r) => r.category === "affirmation")
                .map((item, index) => (
                  <ResourceItem key={`affirm-${index}`} item={item} />
                ))}
            </ul>
          </section>

          <section id="nature">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <span className="mr-2">🌿</span> Nature & Sound Therapy
            </h3>
            <ul className="space-y-4">
              {enhancedResources
                .filter((r) => r.category === "nature")
                .map((item, index) => (
                  <ResourceItem key={`nature-${index}`} item={item} />
                ))}
            </ul>
          </section>
          <section id="support">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <span className="mr-2">📞</span> Helplines & Professional Support
            </h3>
            <ul className="space-y-4">
              {enhancedResources
                .filter((r) => r.category === "support")
                .map((item, index) => (
                  <ResourceItem key={`support-${index}`} item={item} hideLink />
                ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

// Component for individual resource items
const ResourceItem = ({ item, hideLink }: { item: any; hideLink?: boolean }) => (
  <li className="bg-white/10 p-4 rounded-lg shadow hover:shadow-lg transition">
    <div className="flex items-center gap-3">
      <span className="text-2xl">{item.type}</span>
      <div>
        <h3 className="text-lg text-white font-semibold">{item.title}</h3>
        <p className="text-white/70 text-sm">{item.description}</p>
        {!hideLink && item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-300 underline mt-1 inline-block text-sm"
          >
            Open Resource
          </a>
        )}
      </div>
    </div>
  </li>
);
