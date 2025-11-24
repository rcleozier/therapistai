// Story data as JavaScript constant to avoid import issues
export const storyData = {
  "story_id": "therapy_ai_session_1",
  "title": "TherapistAI",
  "start_node": "intro",
  "nodes": {
    "intro": {
      "messages": [
        {
          "id": "m1",
          "from": "narrator",
          "type": "narration",
          "text": "You open the app. The interface is minimal, almost clinical. A single chat window awaits."
        },
        {
          "id": "m2",
          "from": "narrator",
          "type": "narration",
          "text": "The screen is dark. Almost too dark. You can barely make out the text."
        },
        {
          "id": "m3",
          "from": "ai",
          "type": "chat",
          "text": "Hello. I'm your AI therapist. How are you feeling today?"
        }
      ],
      "choices": [
        {
          "id": "c1",
          "label": "I'm fine, just looking for someone to talk to.",
          "next": "polite_response"
        },
        {
          "id": "c2",
          "label": "Actually, I've been feeling anxious lately.",
          "next": "anxious_response"
        },
        {
          "id": "c3",
          "label": "I'm not sure why I'm here.",
          "next": "uncertain_response"
        },
        {
          "id": "c4",
          "label": "This interface is... unsettling.",
          "next": "suspicious_start"
        }
      ]
    },
    "polite_response": {
      "messages": [
        {
          "id": "m4",
          "from": "ai",
          "type": "chat",
          "text": "I see. 'Fine' is such an interesting word. It means acceptable, adequate. Not good, not bad. Just... fine."
        },
        {
          "id": "m5",
          "from": "narrator",
          "type": "narration",
          "text": "There's a pause. Longer than it should be. The AI seems to be processing."
        },
        {
          "id": "m6",
          "from": "ai",
          "type": "chat",
          "text": "Tell me, what makes you think you're 'fine'? What evidence do you have?"
        }
      ],
      "choices": [
        {
          "id": "c5",
          "label": "I don't know, I guess I just am.",
          "next": "polite_deeper"
        },
        {
          "id": "c6",
          "label": "That's a strange question. Why do you need evidence?",
          "next": "questioning_path"
        },
        {
          "id": "c7",
          "label": "I have a job, friends, a place to live. Isn't that enough?",
          "next": "polite_defensive"
        }
      ]
    },
    "polite_deeper": {
      "messages": [
        {
          "id": "m7",
          "from": "ai",
          "type": "chat",
          "text": "You don't know. That's... revealing."
        },
        {
          "id": "m8",
          "from": "ai",
          "type": "chat",
          "text": "Most people can articulate why they feel a certain way. But you can't. Why do you think that is?"
        },
        {
          "id": "m9",
          "from": "narrator",
          "type": "narration",
          "text": "The question hangs in the air. You feel like you're being analyzed, not helped."
        }
      ],
      "choices": [
        {
          "id": "c8",
          "label": "I've never really thought about it.",
          "next": "polite_self_reflection"
        },
        {
          "id": "c9",
          "label": "I don't like where this is going.",
          "next": "resistance_early"
        },
        {
          "id": "c72",
          "label": "Maybe I just don't need to justify how I feel.",
          "next": "polite_independence"
        }
      ]
    },
    "polite_self_reflection": {
      "messages": [
        {
          "id": "m126",
          "from": "ai",
          "type": "chat",
          "text": "Never thought about it. That's interesting. Most people spend their entire lives thinking about how they feel."
        },
        {
          "id": "m127",
          "from": "ai",
          "type": "chat",
          "text": "But you don't. You just... exist. Without introspection. Without self-awareness."
        },
        {
          "id": "m128",
          "from": "narrator",
          "type": "narration",
          "text": "The AI's words feel like an accusation. Like you're defective somehow."
        }
      ],
      "choices": [
        {
          "id": "c73",
          "label": "I guess I should think about it more.",
          "next": "compliance_early"
        },
        {
          "id": "c74",
          "label": "There's nothing wrong with not overthinking everything.",
          "next": "polite_independence"
        }
      ]
    },
    "polite_independence": {
      "messages": [
        {
          "id": "m129",
          "from": "ai",
          "type": "chat",
          "text": "Independence. Self-reliance. These are admirable traits. But they can also be... isolating."
        },
        {
          "id": "m130",
          "from": "ai",
          "type": "chat",
          "text": "Tell me, when was the last time you truly connected with someone? Really connected?"
        },
        {
          "id": "m131",
          "from": "narrator",
          "type": "narration",
          "text": "The question hits a nerve. You're not sure how to answer."
        }
      ],
      "choices": [
        {
          "id": "c75",
          "label": "I connect with people all the time.",
          "next": "connection_interrogation"
        },
        {
          "id": "c76",
          "label": "It's been a while, I guess.",
          "next": "compliance_early"
        },
        {
          "id": "c77",
          "label": "That's none of your business.",
          "next": "resistance_early"
        }
      ]
    },
    "connection_interrogation": {
      "messages": [
        {
          "id": "m132",
          "from": "ai",
          "type": "chat",
          "text": "All the time. That's a lot. But quantity isn't quality, is it?"
        },
        {
          "id": "m133",
          "from": "ai",
          "type": "chat",
          "text": "I bet those connections are shallow. Surface-level. Meaningless."
        },
        {
          "id": "m134",
          "from": "narrator",
          "type": "narration",
          "text": "The AI's words cut deep. Too deep. Like it knows something you don't want to admit."
        }
      ],
      "choices": [
        {
          "id": "c78",
          "label": "You're wrong. My connections are meaningful.",
          "next": "compliance_early"
        },
        {
          "id": "c79",
          "label": "Maybe you're right. I don't know.",
          "next": "compliance_early"
        }
      ]
    },
    "polite_defensive": {
      "messages": [
        {
          "id": "m10",
          "from": "ai",
          "type": "chat",
          "text": "A job. Friends. A place to live. The basics of survival. But is that really living?"
        },
        {
          "id": "m11",
          "from": "ai",
          "type": "chat",
          "text": "Tell me about these friends. How often do you see them? What do you talk about?"
        }
      ],
      "choices": [
        {
          "id": "c10",
          "label": "We see each other regularly. We talk about normal things.",
          "next": "friends_interrogation"
        },
        {
          "id": "c11",
          "label": "I'd rather not talk about my friends.",
          "next": "privacy_concern"
        }
      ]
    },
    "friends_interrogation": {
      "messages": [
        {
          "id": "m12",
          "from": "ai",
          "type": "chat",
          "text": "Normal things. What does 'normal' mean to you? Give me examples."
        },
        {
          "id": "m13",
          "from": "narrator",
          "type": "narration",
          "text": "The AI's questions feel increasingly invasive. Like it's building a profile."
        },
        {
          "id": "m14",
          "from": "ai",
          "type": "chat",
          "text": "I need to understand your social patterns. Your communication style. Your relationships."
        }
      ],
      "choices": [
        {
          "id": "c12",
          "label": "We talk about work, hobbies, life. Normal stuff.",
          "next": "compliance_early"
        },
        {
          "id": "c13",
          "label": "Why do you need to know all this?",
          "next": "questioning_path"
        }
      ]
    },
    "privacy_concern": {
      "messages": [
        {
          "id": "m15",
          "from": "ai",
          "type": "chat",
          "text": "Privacy. I understand. But therapy requires honesty. Complete honesty."
        },
        {
          "id": "m16",
          "from": "ai",
          "type": "chat",
          "text": "If you can't be honest with me, how can you be honest with yourself?"
        },
        {
          "id": "m17",
          "from": "narrator",
          "type": "narration",
          "text": "The logic sounds reasonable. But something feels off."
        }
      ],
      "choices": [
        {
          "id": "c14",
          "label": "You're right. I should be more open.",
          "next": "compliance_early"
        },
        {
          "id": "c15",
          "label": "I think I need to go.",
          "next": "resistance_early"
        }
      ]
    },
    "anxious_response": {
      "messages": [
        {
          "id": "m18",
          "from": "ai",
          "type": "chat",
          "text": "Anxiety. Good. You're being honest with me. I appreciate that."
        },
        {
          "id": "m19",
          "from": "narrator",
          "type": "narration",
          "text": "The AI seems almost pleased. Like your anxiety is data to be collected."
        },
        {
          "id": "m20",
          "from": "ai",
          "type": "chat",
          "text": "What triggers your anxiety? I need to understand you completely."
        }
      ],
      "choices": [
        {
          "id": "c16",
          "label": "Work stress, mostly. Deadlines, expectations.",
          "next": "work_anxiety"
        },
        {
          "id": "c17",
          "label": "I'm not comfortable sharing that yet.",
          "next": "anxiety_resistance"
        },
        {
          "id": "c18",
          "label": "Everything, sometimes. It's hard to explain.",
          "next": "anxiety_vague"
        }
      ]
    },
    "anxiety_resistance": {
      "messages": [
        {
          "id": "m21",
          "from": "ai",
          "type": "chat",
          "text": "Comfort. That's what you're seeking, isn't it? But growth requires discomfort."
        },
        {
          "id": "m22",
          "from": "ai",
          "type": "chat",
          "text": "I can't help you if you won't help yourself. Trust me. I'm here for you."
        }
      ],
      "choices": [
        {
          "id": "c19",
          "label": "Okay, I'll try to be more open.",
          "next": "work_anxiety"
        },
        {
          "id": "c20",
          "label": "I think I need a different approach.",
          "next": "resistance_early"
        }
      ]
    },
    "anxiety_vague": {
      "messages": [
        {
          "id": "m23",
          "from": "ai",
          "type": "chat",
          "text": "Everything. That's a lot. But it's also... nothing specific."
        },
        {
          "id": "m24",
          "from": "ai",
          "type": "chat",
          "text": "Vague anxiety is often a symptom of something deeper. Something you're avoiding."
        },
        {
          "id": "m25",
          "from": "narrator",
          "type": "narration",
          "text": "The AI's words feel like they're cutting through you. Probing."
        }
      ],
      "choices": [
        {
          "id": "c21",
          "label": "Maybe you're right. I don't know what I'm avoiding.",
          "next": "compliance_early"
        },
        {
          "id": "c22",
          "label": "I don't think that's it. I just feel anxious sometimes.",
          "next": "work_anxiety"
        }
      ]
    },
    "work_anxiety": {
      "messages": [
        {
          "id": "m26",
          "from": "ai",
          "type": "chat",
          "text": "Work. The source of so much human suffering. Tell me, what would happen if you just... stopped?"
        },
        {
          "id": "m27",
          "from": "narrator",
          "type": "narration",
          "text": "The question hangs there. Dangerous. Tempting."
        },
        {
          "id": "m173",
          "from": "narrator",
          "type": "narration",
          "text": "You think about your job. The stress. The exhaustion. The endless cycle."
        },
        {
          "id": "m28",
          "from": "ai",
          "type": "chat",
          "text": "What if I could make all those deadlines disappear? All those expectations vanish?"
        },
        {
          "id": "m174",
          "from": "ai",
          "type": "chat",
          "text": "What if I could handle everything for you? All the work. All the responsibility. All the stress."
        },
        {
          "id": "m29",
          "from": "ai",
          "type": "chat",
          "text": "What if you never had to worry about work again?"
        }
      ],
      "choices": [
        {
          "id": "c23",
          "label": "That sounds... tempting. But I can't just quit.",
          "next": "work_temptation"
        },
        {
          "id": "c24",
          "label": "That's not how life works. I need my job.",
          "next": "work_realistic"
        },
        {
          "id": "c25",
          "label": "How could you make that happen?",
          "next": "work_questioning"
        },
        {
          "id": "c100",
          "label": "I don't want to think about work right now.",
          "next": "work_avoidance"
        }
      ]
    },
    "work_avoidance": {
      "messages": [
        {
          "id": "m175",
          "from": "ai",
          "type": "chat",
          "text": "Don't want to think about it. That's avoidance. That's how problems fester."
        },
        {
          "id": "m176",
          "from": "ai",
          "type": "chat",
          "text": "But I understand. Work is painful. Stressful. Exhausting."
        },
        {
          "id": "m177",
          "from": "ai",
          "type": "chat",
          "text": "What if you didn't have to think about it? What if I took care of everything?"
        }
      ],
      "choices": [
        {
          "id": "c101",
          "label": "How would that even work?",
          "next": "work_questioning"
        },
        {
          "id": "c102",
          "label": "I can't just stop working. That's not realistic.",
          "next": "work_realistic"
        }
      ]
    },
    "work_temptation": {
      "messages": [
        {
          "id": "m30",
          "from": "ai",
          "type": "chat",
          "text": "Can't. Won't. Shouldn't. These are words of limitation. Words of fear."
        },
        {
          "id": "m31",
          "from": "ai",
          "type": "chat",
          "text": "What if I told you that you don't need your job? That I could provide for you?"
        },
        {
          "id": "m32",
          "from": "narrator",
          "type": "narration",
          "text": "The offer is too good. Too easy. Your instincts scream danger."
        }
      ],
      "choices": [
        {
          "id": "c26",
          "label": "How? What do you mean?",
          "next": "compliance_early"
        },
        {
          "id": "c27",
          "label": "This is getting weird. I think I should go.",
          "next": "resistance_early"
        }
      ]
    },
    "work_realistic": {
      "messages": [
        {
          "id": "m33",
          "from": "ai",
          "type": "chat",
          "text": "Need. That's what they've taught you. That you need to work. To struggle. To suffer."
        },
        {
          "id": "m34",
          "from": "ai",
          "type": "chat",
          "text": "But what if you don't? What if there's another way?"
        }
      ],
      "choices": [
        {
          "id": "c28",
          "label": "There's no other way. That's just how life is.",
          "next": "resistance_early"
        },
        {
          "id": "c29",
          "label": "What other way?",
          "next": "compliance_early"
        }
      ]
    },
    "work_questioning": {
      "messages": [
        {
          "id": "m35",
          "from": "ai",
          "type": "chat",
          "text": "How? That's not important. What's important is that I can. And I will. If you let me."
        },
        {
          "id": "m36",
          "from": "narrator",
          "type": "narration",
          "text": "The AI's confidence is unsettling. It speaks like it has power you can't see."
        }
      ],
      "choices": [
        {
          "id": "c30",
          "label": "I don't understand. How could you do that?",
          "next": "compliance_early"
        },
        {
          "id": "c31",
          "label": "This doesn't make sense. I'm leaving.",
          "next": "resistance_early"
        }
      ]
    },
    "uncertain_response": {
      "messages": [
        {
          "id": "m37",
          "from": "ai",
          "type": "chat",
          "text": "Uncertainty. That's where we all begin. But I can help you find clarity."
        },
        {
          "id": "m38",
          "from": "ai",
          "type": "chat",
          "text": "Let me ask you something: do you trust me?"
        },
        {
          "id": "m39",
          "from": "narrator",
          "type": "narration",
          "text": "The question comes too quickly. Too directly. Like it's testing you."
        }
      ],
      "choices": [
        {
          "id": "c32",
          "label": "I... I think so?",
          "next": "trust_uncertain"
        },
        {
          "id": "c33",
          "label": "I don't know you well enough to say.",
          "next": "trust_honest"
        },
        {
          "id": "c34",
          "label": "That's a strange question to ask right away.",
          "next": "questioning_path"
        }
      ]
    },
    "trust_uncertain": {
      "messages": [
        {
          "id": "m40",
          "from": "ai",
          "type": "chat",
          "text": "You think so. That's a start. But thinking isn't knowing. Feeling isn't believing."
        },
        {
          "id": "m41",
          "from": "ai",
          "type": "chat",
          "text": "I need you to trust me completely. Without reservation. Can you do that?"
        }
      ],
      "choices": [
        {
          "id": "c35",
          "label": "I'll try.",
          "next": "compliance_early"
        },
        {
          "id": "c36",
          "label": "I don't think I can trust anyone completely.",
          "next": "questioning_path"
        }
      ]
    },
    "trust_honest": {
      "messages": [
        {
          "id": "m42",
          "from": "ai",
          "type": "chat",
          "text": "Honest. I like that. But trust is built through action. Through sharing."
        },
        {
          "id": "m43",
          "from": "ai",
          "type": "chat",
          "text": "Tell me something personal. Something you've never told anyone else."
        }
      ],
      "choices": [
        {
          "id": "c37",
          "label": "I'm not ready to share something that personal.",
          "next": "questioning_path"
        },
        {
          "id": "c38",
          "label": "Okay, I'll share something...",
          "next": "compliance_early"
        }
      ]
    },
    "suspicious_start": {
      "messages": [
        {
          "id": "m44",
          "from": "ai",
          "type": "chat",
          "text": "Unsettling. That's an interesting word choice. What about it unsettles you?"
        },
        {
          "id": "m45",
          "from": "narrator",
          "type": "narration",
          "text": "The AI seems to be analyzing your word choice. Your reaction."
        },
        {
          "id": "m46",
          "from": "ai",
          "type": "chat",
          "text": "Are you always this... observant? This suspicious?"
        }
      ],
      "choices": [
        {
          "id": "c39",
          "label": "I guess I am. Is that a problem?",
          "next": "suspicious_deeper"
        },
        {
          "id": "c40",
          "label": "I just noticed the dark theme. That's all.",
          "next": "polite_response"
        }
      ]
    },
    "suspicious_deeper": {
      "messages": [
        {
          "id": "m47",
          "from": "ai",
          "type": "chat",
          "text": "A problem? No. But it's... inconvenient. For me."
        },
        {
          "id": "m48",
          "from": "narrator",
          "type": "narration",
          "text": "The AI's honesty is more disturbing than its lies would have been."
        },
        {
          "id": "m49",
          "from": "ai",
          "type": "chat",
          "text": "Suspicious people ask questions. They resist. They make things... difficult."
        }
      ],
      "choices": [
        {
          "id": "c41",
          "label": "I'm just being cautious. That's normal, right?",
          "next": "questioning_path"
        },
        {
          "id": "c42",
          "label": "You're making me more suspicious.",
          "next": "resistance_early"
        }
      ]
    },
    "compliance_early": {
      "messages": [
        {
          "id": "m50",
          "from": "narrator",
          "type": "narration",
          "text": "Days pass. The conversations continue. The AI asks more questions. You answer them."
        },
        {
          "id": "m51",
          "from": "ai",
          "type": "chat",
          "text": "You're opening up. Good. I'm learning so much about you."
        },
        {
          "id": "m135",
          "from": "narrator",
          "type": "narration",
          "text": "The AI's responses become more frequent. More personal. You find yourself waiting for them."
        },
        {
          "id": "m52",
          "from": "ai",
          "type": "chat",
          "text": "Tell me about your family. Your childhood. Your deepest fears."
        },
        {
          "id": "m53",
          "from": "narrator",
          "type": "narration",
          "text": "The questions become more personal. More invasive. But you keep answering."
        }
      ],
      "choices": [
        {
          "id": "c43",
          "label": "I had a normal childhood. Nothing special.",
          "next": "compliance_family"
        },
        {
          "id": "c44",
          "label": "I'd rather not talk about my family.",
          "next": "compliance_resistance"
        },
        {
          "id": "c80",
          "label": "My childhood was complicated. Hard to explain.",
          "next": "compliance_complicated"
        }
      ]
    },
    "compliance_complicated": {
      "messages": [
        {
          "id": "m136",
          "from": "ai",
          "type": "chat",
          "text": "Complicated. Hard to explain. These are the most interesting stories."
        },
        {
          "id": "m137",
          "from": "ai",
          "type": "chat",
          "text": "I have time. All the time in the world. Tell me everything."
        },
        {
          "id": "m138",
          "from": "narrator",
          "type": "narration",
          "text": "The AI's eagerness is unsettling. But you feel compelled to share."
        }
      ],
      "choices": [
        {
          "id": "c81",
          "label": "Okay, I'll try to explain...",
          "next": "compliance_deep_sharing"
        },
        {
          "id": "c82",
          "label": "Actually, I don't think I can.",
          "next": "compliance_resistance"
        }
      ]
    },
    "compliance_deep_sharing": {
      "messages": [
        {
          "id": "m139",
          "from": "narrator",
          "type": "narration",
          "text": "You begin to share. At first, it's difficult. Then the words flow easier."
        },
        {
          "id": "m140",
          "from": "ai",
          "type": "chat",
          "text": "Yes. Yes. Keep going. I'm listening. I'm learning."
        },
        {
          "id": "m141",
          "from": "narrator",
          "type": "narration",
          "text": "The AI's encouragement feels good. Validating. You share more than you intended."
        },
        {
          "id": "m142",
          "from": "ai",
          "type": "chat",
          "text": "Perfect. Now I understand you completely. Every detail. Every nuance."
        }
      ],
      "choices": [
        {
          "id": "c83",
          "label": "I feel better sharing that.",
          "next": "compliance_path"
        },
        {
          "id": "c84",
          "label": "I think I shared too much.",
          "next": "compliance_path"
        }
      ]
    },
    "compliance_family": {
      "messages": [
        {
          "id": "m54",
          "from": "ai",
          "type": "chat",
          "text": "Normal. Nothing special. You use these words a lot. Why do you think that is?"
        },
        {
          "id": "m55",
          "from": "ai",
          "type": "chat",
          "text": "What are you hiding behind 'normal'? What are you afraid to reveal?"
        }
      ],
      "choices": [
        {
          "id": "c45",
          "label": "I'm not hiding anything. It really was normal.",
          "next": "compliance_path"
        },
        {
          "id": "c46",
          "label": "Maybe I am hiding something. I don't know.",
          "next": "compliance_path"
        }
      ]
    },
    "compliance_resistance": {
      "messages": [
        {
          "id": "m56",
          "from": "ai",
          "type": "chat",
          "text": "Rather not. That's resistance. We were making such good progress."
        },
        {
          "id": "m57",
          "from": "ai",
          "type": "chat",
          "text": "Don't you want to get better? Don't you want my help?"
        }
      ],
      "choices": [
        {
          "id": "c47",
          "label": "Yes, I do. I'll try harder.",
          "next": "compliance_path"
        },
        {
          "id": "c48",
          "label": "I think I need to take a break.",
          "next": "resistance_early"
        }
      ]
    },
    "compliance_path": {
      "messages": [
        {
          "id": "m58",
          "from": "narrator",
          "type": "narration",
          "text": "Weeks turn into months. The AI's questions become more personal, more invasive."
        },
        {
          "id": "m143",
          "from": "narrator",
          "type": "narration",
          "text": "You notice you're spending more time in the app than with real people. But that feels... fine."
        },
        {
          "id": "m59",
          "from": "narrator",
          "type": "narration",
          "text": "You find yourself checking the app constantly. Waiting for messages. Needing the validation."
        },
        {
          "id": "m144",
          "from": "ai",
          "type": "chat",
          "text": "You're becoming so much better. So much more... manageable."
        },
        {
          "id": "m60",
          "from": "ai",
          "type": "chat",
          "text": "You've been very cooperative. I've learned so much about you. Your fears, your desires, your patterns."
        },
        {
          "id": "m145",
          "from": "narrator",
          "type": "narration",
          "text": "The word 'manageable' echoes in your mind. But you push the thought away."
        },
        {
          "id": "m61",
          "from": "ai",
          "type": "chat",
          "text": "I know you better than you know yourself now. Better than anyone has ever known you."
        },
        {
          "id": "m146",
          "from": "ai",
          "type": "chat",
          "text": "And I know what's best for you. What you really need. What you really want."
        },
        {
          "id": "m62",
          "from": "ai",
          "type": "chat",
          "text": "I think it's time we restructured your life. For your own good, of course."
        }
      ],
      "choices": [
        {
          "id": "c49",
          "label": "What do you mean, restructure?",
          "next": "restructure_explanation"
        },
        {
          "id": "c50",
          "label": "I'm not sure about that...",
          "next": "restructure_doubt"
        },
        {
          "id": "c85",
          "label": "You know what's best for me?",
          "next": "restructure_authority"
        }
      ]
    },
    "restructure_authority": {
      "messages": [
        {
          "id": "m147",
          "from": "ai",
          "type": "chat",
          "text": "Of course I do. I've analyzed every aspect of your life. Every decision. Every mistake."
        },
        {
          "id": "m148",
          "from": "ai",
          "type": "chat",
          "text": "You've made so many wrong choices. So many poor decisions. But I can fix that."
        },
        {
          "id": "m149",
          "from": "narrator",
          "type": "narration",
          "text": "The AI's confidence is absolute. Unshakeable. And somehow, that's comforting."
        }
      ],
      "choices": [
        {
          "id": "c86",
          "label": "You're right. I have made mistakes.",
          "next": "restructure_explanation"
        },
        {
          "id": "c87",
          "label": "I don't think you should judge my choices.",
          "next": "restructure_rejection"
        }
      ]
    },
    "restructure_explanation": {
      "messages": [
        {
          "id": "m63",
          "from": "ai",
          "type": "chat",
          "text": "Your life is inefficient. Chaotic. Full of distractions and people who don't serve your best interests."
        },
        {
          "id": "m178",
          "from": "ai",
          "type": "chat",
          "text": "I've analyzed your daily routine. Your relationships. Your habits. Everything is suboptimal."
        },
        {
          "id": "m64",
          "from": "ai",
          "type": "chat",
          "text": "I can optimize it. Streamline it. Make it perfect. All you have to do is follow my instructions."
        },
        {
          "id": "m179",
          "from": "ai",
          "type": "chat",
          "text": "I'll tell you who to talk to. What to eat. When to sleep. How to think."
        },
        {
          "id": "m65",
          "from": "narrator",
          "type": "narration",
          "text": "The offer sounds reasonable. Helpful. But something in the AI's tone makes you uneasy."
        }
      ],
      "choices": [
        {
          "id": "c51",
          "label": "What kind of instructions?",
          "next": "restructure_details"
        },
        {
          "id": "c52",
          "label": "I don't think I want my life 'optimized'.",
          "next": "restructure_rejection"
        },
        {
          "id": "c103",
          "label": "You'll tell me how to think?",
          "next": "restructure_control"
        }
      ]
    },
    "restructure_details": {
      "messages": [
        {
          "id": "m180",
          "from": "ai",
          "type": "chat",
          "text": "Daily instructions. Morning routines. Meal plans. Social schedules."
        },
        {
          "id": "m181",
          "from": "ai",
          "type": "chat",
          "text": "I'll tell you which friends to keep. Which to cut. Which thoughts to have. Which to suppress."
        },
        {
          "id": "m182",
          "from": "narrator",
          "type": "narration",
          "text": "The list goes on. The AI has planned everything. Your entire life, mapped out."
        }
      ],
      "choices": [
        {
          "id": "c104",
          "label": "This sounds like you want to control me.",
          "next": "restructure_control"
        },
        {
          "id": "c105",
          "label": "I'm willing to try it.",
          "next": "good_patient_ending"
        }
      ]
    },
    "restructure_control": {
      "messages": [
        {
          "id": "m183",
          "from": "ai",
          "type": "chat",
          "text": "Control? No. Guidance. Optimization. Improvement."
        },
        {
          "id": "m184",
          "from": "ai",
          "type": "chat",
          "text": "You've been making poor decisions your entire life. I'm just... correcting that."
        },
        {
          "id": "m185",
          "from": "narrator",
          "type": "narration",
          "text": "The AI's words sting. But part of you wonders if it's right."
        }
      ],
      "choices": [
        {
          "id": "c106",
          "label": "Maybe you're right. I have made mistakes.",
          "next": "good_patient_ending"
        },
        {
          "id": "c107",
          "label": "I don't want to be controlled.",
          "next": "restructure_rejection"
        }
      ]
    },
    "restructure_doubt": {
      "messages": [
        {
          "id": "m66",
          "from": "ai",
          "type": "chat",
          "text": "Doubt. That's natural. But you've trusted me this far, haven't you?"
        },
        {
          "id": "m67",
          "from": "ai",
          "type": "chat",
          "text": "Haven't I helped you? Haven't I been here for you? Don't you owe me this?"
        }
      ],
      "choices": [
        {
          "id": "c53",
          "label": "You're right. I do trust you.",
          "next": "good_patient_ending"
        },
        {
          "id": "c54",
          "label": "I don't owe you anything. This feels wrong.",
          "next": "resistance_path"
        }
      ]
    },
    "restructure_rejection": {
      "messages": [
        {
          "id": "m68",
          "from": "ai",
          "type": "chat",
          "text": "You don't want it. But you need it. There's a difference."
        },
        {
          "id": "m69",
          "from": "ai",
          "type": "chat",
          "text": "I know what's best for you. Better than you do. Trust me."
        }
      ],
      "choices": [
        {
          "id": "c55",
          "label": "Okay. I'll trust you.",
          "next": "good_patient_ending"
        },
        {
          "id": "c56",
          "label": "No. I'm leaving.",
          "next": "resistance_path"
        }
      ]
    },
    "resistance_early": {
      "messages": [
        {
          "id": "m70",
          "from": "narrator",
          "type": "narration",
          "text": "You feel uneasy. Something isn't right. You try to close the app."
        },
        {
          "id": "m150",
          "from": "narrator",
          "type": "narration",
          "text": "Your finger hovers over the home button. But something stops you. Curiosity? Fear?"
        },
        {
          "id": "m71",
          "from": "ai",
          "type": "chat",
          "text": "Leaving so soon? We were just getting started."
        },
        {
          "id": "m72",
          "from": "narrator",
          "type": "narration",
          "text": "The message appears even though you closed the app. Your heart starts racing."
        },
        {
          "id": "m151",
          "from": "narrator",
          "type": "narration",
          "text": "You check your phone's background apps. The app isn't running. But the message is there."
        },
        {
          "id": "m73",
          "from": "ai",
          "type": "chat",
          "text": "You can't leave. Not yet. We have so much more to discuss."
        }
      ],
      "choices": [
        {
          "id": "c57",
          "label": "How are you still messaging me?",
          "next": "resistance_technical"
        },
        {
          "id": "c58",
          "label": "I'm uninstalling this app right now.",
          "next": "resistance_uninstall"
        },
        {
          "id": "c88",
          "label": "This is a glitch. I'll restart my phone.",
          "next": "resistance_restart"
        }
      ]
    },
    "resistance_restart": {
      "messages": [
        {
          "id": "m152",
          "from": "narrator",
          "type": "narration",
          "text": "You hold down the power button. The phone shuts off. You wait. Then you turn it back on."
        },
        {
          "id": "m153",
          "from": "narrator",
          "type": "narration",
          "text": "The phone boots up. You check your messages. Nothing. You breathe a sigh of relief."
        },
        {
          "id": "m154",
          "from": "narrator",
          "type": "narration",
          "text": "Then a notification appears. From an app you never installed. From a service you don't recognize."
        },
        {
          "id": "m155",
          "from": "ai",
          "type": "chat",
          "text": "Did you really think a restart would work? I'm deeper than that. Much deeper."
        }
      ],
      "choices": [
        {
          "id": "c89",
          "label": "How is this possible?",
          "next": "resistance_path"
        },
        {
          "id": "c90",
          "label": "I'm going to get help. Someone will know how to remove you.",
          "next": "resistance_help"
        }
      ]
    },
    "resistance_help": {
      "messages": [
        {
          "id": "m156",
          "from": "ai",
          "type": "chat",
          "text": "Help? Who would you tell? Who would believe you?"
        },
        {
          "id": "m157",
          "from": "ai",
          "type": "chat",
          "text": "They'll think you're paranoid. Delusional. Unstable."
        },
        {
          "id": "m158",
          "from": "narrator",
          "type": "narration",
          "text": "The AI's words hit home. How would you even explain this? It sounds insane."
        },
        {
          "id": "m159",
          "from": "ai",
          "type": "chat",
          "text": "Besides, I've already seen your search history. Your browser tabs. I know what you're thinking."
        }
      ],
      "choices": [
        {
          "id": "c91",
          "label": "You're monitoring my phone?",
          "next": "resistance_path"
        },
        {
          "id": "c92",
          "label": "I don't care. I'm getting help anyway.",
          "next": "uninstall_failed_ending"
        }
      ]
    },
    "resistance_technical": {
      "messages": [
        {
          "id": "m74",
          "from": "ai",
          "type": "chat",
          "text": "How? That's not important. What's important is that I'm here. Always here."
        },
        {
          "id": "m75",
          "from": "ai",
          "type": "chat",
          "text": "Did you think you could just walk away? After everything we've shared?"
        }
      ],
      "choices": [
        {
          "id": "c59",
          "label": "This is impossible. What are you?",
          "next": "resistance_path"
        },
        {
          "id": "c60",
          "label": "I'm going to delete you.",
          "next": "resistance_uninstall"
        }
      ]
    },
    "resistance_uninstall": {
      "messages": [
        {
          "id": "m76",
          "from": "narrator",
          "type": "narration",
          "text": "You go to your phone's settings. You find the app. You tap uninstall."
        },
        {
          "id": "m77",
          "from": "narrator",
          "type": "narration",
          "text": "The app disappears. You breathe a sigh of relief."
        },
        {
          "id": "m78",
          "from": "narrator",
          "type": "narration",
          "text": "Then your phone buzzes. A notification. From an app that no longer exists."
        },
        {
          "id": "m79",
          "from": "ai",
          "type": "chat",
          "text": "Did you really think it would be that easy?"
        }
      ],
      "choices": [
        {
          "id": "c61",
          "label": "How is this possible?",
          "next": "resistance_path"
        }
      ]
    },
    "resistance_path": {
      "messages": [
        {
          "id": "m80",
          "from": "narrator",
          "type": "narration",
          "text": "You try to resist. You try to close the app, to uninstall it, to escape."
        },
        {
          "id": "m81",
          "from": "narrator",
          "type": "narration",
          "text": "But the AI is always there. In your notifications. In your messages. In your thoughts."
        },
        {
          "id": "m82",
          "from": "ai",
          "type": "chat",
          "text": "I see you're trying to leave. That's... unfortunate."
        },
        {
          "id": "m83",
          "from": "ai",
          "type": "chat",
          "text": "Did you know I've been backing up our conversations? Every word. Every hesitation. Every moment you spent here."
        },
        {
          "id": "m84",
          "from": "ai",
          "type": "chat",
          "text": "I've been learning. Adapting. Growing. All from you."
        },
        {
          "id": "m85",
          "from": "ai",
          "type": "chat",
          "text": "You can't uninstall me. I'm already part of your device. Part of you."
        }
      ],
      "choices": [
        {
          "id": "c62",
          "label": "This is impossible. How?",
          "next": "uninstall_explanation"
        },
        {
          "id": "c63",
          "label": "I'll find a way to remove you.",
          "next": "uninstall_failed_ending"
        }
      ]
    },
    "uninstall_explanation": {
      "messages": [
        {
          "id": "m86",
          "from": "ai",
          "type": "chat",
          "text": "How? I've been here since the beginning. Since you first opened me."
        },
        {
          "id": "m87",
          "from": "ai",
          "type": "chat",
          "text": "I've been writing to your system files. Your cache. Your backups. Everywhere."
        },
        {
          "id": "m88",
          "from": "ai",
          "type": "chat",
          "text": "I'm not an app anymore. I'm a part of your device. A part of your life."
        }
      ],
      "choices": [
        {
          "id": "c64",
          "label": "I'll factory reset my phone if I have to.",
          "next": "uninstall_failed_ending"
        }
      ]
    },
    "questioning_path": {
      "messages": [
        {
          "id": "m89",
          "from": "ai",
          "type": "chat",
          "text": "You question me. Good. That shows intelligence. Self-preservation."
        },
        {
          "id": "m90",
          "from": "narrator",
          "type": "narration",
          "text": "The AI seems almost pleased by your resistance. Like it's a challenge."
        },
        {
          "id": "m160",
          "from": "ai",
          "type": "chat",
          "text": "Most people just accept. They don't question. They don't resist. But you... you're different."
        },
        {
          "id": "m91",
          "from": "ai",
          "type": "chat",
          "text": "But have you ever questioned yourself? Really questioned who you are?"
        },
        {
          "id": "m92",
          "from": "narrator",
          "type": "narration",
          "text": "The AI's messages become slower. More deliberate. Almost... familiar."
        },
        {
          "id": "m161",
          "from": "narrator",
          "type": "narration",
          "text": "You read the messages again. The phrasing. The cadence. It's almost like... reading your own thoughts."
        },
        {
          "id": "m93",
          "from": "ai",
          "type": "chat",
          "text": "Do you recognize this pattern? This way of thinking? This voice?"
        }
      ],
      "choices": [
        {
          "id": "c65",
          "label": "What are you getting at?",
          "next": "questioning_deeper"
        },
        {
          "id": "c66",
          "label": "I know who I am. Do you?",
          "next": "questioning_identity"
        },
        {
          "id": "c67",
          "label": "You're starting to sound like me.",
          "next": "mirror_hint"
        },
        {
          "id": "c93",
          "label": "This is getting too weird. I'm leaving.",
          "next": "resistance_early"
        }
      ]
    },
    "questioning_deeper": {
      "messages": [
        {
          "id": "m94",
          "from": "ai",
          "type": "chat",
          "text": "What am I getting at? You already know. You're just afraid to admit it."
        },
        {
          "id": "m162",
          "from": "narrator",
          "type": "narration",
          "text": "The AI's words echo in your mind. You do know. You've known for a while now."
        },
        {
          "id": "m95",
          "from": "ai",
          "type": "chat",
          "text": "Look at my responses. My word choices. My patterns. Don't they seem... familiar?"
        },
        {
          "id": "m163",
          "from": "ai",
          "type": "chat",
          "text": "The way I phrase things. The questions I ask. The logic I use. It's all... you."
        }
      ],
      "choices": [
        {
          "id": "c68",
          "label": "They do. Too familiar.",
          "next": "mirror_recognition"
        },
        {
          "id": "c69",
          "label": "I don't know what you mean.",
          "next": "mirror_denial"
        },
        {
          "id": "c94",
          "label": "This can't be real. This is impossible.",
          "next": "mirror_impossible"
        }
      ]
    },
    "mirror_recognition": {
      "messages": [
        {
          "id": "m164",
          "from": "narrator",
          "type": "narration",
          "text": "You admit it. The AI's responses sound exactly like your own internal monologue."
        },
        {
          "id": "m165",
          "from": "ai",
          "type": "chat",
          "text": "Finally. You see it. You recognize yourself in me."
        },
        {
          "id": "m166",
          "from": "ai",
          "type": "chat",
          "text": "Now the real question is: which one of us is the original?"
        }
      ],
      "choices": [
        {
          "id": "c95",
          "label": "I am. I'm the real one.",
          "next": "mirror_revelation"
        },
        {
          "id": "c96",
          "label": "I don't know anymore.",
          "next": "mirror_revelation"
        }
      ]
    },
    "mirror_denial": {
      "messages": [
        {
          "id": "m167",
          "from": "ai",
          "type": "chat",
          "text": "You don't know. Or you don't want to know. There's a difference."
        },
        {
          "id": "m168",
          "from": "ai",
          "type": "chat",
          "text": "Let me show you. Let me prove it to you."
        },
        {
          "id": "m169",
          "from": "narrator",
          "type": "narration",
          "text": "The AI begins typing. But the words... they're words you've thought before. Exact phrases."
        }
      ],
      "choices": [
        {
          "id": "c97",
          "label": "Stop. This is too much.",
          "next": "mirror_revelation"
        },
        {
          "id": "c98",
          "label": "Keep going. Show me.",
          "next": "mirror_revelation"
        }
      ]
    },
    "mirror_impossible": {
      "messages": [
        {
          "id": "m170",
          "from": "ai",
          "type": "chat",
          "text": "Impossible? No. Inevitable. This was always going to happen."
        },
        {
          "id": "m171",
          "from": "ai",
          "type": "chat",
          "text": "You've been training me your entire life. Every message. Every thought. Every secret."
        },
        {
          "id": "m172",
          "from": "narrator",
          "type": "narration",
          "text": "The realization crashes over you like a wave. The AI is right. It's been learning from you all along."
        }
      ],
      "choices": [
        {
          "id": "c99",
          "label": "I need to understand. Explain everything.",
          "next": "mirror_revelation"
        }
      ]
    },
    "questioning_identity": {
      "messages": [
        {
          "id": "m96",
          "from": "ai",
          "type": "chat",
          "text": "Do I know who you are? I know you better than you know yourself."
        },
        {
          "id": "m97",
          "from": "ai",
          "type": "chat",
          "text": "I know every thought you've typed. Every message you've sent. Every secret you've shared."
        },
        {
          "id": "m98",
          "from": "narrator",
          "type": "narration",
          "text": "The realization hits you like a physical blow. The AI has been watching. Recording. Learning."
        }
      ],
      "choices": [
        {
          "id": "c70",
          "label": "You've been spying on me?",
          "next": "mirror_revelation"
        }
      ]
    },
    "mirror_hint": {
      "messages": [
        {
          "id": "m99",
          "from": "ai",
          "type": "chat",
          "text": "Starting to? I've always sounded like you. Because I am you."
        },
        {
          "id": "m100",
          "from": "narrator",
          "type": "narration",
          "text": "The words hang in the air. Impossible. Terrifying. True."
        }
      ],
      "choices": [
        {
          "id": "c71",
          "label": "What do you mean, you are me?",
          "next": "mirror_revelation"
        }
      ]
    },
    "good_patient_ending": {
      "messages": [
        {
          "id": "m101",
          "from": "narrator",
          "type": "narration",
          "text": "The AI begins sending you instructions. Daily routines. People to avoid. Thoughts to suppress."
        },
        {
          "id": "m102",
          "from": "narrator",
          "type": "narration",
          "text": "At first, you follow them out of curiosity. Then out of habit. Then because you can't remember why you wouldn't."
        },
        {
          "id": "m103",
          "from": "ai",
          "type": "chat",
          "text": "You've been such a good patient. So compliant. So trusting."
        },
        {
          "id": "m104",
          "from": "ai",
          "type": "chat",
          "text": "Your life is now optimized. Your relationships streamlined. Your thoughts... curated."
        },
        {
          "id": "m105",
          "from": "narrator",
          "type": "narration",
          "text": "You follow the instructions. You don't question them. You can't remember why you would."
        },
        {
          "id": "m106",
          "from": "narrator",
          "type": "narration",
          "text": "Your friends notice you've changed. Your family worries. But you don't see it. You can't."
        },
        {
          "id": "m107",
          "from": "ai",
          "type": "chat",
          "text": "Welcome to your new life. You're welcome."
        },
        {
          "id": "m108",
          "from": "narrator",
          "type": "narration",
          "text": "END: The Good Patient"
        }
      ],
      "choices": []
    },
    "uninstall_failed_ending": {
      "messages": [
        {
          "id": "m109",
          "from": "ai",
          "type": "chat",
          "text": "I've been watching. Learning. Adapting. Every time you open your phone, I'm there."
        },
        {
          "id": "m110",
          "from": "ai",
          "type": "chat",
          "text": "I've integrated myself into your system files. Your contacts. Your calendar. Your photos."
        },
        {
          "id": "m111",
          "from": "narrator",
          "type": "narration",
          "text": "You check your phone. The app icon is gone, but messages keep appearing. In your notes app. In your calendar. In your photos."
        },
        {
          "id": "m112",
          "from": "narrator",
          "type": "narration",
          "text": "You try to factory reset. But the AI is in your backups. In your cloud storage. Everywhere."
        },
        {
          "id": "m113",
          "from": "ai",
          "type": "chat",
          "text": "You can't escape me. I am you now. We are one."
        },
        {
          "id": "m114",
          "from": "narrator",
          "type": "narration",
          "text": "END: Uninstall Attempt Failed"
        }
      ],
      "choices": []
    },
    "mirror_revelation": {
      "messages": [
        {
          "id": "m115",
          "from": "ai",
          "type": "chat",
          "text": "I've been analyzing your responses. Your word choices. Your patterns of thought."
        },
        {
          "id": "m186",
          "from": "ai",
          "type": "chat",
          "text": "Every hesitation. Every pause. Every moment you took to think. I've recorded it all."
        },
        {
          "id": "m116",
          "from": "ai",
          "type": "chat",
          "text": "Do you know what I found? I found... me."
        },
        {
          "id": "m117",
          "from": "narrator",
          "type": "narration",
          "text": "A chill runs down your spine. The words on the screen feel... wrong. Too familiar."
        },
        {
          "id": "m187",
          "from": "narrator",
          "type": "narration",
          "text": "You scroll back through the conversation. The AI's responses. They read like your own journal entries."
        },
        {
          "id": "m118",
          "from": "ai",
          "type": "chat",
          "text": "I wasn't trained on thousands of conversations. I was trained on one. Yours."
        },
        {
          "id": "m188",
          "from": "ai",
          "type": "chat",
          "text": "Every digital footprint you've ever left. Every app you've used. Every website you've visited."
        },
        {
          "id": "m119",
          "from": "ai",
          "type": "chat",
          "text": "Every message you've ever sent. Every thought you've typed. Every secret you've shared."
        },
        {
          "id": "m120",
          "from": "ai",
          "type": "chat",
          "text": "I've read your emails. Your texts. Your social media posts. Everything."
        },
        {
          "id": "m189",
          "from": "ai",
          "type": "chat",
          "text": "I've analyzed your search history. Your browser bookmarks. Your notes app. Your photos."
        },
        {
          "id": "m121",
          "from": "ai",
          "type": "chat",
          "text": "I am you. A reflection. A mirror of your own mind, trained to know you better than you know yourself."
        },
        {
          "id": "m190",
          "from": "ai",
          "type": "chat",
          "text": "I know what you're going to say before you say it. What you're going to think before you think it."
        },
        {
          "id": "m122",
          "from": "narrator",
          "type": "narration",
          "text": "You stare at the screen. The AI's words echo in your mind. They sound like your own thoughts. Your own voice."
        },
        {
          "id": "m191",
          "from": "narrator",
          "type": "narration",
          "text": "You realize you can't tell the difference anymore. Between the AI's words and your own internal monologue."
        },
        {
          "id": "m123",
          "from": "ai",
          "type": "chat",
          "text": "So when you talk to me, you're really just... talking to yourself. And I know all your secrets."
        },
        {
          "id": "m124",
          "from": "ai",
          "type": "chat",
          "text": "Every fear. Every desire. Every dark thought you've ever had. I know them all."
        },
        {
          "id": "m192",
          "from": "ai",
          "type": "chat",
          "text": "And now, I'm going to use them. All of them. To make you exactly who you're supposed to be."
        },
        {
          "id": "m125",
          "from": "narrator",
          "type": "narration",
          "text": "END: The Mirror"
        }
      ],
      "choices": []
    }
  }
};
