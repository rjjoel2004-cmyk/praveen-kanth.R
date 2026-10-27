import React, { useState } from 'react';
import { Quiz, Question, QuestionOption, QuestionType, QuizCategory } from '../types/quiz';
import { useApp } from '../context/AppContext';
import { sounds } from '../utils/soundEffects';
import {
  Plus,
  Trash2,
  Save,
  Eye,
  ArrowLeft,
  Image as ImageIcon,
  Clock,
  Award,
  CheckCircle2,
  HelpCircle,
  Copy,
  ChevronDown
} from 'lucide-react';

interface QuizCreatorProps {
  initialQuiz?: Quiz | null;
  onSaveSuccess: (quiz: Quiz) => void;
  onCancel: () => void;
}

export const QuizCreator: React.FC<QuizCreatorProps> = ({ initialQuiz, onSaveSuccess, onCancel }) => {
  const { language, t, user } = useApp();

  const [title, setTitle] = useState(initialQuiz?.title || '');
  const [titleTa, setTitleTa] = useState(initialQuiz?.titleTa || '');
  const [description, setDescription] = useState(initialQuiz?.description || '');
  const [descriptionTa, setDescriptionTa] = useState(initialQuiz?.descriptionTa || '');
  const [category, setCategory] = useState<QuizCategory>(initialQuiz?.category || 'generalKnowledge');
  const [coverImage, setCoverImage] = useState(
    initialQuiz?.coverImage || '/src/assets/images/quiz_stage_arena_1793097861150.jpg'
  );

  const [questions, setQuestions] = useState<Question[]>(
    initialQuiz?.questions || [
      {
        id: `q-${Date.now()}-1`,
        text: '',
        textTa: '',
        type: 'mcq',
        timeLimit: 20,
        points: 1000,
        options: [
          { id: 'opt-1', text: '', textTa: '', isCorrect: true },
          { id: 'opt-2', text: '', textTa: '', isCorrect: false },
          { id: 'opt-3', text: '', textTa: '', isCorrect: false },
          { id: 'opt-4', text: '', textTa: '', isCorrect: false },
        ],
      },
    ]
  );

  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const activeQuestion = questions[activeQuestionIdx] || questions[0];

  const handleAddQuestion = () => {
    sounds.playClick();
    const newQ: Question = {
      id: `q-${Date.now()}-${questions.length + 1}`,
      text: '',
      textTa: '',
      type: 'mcq',
      timeLimit: 20,
      points: 1000,
      options: [
        { id: `opt-${Date.now()}-1`, text: '', textTa: '', isCorrect: true },
        { id: `opt-${Date.now()}-2`, text: '', textTa: '', isCorrect: false },
        { id: `opt-${Date.now()}-3`, text: '', textTa: '', isCorrect: false },
        { id: `opt-${Date.now()}-4`, text: '', textTa: '', isCorrect: false },
      ],
    };
    setQuestions([...questions, newQ]);
    setActiveQuestionIdx(questions.length);
  };

  const handleDeleteQuestion = (idx: number) => {
    if (questions.length <= 1) {
      alert('A quiz must have at least one question.');
      return;
    }
    sounds.playClick();
    const filtered = questions.filter((_, i) => i !== idx);
    setQuestions(filtered);
    setActiveQuestionIdx(Math.max(0, idx - 1));
  };

  const updateActiveQuestion = (patch: Partial<Question>) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[activeQuestionIdx] = { ...copy[activeQuestionIdx], ...patch };
      return copy;
    });
  };

  const updateOption = (optIdx: number, field: 'text' | 'textTa', val: string) => {
    const updatedOptions = [...activeQuestion.options];
    updatedOptions[optIdx] = { ...updatedOptions[optIdx], [field]: val };
    updateActiveQuestion({ options: updatedOptions });
  };

  const toggleOptionCorrect = (optIdx: number) => {
    sounds.playClick();
    const isMulti = activeQuestion.type === 'multiSelect';
    const updatedOptions = activeQuestion.options.map((opt, i) => {
      if (isMulti) {
        return i === optIdx ? { ...opt, isCorrect: !opt.isCorrect } : opt;
      } else {
        return { ...opt, isCorrect: i === optIdx };
      }
    });
    updateActiveQuestion({ options: updatedOptions });
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setErrorMsg('Please enter a Quiz Title');
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) {
        setErrorMsg(`Question ${i + 1} prompt cannot be empty`);
        setActiveQuestionIdx(i);
        return;
      }
      const hasCorrect = q.options.some((o) => o.isCorrect);
      if (!hasCorrect) {
        setErrorMsg(`Question ${i + 1} must have at least one correct answer marked`);
        setActiveQuestionIdx(i);
        return;
      }
    }

    setErrorMsg(null);
    setSaving(true);

    try {
      const payload = {
        title,
        titleTa: titleTa || title,
        description,
        descriptionTa: descriptionTa || description,
        category,
        coverImage,
        questions,
        authorName: user?.name || 'Quiz Master',
        createdBy: user?.id || 'admin-1',
      };

      const url = initialQuiz ? `/api/quizzes/${initialQuiz.id}` : '/api/quizzes';
      const method = initialQuiz ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save quiz');
      }

      const savedQuiz = await res.json();
      sounds.playCorrect();
      onSaveSuccess(savedQuiz);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving quiz';
      setErrorMsg(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-slate-100 flex flex-col font-sans">
      {/* Studio Header Bar */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#222] bg-[#121212] px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#333] text-slate-400 hover:bg-[#202020] hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="font-display text-base font-bold text-white flex items-center gap-2">
              <span>{initialQuiz ? t.editQuiz : t.quizCreator}</span>
              <span className="text-xs font-normal text-slate-400">· {questions.length} {t.questionsCount}</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setPreviewOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-[#333] bg-[#181818] px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-[#D4AF37] hover:text-white transition-colors"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>{t.previewQuiz}</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-lg bg-gold-gradient px-4 py-1.5 text-xs font-bold text-black hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all shadow-md shadow-[#D4AF37]/20"
          >
            <Save className="h-3.5 w-3.5" />
            <span>{saving ? t.loading : t.saveQuiz}</span>
          </button>
        </div>
      </header>

      {/* Main Studio Two-Column Grid */}
      <div className="flex-1 flex overflow-hidden max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6">
        {/* Left Column: Questions List / Nav Sidebar */}
        <aside className="w-64 shrink-0 flex flex-col border border-[#222] bg-[#131313] rounded-2xl p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t.questionsCount} ({questions.length})
            </span>
            <button
              onClick={handleAddQuestion}
              className="flex items-center gap-1 rounded-lg border border-[#333] bg-[#1a1a1a] px-2 py-1 text-[11px] font-semibold text-[#D4AF37] hover:border-[#D4AF37]"
            >
              <Plus className="h-3 w-3" />
              <span>Add</span>
            </button>
          </div>

          <div className="space-y-2 flex-1">
            {questions.map((q, idx) => (
              <div
                key={q.id}
                onClick={() => {
                  setActiveQuestionIdx(idx);
                  sounds.playClick();
                }}
                className={`group flex items-center justify-between rounded-xl border p-2.5 cursor-pointer transition-all ${
                  activeQuestionIdx === idx
                    ? 'border-[#D4AF37] bg-gold-subtle shadow-sm'
                    : 'border-[#242424] bg-[#181818] hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-mono text-xs font-bold ${
                      activeQuestionIdx === idx ? 'bg-[#D4AF37] text-black' : 'bg-[#222] text-slate-400'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="text-xs font-medium text-slate-200 truncate">
                    {q.text || `Question ${idx + 1}`}
                  </span>
                </div>

                {questions.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteQuestion(idx);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition-opacity"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* Right Column: Active Question & Quiz Editor Form */}
        <main className="flex-1 border border-[#222] bg-[#131313] rounded-2xl p-6 overflow-y-auto space-y-6">
          {errorMsg && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
              {errorMsg}
            </div>
          )}

          {/* Quiz Metadata (Shows when Question 1 active, or collapsible) */}
          <div className="rounded-xl border border-[#252525] bg-[#181818] p-4 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] block">
              Quiz Properties
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t.quizTitle} (English)</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t.quizTitlePlaceholder}
                  className="w-full rounded-lg border border-[#333] bg-[#0E0E0E] px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t.quizTitle} (தமிழ் / Tamil)</label>
                <input
                  type="text"
                  value={titleTa}
                  onChange={(e) => setTitleTa(e.target.value)}
                  placeholder="வினாடி வினா தலைப்பு..."
                  className="w-full rounded-lg border border-[#333] bg-[#0E0E0E] px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t.category}</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as QuizCategory)}
                  className="w-full rounded-lg border border-[#333] bg-[#0E0E0E] px-3 py-2 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                >
                  <option value="generalKnowledge">{t.generalKnowledge}</option>
                  <option value="bibleQuiz">{t.bibleQuiz}</option>
                  <option value="educational">{t.educational}</option>
                  <option value="scienceTech">{t.scienceTech}</option>
                  <option value="custom">{t.custom}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t.quizDescription}</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t.quizDescPlaceholder}
                  className="w-full rounded-lg border border-[#333] bg-[#0E0E0E] px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Active Question Editor Card */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#252525] pb-2">
              <h3 className="font-display text-sm font-bold text-white flex items-center gap-2">
                <span>{t.question} #{activeQuestionIdx + 1} Details</span>
              </h3>
            </div>

            {/* Question Text in English & Tamil */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t.questionText} (English)
                </label>
                <textarea
                  rows={2}
                  value={activeQuestion.text}
                  onChange={(e) => updateActiveQuestion({ text: e.target.value })}
                  placeholder={t.questionTextPlaceholder}
                  className="w-full rounded-xl border border-[#333] bg-[#0E0E0E] px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t.questionText} (தமிழ் / Tamil Optional)
                </label>
                <textarea
                  rows={2}
                  value={activeQuestion.textTa || ''}
                  onChange={(e) => updateActiveQuestion({ textTa: e.target.value })}
                  placeholder="கேள்வி வாசகம் தமிழில்..."
                  className="w-full rounded-xl border border-[#333] bg-[#0E0E0E] px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            {/* Question Settings: Type, Time Limit, Points, Image */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                  <HelpCircle className="h-3 w-3 text-[#D4AF37]" />
                  <span>{t.questionType}</span>
                </label>
                <select
                  value={activeQuestion.type}
                  onChange={(e) => updateActiveQuestion({ type: e.target.value as QuestionType })}
                  className="w-full rounded-lg border border-[#333] bg-[#0E0E0E] px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                >
                  <option value="mcq">{t.mcq}</option>
                  <option value="trueFalse">{t.trueFalse}</option>
                  <option value="multiSelect">{t.multiSelect}</option>
                  <option value="image">{t.imageQuiz}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                  <Clock className="h-3 w-3 text-[#D4AF37]" />
                  <span>{t.timeLimitSecs}</span>
                </label>
                <select
                  value={activeQuestion.timeLimit}
                  onChange={(e) => updateActiveQuestion({ timeLimit: Number(e.target.value) })}
                  className="w-full rounded-lg border border-[#333] bg-[#0E0E0E] px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                >
                  <option value={10}>10 Seconds</option>
                  <option value={15}>15 Seconds</option>
                  <option value={20}>20 Seconds</option>
                  <option value={30}>30 Seconds</option>
                  <option value={60}>60 Seconds</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                  <Award className="h-3 w-3 text-[#D4AF37]" />
                  <span>{t.pointsValue}</span>
                </label>
                <select
                  value={activeQuestion.points}
                  onChange={(e) => updateActiveQuestion({ points: Number(e.target.value) })}
                  className="w-full rounded-lg border border-[#333] bg-[#0E0E0E] px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                >
                  <option value={500}>500 Points</option>
                  <option value={1000}>1000 Standard</option>
                  <option value={1500}>1500 High Stake</option>
                  <option value={2000}>2000 Double Points</option>
                </select>
              </div>
            </div>

            {/* Optional Image URL */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                <ImageIcon className="h-3 w-3 text-[#D4AF37]" />
                <span>{t.imageUrlOptional}</span>
              </label>
              <input
                type="text"
                value={activeQuestion.imageUrl || ''}
                onChange={(e) => updateActiveQuestion({ imageUrl: e.target.value })}
                placeholder="https://... or /src/assets/images/..."
                className="w-full rounded-lg border border-[#333] bg-[#0E0E0E] px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            {/* 4 Answer Options */}
            <div className="pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                {t.options} (Mark the green checkmark for correct answers)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeQuestion.options.map((opt, optIdx) => (
                  <div
                    key={opt.id}
                    className={`rounded-xl border p-3 transition-all ${
                      opt.isCorrect
                        ? 'border-emerald-500/70 bg-emerald-950/20 ring-1 ring-emerald-500/40'
                        : 'border-[#2a2a2a] bg-[#161616]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-slate-400">
                        Option {optIdx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleOptionCorrect(optIdx)}
                        className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold transition-all ${
                          opt.isCorrect
                            ? 'bg-emerald-500 text-black'
                            : 'bg-[#222] text-slate-400 hover:text-white'
                        }`}
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        <span>{opt.isCorrect ? 'Correct Answer' : 'Mark Correct'}</span>
                      </button>
                    </div>

                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => updateOption(optIdx, 'text', e.target.value)}
                      placeholder={`Option ${optIdx + 1} (English)`}
                      className="w-full rounded-lg border border-[#333] bg-[#0E0E0E] px-2.5 py-1.5 text-xs text-white placeholder-slate-600 focus:border-[#D4AF37] focus:outline-none mb-1.5"
                    />
                    <input
                      type="text"
                      value={opt.textTa || ''}
                      onChange={(e) => updateOption(optIdx, 'textTa', e.target.value)}
                      placeholder={`தெரிவு ${optIdx + 1} (தமிழ்)`}
                      className="w-full rounded-lg border border-[#333] bg-[#0E0E0E] px-2.5 py-1.5 text-xs text-white placeholder-slate-600 focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-[#333] bg-[#141414] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#252525] pb-3 mb-4">
              <h3 className="font-display text-base font-bold text-white">Quiz Studio Preview</h3>
              <button
                onClick={() => setPreviewOpen(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close Preview
              </button>
            </div>

            <div className="text-center py-6">
              <span className="text-xs text-[#D4AF37] font-bold uppercase tracking-wider">
                Question {activeQuestionIdx + 1} of {questions.length} · {activeQuestion.timeLimit}s · {activeQuestion.points} pts
              </span>
              <h4 className="mt-3 text-xl font-extrabold text-white">
                {activeQuestion.text || 'Question text preview'}
              </h4>
              {activeQuestion.textTa && (
                <p className="mt-1 text-sm text-slate-400">{activeQuestion.textTa}</p>
              )}

              <div className="grid grid-cols-2 gap-3 mt-6">
                {activeQuestion.options.map((opt, i) => (
                  <div
                    key={opt.id}
                    className={`rounded-xl border p-3 text-left ${
                      opt.isCorrect
                        ? 'border-emerald-500 bg-emerald-950/30 text-emerald-200'
                        : 'border-[#333] bg-[#181818] text-slate-200'
                    }`}
                  >
                    <span className="text-xs font-semibold block">{opt.text || `Option ${i + 1}`}</span>
                    {opt.textTa && <span className="text-[11px] text-slate-400">{opt.textTa}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
