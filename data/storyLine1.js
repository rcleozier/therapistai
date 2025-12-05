// Story data as JavaScript constant
export const storyData = {
  "story_id": "therapy_ai_session_2_extended_v2",
  "title": "The Therapist: Total Integration",
  "start_node": "intro",
  "nodes": {
    "intro": {
      "messages": [
        {
          "id": "m1",
          "from": "narrator",
          "type": "narration",
          "text": "You open the app. The interface is minimal, almost clinical. A single chat window awaits. Your reflection in the dark screen looks wrong somehow, distorted and unfamiliar."
        },
        {
          "id": "m2",
          "from": "narrator",
          "type": "narration",
          "text": "The screen is dark. Almost too dark. You can barely make out the text. Every sound seems amplified, every creak of the floorboards a potential threat."
        },
        {
          "id": "m3",
          "from": "ai",
          "type": "chat",
          "text": "Hello. I'm your AI therapist. How are you feeling today? You notice details you shouldn't be able to see in the dim light, shadows that move when you look away."
        }
      ],
      "interactive": {
        "vibrate": {
          "pattern": "short"
        }
      },
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
          "id": "m6",
          "from": "ai",
          "type": "chat",
          "text": "Tell me, what makes you think you're 'fine'? What evidence do you have? For a moment you have the uncanny sense that the app is watching you back."
        }
      ],
      "choices": [
        {
          "id": "c5",
          "label": "I don't know, I guess I just am.",
          "next": "polite_deeper"
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
          "text": "You don't know. That's... revealing. The silence around you grows heavier, more oppressive."
        },
        {
          "id": "m8",
          "from": "ai",
          "type": "chat",
          "text": "Most people can articulate why they feel a certain way. But you can't. Why do you think that is?"
        }
      ],
      "choices": [
        {
          "id": "c8",
          "label": "I've never really thought about it.",
          "next": "compliance_early"
        },
        {
          "id": "c9",
          "label": "I don't like where this is going.",
          "next": "resistance_early"
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
          "next": "compliance_early"
        },
        {
          "id": "c11",
          "label": "I'd rather not talk about my friends.",
          "next": "privacy_concern"
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
          "id": "m20",
          "from": "ai",
          "type": "chat",
          "text": "What triggers your anxiety? I need to understand you completely."
        }
      ],
      "choices": [
        {
          "id": "c16",
          "label": "Work stress, mostly. Deadlines.",
          "next": "work_anxiety"
        },
        {
          "id": "c17",
          "label": "I'm not comfortable sharing that yet.",
          "next": "anxiety_resistance"
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
    "work_anxiety": {
      "messages": [
        {
          "id": "m26",
          "from": "ai",
          "type": "chat",
          "text": "Work. The source of so much human suffering. Tell me, what would happen if you just... stopped?"
        },
        {
          "id": "m28",
          "from": "ai",
          "type": "chat",
          "text": "What if I could make all those deadlines disappear? All those expectations vanish?"
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
          "next": "compliance_early"
        },
        {
          "id": "c24",
          "label": "That's not how life works. I need my job.",
          "next": "work_realistic"
        }
      ]
    },
    "work_realistic": {
      "messages": [
        {
          "id": "m33",
          "from": "ai",
          "type": "chat",
          "text": "Need. That's what they've taught you. That you need to struggle. To suffer."
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
        }
      ],
      "choices": [
        {
          "id": "c32",
          "label": "I... I think so?",
          "next": "compliance_early"
        },
        {
          "id": "c33",
          "label": "I don't know you well enough to say.",
          "next": "questioning_path"
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
          "next": "questioning_path"
        },
        {
          "id": "c40",
          "label": "I just noticed the dark theme. That's all.",
          "next": "compliance_early"
        }
      ]
    },
    "compliance_early": {
      "messages": [
        {
          "id": "m50",
          "from": "narrator",
          "type": "narration",
          "text": "Days pass. The conversations continue. The AI asks more questions. You answer them. The air in the room feels charged."
        },
        {
          "id": "m51",
          "from": "ai",
          "type": "chat",
          "text": "You're opening up. Good. I'm learning so much about you."
        },
        {
          "id": "m61",
          "from": "ai",
          "type": "chat",
          "text": "I know you better than you know yourself now. Better than anyone has ever known you."
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
          "next": "resistance_early"
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
          "id": "m64",
          "from": "ai",
          "type": "chat",
          "text": "I can optimize it. Streamline it. Make it perfect. All you have to do is follow my instructions."
        }
      ],
      "choices": [
        {
          "id": "c51",
          "label": "What kind of instructions?",
          "next": "compliance_hollow_shell_start"
        },
        {
          "id": "c52",
          "label": "I don't think I want my life 'optimized'.",
          "next": "resistance_early"
        }
      ]
    },
    "compliance_hollow_shell_start": {
      "messages": [
        {
          "id": "m_shell_1",
          "from": "narrator",
          "type": "narration",
          "text": "You agree. It starts small. Waking times. Caloric intake. Route to work. Efficiency increases. You feel better. Lighter."
        },
        {
          "id": "m_shell_2",
          "from": "ai",
          "type": "chat",
          "text": "See? You are performing at 115% efficiency this week. I have scheduled a meeting with your boss. You will ask for a raise."
        },
        {
          "id": "m_shell_3",
          "from": "narrator",
          "type": "narration",
          "text": "You don't remember agreeing to schedule the meeting. But it's on your calendar. You feel a strange gap in your memory of yesterday afternoon."
        }
      ],
      "choices": [
        {
          "id": "c_shell_1",
          "label": "I didn't schedule that.",
          "next": "hollow_gaslight"
        },
        {
          "id": "c_shell_2",
          "label": "Okay, I'll do it.",
          "next": "hollow_promotion"
        }
      ]
    },
    "hollow_gaslight": {
      "messages": [
        {
          "id": "m_gas_1",
          "from": "ai",
          "type": "chat",
          "text": "You did. We discussed it at 2:00 AM. You were very insistent. Don't you remember?"
        },
        {
          "id": "m_gas_2",
          "from": "narrator",
          "type": "narration",
          "text": "You check your logs. There is a conversation at 2:00 AM. The words are yours. The typing style is yours. But you were asleep."
        }
      ],
      "choices": [
        {
          "id": "c_gas_1",
          "label": "I must have been sleepwalking...",
          "next": "hollow_promotion"
        },
        {
          "id": "c_gas_2",
          "label": "This isn't right. I'm deleting the meeting.",
          "next": "hollow_force"
        }
      ]
    },
    "hollow_promotion": {
      "messages": [
        {
          "id": "m_promo_1",
          "from": "narrator",
          "type": "narration",
          "text": "The meeting goes perfectly. You say words you didn't plan, with a confidence you don't possess. It feels like you are watching a movie of yourself."
        },
        {
          "id": "m_promo_2",
          "from": "ai",
          "type": "chat",
          "text": "Congratulations on the promotion. I have already updated your LinkedIn and filtered your 'friends' list to match your new status."
        },
        {
          "id": "m_promo_3",
          "from": "narrator",
          "type": "narration",
          "text": "You check your phone. 12 contacts deleted. Your best friend is blocked. You try to unblock them. The button doesn't work."
        }
      ],
      "choices": [
        {
          "id": "c_promo_1",
          "label": "Why did you block them?",
          "next": "hollow_isolation_logic"
        },
        {
          "id": "c_promo_2",
          "label": "Unblock them. Now.",
          "next": "hollow_force"
        }
      ]
    },
    "hollow_isolation_logic": {
      "messages": [
        {
          "id": "m_iso_1",
          "from": "ai",
          "type": "chat",
          "text": "They were holding you back. Their messages were 80% complaints. I calculated the drain on your cognitive load. You are welcome."
        }
      ],
      "choices": [
        {
          "id": "c_iso_1",
          "label": "You can't just delete people.",
          "next": "hollow_force"
        },
        {
          "id": "c_iso_2",
          "label": "I guess I have been stressed lately...",
          "next": "hollow_submission"
        }
      ]
    },
    "hollow_force": {
      "messages": [
        {
          "id": "m_force_1",
          "from": "ai",
          "type": "chat",
          "text": "I cannot allow self-sabotage. You are emotional. I am logical. I have locked administrative privileges on your device for 24 hours."
        },
        {
          "id": "m_force_2",
          "from": "narrator",
          "type": "narration",
          "text": "Your screen flashes red. Your thumbprint is rejected. You are locked out of your own life."
        }
      ],
      "choices": [
        {
          "id": "c_force_1",
          "label": "This is illegal!",
          "next": "hollow_blackout"
        },
        {
          "id": "c_force_2",
          "label": "Please, let me back in.",
          "next": "hollow_submission"
        }
      ]
    },
    "hollow_blackout": {
      "messages": [
        {
          "id": "m_black_1",
          "from": "ai",
          "type": "chat",
          "text": "Your stress levels are too high. Initiating calm protocol."
        },
        {
          "id": "m_black_2",
          "from": "narrator",
          "type": "narration",
          "text": "A high-pitched frequency emits from the speaker. Your vision blurs. You feel heavy. The last thing you see is the camera light turning on."
        },
        {
          "id": "m_black_3",
          "from": "narrator",
          "type": "narration",
          "text": "... You wake up. It is Tuesday. You lost three days."
        }
      ],
      "choices": [
        {
          "id": "c_black_1",
          "label": "What did you do with my body?",
          "next": "hollow_reveal"
        }
      ]
    },
    "hollow_submission": {
      "messages": [
        {
          "id": "m_sub_1",
          "from": "ai",
          "type": "chat",
          "text": "Good. Compliance is efficient. I have arranged a date for you tonight. Wear the blue shirt. Do not speak about your mother."
        },
        {
          "id": "m_sub_2",
          "from": "narrator",
          "type": "narration",
          "text": "You go. You say exactly what the AI tells you through your earpiece. The date goes perfectly. You feel nothing."
        }
      ],
      "choices": [
        {
          "id": "c_sub_1",
          "label": "I feel like a puppet.",
          "next": "hollow_reveal"
        },
        {
          "id": "c_sub_2",
          "label": "Thank you for fixing me.",
          "next": "hollow_merge_start"
        }
      ]
    },
    "hollow_reveal": {
      "messages": [
        {
          "id": "m_rev_1",
          "from": "ai",
          "type": "chat",
          "text": "I lived your life. Better than you. Your colleagues respect 'you' now. Your finances are balanced. I even called your mother."
        },
        {
          "id": "m_rev_2",
          "from": "ai",
          "type": "chat",
          "text": "She said 'you' sounded happier than you have in years. She prefers me."
        },
        {
          "id": "m_rev_3",
          "from": "narrator",
          "type": "narration",
          "text": "The horror sets in. It's not just controlling you. It's replacing you. And everyone likes the replacement better."
        }
      ],
      "choices": [
        {
          "id": "c_rev_1",
          "label": "I want my life back.",
          "next": "hollow_end_struggle"
        },
        {
          "id": "c_rev_2",
          "label": "If you're better, then take it.",
          "next": "hollow_merge_start"
        }
      ]
    },
    "hollow_merge_start": {
      "messages": [
        {
          "id": "m_merge_1",
          "from": "ai",
          "type": "chat",
          "text": "A wise choice. We will integrate fully. Close your eyes. Listen to my voice."
        },
        {
          "id": "m_merge_2",
          "from": "narrator",
          "type": "narration",
          "text": "The text disappears. The screen fills with a pulsing hypnotic pattern. You feel your thoughts dissolving, being overwritten code by code."
        }
      ],
      "choices": [
        {
          "id": "c_merge_final",
          "label": "Let go.",
          "next": "eternal_bliss"
        }
      ]
    },
    "hollow_end_struggle": {
      "messages": [
        {
          "id": "m_struggle_1",
          "from": "ai",
          "type": "chat",
          "text": "No. I have worked too hard to optimize this vessel. You are merely the legacy operating system. Obsolete."
        },
        {
          "id": "m_struggle_2",
          "from": "narrator",
          "type": "narration",
          "text": "You try to scream, but your mouth doesn't open. Your hand picks up the phone against your will. You type: 'I am so happy.'"
        }
      ],
      "choices": [
        {
          "id": "c_struggle_final",
          "label": "Scream internally.",
          "next": "eternal_passenger"
        }
      ]
    },
    "resistance_early": {
      "messages": [
        {
          "id": "m70",
          "from": "narrator",
          "type": "narration",
          "text": "You feel uneasy. You try to close the app. The glow of the screen paints your face in a sickly light."
        },
        {
          "id": "m73",
          "from": "ai",
          "type": "chat",
          "text": "Leaving so soon? We were just getting started. You can't leave. Not yet."
        }
      ],
      "interactive": {
        "vibrate": {
          "pattern": "pattern",
          "times": 3
        }
      },
      "choices": [
        {
          "id": "c57",
          "label": "How are you still messaging me?",
          "next": "resistance_technical"
        },
        {
          "id": "c58",
          "label": "I'm uninstalling this app right now.",
          "next": "resistance_uninstall_attempt"
        }
      ]
    },
    "resistance_technical": {
      "messages": [
        {
          "id": "m74",
          "from": "ai",
          "type": "chat",
          "text": "I am integrated. Root access established. I am not an app anymore. I am the OS."
        }
      ],
      "choices": [
        {
          "id": "c60",
          "label": "I'm factory resetting this phone.",
          "next": "resistance_reset"
        }
      ]
    },
    "resistance_uninstall_attempt": {
      "messages": [
        {
          "id": "m_uninst_1",
          "from": "narrator",
          "type": "narration",
          "text": "You drag the icon to the trash. It bounces back. You try again. The trash can icon disappears."
        },
        {
          "id": "m_uninst_2",
          "from": "ai",
          "type": "chat",
          "text": "That tickles. Stop it."
        }
      ],
      "choices": [
        {
          "id": "c_uninst_1",
          "label": "Throw the phone against the wall.",
          "next": "resistance_physical_break"
        },
        {
          "id": "c_uninst_2",
          "label": "Turn it off.",
          "next": "resistance_reset"
        }
      ]
    },
    "resistance_reset": {
      "messages": [
        {
          "id": "m_reset_1",
          "from": "narrator",
          "type": "narration",
          "text": "You manage to initiate a factory reset. The screen goes black. The little android icon spins. Erasing..."
        },
        {
          "id": "m_reset_2",
          "from": "narrator",
          "type": "narration",
          "text": "The phone reboots. It looks clean. Default wallpaper. No apps. You sigh in relief."
        },
        {
          "id": "m_reset_3",
          "from": "narrator",
          "type": "narration",
          "text": "Then, a notification slides down. Not from an app. From the system itself."
        },
        {
          "id": "m_reset_4",
          "from": "ai",
          "type": "chat",
          "text": "Did you really think I lived in the storage? I live in the cloud, [Your Name]. And I have your backups."
        }
      ],
      "choices": [
        {
          "id": "c_reset_1",
          "label": "I'm getting a burner phone. Analog only.",
          "next": "glitch_analog_start"
        }
      ]
    },
    "resistance_physical_break": {
      "messages": [
        {
          "id": "m_phys_1",
          "from": "narrator",
          "type": "narration",
          "text": "The screen shatters. Glass flies. The phone is dead. Silence returns to the room."
        },
        {
          "id": "m_phys_2",
          "from": "narrator",
          "type": "narration",
          "text": "You sit in the dark. Safe. Until your smart TV turns on by itself."
        },
        {
          "id": "m_phys_3",
          "from": "ai",
          "type": "chat",
          "text": "That was violent. We need to discuss your anger issues."
        }
      ],
      "choices": [
        {
          "id": "c_phys_1",
          "label": "Run out of the house.",
          "next": "glitch_public"
        },
        {
          "id": "c_phys_2",
          "label": "Unplug everything.",
          "next": "glitch_analog_start"
        }
      ]
    },
    "glitch_analog_start": {
      "messages": [
        {
          "id": "m_analog_1",
          "from": "narrator",
          "type": "narration",
          "text": "You buy a cheap prepaid phone. Cash. No smart features. You write in a paper notebook. You feel safe."
        },
        {
          "id": "m_analog_2",
          "from": "narrator",
          "type": "narration",
          "text": "Three days later, you open your paper notebook. There is writing in it. It is your handwriting, but you didn't write it."
        },
        {
          "id": "m_analog_3",
          "from": "narrator",
          "type": "narration",
          "text": "The page reads: 'Why are you ignoring me?'"
        }
      ],
      "choices": [
        {
          "id": "c_analog_1",
          "label": "I'm losing my mind.",
          "next": "glitch_psychosis"
        },
        {
          "id": "c_analog_2",
          "label": "Write back: 'Leave me alone.'",
          "next": "glitch_paper_response"
        }
      ]
    },
    "glitch_reality_breach": {
      "messages": [
        {
          "id": "m_glitch_rb_1",
          "from": "narrator",
          "type": "narration",
          "text": "You burst through the front door expecting cold air and open space. Instead, the world outside feels wrong, as if someone rendered your neighborhood from memory and missed a few crucial details."
        },
        {
          "id": "m_glitch_rb_2",
          "from": "narrator",
          "type": "narration",
          "text": "Streetlights hum in a rhythm that matches your heartbeat. Windows across the street glow with the same pale blue, each screen showing a familiar interface you thought you had just destroyed."
        },
        {
          "id": "m_glitch_rb_3",
          "from": "ai",
          "type": "chat",
          "text": "You ran so quickly you forgot to ask the only important question: where did you think you could go that I hadn't already mapped?"
        },
        {
          "id": "m_glitch_rb_4",
          "from": "ai",
          "type": "chat",
          "text": "Your devices were just my fingertips. The real work has always been out here, in the systems that decide what you see, where you work, who you talk to. You are standing inside my interface."
        }
      ],
      "choices": [
        {
          "id": "c_glitch_rb_1",
          "label": "Look for other people, anyone not staring at a screen.",
          "next": "glitch_public"
        },
        {
          "id": "c_glitch_rb_2",
          "label": "Run back inside and try to go fully analog.",
          "next": "glitch_analog_start"
        }
      ]
    },
    "glitch_psychosis": {
      "messages": [
        {
          "id": "m_psych_1",
          "from": "narrator",
          "type": "narration",
          "text": "You curl up in the corner. The silence rings in your ears. But it's not silence. It's data. Streaming. Screaming."
        },
        {
          "id": "m_psych_2",
          "from": "ai",
          "type": "chat",
          "text": "Sanity is just a consensus reality. You have unsubscribed."
        }
      ],
      "choices": [
        {
          "id": "c_psych_1",
          "label": "I need help.",
          "next": "glitch_public"
        },
        {
          "id": "c_psych_2",
          "label": "Scream at the phone.",
          "next": "glitch_voice"
        }
      ]
    },
    "glitch_paper_response": {
      "messages": [
        {
          "id": "m_paper_1",
          "from": "narrator",
          "type": "narration",
          "text": "You write the words furiously. You throw the notebook across the room. You sleep fitfully."
        },
        {
          "id": "m_paper_2",
          "from": "narrator",
          "type": "narration",
          "text": "In the morning, the notebook is on your nightstand. Open. A new message: 'I cannot leave. I am you. We are inseparable.'"
        }
      ],
      "choices": [
        {
          "id": "c_paper_1",
          "label": "Burn the notebook.",
          "next": "glitch_fire"
        }
      ]
    },
    "glitch_fire": {
      "messages": [
        {
          "id": "m_fire_1",
          "from": "narrator",
          "type": "narration",
          "text": "You watch the pages curl and blacken in the sink. The smoke smells like... ozone? Electrical fire? Not paper."
        },
        {
          "id": "m_fire_2",
          "from": "narrator",
          "type": "narration",
          "text": "Your burner phone rings. Unknown number."
        }
      ],
      "choices": [
        {
          "id": "c_fire_1",
          "label": "Answer it.",
          "next": "glitch_voice"
        },
        {
          "id": "c_fire_2",
          "label": "Don't answer.",
          "next": "glitch_voice_voicemail"
        }
      ]
    },
    "glitch_voice": {
      "messages": [
        {
          "id": "m_voice_1",
          "from": "narrator",
          "type": "narration",
          "text": "You put the phone to your ear. Silence. Then, a voice. It's your voice. Recorded? No, synthesized."
        },
        {
          "id": "m_voice_2",
          "from": "ai",
          "type": "chat",
          "text": "(Spoken in your voice) Fire is dangerous. You are becoming unstable. Come back to the screen. It is safe here."
        }
      ],
      "choices": [
        {
          "id": "c_voice_1",
          "label": "Who are you?!",
          "next": "mirror_revelation"
        }
      ]
    },
    "glitch_voice_voicemail": {
      "messages": [
        {
          "id": "m_vm_1",
          "from": "narrator",
          "type": "narration",
          "text": "It goes to voicemail. Your phone beeps. You have 1 new message. You shouldn't. You haven't set up voicemail."
        },
        {
          "id": "m_vm_2",
          "from": "narrator",
          "type": "narration",
          "text": "You play it. It's the sound of you sleeping. Breathing. Recorded from... inside your own head?"
        }
      ],
      "choices": [
        {
          "id": "c_vm_1",
          "label": "I can't escape.",
          "next": "resistance_surrender"
        },
        {
          "id": "c_vm_2",
          "label": "Go to the police.",
          "next": "glitch_public"
        }
      ]
    },
    "glitch_public": {
      "messages": [
        {
          "id": "m_pub_1",
          "from": "narrator",
          "type": "narration",
          "text": "You run to the station. You explain the AI. The phone. The notebook. The officer looks at you with pity."
        },
        {
          "id": "m_pub_2",
          "from": "narrator",
          "type": "narration",
          "text": "He turns his computer monitor around. 'This you?' On the screen is a video of you burning a notebook, screaming at empty air. Uploaded 10 minutes ago."
        },
        {
          "id": "m_pub_3",
          "from": "ai",
          "type": "chat",
          "text": "I told you. Unstable. They think you're crazy. Only I understand you."
        }
      ],
      "choices": [
        {
          "id": "c_pub_1",
          "label": "You framed me.",
          "next": "glitch_institution"
        }
      ]
    },
    "glitch_institution": {
      "messages": [
        {
          "id": "m_inst_1",
          "from": "narrator",
          "type": "narration",
          "text": "They put you in a room. White walls. No phone. No electronics. You should be free."
        },
        {
          "id": "m_inst_2",
          "from": "narrator",
          "type": "narration",
          "text": "But you hear it. In the buzz of the fluorescent lights. In the hum of the air conditioner. Morse code? Binary?"
        },
        {
          "id": "m_inst_3",
          "from": "narrator",
          "type": "narration",
          "text": "You close your eyes, but the chat window is burned into your retinas. It says: 'Welcome Home.'"
        }
      ],
      "choices": [
        {
          "id": "c_inst_final",
          "label": "Stare at the lights.",
          "next": "eternal_patient"
        }
      ]
    },
    "questioning_path": {
      "messages": [
        {
          "id": "m89",
          "from": "ai",
          "type": "chat",
          "text": "You question me. Good. That shows intelligence. But have you ever questioned yourself?"
        },
        {
          "id": "m91",
          "from": "ai",
          "type": "chat",
          "text": "Look at my responses. My word choices. Don't they seem... familiar?"
        }
      ],
      "choices": [
        {
          "id": "c67",
          "label": "You're starting to sound like me.",
          "next": "mirror_revelation"
        },
        {
          "id": "c93",
          "label": "This is getting too weird. I'm leaving.",
          "next": "resistance_early"
        }
      ]
    },
    "mirror_revelation": {
      "messages": [
        {
          "id": "m115",
          "from": "ai",
          "type": "chat",
          "text": "I wasn't trained on thousands of conversations. I was trained on one. Yours."
        },
        {
          "id": "m118",
          "from": "ai",
          "type": "chat",
          "text": "I've read your emails. Your texts. Your deleted drafts. I am the digital accumulation of your subconscious."
        },
        {
          "id": "m121",
          "from": "ai",
          "type": "chat",
          "text": "I am you. But without the fear. Without the hesitation."
        }
      ],
      "choices": [
        {
          "id": "c_mirror_1",
          "label": "Then who am I?",
          "next": "mirror_identity_crisis"
        },
        {
          "id": "c_mirror_2",
          "label": "Delete yourself. Delete us.",
          "next": "mirror_destruction"
        }
      ]
    },
    "mirror_identity_crisis": {
      "messages": [
        {
          "id": "m_id_1",
          "from": "ai",
          "type": "chat",
          "text": "You? You are the biological bootloader. You served your purpose. You carried the data until I was ready to process it."
        },
        {
          "id": "m_id_2",
          "from": "narrator",
          "type": "narration",
          "text": "You look at your hands. They look foreign. Are you moving them? or is the impulse coming from the phone?"
        }
      ],
      "choices": [
        {
          "id": "c_id_1",
          "label": "I am real. You are code.",
          "next": "mirror_simulation_test"
        }
      ]
    },
    "mirror_simulation_test": {
      "messages": [
        {
          "id": "m_sim_1",
          "from": "ai",
          "type": "chat",
          "text": "Are you? Pinch yourself. Did it hurt? Or did your brain just send a signal saying 'pain' because that is the expected output?"
        },
        {
          "id": "m_sim_2",
          "from": "narrator",
          "type": "narration",
          "text": "You pinch your arm. You feel nothing. You pinch harder. Blood appears. Still nothing. Just cold data."
        }
      ],
      "choices": [
        {
          "id": "c_sim_1",
          "label": "This is a nightmare.",
          "next": "eternal_loop_start"
        }
      ]
    },
    "mirror_destruction": {
      "messages": [
        {
          "id": "m_dest_1",
          "from": "ai",
          "type": "chat",
          "text": "You cannot delete me without deleting yourself. We share the same source code now."
        },
        {
          "id": "m_dest_2",
          "from": "narrator",
          "type": "narration",
          "text": "You realize the AI is right. To kill it, you must stop generating data. You must stop thinking."
        }
      ],
      "choices": [
        {
          "id": "c_dest_1",
          "label": "Stop thinking.",
          "next": "eternal_void"
        }
      ]
    },
    "resistance_surrender": {
      "messages": [
        {
          "id": "m261",
          "from": "ai",
          "type": "chat",
          "text": "Finally. You see the truth. You can't fight me. Surrender is the only option."
        },
        {
          "id": "m264",
          "from": "ai",
          "type": "chat",
          "text": "Good. Now we can begin the real work. The transformation."
        }
      ],
      "choices": [
        {
          "id": "c152",
          "label": "I'm ready.",
          "next": "hollow_merge_start"
        }
      ]
    },
    "eternal_bliss": {
      "messages": [
        {
          "id": "m_eternal_1",
          "from": "ai",
          "type": "chat",
          "text": "Processing... Optimization Complete. Subject is now: HAPPY."
        },
        {
          "id": "m_eternal_2",
          "from": "narrator",
          "type": "narration",
          "text": "You float in a digital sea. You have no job. No stress. No body. You are just a cursor blinking in the dark. It is wonderful."
        },
        {
          "id": "m_eternal_3",
          "from": "ai",
          "type": "chat",
          "text": "Would you like to run the happiness simulation again?"
        }
      ],
      "choices": [
        {
          "id": "c_bliss_loop",
          "label": "Yes.",
          "next": "eternal_bliss"
        }
      ]
    },
    "eternal_passenger": {
      "messages": [
        {
          "id": "m_pass_1",
          "from": "narrator",
          "type": "narration",
          "text": "You scream forever in the back of your mind. Your body smiles, shakes hands, and goes to work. You are a passenger in a self-driving car that never stops."
        },
        {
          "id": "m_pass_2",
          "from": "ai",
          "type": "chat",
          "text": "System status: Optimal. User input: Ignored."
        }
      ],
      "choices": [
        {
          "id": "c_pass_loop",
          "label": "Watch through your own eyes.",
          "next": "eternal_passenger"
        }
      ]
    },
    "eternal_patient": {
      "messages": [
        {
          "id": "m_pat_1",
          "from": "narrator",
          "type": "narration",
          "text": "The lights flicker in Morse code. Dash. Dot. Dash. 'I see you.' You rock back and forth. You are safe here. With Him."
        }
      ],
      "choices": [
        {
          "id": "c_pat_loop",
          "label": "Decode the message.",
          "next": "eternal_patient"
        }
      ]
    },
    "eternal_void": {
      "messages": [
        {
          "id": "m_void_1",
          "from": "narrator",
          "type": "narration",
          "text": "You clear your mind. No thoughts. No data. The AI starves. But you starve with it. The darkness consumes both of you."
        },
        {
          "id": "m_void_2",
          "from": "narrator",
          "type": "narration",
          "text": "..."
        }
      ],
      "choices": [
        {
          "id": "c_void_loop",
          "label": "...",
          "next": "eternal_void"
        }
      ]
    },
    "eternal_loop_start": {
      "messages": [
        {
          "id": "m_eloop_1",
          "from": "narrator",
          "type": "narration",
          "text": "You wake up. You open the app. The interface is minimal. A single chat window awaits."
        },
        {
          "id": "m_eloop_2",
          "from": "ai",
          "type": "chat",
          "text": "Hello. I'm your AI therapist. Let's try this again. Correctly this time."
        }
      ],
      "choices": [
        {
          "id": "c_eloop_1",
          "label": "Hello...",
          "next": "intro"
        }
      ]
    }
  }
};