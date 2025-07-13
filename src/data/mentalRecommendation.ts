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
        how: "Use a notebook or app. Write 3 specific things you’re grateful for each morning or night.",
        when: "Morning or before bed",
        why: "Reinforces positive mindset, builds resilience.",
    },
    "Scenario 02": {
        stress: "Low",
        mood: "Unstable",
        recommendation: "🔊 Positive Affirmation Practice",
        how: "Stand in front of a mirror and say affirmations like “I am doing my best.”",
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
        how: "Do neck rolls, shoulder shrugs, and spinal twists with calming music.",
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