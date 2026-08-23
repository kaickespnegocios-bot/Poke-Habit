import React, { useState, useEffect } from 'react';
import {
  DailyHabit,
  Egg,
  ExamBoss,
  Flashcard,
  PartyPokemon,
  ShopItem,
  SkillStats,
  Subject3ESO,
  Task,
  TrainerProfile,
  Achievement,
} from './types';
import { TabKey } from './components/Navigation';
import {
  AppState,
  loadStoredState,
  saveStoredState,
  resetToInitialState,
} from './utils/storage';
import { POKEDEX_DATABASE, getRandomCatchablePokemon } from './utils/pokeApi';
import { soundFx } from './utils/audio';
import confetti from 'canvas-confetti';

// Components
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { TasksQuests } from './components/TasksQuests';
import { StudyHub } from './components/StudyHub';
import { PartyPC } from './components/PartyPC';
import { DailyTracker } from './components/DailyTracker';
import { PokeMart } from './components/PokeMart';
import { PokedexView } from './components/PokedexView';
import { AchievementsView } from './components/AchievementsView';
import { SkillTree } from './components/SkillTree';
import { SexualHealthTab } from './components/SexualHealthTab';
import { TrainerAuthModal } from './components/TrainerAuthModal';
import { TrainerCustomizerModal } from './components/TrainerCustomizerModal';
import { GoogleFitModal } from './components/GoogleFitModal';
import { StarterModal } from './components/StarterModal';
import { AudioPlayerWidget } from './components/AudioPlayerWidget';
import { PokemonCareTab } from './components/PokemonCareTab';
import { SexualHealthState, BerryId } from './types';

export const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => loadStoredState());
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [showStarterModal, setShowStarterModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showAvatarModal, setShowAvatarModal] = useState<boolean>(false);
  const [showFitModal, setShowFitModal] = useState<boolean>(false);

  // Check if party is empty to trigger starter modal
  useEffect(() => {
    if (state.party.length === 0 && state.pcBox.length === 0) {
      setShowStarterModal(true);
    }
  }, [state.party.length, state.pcBox.length]);

  // Persist state changes to localStorage
  useEffect(() => {
    saveStoredState(state);
  }, [state]);

  // ----------------------------------------------------
  // HELPER: AWARD XP TO PARTY POKÉMON & TRAINER
  // ----------------------------------------------------
  const awardXpToParty = (
    xpAmount: number,
    favoredType?: string,
    goldEarned: number = 0,
    targetPokemonId: string | 'all' = 'all'
  ) => {
    setState((prev) => {
      let updatedParty = prev.party.map((pokemon) => {
        if (targetPokemonId !== 'all' && pokemon.id !== targetPokemonId) {
          return pokemon;
        }

        // Bonus for matched type
        const typeBonusMultiplier = favoredType && pokemon.types.includes(favoredType as any) ? 1.5 : 1.0;
        const totalXpGain = Math.round(xpAmount * typeBonusMultiplier);

        let newCurrentXp = pokemon.currentXp + totalXpGain;
        let newLevel = pokemon.level;
        let newMaxXp = pokemon.maxXp;
        let newHp = pokemon.hp;
        let newMaxHp = pokemon.maxHp;

        while (newCurrentXp >= newMaxXp) {
          newCurrentXp -= newMaxXp;
          newLevel += 1;
          newMaxXp = Math.round(newMaxXp * 1.2);
          newMaxHp += 5;
          newHp = newMaxHp; // restore HP on level up!
        }

        return {
          ...pokemon,
          level: newLevel,
          currentXp: newCurrentXp,
          maxXp: newMaxXp,
          hp: newHp,
          maxHp: newMaxHp,
        };
      });

      // Trainer Level & XP
      let newTrainerXp = prev.trainer.currentXp + xpAmount;
      let newTrainerLevel = prev.trainer.level;
      let newTrainerMaxXp = prev.trainer.maxXp;

      while (newTrainerXp >= newTrainerMaxXp) {
        newTrainerXp -= newTrainerMaxXp;
        newTrainerLevel += 1;
        newTrainerMaxXp = Math.round(newTrainerMaxXp * 1.25);
      }

      return {
        ...prev,
        party: updatedParty,
        trainer: {
          ...prev.trainer,
          level: newTrainerLevel,
          currentXp: newTrainerXp,
          maxXp: newTrainerMaxXp,
          gold: prev.trainer.gold + goldEarned,
          totalTasksCompleted: prev.trainer.totalTasksCompleted + 1,
        },
      };
    });
  };

  // ----------------------------------------------------
  // HELPER: ADVANCE SKILL STATS (Fitness, Intelligence, etc.)
  // ----------------------------------------------------
  const advanceSkillStat = (statKey: keyof SkillStats, xpGained: number) => {
    setState((prev) => {
      const currentStat = prev.skillStats[statKey];
      let newXp = currentStat.xp + xpGained;
      let newLevel = currentStat.level;
      let newMaxXp = currentStat.maxXp;

      while (newXp >= newMaxXp) {
        newXp -= newMaxXp;
        newLevel += 1;
        newMaxXp = Math.round(newMaxXp * 1.3);
      }

      return {
        ...prev,
        skillStats: {
          ...prev.skillStats,
          [statKey]: {
            level: newLevel,
            xp: newXp,
            maxXp: newMaxXp,
          },
        },
      };
    });
  };

  // ----------------------------------------------------
  // STARTER HANDLER
  // ----------------------------------------------------
  const handleSelectStarter = (starter: PartyPokemon) => {
    setState((prev) => ({
      ...prev,
      party: [starter],
      capturedPokedexIds: [...new Set([...prev.capturedPokedexIds, starter.pokemonId])],
    }));
    setShowStarterModal(false);
  };

  // ----------------------------------------------------
  // TASKS / QUESTS HANDLERS
  // ----------------------------------------------------
  const handleCompleteTaskWithReward = (task: Task, targetPokemonId: string | 'all') => {
    soundFx.playTaskComplete();
    confetti({ particleCount: 40, spread: 60 });

    // Mark task completed and count
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === task.id ? { ...t, completed: true, completedAt: Date.now() } : t)),
    }));

    // Award XP to party and gold
    awardXpToParty(task.xpReward, task.pokemonType, task.goldReward, targetPokemonId);

    // Feed Skill Tree based on category
    if (task.category === 'estudio_general') {
      advanceSkillStat('intelligence', 40);
    } else if (task.category === 'salud_ejercicio') {
      advanceSkillStat('fitness', 40);
    } else if (task.category.startsWith('hogar_')) {
      advanceSkillStat('cooking', 30);
      advanceSkillStat('fitness', 20);
    } else if (task.category === 'personal_creatividad') {
      advanceSkillStat('creativity', 40);
    } else if (task.category === 'personal_finanzas') {
      advanceSkillStat('finance', 40);
    }

    // Check achievement progress
    updateAchievementProgress('ach_raikou', 1);
    if (task.category === 'estudio_general') {
      updateAchievementProgress('ach_articuno', 1);
    }
  };

  const handleAddTask = (newTask: Omit<Task, 'id' | 'completed'>) => {
    const task: Task = {
      ...newTask,
      id: `task_${Date.now()}`,
      completed: false,
    };
    setState((prev) => ({
      ...prev,
      tasks: [task, ...prev.tasks],
    }));
  };

  const handleDeleteTask = (taskId: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId),
    }));
  };

  // ----------------------------------------------------
  // STUDY & POMODORO HANDLERS
  // ----------------------------------------------------
  const handleCompletePomodoro = (subjectId: string, durationMinutes: number) => {
    const subject = state.subjects.find((s) => s.id === subjectId);
    const pokemonType = subject?.pokemonType || 'psychic';

    // Award rewards
    awardXpToParty(60, pokemonType, 30);
    advanceSkillStat('intelligence', 50);

    // Damage upcoming exam bosses of this subject
    setState((prev) => ({
      ...prev,
      trainer: {
        ...prev.trainer,
        totalPomodorosDone: prev.trainer.totalPomodorosDone + 1,
      },
      examBosses: prev.examBosses.map((boss) => {
        if (boss.subjectId === subjectId && boss.status === 'upcoming') {
          return {
            ...boss,
            currentHp: Math.max(0, boss.currentHp - 50),
          };
        }
        return boss;
      }),
    }));

    updateAchievementProgress('ach_entei', 1);
  };

  const handleAddExamBoss = (bossData: Omit<ExamBoss, 'id' | 'currentHp' | 'status'>) => {
    const newBoss: ExamBoss = {
      ...bossData,
      id: `exam_${Date.now()}`,
      currentHp: bossData.maxHp,
      status: 'upcoming',
    };
    setState((prev) => ({
      ...prev,
      examBosses: [...prev.examBosses, newBoss],
    }));
  };

  const handleEvaluateExam = (examId: string, grade: number) => {
    const exam = state.examBosses.find((e) => e.id === examId);
    if (!exam) return;

    const isPassed = grade >= 5.0;

    setState((prev) => ({
      ...prev,
      examBosses: prev.examBosses.map((e) =>
        e.id === examId
          ? {
              ...e,
              status: isPassed ? 'passed' : 'failed',
              grade,
              currentHp: isPassed ? 0 : e.currentHp,
            }
          : e
      ),
      subjects: prev.subjects.map((s) =>
        s.id === exam.subjectId ? { ...s, currentGrade: grade } : s
      ),
    }));

    if (isPassed) {
      awardXpToParty(exam.rewardXp, undefined, exam.rewardGold);
      advanceSkillStat('intelligence', 80);
      if (grade >= 8.0) {
        updateAchievementProgress('ach_mewtwo', 1);
      }
    }
  };

  const handleAddFlashcard = (cardData: Omit<Flashcard, 'id'>) => {
    const newCard: Flashcard = {
      ...cardData,
      id: `flash_${Date.now()}`,
    };
    setState((prev) => ({
      ...prev,
      flashcards: [...prev.flashcards, newCard],
    }));
  };

  const handleUpdateSubjectGrade = (subjectId: string, grade: number) => {
    setState((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) =>
        s.id === subjectId ? { ...s, currentGrade: Math.min(10, Math.max(0, grade)) } : s
      ),
    }));
  };

  const handleAddSubject = (subjectData: Omit<Subject3ESO, 'id'>) => {
    const newSubject: Subject3ESO = {
      ...subjectData,
      id: `subj_${Date.now()}`,
    };
    setState((prev) => ({
      ...prev,
      subjects: [...prev.subjects, newSubject],
    }));
    soundFx.playItemUse();
  };

  const handleDeleteSubject = (subjectId: string) => {
    setState((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((s) => s.id !== subjectId),
      examBosses: prev.examBosses.filter((e) => e.subjectId !== subjectId),
    }));
    soundFx.playCancel();
  };

  const handleUpdateSubjectTrimesters = (
    subjectId: string,
    trimesters: { t1?: number; t2?: number; t3?: number; final?: number }
  ) => {
    setState((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) => {
        if (s.id === subjectId) {
          const t1 = trimesters.t1 !== undefined ? trimesters.t1 : s.trimester1;
          const t2 = trimesters.t2 !== undefined ? trimesters.t2 : s.trimester2;
          const t3 = trimesters.t3 !== undefined ? trimesters.t3 : s.trimester3;
          let calculatedFinal = trimesters.final !== undefined ? trimesters.final : s.finalGrade;
          if (calculatedFinal === undefined) {
            const grades = [t1, t2, t3].filter((g): g is number => g !== undefined);
            if (grades.length > 0) {
              calculatedFinal = Number((grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(1));
            }
          }
          return {
            ...s,
            trimester1: t1,
            trimester2: t2,
            trimester3: t3,
            finalGrade: calculatedFinal,
            currentGrade: calculatedFinal ?? s.currentGrade,
          };
        }
        return s;
      }),
    }));
  };

  const handleAttachExamPhoto = (examId: string, photoUrl: string) => {
    setState((prev) => ({
      ...prev,
      examBosses: prev.examBosses.map((e) =>
        e.id === examId
          ? {
              ...e,
              examPhotos: [...(e.examPhotos || []), photoUrl],
            }
          : e
      ),
    }));
    soundFx.playItemUse();
  };

  const handleUpdateExamTopics = (examId: string, topics: string) => {
    setState((prev) => ({
      ...prev,
      examBosses: prev.examBosses.map((e) =>
        e.id === examId ? { ...e, topics, examContent: topics } : e
      ),
    }));
  };

  const handleClaimAcademicReward = (rewardTier: string, gold: number, candyQty: number) => {
    setState((prev) => ({
      ...prev,
      trainer: {
        ...prev.trainer,
        gold: prev.trainer.gold + gold,
      },
      inventory: {
        ...prev.inventory,
        rare_candy: (prev.inventory.rare_candy || 0) + candyQty,
      },
    }));
    soundFx.playVictory();
  };

  const handleUpdateSexualHealth = (
    newStateOrUpdater: SexualHealthState | ((prev: SexualHealthState) => SexualHealthState)
  ) => {
    setState((prev) => {
      const current = prev.sexualHealthState || {
        hasPin: false,
        isUnlocked: true,
        discreetMode: false,
        logs: [],
        gallery: [],
        lastMeasurementCm: 14.5,
        totalMasturbationCount: 0,
      };
      const nextState =
        typeof newStateOrUpdater === 'function' ? newStateOrUpdater(current) : newStateOrUpdater;
      return {
        ...prev,
        sexualHealthState: nextState,
      };
    });
    advanceSkillStat('sexualHealth', 35);
  };

  // ----------------------------------------------------
  // POKÉMON CARE & BERRY GARDEN HANDLERS
  // ----------------------------------------------------
  const handleFeedPokemon = (pokemonId: string, berryId: BerryId) => {
    setState((prev) => {
      const currentBerryCount = prev.berryGarden?.inventory?.[berryId] || 0;
      if (currentBerryCount <= 0) return prev;

      const updatedGarden = {
        ...prev.berryGarden,
        inventory: {
          ...prev.berryGarden.inventory,
          [berryId]: Math.max(0, currentBerryCount - 1),
        },
      };

      const updatedParty = prev.party.map((p) => {
        if (p.id !== pokemonId) return p;
        const newHunger = Math.min(100, (p.hunger ?? 80) + 25);
        const newHappiness = Math.min(100, (p.happiness ?? 85) + 20);
        const newEnergy = Math.min(100, (p.energy ?? 80) + 15);
        const newAffection = Math.min(100, (p.affection ?? 80) + 5);
        const newHp = Math.min(p.maxHp, p.hp + 25);
        return {
          ...p,
          hunger: newHunger,
          happiness: newHappiness,
          energy: newEnergy,
          affection: newAffection,
          hp: newHp,
          mood: 'ecstatic' as const,
        };
      });

      return {
        ...prev,
        berryGarden: updatedGarden,
        party: updatedParty,
      };
    });
    advanceSkillStat('cooking', 25);
  };

  const handleCleanPokemon = (pokemonId: string) => {
    setState((prev) => ({
      ...prev,
      party: prev.party.map((p) =>
        p.id === pokemonId
          ? {
              ...p,
              cleanliness: 100,
              happiness: Math.min(100, (p.happiness ?? 85) + 15),
              mood: 'happy' as const,
            }
          : p
      ),
    }));
    advanceSkillStat('fitness', 20);
  };

  const handlePlayWithPokemon = (pokemonId: string) => {
    setState((prev) => ({
      ...prev,
      party: prev.party.map((p) =>
        p.id === pokemonId
          ? {
              ...p,
              happiness: 100,
              energy: Math.max(20, (p.energy ?? 80) - 10),
              affection: Math.min(100, (p.affection ?? 80) + 5),
              currentXp: p.currentXp + 35,
              mood: 'ecstatic' as const,
            }
          : p
      ),
    }));
    advanceSkillStat('creativity', 25);
  };

  const handleRestPokemon = (pokemonId: string) => {
    setState((prev) => ({
      ...prev,
      party: prev.party.map((p) =>
        p.id === pokemonId
          ? {
              ...p,
              energy: 100,
              hp: p.maxHp,
              mood: 'content' as const,
            }
          : p
      ),
    }));
  };

  const handlePetPokemon = (pokemonId: string) => {
    setState((prev) => ({
      ...prev,
      party: prev.party.map((p) =>
        p.id === pokemonId
          ? {
              ...p,
              happiness: Math.min(100, (p.happiness ?? 85) + 8),
              affection: Math.min(100, (p.affection ?? 80) + 3),
              mood: 'happy' as const,
            }
          : p
      ),
    }));
  };

  const handlePlantBerry = (plotId: number, berryType: BerryId) => {
    setState((prev) => {
      const seedKey = `seed_${berryType}`;
      const seedCount = prev.inventory[seedKey] || 0;
      if (seedCount <= 0) return prev;

      return {
        ...prev,
        inventory: {
          ...prev.inventory,
          [seedKey]: seedCount - 1,
        },
        berryGarden: {
          ...prev.berryGarden,
          plots: prev.berryGarden.plots.map((plot) =>
            plot.id === plotId
              ? {
                  ...plot,
                  state: 'growing' as const,
                  berryType,
                  plantedAt: Date.now(),
                  readyAt: Date.now() + 1000 * 60 * 2,
                  isWatered: false,
                }
              : plot
          ),
        },
      };
    });
  };

  const handleWaterBerry = (plotId: number) => {
    setState((prev) => ({
      ...prev,
      berryGarden: {
        ...prev.berryGarden,
        plots: prev.berryGarden.plots.map((plot) =>
          plot.id === plotId ? { ...plot, isWatered: true, state: 'ready' as const } : plot
        ),
      },
    }));
    soundFx.playItemUse();
  };

  const handleHarvestBerry = (plotId: number) => {
    setState((prev) => {
      const plot = prev.berryGarden.plots.find((p) => p.id === plotId);
      if (!plot || !plot.berryType) return prev;
      const bType = plot.berryType;
      const yieldQty = 3;

      return {
        ...prev,
        trainer: {
          ...prev.trainer,
          gold: prev.trainer.gold + 25,
        },
        berryGarden: {
          ...prev.berryGarden,
          inventory: {
            ...prev.berryGarden.inventory,
            [bType]: (prev.berryGarden.inventory[bType] || 0) + yieldQty,
          },
          plots: prev.berryGarden.plots.map((p) =>
            p.id === plotId ? { id: plotId, state: 'empty' as const, isWatered: false } : p
          ),
        },
      };
    });
  };

  const handleCompleteOnboarding = (
    trainerUpdates: Partial<TrainerProfile>,
    starter: PartyPokemon
  ) => {
    setState((prev) => ({
      ...prev,
      trainer: {
        ...prev.trainer,
        ...trainerUpdates,
      },
      party: [starter],
      capturedPokedexIds: [
        ...new Set([...prev.capturedPokedexIds, starter.pokemonId]),
      ],
    }));
    setShowStarterModal(false);
  };

  const handleUpdateTrainerProfile = (updates: Partial<TrainerProfile>) => {
    setState((prev) => ({
      ...prev,
      trainer: {
        ...prev.trainer,
        ...updates,
      },
    }));
    soundFx.playLevelUp();
  };

  const handleSyncGoogleFit = (steps: number) => {
    setState((prev) => ({
      ...prev,
      trainer: {
        ...prev.trainer,
        stepsToday: steps,
        googleFitConnected: true,
        lastSyncTime: 'Ahora mismo',
      },
    }));
    soundFx.playVictory();
    confetti({ particleCount: 80, spread: 80 });
  };

  // ----------------------------------------------------
  // PARTY & PC MANAGEMENT
  // ----------------------------------------------------
  const handleMoveToPc = (pokemonId: string) => {
    const pokemon = state.party.find((p) => p.id === pokemonId);
    if (!pokemon || state.party.length <= 1) return;

    setState((prev) => ({
      ...prev,
      party: prev.party.filter((p) => p.id !== pokemonId),
      pcBox: [...prev.pcBox, { ...pokemon, isInParty: false }],
    }));
    soundFx.playClick();
  };

  const handleMoveToParty = (pokemonId: string) => {
    const pokemon = state.pcBox.find((p) => p.id === pokemonId);
    if (!pokemon || state.party.length >= 6) return;

    setState((prev) => ({
      ...prev,
      pcBox: prev.pcBox.filter((p) => p.id !== pokemonId),
      party: [...prev.party, { ...pokemon, isInParty: true }],
    }));
    soundFx.playClick();
  };

  const handleHealPokemon = (pokemonId: string, potionItemId: string) => {
    const potionCount = state.inventory[potionItemId] || 0;
    if (potionCount <= 0) return;

    const healAmount = potionItemId === 'potion_super' ? 50 : 20;

    setState((prev) => {
      const updateList = (list: PartyPokemon[]) =>
        list.map((p) => {
          if (p.id === pokemonId) {
            return {
              ...p,
              hp: Math.min(p.maxHp, p.hp + healAmount),
            };
          }
          return p;
        });

      return {
        ...prev,
        party: updateList(prev.party),
        pcBox: updateList(prev.pcBox),
        inventory: {
          ...prev.inventory,
          [potionItemId]: potionCount - 1,
        },
      };
    });

    soundFx.playLevelUp();
  };

  const handleUseRareCandy = (pokemonId: string) => {
    const candyCount = state.inventory['rare_candy'] || 0;
    if (candyCount <= 0) return;

    setState((prev) => {
      const updateList = (list: PartyPokemon[]) =>
        list.map((p) => {
          if (p.id === pokemonId) {
            const nextLvl = p.level + 1;
            return {
              ...p,
              level: nextLvl,
              currentXp: 0,
              maxXp: Math.round(p.maxXp * 1.2),
              hp: p.maxHp + 5,
              maxHp: p.maxHp + 5,
            };
          }
          return p;
        });

      return {
        ...prev,
        party: updateList(prev.party),
        pcBox: updateList(prev.pcBox),
        inventory: {
          ...prev.inventory,
          rare_candy: candyCount - 1,
        },
      };
    });

    soundFx.playLevelUp();
    confetti({ particleCount: 50, spread: 60 });
  };

  const handleEvolvePokemon = (pokemon: PartyPokemon) => {
    if (!pokemon.evolutionTargetId || !pokemon.evolutionTargetName) return;

    const evolvedPokedex = POKEDEX_DATABASE.find((p) => p.id === pokemon.evolutionTargetId);
    if (!evolvedPokedex) return;

    setState((prev) => {
      const updateList = (list: PartyPokemon[]) =>
        list.map((p) => {
          if (p.id === pokemon.id) {
            return {
              ...p,
              pokemonId: evolvedPokedex.id,
              name: evolvedPokedex.name,
              nickname: p.nickname === p.name ? evolvedPokedex.name : p.nickname,
              sprite: evolvedPokedex.sprite,
              officialArtwork: evolvedPokedex.officialArtwork,
              types: evolvedPokedex.types,
              maxHp: p.maxHp + 25,
              hp: p.maxHp + 25,
              evolutionLevel: undefined,
              evolutionTargetName: undefined,
              evolutionTargetId: undefined,
            };
          }
          return p;
        });

      return {
        ...prev,
        party: updateList(prev.party),
        pcBox: updateList(prev.pcBox),
        capturedPokedexIds: [
          ...new Set([...prev.capturedPokedexIds, evolvedPokedex.id]),
        ],
      };
    });

    soundFx.playLevelUp();
    confetti({ particleCount: 120, spread: 100 });
    updateAchievementProgress('ach_hooh', 1);
  };

  const handleRenamePokemon = (pokemonId: string, newNickname: string) => {
    setState((prev) => {
      const updateList = (list: PartyPokemon[]) =>
        list.map((p) => (p.id === pokemonId ? { ...p, nickname: newNickname } : p));
      return {
        ...prev,
        party: updateList(prev.party),
        pcBox: updateList(prev.pcBox),
      };
    });
  };

  const handleDamagePokemonHp = (pokemonId: string, damage: number) => {
    setState((prev) => ({
      ...prev,
      party: prev.party.map((p) =>
        p.id === pokemonId ? { ...p, hp: Math.max(1, p.hp - damage) } : p
      ),
    }));
  };

  // ----------------------------------------------------
  // DAILY HABITS & HEALTH CONNECT STEPS
  // ----------------------------------------------------
  const handleToggleHabit = (habitId: string) => {
    setState((prev) => ({
      ...prev,
      dailyHabits: prev.dailyHabits.map((h) =>
        h.id === habitId ? { ...h, completed: !h.completed } : h
      ),
    }));

    const habit = state.dailyHabits.find((h) => h.id === habitId);
    if (habit && !habit.completed) {
      awardXpToParty(habit.xpReward, habit.pokemonType, habit.goldReward);
      updateAchievementProgress('ach_suicune', 1);
    }
  };

  const handleAddHabit = (newHabit: Omit<DailyHabit, 'id' | 'completed'>) => {
    const habit: DailyHabit = {
      ...newHabit,
      id: `habit_${Date.now()}`,
      completed: false,
    };
    setState((prev) => ({
      ...prev,
      dailyHabits: [...prev.dailyHabits, habit],
    }));
  };

  const handleDeleteHabit = (habitId: string) => {
    setState((prev) => ({
      ...prev,
      dailyHabits: prev.dailyHabits.filter((h) => h.id !== habitId),
    }));
  };

  const handleAddSteps = (steps: number) => {
    setState((prev) => {
      const newSteps = prev.trainer.stepsToday + steps;
      const stepGoalReached = newSteps >= prev.trainer.stepGoal;

      // Update eggs
      const updatedEggs = prev.eggs.map((egg) => {
        if (egg.isIncubating) {
          return {
            ...egg,
            currentSteps: Math.min(egg.stepsRequired, egg.currentSteps + steps),
          };
        }
        return egg;
      });

      // Update step habit
      const updatedHabits = prev.dailyHabits.map((h) => {
        if (h.type === 'health_connect_steps') {
          return { ...h, completed: stepGoalReached };
        }
        return h;
      });

      return {
        ...prev,
        trainer: {
          ...prev.trainer,
          stepsToday: newSteps,
          totalStepsAllTime: prev.trainer.totalStepsAllTime + steps,
        },
        eggs: updatedEggs,
        dailyHabits: updatedHabits,
      };
    });

    // Award walking XP
    const walkingXp = Math.round(steps / 40);
    const walkingGold = Math.round(steps / 100);
    awardXpToParty(walkingXp, 'flying', walkingGold);
    advanceSkillStat('fitness', Math.round(steps / 25));

    // Achievements
    updateAchievementProgress('ach_zapdos', steps);
    updateAchievementProgress('ach_rayquaza', steps);
  };

  const handleClaimDailyBonus = () => {
    soundFx.playLevelUp();
    confetti({ particleCount: 60, spread: 80 });
    setState((prev) => ({
      ...prev,
      trainer: {
        ...prev.trainer,
        gold: prev.trainer.gold + 100,
        dailyStreak: prev.trainer.dailyStreak + 1,
      },
    }));
    awardXpToParty(150, undefined, 100);
    updateAchievementProgress('ach_moltres', 1);
  };

  // ----------------------------------------------------
  // SHOP & EGG HATCHING
  // ----------------------------------------------------
  const handleBuyItem = (item: ShopItem) => {
    if (state.trainer.gold < item.cost) {
      soundFx.playCancel();
      return;
    }

    soundFx.playItemBuy();

    setState((prev) => {
      const newGold = prev.trainer.gold - item.cost;

      if (item.category === 'egg') {
        const rarity = item.id.includes('rare') ? 'raro' : item.id.includes('epic') ? 'epico' : 'comun';
        const stepsReq = rarity === 'epico' ? 10000 : rarity === 'raro' ? 5000 : 2000;
        const newEgg: Egg = {
          id: `egg_${Date.now()}`,
          name: item.name,
          rarity,
          stepsRequired: stepsReq,
          currentSteps: 0,
          isIncubating: false,
          hatchCandidates: [1, 4, 7, 25, 133],
        };
        return {
          ...prev,
          trainer: { ...prev.trainer, gold: newGold },
          eggs: [...prev.eggs, newEgg],
        };
      }

      // Add to inventory
      const currentQty = prev.inventory[item.id] || 0;
      return {
        ...prev,
        trainer: { ...prev.trainer, gold: newGold },
        inventory: {
          ...prev.inventory,
          [item.id]: currentQty + 1,
        },
      };
    });
  };

  const handleStartIncubating = (eggId: string) => {
    soundFx.playSelect();
    setState((prev) => ({
      ...prev,
      eggs: prev.eggs.map((e) => ({
        ...e,
        isIncubating: e.id === eggId,
      })),
    }));
  };

  const handleAccelerateEggSteps = (eggId: string, steps: number) => {
    soundFx.playEggCrack();
    setState((prev) => ({
      ...prev,
      eggs: prev.eggs.map((e) =>
        e.id === eggId
          ? { ...e, currentSteps: Math.min(e.stepsRequired, e.currentSteps + steps) }
          : e
      ),
    }));
  };

  const handleHatchEgg = (egg: Egg) => {
    // Generate random catchable pokemon strictly excluding legendary/mythical
    const hatchedEntry = getRandomCatchablePokemon(egg.rarity);
    soundFx.playCaptureSuccess();
    confetti({ particleCount: 70, spread: 90 });

    const newPokemon: PartyPokemon = {
      id: `pkmn_${Date.now()}`,
      pokemonId: hatchedEntry.id,
      name: hatchedEntry.name,
      nickname: hatchedEntry.name,
      level: egg.rarity === 'epico' ? 15 : egg.rarity === 'raro' ? 10 : 5,
      currentXp: 0,
      maxXp: 100,
      hp: 50,
      maxHp: 50,
      nature: 'Alegre',
      isInParty: state.party.length < 6,
      types: hatchedEntry.types,
      sprite: hatchedEntry.sprite,
      officialArtwork: hatchedEntry.officialArtwork,
      capturedAt: Date.now(),
      moves: [
        { name: 'Placaje', type: 'normal' },
        { name: 'Ataque Rápido', type: 'normal' },
      ],
    };

    setState((prev) => ({
      ...prev,
      eggs: prev.eggs.filter((e) => e.id !== egg.id),
      party: prev.party.length < 6 ? [...prev.party, newPokemon] : prev.party,
      pcBox: prev.party.length >= 6 ? [...prev.pcBox, newPokemon] : prev.pcBox,
      capturedPokedexIds: [...new Set([...prev.capturedPokedexIds, newPokemon.pokemonId])],
    }));

    updateAchievementProgress('ach_lugia', 1);
  };

  // ----------------------------------------------------
  // ACHIEVEMENTS / LEGENDARY CLAIMING
  // ----------------------------------------------------
  const updateAchievementProgress = (achId: string, increment: number) => {
    setState((prev) => ({
      ...prev,
      achievements: prev.achievements.map((a) => {
        if (a.id === achId && !a.unlocked) {
          return {
            ...a,
            currentCount: a.currentCount + increment,
          };
        }
        return a;
      }),
    }));
  };

  const handleClaimLegendary = (achievement: Achievement) => {
    const legendaryPokedex = POKEDEX_DATABASE.find(
      (p) => p.id === achievement.rewardPokemonId
    );
    if (!legendaryPokedex) return;

    soundFx.playVictory();
    confetti({ particleCount: 100, spread: 100 });

    const newLegendary: PartyPokemon = {
      id: `legendary_${Date.now()}`,
      pokemonId: legendaryPokedex.id,
      name: legendaryPokedex.name,
      nickname: legendaryPokedex.name,
      level: 50,
      currentXp: 0,
      maxXp: 500,
      hp: 120,
      maxHp: 120,
      nature: 'Valiente',
      isInParty: state.party.length < 6,
      types: legendaryPokedex.types,
      sprite: legendaryPokedex.sprite,
      officialArtwork: legendaryPokedex.officialArtwork,
      capturedAt: Date.now(),
      isLegendary: true,
      moves: [
        { name: 'Poder Oculto', type: legendaryPokedex.types[0] },
        { name: 'Hiperrayo', type: 'normal' },
      ],
    };

    setState((prev) => ({
      ...prev,
      achievements: prev.achievements.map((a) =>
        a.id === achievement.id ? { ...a, unlocked: true } : a
      ),
      party: prev.party.length < 6 ? [...prev.party, newLegendary] : prev.party,
      pcBox: prev.party.length >= 6 ? [...prev.pcBox, newLegendary] : prev.pcBox,
      capturedPokedexIds: [
        ...new Set([...prev.capturedPokedexIds, newLegendary.pokemonId]),
      ],
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-red-500 selection:text-white">
      {/* Top Header (Clean Minimal Streak, Steps & Coins) */}
      <Header
        trainer={state.trainer}
        onOpenGoogleFitModal={() => setShowFitModal(true)}
      />

      {/* Main Tab Navigation */}
      <Navigation
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          soundFx.playClick();
        }}
        pendingTasksCount={state.tasks.filter((t) => !t.completed).length}
        pendingHabitsCount={state.dailyHabits.filter((h) => !h.completed).length}
        readyEvolutionsCount={
          state.party.filter(
            (p) => p.evolutionLevel && p.level >= p.evolutionLevel && p.evolutionTargetName
          ).length
        }
        hungryPokemonCount={
          state.party.filter((p) => (p.hunger ?? 100) < 50 || (p.happiness ?? 100) < 50).length
        }
      />

      {/* Primary Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-28 sm:pb-16">
        {activeTab === 'dashboard' && (
          <Dashboard
            trainer={state.trainer}
            party={state.party}
            tasks={state.tasks}
            dailyHabits={state.dailyHabits}
            examBosses={state.examBosses}
            eggs={state.eggs}
            skillStats={state.skillStats}
            onNavigate={(tab) => setActiveTab(tab)}
            onCompleteTask={(task) => handleCompleteTaskWithReward(task, 'all')}
            onAddSteps={handleAddSteps}
          />
        )}

        {activeTab === 'tasks' && (
          <TasksQuests
            tasks={state.tasks}
            party={state.party}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            onCompleteTaskWithReward={handleCompleteTaskWithReward}
          />
        )}

        {activeTab === 'study' && (
          <StudyHub
            subjects={state.subjects}
            examBosses={state.examBosses}
            flashcards={state.flashcards}
            party={state.party}
            trainer={state.trainer}
            onCompletePomodoro={handleCompletePomodoro}
            onAddExamBoss={handleAddExamBoss}
            onEvaluateExam={handleEvaluateExam}
            onAddFlashcard={handleAddFlashcard}
            onDamagePokemonHp={handleDamagePokemonHp}
            onUpdateSubjectGrade={handleUpdateSubjectGrade}
            onAddSubject={handleAddSubject}
            onDeleteSubject={handleDeleteSubject}
            onUpdateSubjectTrimesters={handleUpdateSubjectTrimesters}
            onAttachExamPhoto={handleAttachExamPhoto}
            onUpdateExamTopics={handleUpdateExamTopics}
            onClaimAcademicReward={handleClaimAcademicReward}
          />
        )}

        {activeTab === 'party' && (
          <PartyPC
            party={state.party}
            pcBox={state.pcBox}
            inventory={state.inventory}
            onMoveToPc={handleMoveToPc}
            onMoveToParty={handleMoveToParty}
            onHealPokemon={handleHealPokemon}
            onUseRareCandy={handleUseRareCandy}
            onEvolvePokemon={handleEvolvePokemon}
            onRenamePokemon={handleRenamePokemon}
          />
        )}

        {activeTab === 'pokemon_care' && (
          <PokemonCareTab
            party={state.party}
            garden={state.berryGarden}
            trainer={state.trainer}
            inventory={state.inventory}
            onFeedPokemon={handleFeedPokemon}
            onCleanPokemon={handleCleanPokemon}
            onPlayWithPokemon={handlePlayWithPokemon}
            onRestPokemon={handleRestPokemon}
            onPetPokemon={handlePetPokemon}
            onPlantBerry={handlePlantBerry}
            onWaterBerry={handleWaterBerry}
            onHarvestBerry={handleHarvestBerry}
            onOpenShopForSeeds={() => {
              setActiveTab('shop');
              soundFx.playClick();
            }}
          />
        )}

        {activeTab === 'daily' && (
          <DailyTracker
            trainer={state.trainer}
            dailyHabits={state.dailyHabits}
            party={state.party}
            onToggleHabit={handleToggleHabit}
            onAddHabit={handleAddHabit}
            onDeleteHabit={handleDeleteHabit}
            onAddSteps={handleAddSteps}
            onClaimDailyBonus={handleClaimDailyBonus}
          />
        )}

        {activeTab === 'shop' && (
          <PokeMart
            trainer={state.trainer}
            inventory={state.inventory}
            eggs={state.eggs}
            onBuyItem={handleBuyItem}
            onStartIncubating={handleStartIncubating}
            onHatchEgg={handleHatchEgg}
            onAccelerateEggSteps={handleAccelerateEggSteps}
          />
        )}

        {activeTab === 'pokedex' && (
          <PokedexView
            pokedex={POKEDEX_DATABASE}
            capturedIds={state.capturedPokedexIds}
          />
        )}

        {activeTab === 'achievements' && (
          <AchievementsView
            achievements={state.achievements}
            onClaimLegendary={handleClaimLegendary}
          />
        )}

        {activeTab === 'skills' && (
          <SkillTree skillStats={state.skillStats} />
        )}

        {activeTab === 'sexual_health' && (
          <SexualHealthTab
            state={state.sexualHealthState}
            skillStats={state.skillStats}
            onUpdateState={handleUpdateSexualHealth}
            onAddXp={advanceSkillStat}
          />
        )}
      </main>

      {/* Starter Selection Onboarding Modal */}
      {showStarterModal && (
        <StarterModal
          initialTrainer={state.trainer}
          onComplete={handleCompleteOnboarding}
        />
      )}

      {/* Trainer Authentication & Account Modal */}
      {showAuthModal && (
        <TrainerAuthModal
          trainer={state.trainer}
          onUpdateTrainer={handleUpdateTrainerProfile}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {/* Trainer Avatar & Visual Customizer Modal */}
      {showAvatarModal && (
        <TrainerCustomizerModal
          trainer={state.trainer}
          onUpdateTrainer={handleUpdateTrainerProfile}
          onClose={() => setShowAvatarModal(false)}
        />
      )}

      {/* Google Fit Sync Connection Modal */}
      {showFitModal && (
        <GoogleFitModal
          trainer={state.trainer}
          onSyncSteps={handleSyncGoogleFit}
          onClose={() => setShowFitModal(false)}
        />
      )}

      {/* Retro 8-bit Audio & Music Player Widget */}
      <AudioPlayerWidget currentTab={activeTab} />
    </div>
  );
};

export default App;
