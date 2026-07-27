/**
 * Wellness content for Nouri Glow — journal prompts and guided meditations
 * adapted from white-labeled Mindfulness Exercises worksheet packs
 * (Emotions, Purpose, Mindfulness, Self Discovery, Relationships, Health).
 * Included in the basic package.
 */

export type JournalCategory =
  | "food"
  | "emotions"
  | "purpose"
  | "self"
  | "relationships"
  | "mindfulness"
  | "self-care";

export type JournalPrompt = {
  id: string;
  title: string;
  subtitle: string;
  category: JournalCategory;
  icon: string;
  prompts: string[];
};

export type JournalPackMeta = {
  id: JournalCategory | "all";
  label: string;
  icon: string;
};

export const journalPacks: JournalPackMeta[] = [
  { id: "all", label: "All", icon: "✨" },
  { id: "food", label: "Food", icon: "🍽️" },
  { id: "emotions", label: "Emotions", icon: "💭" },
  { id: "purpose", label: "Purpose", icon: "🧭" },
  { id: "self", label: "Self", icon: "🪞" },
  { id: "relationships", label: "Relate", icon: "🤝" },
  { id: "mindfulness", label: "Mindful", icon: "🌿" },
  { id: "self-care", label: "Care", icon: "🌙" },
];

export type MeditationStep = {
  title: string;
  body: string;
  seconds: number;
};

export type MeditationSession = {
  id: string;
  title: string;
  subtitle: string;
  category: "breath" | "body" | "food" | "heart" | "ground" | "emotion" | "mind";
  icon: string;
  minutes: number;
  steps: MeditationStep[];
};

export const journalPrompts: JournalPrompt[] = [
  // —— Food / health ——
  {
    id: "stress-eating",
    title: "Stress & eating",
    subtitle: "Notice hunger that may be emotional",
    category: "food",
    icon: "🍫",
    prompts: [
      "What was happening right before you felt the urge to eat?",
      "Where do you feel stress in your body right now (belly, chest, head)?",
      "Does this feel like physical hunger, emotional hunger, or both?",
      "What might help you care for yourself besides food in this moment?",
    ],
  },
  {
    id: "relationship-food",
    title: "Relationship with food",
    subtitle: "Stories, feelings, and kindness",
    category: "food",
    icon: "🍽️",
    prompts: [
      "What story do you tell yourself about food or your body today?",
      "How does that story feel in your belly, chest, and head?",
      "What emotion sits underneath it?",
      "How might you respond with more kindness at the next meal?",
    ],
  },

  // —— Emotions ——
  {
    id: "emotional-journaling",
    title: "Emotional journaling",
    subtitle: "Spill feelings without judgment",
    category: "emotions",
    icon: "📓",
    prompts: [
      "Describe a recent event using your senses — what did you see, hear, feel?",
      "What emotions rose during or after it?",
      "If you focus on one interior feeling now, what is its “big picture”?",
      "What insight appears when you write without censoring yourself?",
    ],
  },
  {
    id: "three-good-things",
    title: "Three good things",
    subtitle: "Nightly reflection on what went well",
    category: "emotions",
    icon: "🌟",
    prompts: [
      "What is the first good thing that happened today (big or small)? Why did it happen?",
      "What is the second good thing? Why did it happen?",
      "What is the third good thing? Why did it happen?",
    ],
  },
  {
    id: "comfortable-emotions",
    title: "Getting comfortable with emotions",
    subtitle: "Notice what you lean into and move away from",
    category: "emotions",
    icon: "🌊",
    prompts: [
      "What emotion did you feel most strongly today? How could you tell?",
      "What emotion felt most comfortable? What can you learn from that?",
      "What emotion did you move away from? What does that tell you?",
      "What action will you take from what you observed?",
    ],
  },
  {
    id: "working-judgments",
    title: "Working with judgments",
    subtitle: "Regret, comparison, and self-kindness",
    category: "emotions",
    icon: "⚖️",
    prompts: [
      "List a few judgments that showed up today (regret or comparison).",
      "Pick one regret-based judgment and write freely about it for a minute.",
      "Pick one comparison-based judgment and write freely about it.",
      "How can you meet your judging voice with more gentleness?",
    ],
  },
  {
    id: "inner-strength",
    title: "Building inner strength",
    subtitle: "Where strength showed up today",
    category: "emotions",
    icon: "💪",
    prompts: [
      "Around what event did you feel strong today?",
      "What strengthened you?",
      "In what ways did you rely on your strength?",
      "What pattern are you noticing, and how will you carry it forward?",
    ],
  },
  {
    id: "gratitude-heart",
    title: "Opening to gratitude",
    subtitle: "Appreciate what supports you",
    category: "emotions",
    icon: "🙏",
    prompts: [
      "What are you grateful for in this moment?",
      "Who has supported you recently, and how?",
      "How does gratitude feel in your body right now?",
      "How might you express appreciation today?",
    ],
  },

  // —— Purpose ——
  {
    id: "ultimate-purpose",
    title: "Ultimate purpose",
    subtitle: "Values, people, and what calls you",
    category: "purpose",
    icon: "🎯",
    prompts: [
      "List up to 10 values that describe how you really live.",
      "Who are the five most important people in your life?",
      "What are three defining events in your life?",
      "What community or world issues would you most want to help with?",
      "When have you felt most “at home” or like your best self?",
    ],
  },
  {
    id: "aligning-purpose",
    title: "Aligning with purpose",
    subtitle: "Check recent actions against what matters",
    category: "purpose",
    icon: "🧭",
    prompts: [
      "What actions this week aligned with your purpose?",
      "What actions were not aligned?",
      "How do you feel about those actions?",
      "What one action will you take from what you observed?",
    ],
  },
  {
    id: "future-wants",
    title: "What I want for the future",
    subtitle: "Near and far horizons",
    category: "purpose",
    icon: "🌅",
    prompts: [
      "In 6–12 months, what do you want to be doing?",
      "Whom do you want in your life, and in what capacity?",
      "What experiences do you want more of?",
      "In what ways do you want to be growing or learning?",
    ],
  },
  {
    id: "looking-back-95",
    title: "Looking back from 95",
    subtitle: "Wisdom from your future self",
    category: "purpose",
    icon: "⏳",
    prompts: [
      "Imagine you are 95, looking back. What are you most glad you made time for?",
      "What do you wish you had worried about less?",
      "What relationships mattered most?",
      "What advice would that future you give you for this week?",
    ],
  },

  // —— Self discovery ——
  {
    id: "personal-values",
    title: "Identifying personal values",
    subtitle: "Clarify what guides your choices",
    category: "self",
    icon: "🪞",
    prompts: [
      "Which values feel most alive for you right now?",
      "Where are you living in line with those values?",
      "Where are you out of alignment?",
      "What is one choice this week that would honor a core value?",
    ],
  },
  {
    id: "core-beliefs",
    title: "Core beliefs",
    subtitle: "Notice the beliefs underneath your reactions",
    category: "self",
    icon: "🧩",
    prompts: [
      "What belief about yourself showed up strongly today?",
      "Where did that belief come from?",
      "Is it still true, partially true, or outdated?",
      "What kinder, more accurate belief could you practice?",
    ],
  },
  {
    id: "story-believing",
    title: "What story am I believing?",
    subtitle: "Observe your private and public narrative",
    category: "self",
    icon: "📖",
    prompts: [
      "What story did you tell yourself about your day?",
      "What story did you tell others?",
      "What did you include, exclude, or give meaning to?",
      "Without judging — what do you notice about this narrative?",
    ],
  },
  {
    id: "what-avoiding",
    title: "What are you avoiding?",
    subtitle: "Gently name what you move away from",
    category: "self",
    icon: "🚪",
    prompts: [
      "What do you move away from or avoid in life? Why?",
      "What feels like the “worst thing” that could happen — and how do you organize around that fear?",
      "What past events do you want to make sure never happen again?",
      "How will you take what you learned forward?",
    ],
  },
  {
    id: "nurturing-stressful",
    title: "Nurturing vs. stressful",
    subtitle: "Map what feeds you and what drains you",
    category: "self",
    icon: "⚖️",
    prompts: [
      "Who or what nurtured you recently?",
      "Who or what stressed you?",
      "How did your own thoughts or interpretations add nurture or stress?",
      "What is one shift you want to make?",
    ],
  },

  // —— Relationships ——
  {
    id: "nourishing-conversations",
    title: "Nourishing conversations",
    subtitle: "Reflect on how you connect",
    category: "relationships",
    icon: "💬",
    prompts: [
      "Describe a conversation that felt nourishing recently.",
      "What made it feel that way?",
      "Where do your conversations tend to feel depleting?",
      "What is one way you can listen or speak more mindfully?",
    ],
  },
  {
    id: "building-empathy",
    title: "Building empathy",
    subtitle: "Step into someone else’s point of view",
    category: "relationships",
    icon: "🤝",
    prompts: [
      "Think of a recent encounter. How might the other person have experienced it?",
      "What did you learn about them — and about yourself?",
      "Where do you get upset or frustrated with others, and what happens if you try their viewpoint?",
      "What will you practice in your next conversation?",
    ],
  },
  {
    id: "standing-up",
    title: "Standing up for yourself",
    subtitle: "Boundaries with clarity and care",
    category: "relationships",
    icon: "🛡️",
    prompts: [
      "Where do you need to stand up for yourself right now?",
      "What makes that hard?",
      "What would a clear, kind boundary sound like?",
      "What support do you need to follow through?",
    ],
  },
  {
    id: "communication-patterns",
    title: "Patterns of communication",
    subtitle: "Notice how you show up with others",
    category: "relationships",
    icon: "🔁",
    prompts: [
      "What communication pattern showed up for you today?",
      "When do you close down, over-explain, withdraw, or push?",
      "What mood do you think you generate in others?",
      "What is one pattern you’d like to soften?",
    ],
  },
  {
    id: "mindful-connection",
    title: "Mindful connection",
    subtitle: "Presence in relationship",
    category: "relationships",
    icon: "💗",
    prompts: [
      "When did you feel most connected to someone recently?",
      "What helped that connection?",
      "Where do you feel closed or guarded?",
      "How can you practice more open, mindful connection this week?",
    ],
  },
  {
    id: "gratitude-letter",
    title: "Gratitude letter",
    subtitle: "Write to someone you appreciate",
    category: "relationships",
    icon: "✉️",
    prompts: [
      "Who do you feel deep appreciation for but haven’t fully thanked?",
      "What gifts, qualities, or offerings do you appreciate in them?",
      "Draft your letter here — what do you want them to know?",
      "Will you send it, share it, or keep it as a practice for now?",
    ],
  },

  // —— Mindfulness ——
  {
    id: "acts-of-kindness",
    title: "Acts of kindness",
    subtitle: "Give and receive support",
    category: "mindfulness",
    icon: "🎁",
    prompts: [
      "Recall a time someone was kind to you. Who was it, and how did it support you?",
      "Recall a time you were the benefactor. What did you give, and how did it feel?",
      "Brainstorm kindnesses you could offer this month (to people, community, or the earth).",
      "How might offering kindness inspire your next actions?",
    ],
  },
  {
    id: "witnessing-thoughts-journal",
    title: "Witnessing thoughts",
    subtitle: "Reflect after watching the mind",
    category: "mindfulness",
    icon: "☁️",
    prompts: [
      "What kinds of thoughts kept returning?",
      "What emotions or body sensations rode along with them?",
      "When did you get “lost in thought,” and how did you come back?",
      "What did you learn from watching without judging?",
    ],
  },
  {
    id: "letting-go",
    title: "Letting go",
    subtitle: "Release what you’re gripping",
    category: "mindfulness",
    icon: "🍃",
    prompts: [
      "What are you holding onto that feels heavy?",
      "What would it mean to loosen your grip — even a little?",
      "What stays true if you let this soften?",
      "What is one small act of letting go today?",
    ],
  },

  // —— Self-care (health worksheets) ——
  {
    id: "self-care",
    title: "Taking care of yourself",
    subtitle: "What nourishes vs. drains you",
    category: "self-care",
    icon: "🌿",
    prompts: [
      "What activities make you feel alive and free?",
      "What activities sap your energy or leave you feeling stuck?",
      "Are you choosing activities that support your well-being today?",
      "What is one small thing you can add this week that nourishes you?",
      "What is one thing you can reduce that drains you?",
    ],
  },
  {
    id: "gift-of-rest",
    title: "The gift of rest",
    subtitle: "Permission to pause and recharge",
    category: "self-care",
    icon: "🌙",
    prompts: [
      "How rested do you feel in body and mind right now?",
      "What has been asking for rest that you've been ignoring?",
      "What would “doing nothing” look like for 15 minutes today?",
      "How might you unplug or step outdoors to restore yourself?",
    ],
  },
  {
    id: "pleasant",
    title: "Something pleasant",
    subtitle: "Schedule joy on purpose",
    category: "self-care",
    icon: "☀️",
    prompts: [
      "List 3 activities that feel pleasant, fun, or nourishing.",
      "Which one could you schedule into today or tomorrow?",
      "What might get in the way — and how will you protect this time?",
      "How do you feel after imagining yourself doing it?",
    ],
  },
  {
    id: "free",
    title: "Free write",
    subtitle: "No prompts — just your words",
    category: "emotions",
    icon: "✍️",
    prompts: [],
  },
];

export const meditations: MeditationSession[] = [
  {
    id: "breath-awareness",
    title: "Breath awareness",
    subtitle: "Anchor attention to the breath",
    category: "breath",
    icon: "🌬️",
    minutes: 5,
    steps: [
      { title: "Settle", body: "Sit comfortably with a tall, relaxed spine. Soften the face and shoulders. Bring kind awareness to this moment.", seconds: 40 },
      { title: "Find the breath", body: "Notice where the breath is most vivid — nostrils, chest, or belly. Rest your attention there without changing anything.", seconds: 60 },
      { title: "Follow the rhythm", body: "Feel the full cycle: inhale, slight pause, exhale, slight pause. When the mind wanders, gently return to the breath.", seconds: 120 },
      { title: "Equal breath", body: "If it feels easy, let the inhale and exhale last about the same length. Stay soft. No forcing.", seconds: 60 },
      { title: "Close", body: "Widen awareness to the whole body. Take one fuller breath, and when you're ready, open your eyes.", seconds: 30 },
    ],
  },
  {
    id: "body-scan",
    title: "Body scan",
    subtitle: "Move attention from feet to head",
    category: "body",
    icon: "🧘",
    minutes: 8,
    steps: [
      { title: "Arrive", body: "Sit or lie down. Eyes open or gently closed. Check in with how body and mind feel right now.", seconds: 40 },
      { title: "Feet & legs", body: "Bring attention to your feet, ankles, calves, knees, and thighs. Notice sensation without needing to fix anything.", seconds: 90 },
      { title: "Torso", body: "Move awareness through the hips, belly, chest, and back. Soften on each exhale.", seconds: 90 },
      { title: "Arms & hands", body: "Feel the shoulders, arms, wrists, and hands. Allow them to rest heavy and warm.", seconds: 60 },
      { title: "Neck & head", body: "Notice the neck, jaw, face, and scalp. Soften the eyes and forehead.", seconds: 60 },
      { title: "Whole body", body: "Feel the body as one field of sensation, breathing. Rest here for a few breaths before returning.", seconds: 50 },
    ],
  },
  {
    id: "basic-relaxation",
    title: "Basic relaxation",
    subtitle: "Release tension area by area",
    category: "body",
    icon: "😌",
    minutes: 6,
    steps: [
      { title: "Posture", body: "Sit reposed with a straight back and a relaxed body. Bring attention to one small area — for example, the left foot.", seconds: 40 },
      { title: "Relax & release", body: "Feel that area. Soften it. Let go of holding. Move slowly through neighboring areas of the body.", seconds: 120 },
      { title: "Continue the wave", body: "Continue area by area. When you finish the whole body, gently repeat once more, even softer.", seconds: 120 },
      { title: "Rest", body: "Rest in the quiet that remains. Notice any ease that has arrived.", seconds: 50 },
    ],
  },
  {
    id: "eating",
    title: "Eating meditation",
    subtitle: "Slow down and taste one bite fully",
    category: "food",
    icon: "🍎",
    minutes: 7,
    steps: [
      { title: "Prepare", body: "Have a small piece of food ready. Pause before eating. Bring kind awareness to hunger, mood, and the plate.", seconds: 40 },
      { title: "See & smell", body: "Look carefully at the food — color, shape, texture. Bring it near and notice the aroma.", seconds: 50 },
      { title: "First bite", body: "Take one slow bite. Put the rest down. Notice taste, temperature, and texture as you chew.", seconds: 90 },
      { title: "Swallow & pause", body: "Feel the swallow. Pause. Check in with satisfaction. Are you rushing, grasping, or present?", seconds: 60 },
      { title: "Continue mindfully", body: "Continue for a few more bites at this pace. Notice fullness arriving. Stop when you've had enough.", seconds: 100 },
      { title: "Close", body: "Thank your body for the nourishment. Carry this slower pace into the next meal if you can.", seconds: 30 },
    ],
  },
  {
    id: "loving-kindness",
    title: "Loving-kindness",
    subtitle: "Wish well for yourself and others",
    category: "heart",
    icon: "💗",
    minutes: 6,
    steps: [
      { title: "Settle", body: "Sit comfortably. Let the body and mind settle. Soften the heart space.", seconds: 40 },
      { title: "For yourself", body: "Silently repeat: May I be safe and protected. May I be peaceful and happy. May I be healthy and strong. May I experience well-being.", seconds: 90 },
      { title: "For a loved one", body: "Bring someone you care about to mind. Offer them the same wishes: safety, peace, health, well-being.", seconds: 70 },
      { title: "For all beings", body: "Widen the circle — acquaintances, strangers, all living beings. May we all be safe, peaceful, and well.", seconds: 70 },
      { title: "Close", body: "Rest in the warmth of goodwill. Carry one kind wish with you into the day.", seconds: 30 },
    ],
  },
  {
    id: "self-compassion",
    title: "Self-compassion break",
    subtitle: "Meet difficulty with kindness",
    category: "heart",
    icon: "🤍",
    minutes: 4,
    steps: [
      { title: "This is a moment of suffering", body: "Acknowledge what hurts — stress, disappointment, self-criticism. Name it gently: “This is hard.”", seconds: 40 },
      { title: "Suffering is part of life", body: "Remember you are not alone. Difficulty is part of being human. Soften isolation.", seconds: 50 },
      { title: "May I be kind to myself", body: "Place a hand on your heart or cheek. Offer yourself warmth: “May I give myself the compassion I need.”", seconds: 70 },
      { title: "Close", body: "Take a breath. Carry that kindness into your next moment.", seconds: 30 },
    ],
  },
  {
    id: "mountain",
    title: "Mountain meditation",
    subtitle: "Steady presence through changing weather",
    category: "ground",
    icon: "🏔️",
    minutes: 6,
    steps: [
      { title: "Sit as stillness", body: "Take a comfortable seat. Follow a few rounds of breath. Feel contact with the ground or chair.", seconds: 40 },
      { title: "See the mountain", body: "Imagine a beautiful mountain — solid, grounded, unmoving. Notice its details and quiet strength.", seconds: 70 },
      { title: "Become the mountain", body: "Bring the mountain inside you. Your posture is the peak; your base is rooted in the earth.", seconds: 80 },
      { title: "Weather passes", body: "Thoughts and feelings may move like weather across the mountain. You remain steady underneath.", seconds: 80 },
      { title: "Close", body: "Return to the room, still carrying that grounded strength.", seconds: 30 },
    ],
  },
  {
    id: "earth-descent",
    title: "Earth descent",
    subtitle: "Ground and release into the earth",
    category: "ground",
    icon: "🌍",
    minutes: 7,
    steps: [
      { title: "Lie down", body: "Lie on your back comfortably. Breathe deeply. On each exhale, let tension drain into the earth.", seconds: 50 },
      { title: "Roots", body: "Imagine roots extending about a foot into the ground. Feel their strength and warmth.", seconds: 50 },
      { title: "Deeper", body: "Allow awareness to drop deeper — 10 feet, then further. Feel solidity and support.", seconds: 70 },
      { title: "Deep earth", body: "Continue descending with each breath. Soften any resistance. Open to depth and calm.", seconds: 90 },
      { title: "Return", body: "Gently travel back up through the layers until you rest in your body again, grounded and clear.", seconds: 50 },
    ],
  },
  {
    id: "grounding",
    title: "Grounding",
    subtitle: "Return to body, breath, and earth",
    category: "ground",
    icon: "🌳",
    minutes: 4,
    steps: [
      { title: "Seat", body: "Sit with a straight spine and soft shoulders. Close the eyes gently.", seconds: 30 },
      { title: "Five breaths", body: "Take five full, steady breaths. Feel yourself drop into the body.", seconds: 50 },
      { title: "Contact points", body: "Notice feet, seat, and hands. Feel the support beneath you.", seconds: 60 },
      { title: "Present", body: "Rest in grounded presence. When ready, open your eyes.", seconds: 40 },
    ],
  },
  {
    id: "rain",
    title: "RAIN for hard feelings",
    subtitle: "Recognize · Allow · Investigate · Nurture",
    category: "emotion",
    icon: "🌧️",
    minutes: 7,
    steps: [
      { title: "Recognize", body: "Name what is here — anxiety, craving, sadness, anger. Simply recognize: “This is present.”", seconds: 50 },
      { title: "Allow", body: "Allow the feeling to be here without pushing it away or acting it out. Soften around it.", seconds: 60 },
      { title: "Investigate", body: "With kindness, notice where it lives in the body. What sensations? What story arrives with it?", seconds: 90 },
      { title: "Nurture / not-identify", body: "Offer yourself care: a hand on the heart, a kind phrase. Remember — you have this feeling; you are not this feeling.", seconds: 80 },
      { title: "Close", body: "Take a breath. Notice any shift. Return when you're ready.", seconds: 30 },
    ],
  },
  {
    id: "witnessing-thoughts",
    title: "Witnessing thoughts",
    subtitle: "Watch the mind like clouds in the sky",
    category: "mind",
    icon: "☁️",
    minutes: 6,
    steps: [
      { title: "Settle", body: "Sit tall and soft. Take five full breaths to ground yourself.", seconds: 40 },
      { title: "Open awareness", body: "Broaden attention. Notice what rises in the mind without chasing it.", seconds: 70 },
      { title: "Watch like the sky", body: "Thoughts are clouds; you are the open sky. Notice, don’t judge, don’t suppress.", seconds: 100 },
      { title: "Return", body: "When you get lost, compassionately come back — “coming back” — to quiet presence.", seconds: 70 },
      { title: "Close", body: "Return to the breath. Open your eyes when ready.", seconds: 30 },
    ],
  },
  {
    id: "walking",
    title: "Walking meditation",
    subtitle: "Meditate while moving, step by step",
    category: "body",
    icon: "🚶",
    minutes: 5,
    steps: [
      { title: "Begin", body: "Stand tall. Soften the gaze. Walk slowly in a quiet space — indoors or outdoors.", seconds: 30 },
      { title: "Lifting", body: "Notice the moment of lifting the foot. Stay with the sensation.", seconds: 60 },
      { title: "Moving", body: "Feel the foot moving through space. No rush. One step is enough.", seconds: 70 },
      { title: "Placing", body: "Feel the foot place and settle. Then the other foot. Continue for several minutes.", seconds: 90 },
      { title: "Close", body: "Stand still. Feel the body. Carry this paced awareness into your next activity.", seconds: 30 },
    ],
  },
  {
    id: "parasympathetic",
    title: "Calm the nervous system",
    subtitle: "Breath and softness to settle stress",
    category: "breath",
    icon: "🕊️",
    minutes: 5,
    steps: [
      { title: "Deep breath", body: "Inhale fully, hold for a second, exhale slowly. Continue for about a minute.", seconds: 60 },
      { title: "Relax the body", body: "Soften the shoulders, jaw, and belly. Imagine a calm place — a chair, a beach, quiet light.", seconds: 70 },
      { title: "Heart-centered breath", body: "Breathe so inhale and exhale last about the same count. Imagine the breath moving through the heart, offering gratitude.", seconds: 90 },
      { title: "Close", body: "Notice any cooling of stress. Return gently.", seconds: 30 },
    ],
  },
];

export function getJournalPrompt(id: string) {
  return journalPrompts.find((p) => p.id === id);
}

export function getMeditation(id: string) {
  return meditations.find((m) => m.id === id);
}

export function totalMeditationSeconds(session: MeditationSession) {
  return session.steps.reduce((a, s) => a + s.seconds, 0);
}
