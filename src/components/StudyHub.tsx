import React, { useState, useEffect } from 'react';
import {
  ExamBoss,
  Flashcard,
  PartyPokemon,
  Subject3ESO,
  TrainerProfile,
  PokemonType,
} from '../types';
import { POKEMON_TYPES } from '../data/pokemonTypes';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Swords,
  Plus,
  Trophy,
  Flame,
  Calendar,
  GraduationCap,
  Calculator,
  BookOpen,
  Globe,
  Dna,
  Compass,
  Cpu,
  Music,
  PenTool,
  HeartHandshake,
  CheckCircle2,
  AlertCircle,
  X,
  Camera,
  Image as ImageIcon,
  Trash2,
  Maximize2,
  Upload,
} from 'lucide-react';
import { soundFx } from '../utils/audio';
import confetti from 'canvas-confetti';

interface StudyHubProps {
  subjects: Subject3ESO[];
  examBosses: ExamBoss[];
  flashcards: Flashcard[];
  party: PartyPokemon[];
  trainer: TrainerProfile;
  onCompletePomodoro: (subjectId: string, durationMinutes: number) => void;
  onAddExamBoss: (boss: Omit<ExamBoss, 'id' | 'currentHp' | 'status'>) => void;
  onEvaluateExam: (examId: string, grade: number) => void;
  onAddFlashcard: (card: Omit<Flashcard, 'id'>) => void;
  onDamagePokemonHp: (pokemonId: string, damage: number) => void;
  onUpdateSubjectGrade: (subjectId: string, grade: number) => void;
  onAddSubject?: (subj: Subject3ESO) => void;
  onDeleteSubject?: (subjectId: string) => void;
  onUpdateSubjectTrimesters?: (subjectId: string, t1?: number, t2?: number, t3?: number) => void;
  onAttachExamPhoto?: (examId: string, photoUrl: string) => void;
  onUpdateExamTopics?: (examId: string, topics: string) => void;
  onClaimAcademicReward?: (rewardTier: string, gold: number, candyQty: number) => void;
}

export const StudyHub: React.FC<StudyHubProps> = ({
  subjects,
  examBosses,
  flashcards,
  party,
  trainer,
  onCompletePomodoro,
  onAddExamBoss,
  onEvaluateExam,
  onAddFlashcard,
  onDamagePokemonHp,
  onUpdateSubjectGrade,
  onAddSubject,
  onDeleteSubject,
  onUpdateSubjectTrimesters,
  onAttachExamPhoto,
}) => {
  const [activeStudyTab, setActiveStudyTab] = useState<'pomodoro' | 'battle_review' | 'exams' | 'grades'>('pomodoro');

  // Pomodoro state
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || 'matematicas');
  const [timerSeconds, setTimerSeconds] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isBreak, setIsBreak] = useState<boolean>(false);

  // Exam modal state
  const [showAddExamModal, setShowAddExamModal] = useState<boolean>(false);
  const [examTitle, setExamTitle] = useState<string>('');
  const [examSubject, setExamSubject] = useState<string>(subjects[0]?.id || 'matematicas');
  const [examDate, setExamDate] = useState<string>('');
  const [examTopics, setExamTopics] = useState<string>('');
  const [editingExamTopicsId, setEditingExamTopicsId] = useState<string | null>(null);
  const [tempExamTopics, setTempExamTopics] = useState<string>('');
  const [examGradeModal, setExamGradeModal] = useState<ExamBoss | null>(null);
  const [enteredGrade, setEnteredGrade] = useState<number>(8);
  const [examPhotoUploadForId, setExamPhotoUploadForId] = useState<string | null>(null);
  const [zoomedPhotoUrl, setZoomedPhotoUrl] = useState<string | null>(null);
  const [claimedAcademicRewards, setClaimedAcademicRewards] = useState<{ [tier: string]: boolean }>({});

  // Custom Subject Modal state
  const [showAddSubjectModal, setShowAddSubjectModal] = useState<boolean>(false);
  const [newSubjName, setNewSubjName] = useState<string>('');
  const [newSubjType, setNewSubjType] = useState<PokemonType>('psychic');
  const [newSubjT1, setNewSubjT1] = useState<string>('8.0');
  const [newSubjT2, setNewSubjT2] = useState<string>('8.0');
  const [newSubjT3, setNewSubjT3] = useState<string>('8.0');

  // Flashcards Combat state
  const [activeCombatSubject, setActiveCombatSubject] = useState<string>('all');
  const [combatCardIndex, setCombatCardIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);
  const [combatRivalHp, setCombatRivalHp] = useState<number>(100);
  const [combatScore, setCombatScore] = useState<number>(0);

  // New Flashcard Modal
  const [showAddCardModal, setShowAddCardModal] = useState<boolean>(false);
  const [newCardSubject, setNewCardSubject] = useState<string>(subjects[0]?.id || 'matematicas');
  const [newCardQuestion, setNewCardQuestion] = useState<string>('');
  const [newCardOpt1, setNewCardOpt1] = useState<string>('');
  const [newCardOpt2, setNewCardOpt2] = useState<string>('');
  const [newCardOpt3, setNewCardOpt3] = useState<string>('');
  const [newCardOpt4, setNewCardOpt4] = useState<string>('');
  const [newCardExplanation, setNewCardExplanation] = useState<string>('');

  // Pomodoro timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timerSeconds === 0) {
      if (!isBreak) {
        // Study block completed!
        soundFx.playPomodoroBell();
        confetti({ particleCount: 50, spread: 60 });
        onCompletePomodoro(selectedSubjectId, 25);
        setIsBreak(true);
        setTimerSeconds(5 * 60);
      } else {
        // Break block completed!
        soundFx.playPomodoroBell();
        setIsBreak(false);
        setTimerSeconds(25 * 60);
      }
      setIsRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timerSeconds, isBreak, selectedSubjectId, onCompletePomodoro]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];
  const subjectType = selectedSubject ? POKEMON_TYPES[selectedSubject.pokemonType] : POKEMON_TYPES.psychic;

  // Filtered flashcards for battle
  const combatFlashcards = flashcards.filter(
    (f) => activeCombatSubject === 'all' || f.subjectId === activeCombatSubject
  );
  const currentCombatCard = combatFlashcards[combatCardIndex % (combatFlashcards.length || 1)];

  const handleCombatAnswer = (optIndex: number) => {
    if (isAnswerRevealed || !currentCombatCard) return;
    setSelectedOption(optIndex);
    setIsAnswerRevealed(true);

    const isCorrect = optIndex === currentCombatCard.correctAnswerIndex;
    if (isCorrect) {
      soundFx.playSuperEffective();
      setCombatRivalHp((prev) => Math.max(0, prev - 35));
      setCombatScore((prev) => prev + 1);
      confetti({ particleCount: 25, spread: 45 });
    } else {
      soundFx.playAttackHit();
      // Damage lead pokemon slightly
      if (party[0]) {
        onDamagePokemonHp(party[0].id, 10);
      }
    }
  };

  const handleNextCombatCard = () => {
    setSelectedOption(null);
    setIsAnswerRevealed(false);
    setCombatCardIndex((prev) => prev + 1);
    if (combatRivalHp <= 0) {
      soundFx.playLevelUp();
      setCombatRivalHp(100);
    }
  };

  const handleAddExamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examTitle.trim() || !examDate) return;

    const subj = subjects.find((s) => s.id === examSubject) || subjects[0];
    onAddExamBoss({
      subjectId: subj.id,
      title: examTitle.trim(),
      date: examDate,
      topics: examTopics.trim() || undefined,
      maxHp: 500,
      bossPokemonId: subj.pokemonType === 'fire' ? 126 : subj.pokemonType === 'water' ? 131 : 65,
      bossPokemonName: `Guardián de ${subj.name}`,
      bossSprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
        subj.pokemonType === 'fire' ? 126 : subj.pokemonType === 'water' ? 131 : 65
      }.png`,
      rewardGold: 350,
      rewardXp: 500,
      badgeName: `Insignia de ${subj.name}`,
      badgeSprite: '🏅',
    });

    setExamTitle('');
    setExamTopics('');
    setShowAddExamModal(false);
    soundFx.playClick();
  };

  const handleAddCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardQuestion.trim() || !newCardOpt1.trim() || !newCardOpt2.trim()) return;

    onAddFlashcard({
      subjectId: newCardSubject,
      question: newCardQuestion.trim(),
      options: [newCardOpt1.trim(), newCardOpt2.trim(), newCardOpt3.trim() || 'Ninguna de las anteriores', newCardOpt4.trim() || 'Todas las anteriores'],
      correctAnswerIndex: 0,
      explanation: newCardExplanation.trim() || 'Respuesta correcta verificada.',
    });

    setNewCardQuestion('');
    setNewCardOpt1('');
    setNewCardOpt2('');
    setNewCardOpt3('');
    setNewCardOpt4('');
    setNewCardExplanation('');
    setShowAddCardModal(false);
    soundFx.playClick();
  };

  // Grade averages
  const gradedSubjects = subjects.filter((s) => s.currentGrade !== undefined);
  const averageGrade = gradedSubjects.length
    ? (gradedSubjects.reduce((acc, s) => acc + (s.currentGrade || 0), 0) / gradedSubjects.length).toFixed(2)
    : '8.40';

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header with 3º ESO Hub Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-red-500" />
              Academia 3º ESO & Batallas de Estudio
            </h2>
            <span className="bg-amber-500/20 text-amber-300 font-black text-xs px-2.5 py-0.5 rounded-full border border-amber-500/40">
              Media: {averageGrade} / 10
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Cada asignatura está vinculada a un tipo Pokémon. Estudia con Pomodoro para debilitar a los <strong>Bosses de Exámenes</strong> y entrena en el <strong>Combate de Flashcards</strong>.
          </p>
        </div>

        {/* Sub tabs */}
        <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700/60 text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveStudyTab('pomodoro')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeStudyTab === 'pomodoro' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            ⏱️ Pomodoro
          </button>
          <button
            onClick={() => setActiveStudyTab('battle_review')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeStudyTab === 'battle_review' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚔️ Repaso Combate
          </button>
          <button
            onClick={() => setActiveStudyTab('exams')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeStudyTab === 'exams' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            🛡️ Bosses Exámenes ({examBosses.filter((b) => b.status === 'upcoming').length})
          </button>
          <button
            onClick={() => setActiveStudyTab('grades')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeStudyTab === 'grades' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            📊 Notas & Boletín
          </button>
        </div>
      </div>

      {/* TAB 1: POMODORO STUDY TIMER */}
      {activeStudyTab === 'pomodoro' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Main Timer Display */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-between text-center relative overflow-hidden">
            <div
              className="absolute -top-12 -left-12 w-48 h-48 rounded-full blur-3xl opacity-20"
              style={{ backgroundColor: subjectType?.color || '#F85888' }}
            />

            <div className="w-full flex items-center justify-between z-10">
              <span
                className="text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider"
                style={{
                  backgroundColor: subjectType?.color || '#333',
                  color: subjectType?.textColor || '#fff',
                }}
              >
                Tipo {subjectType?.label} • {selectedSubject.name}
              </span>

              <span className="text-xs font-bold text-slate-400">
                {isBreak ? '☕ Tiempo de Descanso' : '📖 Sesión de Estudio Foco'}
              </span>
            </div>

            {/* Giant Digital Timer */}
            <div className="my-8 z-10">
              <div className="text-7xl sm:text-8xl font-black text-white tracking-tighter drop-shadow-lg font-mono">
                {formatTime(timerSeconds)}
              </div>
              <p className="text-sm text-slate-400 mt-2 font-medium">
                {isBreak
                  ? 'Tómate un respiro, bebe agua y estira las piernas.'
                  : `Concentrado en ${selectedSubject.name}. (+50 XP para Pokémon de tipo ${subjectType.label})`}
              </p>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center gap-3 z-10">
              <button
                onClick={() => {
                  soundFx.playClick();
                  if (!isRunning) {
                    soundFx.playPomodoroLofi();
                  }
                  setIsRunning(!isRunning);
                }}
                className={`px-8 py-3.5 rounded-2xl font-black text-sm shadow-xl flex items-center gap-2 transition-transform active:scale-95 cursor-pointer ${
                  isRunning
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5" /> Pausar
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" /> Comenzar Sesión (Lo-Fi 🎵)
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  setIsRunning(false);
                  setTimerSeconds(isBreak ? 5 * 60 : 25 * 60);
                }}
                className="p-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl border border-slate-700 transition-colors cursor-pointer"
                title="Reiniciar temporizador"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              {/* Fast test trigger for simulator convenience */}
              <button
                onClick={() => setTimerSeconds(3)}
                className="px-3 py-2 bg-slate-800/60 hover:bg-slate-800 text-[11px] text-amber-300/80 hover:text-amber-300 font-bold rounded-xl border border-slate-700/50 cursor-pointer"
                title="Prueba rápida (3 segundos)"
              >
                ⏩ Test Rápido
              </button>
            </div>

            {/* Rewards footnote */}
            <div className="w-full mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Pomodoros totales: <strong className="text-white">{trainer.totalPomodorosDone}</strong></span>
              <span className="text-amber-300 font-semibold">⚔️ Daña -50 HP a cualquier examen de esta asignatura</span>
            </div>
          </div>

          {/* Subject Selector & Type Bonuses */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Selecciona Asignatura (3º ESO)
            </h3>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {subjects.map((subj) => {
                const type = POKEMON_TYPES[subj.pokemonType];
                const isSelected = subj.id === selectedSubjectId;

                return (
                  <div
                    key={subj.id}
                    onClick={() => {
                      setSelectedSubjectId(subj.id);
                      soundFx.playClick();
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-slate-800 border-red-500 shadow-md ring-1 ring-red-500'
                        : 'bg-slate-800/50 border-slate-700/60 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-bold text-white leading-tight">
                        {subj.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                        {subj.description}
                      </p>
                    </div>

                    <span
                      className="text-[9px] font-black px-2 py-0.5 rounded-full uppercase shrink-0"
                      style={{
                        backgroundColor: type?.color || '#777',
                        color: type?.textColor || '#fff',
                      }}
                    >
                      {type?.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FLASHCARDS COMBAT REVIEW */}
      {activeStudyTab === 'battle_review' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Swords className="w-5 h-5 text-red-500" />
                Modo Repaso: ¡Combate Pokémon de Preguntas!
              </h3>
              <p className="text-xs text-slate-400">
                Responde correctamente para golpear al Pokémon rival. ¡Fallar restará salud a tu Pokémon activo!
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={activeCombatSubject}
                onChange={(e) => {
                  setActiveCombatSubject(e.target.value);
                  setCombatCardIndex(0);
                  setSelectedOption(null);
                  setIsAnswerRevealed(false);
                }}
                className="bg-slate-800 border border-slate-700 text-white text-xs font-bold rounded-xl px-3 py-2"
              >
                <option value="all">Todas las Asignaturas</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setShowAddCardModal(true)}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Añadir Tarjeta
              </button>
            </div>
          </div>

          {/* Combat Arena */}
          {currentCombatCard ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Rival Pokémon status & sprite */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 flex flex-col items-center justify-center text-center relative">
                <div className="w-full flex justify-between text-xs font-bold mb-2">
                  <span className="text-red-400">Rival: Gengar Sabio</span>
                  <span className="text-white font-mono">{combatRivalHp} / 100 HP</span>
                </div>
                {/* Rival HP bar */}
                <div className="w-full bg-slate-950 rounded-full h-2.5 mb-4 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 to-rose-400 rounded-full transition-all duration-300"
                    style={{ width: `${combatRivalHp}%` }}
                  />
                </div>

                <img
                  src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png"
                  alt="Rival Gengar"
                  className="w-28 h-28 object-contain pixelated drop-shadow animate-pulse"
                />

                <div className="mt-3 text-xs text-slate-300 font-bold bg-slate-900/80 px-3 py-1 rounded-full">
                  Puntuación de racha: <span className="text-amber-400">{combatScore}</span> aciertos
                </div>
              </div>

              {/* Question & Options Panel */}
              <div className="md:col-span-2 space-y-4">
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60">
                  <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-950 px-2 py-0.5 rounded">
                    {subjects.find((s) => s.id === currentCombatCard.subjectId)?.name || 'General'}
                  </span>
                  <h4 className="text-base font-bold text-white mt-2 leading-snug">
                    {currentCombatCard.question}
                  </h4>
                </div>

                {/* 4 Interactive Option Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {currentCombatCard.options.map((opt, optIdx) => {
                    let btnClass = 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white';
                    if (isAnswerRevealed) {
                      if (optIdx === currentCombatCard.correctAnswerIndex) {
                        btnClass = 'bg-emerald-600 border-emerald-400 text-white ring-2 ring-emerald-400 font-bold';
                      } else if (selectedOption === optIdx) {
                        btnClass = 'bg-red-600/80 border-red-400 text-white';
                      } else {
                        btnClass = 'bg-slate-800/40 border-slate-800 text-slate-500';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleCombatAnswer(optIdx)}
                        disabled={isAnswerRevealed}
                        className={`p-3.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${btnClass}`}
                      >
                        <span className="font-bold mr-2 text-slate-400">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation feedback & Next Button */}
                {isAnswerRevealed && (
                  <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-xl space-y-3 animate-fadeIn">
                    <div className="flex items-center gap-2">
                      {selectedOption === currentCombatCard.correctAnswerIndex ? (
                        <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                          <CheckCircle2 className="w-4 h-4" /> ¡Ataque Súper Efectivo! (+1 Acierto)
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-red-400 font-bold text-xs">
                          <AlertCircle className="w-4 h-4" /> ¡Has fallado! Tu Pokémon activo pierde 10 HP.
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-slate-300">
                      💡 {currentCombatCard.explanation}
                    </p>

                    <button
                      onClick={handleNextCombatCard}
                      className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-black text-xs rounded-xl shadow cursor-pointer transition-transform active:scale-95"
                    >
                      Siguiente Pregunta / Ronda ⚔️
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400 text-xs">
              No hay preguntas registradas para esta asignatura. ¡Pulsa "Añadir Tarjeta" para crear preguntas de repaso!
            </div>
          )}
        </div>
      )}

      {/* TAB 3: EXAM BOSSES */}
      {activeStudyTab === 'exams' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Swords className="w-5 h-5 text-red-500" />
                Boss Battles de Exámenes (3º ESO)
              </h3>
              <p className="text-xs text-slate-400">
                Cada examen es un Jefe de Gimnasio. Completa Pomodoros para reducir su HP y sube fotos reales de tus exámenes calificados.
              </p>
            </div>

            <button
              onClick={() => setShowAddExamModal(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> Añadir Examen
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {examBosses.map((exam) => {
              const subj = subjects.find((s) => s.id === exam.subjectId);
              const isPassed = exam.status === 'passed';
              const hpPercent = Math.max(0, Math.min(100, (exam.currentHp / exam.maxHp) * 100));

              return (
                <div
                  key={exam.id}
                  className={`bg-slate-900 border rounded-2xl p-5 shadow-lg space-y-3.5 ${
                    isPassed ? 'border-emerald-500/40 bg-emerald-950/10' : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{exam.badgeSprite}</span>
                      <div>
                        <h4 className="text-sm font-black text-white">{exam.title}</h4>
                        <span className="text-[11px] text-slate-400 font-semibold">
                          {subj?.name} • Fecha: {exam.date}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                        isPassed
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {isPassed ? `Aprobado (Nota: ${exam.grade})` : 'Próximo'}
                    </span>
                  </div>

                  {/* Boss Info and HP Bar */}
                  <div className="bg-slate-800/70 p-3 rounded-xl border border-slate-700/60 flex items-center gap-3">
                    <img
                      src={exam.bossSprite}
                      alt={exam.bossPokemonName}
                      className="w-14 h-14 object-contain pixelated drop-shadow"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-white truncate">{exam.bossPokemonName}</span>
                        <span className="text-red-300 shrink-0">{exam.currentHp} / {exam.maxHp} HP</span>
                      </div>
                      <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full transition-all duration-500"
                          style={{ width: `${hpPercent}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {hpPercent === 0
                          ? '¡Jefe totalmente debilitado! Estás preparadísimo para el examen.'
                          : 'Haz bloques de estudio en esta asignatura para debilitar al jefe.'}
                      </p>
                    </div>
                  </div>

                  {/* Exam Topics / Contents */}
                  <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-bold flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                        Lo que entra / Temario del Examen:
                      </span>
                      {editingExamTopicsId === exam.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              onUpdateExamTopics?.(exam.id, tempExamTopics);
                              setEditingExamTopicsId(null);
                              soundFx.playClick();
                            }}
                            className="text-[10px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2 py-0.5 rounded cursor-pointer"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => setEditingExamTopicsId(null)}
                            className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingExamTopicsId(exam.id);
                            setTempExamTopics(exam.topics || '');
                          }}
                          className="text-[10px] text-amber-400 hover:text-amber-300 font-semibold cursor-pointer underline"
                        >
                          {exam.topics ? 'Editar temario' : '+ Añadir temario'}
                        </button>
                      )}
                    </div>

                    {editingExamTopicsId === exam.id ? (
                      <textarea
                        value={tempExamTopics}
                        onChange={(e) => setTempExamTopics(e.target.value)}
                        placeholder="Escribe aquí los temas, lecciones o preguntas que entran en el examen..."
                        rows={2}
                        className="w-full bg-slate-900 border border-amber-500/50 rounded-lg p-2 text-xs text-white focus:outline-none resize-none"
                      />
                    ) : (
                      <p className="text-xs text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80 font-medium">
                        {exam.topics || (
                          <span className="text-slate-500 italic">
                            No se ha detallado el temario aún. Pulsa en "+ Añadir temario" para apuntar qué entra.
                          </span>
                        )}
                      </p>
                    )}
                  </div>

                  {/* Photos Section for Exam */}
                  <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-bold flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-blue-400" />
                        Fotos del Examen ({exam.photos?.length || 0})
                      </span>
                      <label className="text-[11px] font-bold text-blue-400 hover:text-blue-300 cursor-pointer flex items-center gap-1 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/30">
                        <Upload className="w-3 h-3" /> Subir Foto
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = () => {
                                if (typeof reader.result === 'string') {
                                  onAttachExamPhoto?.(exam.id, reader.result);
                                  soundFx.playClick();
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>

                    {exam.photos && exam.photos.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2 pt-1">
                        {exam.photos.map((photo, idx) => (
                          <div
                            key={idx}
                            onClick={() => setZoomedPhotoUrl(photo)}
                            className="relative group rounded-lg overflow-hidden border border-slate-700 aspect-video bg-slate-900 cursor-pointer"
                          >
                            <img
                              src={photo}
                              alt={`Examen ${idx + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Maximize2 className="w-4 h-4 text-white drop-shadow" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-slate-500 italic">
                        Sube una foto de tu examen corregido o apuntes para guardarlo en tu historial.
                      </p>
                    )}
                  </div>

                  {/* Footer with rewards and grade evaluation */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-slate-400">
                      Recompensa: <strong className="text-amber-300">+{exam.rewardGold} ₽</strong>
                    </span>

                    {!isPassed && (
                      <button
                        onClick={() => {
                          setExamGradeModal(exam);
                          soundFx.playClick();
                        }}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer"
                      >
                        Introducir Nota Obtenida 📝
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: GRADES & REPORT CARD (3 TRIMESTRES + AÑADIR ASIGNATURAS) */}
      {activeStudyTab === 'grades' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-red-500" />
                Boletín de Calificaciones (3 Trimestres)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Controla tus notas del 1º, 2º y 3º trimestre. Puedes añadir tus propias asignaturas personalizadas.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowAddSubjectModal(true)}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Añadir Asignatura
              </button>
              <div className="text-right bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-700">
                <span className="text-xl font-black text-amber-400">{averageGrade}</span>
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Media Global</span>
              </div>
            </div>
          </div>

          {/* Detailed 3 Trimester Grid */}
          <div className="space-y-3">
            <div className="grid grid-cols-12 text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 hidden sm:grid">
              <div className="col-span-4">Asignatura & Tipo</div>
              <div className="col-span-2 text-center">1º Trimestre</div>
              <div className="col-span-2 text-center">2º Trimestre</div>
              <div className="col-span-2 text-center">3º Trimestre</div>
              <div className="col-span-2 text-center">Nota Media</div>
              <div className="col-span-2 text-right">Acción</div>
            </div>

            <div className="space-y-3">
              {subjects.map((subj) => {
                const t1 = subj.trimesterGrades?.t1 ?? subj.currentGrade ?? 8;
                const t2 = subj.trimesterGrades?.t2 ?? subj.currentGrade ?? 8;
                const t3 = subj.trimesterGrades?.t3 ?? subj.currentGrade ?? 8;
                const calculatedAvg = ((t1 + t2 + t3) / 3).toFixed(1);
                const avgNum = parseFloat(calculatedAvg);

                const badgeColor =
                  avgNum >= 9
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : avgNum >= 7
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                    : avgNum >= 5
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-red-500/20 text-red-300 border-red-500/40';

                return (
                  <div
                    key={subj.id}
                    className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 flex flex-col sm:grid sm:grid-cols-12 items-start sm:items-center gap-3"
                  >
                    <div className="col-span-4 flex items-center gap-2.5">
                      <div
                        className="w-3 h-8 rounded-full shrink-0"
                        style={{ backgroundColor: POKEMON_TYPES[subj.pokemonType]?.color || '#ef4444' }}
                      />
                      <div>
                        <h4 className="text-sm font-bold text-white">{subj.name}</h4>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">
                          Tipo {POKEMON_TYPES[subj.pokemonType]?.label}
                        </span>
                      </div>
                    </div>

                    {/* Trimester 1 */}
                    <div className="col-span-2 flex sm:justify-center items-center gap-1 w-full sm:w-auto justify-between">
                      <span className="sm:hidden text-xs text-slate-400 font-bold">1º Trim:</span>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={t1}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          onUpdateSubjectTrimesters?.(subj.id, val, t2, t3);
                        }}
                        className="w-16 bg-slate-900 border border-slate-700 rounded-lg text-center text-xs font-black text-amber-300 py-1 focus:outline-none focus:border-red-500"
                      />
                    </div>

                    {/* Trimester 2 */}
                    <div className="col-span-2 flex sm:justify-center items-center gap-1 w-full sm:w-auto justify-between">
                      <span className="sm:hidden text-xs text-slate-400 font-bold">2º Trim:</span>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={t2}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          onUpdateSubjectTrimesters?.(subj.id, t1, val, t3);
                        }}
                        className="w-16 bg-slate-900 border border-slate-700 rounded-lg text-center text-xs font-black text-amber-300 py-1 focus:outline-none focus:border-red-500"
                      />
                    </div>

                    {/* Trimester 3 */}
                    <div className="col-span-2 flex sm:justify-center items-center gap-1 w-full sm:w-auto justify-between">
                      <span className="sm:hidden text-xs text-slate-400 font-bold">3º Trim:</span>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={t3}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          onUpdateSubjectTrimesters?.(subj.id, t1, t2, val);
                        }}
                        className="w-16 bg-slate-900 border border-slate-700 rounded-lg text-center text-xs font-black text-amber-300 py-1 focus:outline-none focus:border-red-500"
                      />
                    </div>

                    {/* Average & Actions */}
                    <div className="col-span-2 flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                      <span
                        className={`text-xs font-black px-2.5 py-1 rounded-lg border ${badgeColor}`}
                      >
                        {calculatedAvg}
                      </span>
                      {onDeleteSubject && (
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar asignatura "${subj.name}"?`)) {
                              onDeleteSubject(subj.id);
                              soundFx.playClick();
                            }
                          }}
                          className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                          title="Eliminar asignatura"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Academic Report Card Rewards Section */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  Recompensas Académicas por Notas del Boletín
                </h4>
                <p className="text-xs text-slate-400">
                  ¡Tus buenas calificaciones en el instituto desbloquean PokéCoins, Caramelos Raros y Bayas especiales!
                </p>
              </div>

              <span className="text-xs font-black text-amber-300 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/30 self-start sm:self-auto">
                Tu Media Actual: {averageGrade} / 10
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              {/* Tier 1: Sobresaliente */}
              <div
                className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-all ${
                  parseFloat(averageGrade) >= 9.0
                    ? 'bg-amber-950/20 border-amber-500/60 shadow-lg'
                    : 'bg-slate-900/40 border-slate-800 opacity-70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">🌟</span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Media ≥ 9.0
                    </span>
                  </div>
                  <h5 className="text-xs font-black text-white mt-2">Matrícula de Honor</h5>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    +500 ₽ PokéCoins + 2 Caramelos Raros + 3 Bayas Zreza
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (parseFloat(averageGrade) >= 9.0 && !claimedAcademicRewards['sobresaliente']) {
                      onClaimAcademicReward?.('sobresaliente', 500, 2);
                      setClaimedAcademicRewards((prev) => ({ ...prev, sobresaliente: true }));
                      soundFx.playLevelUp();
                      confetti({ particleCount: 70, spread: 80 });
                    }
                  }}
                  disabled={parseFloat(averageGrade) < 9.0 || claimedAcademicRewards['sobresaliente']}
                  className={`w-full py-2 text-xs font-black rounded-xl shadow transition-all ${
                    claimedAcademicRewards['sobresaliente']
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : parseFloat(averageGrade) >= 9.0
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer shadow-amber-500/30 active:scale-95'
                      : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                  }`}
                >
                  {claimedAcademicRewards['sobresaliente']
                    ? '✓ Reclamado'
                    : parseFloat(averageGrade) >= 9.0
                    ? 'Reclamar Premio 🎁'
                    : 'Requiere Media 9.0+'}
                </button>
              </div>

              {/* Tier 2: Notable */}
              <div
                className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-all ${
                  parseFloat(averageGrade) >= 7.0
                    ? 'bg-blue-950/20 border-blue-500/60 shadow-lg'
                    : 'bg-slate-900/40 border-slate-800 opacity-70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">🏅</span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
                      Media ≥ 7.0
                    </span>
                  </div>
                  <h5 className="text-xs font-black text-white mt-2">Notable Alto</h5>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    +250 ₽ PokéCoins + 1 Caramelo Raro + 2 Bayas Aranja
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (parseFloat(averageGrade) >= 7.0 && !claimedAcademicRewards['notable']) {
                      onClaimAcademicReward?.('notable', 250, 1);
                      setClaimedAcademicRewards((prev) => ({ ...prev, notable: true }));
                      soundFx.playLevelUp();
                      confetti({ particleCount: 50, spread: 70 });
                    }
                  }}
                  disabled={parseFloat(averageGrade) < 7.0 || claimedAcademicRewards['notable']}
                  className={`w-full py-2 text-xs font-black rounded-xl shadow transition-all ${
                    claimedAcademicRewards['notable']
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : parseFloat(averageGrade) >= 7.0
                      ? 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer shadow-blue-600/30 active:scale-95'
                      : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                  }`}
                >
                  {claimedAcademicRewards['notable']
                    ? '✓ Reclamado'
                    : parseFloat(averageGrade) >= 7.0
                    ? 'Reclamar Premio 🎁'
                    : 'Requiere Media 7.0+'}
                </button>
              </div>

              {/* Tier 3: Aprobado */}
              <div
                className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-all ${
                  parseFloat(averageGrade) >= 5.0
                    ? 'bg-emerald-950/20 border-emerald-500/60 shadow-lg'
                    : 'bg-slate-900/40 border-slate-800 opacity-70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">📘</span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      Media ≥ 5.0
                    </span>
                  </div>
                  <h5 className="text-xs font-black text-white mt-2">Aprobado General</h5>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    +100 ₽ PokéCoins + 2 Bayas Meloc
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (parseFloat(averageGrade) >= 5.0 && !claimedAcademicRewards['aprobado']) {
                      onClaimAcademicReward?.('aprobado', 100, 0);
                      setClaimedAcademicRewards((prev) => ({ ...prev, aprobado: true }));
                      soundFx.playLevelUp();
                      confetti({ particleCount: 35, spread: 50 });
                    }
                  }}
                  disabled={parseFloat(averageGrade) < 5.0 || claimedAcademicRewards['aprobado']}
                  className={`w-full py-2 text-xs font-black rounded-xl shadow transition-all ${
                    claimedAcademicRewards['aprobado']
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : parseFloat(averageGrade) >= 5.0
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-emerald-600/30 active:scale-95'
                      : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                  }`}
                >
                  {claimedAcademicRewards['aprobado']
                    ? '✓ Reclamado'
                    : parseFloat(averageGrade) >= 5.0
                    ? 'Reclamar Premio 🎁'
                    : 'Requiere Media 5.0+'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Zoomed Photo Lightbox */}
      {zoomedPhotoUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setZoomedPhotoUrl(null)}
        >
          <div className="max-w-3xl w-full max-h-[85vh] flex flex-col items-center justify-center relative">
            <button
              onClick={() => setZoomedPhotoUrl(null)}
              className="absolute -top-10 right-0 text-white bg-slate-800 p-2 rounded-full hover:bg-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={zoomedPhotoUrl}
              alt="Examen ampliado"
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl border border-slate-700"
            />
          </div>
        </div>
      )}

      {/* Modal: Add Custom Subject */}
      {showAddSubjectModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-red-500" />
                Añadir Nueva Asignatura
              </h3>
              <button onClick={() => setShowAddSubjectModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newSubjName.trim()) return;

                const t1 = parseFloat(newSubjT1) || 7.0;
                const t2 = parseFloat(newSubjT2) || 7.0;
                const t3 = parseFloat(newSubjT3) || 7.0;

                const newSubject: Subject3ESO = {
                  id: `custom_${Date.now()}`,
                  name: newSubjName.trim(),
                  pokemonType: newSubjType,
                  iconName: 'BookOpen',
                  color: '#6366f1',
                  currentGrade: parseFloat(((t1 + t2 + t3) / 3).toFixed(1)),
                  trimester1: t1,
                  trimester2: t2,
                  trimester3: t3,
                  finalGrade: parseFloat(((t1 + t2 + t3) / 3).toFixed(1)),
                  description: `Asignatura personalizada de tipo ${newSubjType}`,
                  isCustom: true,
                };

                onAddSubject?.(newSubject);
                setShowAddSubjectModal(false);
                setNewSubjName('');
                soundFx.playClick();
                confetti({ particleCount: 40, spread: 50 });
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Nombre de la Asignatura
                </label>
                <input
                  type="text"
                  value={newSubjName}
                  onChange={(e) => setNewSubjName(e.target.value)}
                  placeholder="Ej: Filosofía, Economía, Francés..."
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-medium focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Tipo Pokémon Asociado
                </label>
                <select
                  value={newSubjType}
                  onChange={(e) => setNewSubjType(e.target.value as PokemonType)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-bold focus:outline-none focus:border-red-500"
                >
                  {Object.entries(POKEMON_TYPES).map(([typeKey, typeData]) => (
                    <option key={typeKey} value={typeKey}>
                      {typeData.label} ({typeKey})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Notas Iniciales de Trimestres (0 - 10)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block mb-1">1º Trimestre</span>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={newSubjT1}
                      onChange={(e) => setNewSubjT1(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-center text-amber-300 font-bold text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block mb-1">2º Trimestre</span>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={newSubjT2}
                      onChange={(e) => setNewSubjT2(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-center text-amber-300 font-bold text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block mb-1">3º Trimestre</span>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={newSubjT3}
                      onChange={(e) => setNewSubjT3(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-center text-amber-300 font-bold text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSubjectModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-black rounded-xl shadow cursor-pointer"
                >
                  Añadir al Boletín
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Exam Modal */}
      {showAddExamModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-red-500" />
                Registrar Nuevo Examen (Boss)
              </h3>
              <button onClick={() => setShowAddExamModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExamSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Título del Examen
                </label>
                <input
                  type="text"
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  placeholder="Ej: Examen Global de Lengua y Literatura"
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-medium focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Asignatura
                  </label>
                  <select
                    value={examSubject}
                    onChange={(e) => setExamSubject(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-bold focus:outline-none focus:border-red-500"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Fecha del Examen
                  </label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-medium focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Temario / Lo que entra en el examen
                </label>
                <textarea
                  value={examTopics}
                  onChange={(e) => setExamTopics(e.target.value)}
                  placeholder="Ej: Temas 3 y 4: Sintaxis de oraciones compuestas, literatura del Siglo de Oro, vocabulario..."
                  rows={3}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-medium focus:outline-none focus:border-red-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddExamModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-black rounded-xl shadow cursor-pointer"
                >
                  Crear Gym Boss
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enter Grade Evaluation Modal */}
      {examGradeModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="text-center">
              <span className="text-3xl">📝</span>
              <h3 className="text-lg font-black text-white mt-1">Calificar Examen</h3>
              <p className="text-xs text-slate-300">{examGradeModal.title}</p>
            </div>

            <div className="bg-slate-800 p-4 rounded-xl text-center space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase">
                Introduce tu nota final (0 - 10)
              </label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={enteredGrade}
                onChange={(e) => setEnteredGrade(parseFloat(e.target.value) || 0)}
                className="w-24 bg-slate-900 border-2 border-red-500 rounded-xl text-center text-2xl font-black text-amber-300 py-1.5 mx-auto focus:outline-none"
              />
              <p className="text-[11px] text-slate-400">
                {enteredGrade >= 5
                  ? '🎉 ¡Aprobado! Ganarás la recompensa completa y la insignia de la asignatura.'
                  : '⚠️ Suspenso. Podrás volver a intentarlo en la recuperación.'}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setExamGradeModal(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  onEvaluateExam(examGradeModal.id, enteredGrade);
                  setExamGradeModal(null);
                  if (enteredGrade >= 5) {
                    soundFx.playLevelUp();
                    confetti({ particleCount: 75, spread: 80 });
                  }
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow cursor-pointer"
              >
                Guardar Nota & Recompensas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Flashcard Modal */}
      {showAddCardModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-red-500" />
                Añadir Pregunta de Repaso
              </h3>
              <button onClick={() => setShowAddCardModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCardSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Asignatura
                </label>
                <select
                  value={newCardSubject}
                  onChange={(e) => setNewCardSubject(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-bold focus:outline-none focus:border-red-500"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Pregunta
                </label>
                <input
                  type="text"
                  value={newCardQuestion}
                  onChange={(e) => setNewCardQuestion(e.target.value)}
                  placeholder="Ej: ¿Qué rey firmó la Constitución de 1812?"
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-medium focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-emerald-400 uppercase mb-1">
                    Opción A (Correcta)
                  </label>
                  <input
                    type="text"
                    value={newCardOpt1}
                    onChange={(e) => setNewCardOpt1(e.target.value)}
                    placeholder="Respuesta correcta"
                    required
                    className="w-full bg-slate-800 border border-emerald-500/50 rounded-xl px-3 py-1.5 text-white text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Opción B (Incorrecta)
                  </label>
                  <input
                    type="text"
                    value={newCardOpt2}
                    onChange={(e) => setNewCardOpt2(e.target.value)}
                    placeholder="Opción incorrecta"
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Explicación
                </label>
                <input
                  type="text"
                  value={newCardExplanation}
                  onChange={(e) => setNewCardExplanation(e.target.value)}
                  placeholder="Por qué es correcta..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-medium focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCardModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-black rounded-xl shadow cursor-pointer"
                >
                  Guardar Tarjeta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
