export interface MentalScenarioRecommendation {
    stress: string;
    mood: string;
    recommendation: string;
    how: string;
    when: string;
    why: string;
    followUp?: string;
}

export const mentalRecommendationsMap: Record<string, MentalScenarioRecommendation> = {
    "Scenario 01": {
        stress: "Low",
        mood: "Stable",
        recommendation: "📝 Gratitude Journaling",
        how: "Use a physical journal, mobile app like Gratitude, Day One, or Five Minute Journal. Set a daily reminder. Write 3 specific things you’re grateful for — avoid general terms like “family” or “health”.",
        when: "Morning or before bed",
        why: "Journaling helps shift attention from what's lacking to what's working well. Furthermore, practicing gratitude can rewire the brain over time to notice positive events more frequently.",
    },
    "Scenario 02": {
        stress: "Low",
        mood: "Unstable",
        recommendation: "🔊 Positive Affirmation Practice",
        how: "Stand before a mirror; hands on heart; say 2–3 affirmations (e.g. “I deserve calm”",
        when: "First thing in the morning or before a stressful task.",
        why: "Rewires self-talk to be more supportive."
    },
    "Scenario 03": {
        stress: "Moderate",
        mood: "Stable",
        recommendation: "🚶‍♀️ Brisk Walking + Motivational Podcast",
        how: "Walk at a brisk pace while listening to motivating podcasts or audiobooks.",
        when: "Morning or lunch break, 5x/week, 30 mins.",
        why: "Reduces cortisol and improves mental clarity.",
            followUp: "If no improvement within 2 weeks, consult a doctor."

    },
    "Scenario 04": {
        stress: "Moderate",
        mood: "Unstable",
        recommendation: "🎧 Desk Stretches + Music Therapy",
        how: "Do neck rolls(10× each direction), shoulder shrugs(15×), and spinal twists with calming music(hold 10 sec × 2).",
        when: "10 mins mid-workday.",
        why: "Releases tension and calms the nervous system.",
            followUp: "If no improvement in mood or stress control within 2 weeks, consult a doctor."

    },
    "Scenario 05": {
        stress: "High",
        mood: "Stable",
        recommendation: "🚴‍♂️ Stationary Cycling or Uphill Walk",
        how: "Moderate cardio session (20–30 min), like uphill walking or cycling.",
        when: "Post-work or late afternoon, 4x/week.",
        why: "Boosts endorphins and reduces stress load.",
        followUp: "If no improvement within 1 weeks, schedule a consultation."

    },
    "Scenario 06": {
        stress: "High",
        mood: "Unstable",
        recommendation: "🎨 Mandala Coloring or Art Therapy",
        how: "Color mandalas or draw patterns freely.",
        when: "Evening or after stressful events.",
        why: "Calms thoughts and supports mindfulness.",
        followUp: "If no improvement in mood or stress control within 1 weeks, schedule a consultation."
    },
    "Scenario 07": {
        stress: "Severe",
        mood: "Stable",
        recommendation: "🧘 Body Scan Meditation",
        how: "Lie down, close eyes, and mentally scan each body part.",
        when: "Before bed or when physically exhausted.",
        why: "Slows down mind and reconnects with body.",
        followUp: "Strongly recommend visiting a doctor, even if improvements are noticed, due to risk of burnout or hidden depression."
    },
    "Scenario 08": {
        stress: "Severe",
        mood: "Unstable",
        recommendation: "📞 Telehealth Counseling or SOS Journaling",
        how: "Use apps like BetterHelp or write what you’d say to a therapist.",
        when: "When emotions feel overwhelming.",
        why: "Professional support ensures safety and recovery.",
        followUp: "Strongly recommend visiting a doctor, even if improvements are noticed, due to risk of burnout or hidden depression."
    }
};

export const resources = [
  {
    title: "Calm Music for Work & Study",
    description: "Lo-fi or ambient music to reduce stress during tasks.",
    link: "https://youtu.be/n61ULEU7CO0?si=eAPRQH_pZvdlVx0t",
    type: "🎵",
  },
  {
    title: "Box Breathing Timer",
    description: "Simple tool to follow 4-4-4-4 breathing pattern.",
    link: "https://xhalr.com",
    type: "⏱️",
  },
  {
    title: "Nature Sounds (Rain, Ocean, Forest)",
    description: "Relaxing background audio to improve focus.",
    link: "https://www.youtube.com/watch?v=OdIJ2x3nxzQ",
    type: "🌧️",
  }
];
