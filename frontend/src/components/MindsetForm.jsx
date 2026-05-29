import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { submitMindset, getDecision, getMindset } from '../services/api';
import { toast } from 'react-hot-toast';
import Header from './Header';
import { requireClearText, getDecisionDisplayTitle } from '../utils/inputValidation';

const STEPS = [
  {
    id: 'driver',
    title: 'What’s pulling you?',
    subtitle: 'Fear, desire, or both — name what’s really moving you.',
  },
  {
    id: 'head-heart',
    title: 'Head or heart?',
    subtitle: 'Logic and emotion both belong here.',
  },
  {
    id: 'future',
    title: 'Future you',
    subtitle: 'Long-term fulfillment vs short-term comfort.',
  },
  {
    id: 'pressure',
    title: 'Voices outside',
    subtitle: 'Whose expectations are in the room with you?',
  },
  {
    id: 'values',
    title: 'What must not be betrayed?',
    subtitle: 'Personal values you’d regret ignoring.',
  },
  {
    id: 'close',
    title: 'Name the tension',
    subtitle: 'Fear, hope, and where your gut leans right now.',
  },
];

function ChoiceGroup({ name, value, onChange, options }) {
  return (
    <div className="grid gap-3 sm:grid-cols-1">
      {options.map((opt) => (
        <label
          key={opt.value}
          className={`cursor-pointer rounded-2xl border px-5 py-4 transition-all ${
            value === opt.value
              ? 'border-[#5de7ff] bg-[#5de7ff]/10 shadow-lg'
              : 'border-white/20 bg-white/5 hover:border-white/40'
          }`}
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={onChange}
            className="sr-only"
          />
          <span className="block text-lg font-medium" style={{ color: '#fff7e4' }}>
            {opt.label}
          </span>
          {opt.hint && (
            <span className="mt-1 block text-sm opacity-80" style={{ color: '#fff7e4' }}>
              {opt.hint}
            </span>
          )}
        </label>
      ))}
    </div>
  );
}

const EMPTY_FORM = {
  primaryDriver: '',
  thinkingStyle: '',
  longTermOutlook: '',
  externalPressure: '',
  valuesThatMatter: '',
  fearIfWrong: '',
  hopeIfRight: '',
  whoIsInfluencing: '',
  innerConflict: '',
  anythingElse: '',
  gutLean: '',
};

/**
 * @param {object} props
 * @param {boolean} [props.embedded] - Render inside Results (no page chrome)
 * @param {string} [props.decisionId]
 * @param {object} [props.decision]
 * @param {() => void} [props.onComplete] - After save (embedded)
 * @param {() => void} [props.onCancel] - Close reflection (embedded)
 */
export default function MindsetForm({
  embedded = false,
  decisionId: decisionIdProp,
  decision: decisionProp,
  onComplete,
  onCancel,
}) {
  const { id: paramId } = useParams();
  const decisionId = decisionIdProp || paramId;
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [decision, setDecision] = useState(decisionProp || null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (decisionProp) setDecision(decisionProp);
    else if (decisionId) {
      getDecision(decisionId)
        .then((res) => setDecision(res.data))
        .catch(() => toast.error('Could not load decision'));
    }
  }, [decisionId, decisionProp]);

  useEffect(() => {
    if (!decisionId) return;
    getMindset(decisionId)
      .then((res) => {
        const m = res.data;
        setForm({
          primaryDriver: m.primaryDriver || '',
          thinkingStyle: m.thinkingStyle || '',
          longTermOutlook: m.longTermOutlook || '',
          externalPressure: m.externalPressure || '',
          valuesThatMatter: m.valuesThatMatter || '',
          fearIfWrong: m.fearIfWrong || '',
          hopeIfRight: m.hopeIfRight || '',
          whoIsInfluencing: m.whoIsInfluencing || '',
          innerConflict: m.innerConflict || '',
          anythingElse: m.anythingElse || '',
          gutLean: m.gutLean || '',
        });
      })
      .catch(() => {});
  }, [decisionId]);

  const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const validateStep = () => {
    const s = STEPS[step].id;
    if (s === 'driver' && !form.primaryDriver) {
      toast.error('Pick what feels most true right now.');
      return false;
    }
    if (s === 'head-heart' && !form.thinkingStyle) {
      toast.error('Choose how you’re deciding today.');
      return false;
    }
    if (s === 'future' && !form.longTermOutlook) {
      toast.error('How does your future self feel about this?');
      return false;
    }
    if (s === 'pressure' && !form.externalPressure) {
      toast.error('Acknowledge the pressure — even if it’s “none”.');
      return false;
    }
    if (s === 'values') {
      return requireClearText(form.valuesThatMatter, {
        minChars: 8,
        message: 'Name at least one value in your own words.',
        onError: (m) => toast.error(m),
      });
    }
    if (s === 'close') {
      if (
        !requireClearText(form.fearIfWrong, { minChars: 6, onError: (m) => toast.error(m) }) ||
        !requireClearText(form.hopeIfRight, { minChars: 6, onError: (m) => toast.error(m) }) ||
        !form.gutLean
      ) {
        if (!form.gutLean) toast.error('Where does your gut lean — even slightly?');
        return false;
      }
    }
    return true;
  };

  const next = () => {
    if (!validateStep()) return;
    if (step < STEPS.length - 1) setStep(step + 1);
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
    else if (embedded && onCancel) onCancel();
    else if (embedded) onCancel?.();
    else navigate(`/decisions/${decisionId}/results`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    setSubmitting(true);
    try {
      await submitMindset(decisionId, form);
      toast.success('Reflection saved — updating your analysis…');
      if (embedded && onComplete) {
        onComplete();
      } else {
        navigate(`/decisions/${decisionId}/results`);
      }
    } catch (error) {
      toast.error('Could not save your reflection. Please try again.');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const current = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  const formBody = (
    <>
      <p className="text-center text-sm uppercase tracking-widest mb-2" style={{ color: '#5de7ff' }}>
        Deeper reflection · Step {step + 1} of {STEPS.length}
      </p>
      <div className="h-1 rounded-full bg-white/10 mb-6 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${progress}%`, backgroundColor: '#5de7ff' }}
        />
      </div>

      <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 font-['Limelight']" style={{ color: '#fff7e4' }}>
        {current.title}
      </h2>
      <p className="text-center text-base mb-6 opacity-90" style={{ color: '#fff7e4' }}>
        {current.subtitle}
      </p>
      {decision && (
        <p className="text-center text-sm mb-6 opacity-70" style={{ color: '#e98198' }}>
          {getDecisionDisplayTitle(decision)}
        </p>
      )}

      <form
        onSubmit={step === STEPS.length - 1 ? handleSubmit : (e) => { e.preventDefault(); next(); }}
        className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl space-y-6"
      >
        {current.id === 'driver' && (
          <ChoiceGroup
            name="primaryDriver"
            value={form.primaryDriver}
            onChange={(e) => setField('primaryDriver', e.target.value)}
            options={[
              { value: 'fear', label: 'Mostly fear', hint: 'Avoiding loss or a bad outcome.' },
              { value: 'desire', label: 'Mostly desire', hint: 'Reaching for something I want.' },
              { value: 'both', label: 'Both at once', hint: 'Pulled forward and held back.' },
            ]}
          />
        )}

        {current.id === 'head-heart' && (
          <ChoiceGroup
            name="thinkingStyle"
            value={form.thinkingStyle}
            onChange={(e) => setField('thinkingStyle', e.target.value)}
            options={[
              { value: 'logic', label: 'Logic leads', hint: 'Facts, costs, timelines.' },
              { value: 'emotion', label: 'Emotion leads', hint: 'Gut, identity, relationships.' },
              { value: 'mixed', label: 'Torn between both', hint: 'Head vs heart.' },
            ]}
          />
        )}

        {current.id === 'future' && (
          <ChoiceGroup
            name="longTermOutlook"
            value={form.longTermOutlook}
            onChange={(e) => setField('longTermOutlook', e.target.value)}
            options={[
              { value: 'aligned', label: 'Aligned long-term', hint: 'Future me would thank me.' },
              { value: 'uncertain', label: 'Honestly unsure', hint: 'Can’t picture it yet.' },
              { value: 'misaligned', label: 'May not fulfill me', hint: 'Right on paper, hollow inside.' },
            ]}
          />
        )}

        {current.id === 'pressure' && (
          <>
            <ChoiceGroup
              name="externalPressure"
              value={form.externalPressure}
              onChange={(e) => setField('externalPressure', e.target.value)}
              options={[
                { value: 'none', label: 'Mostly my call', hint: 'Little outside pressure.' },
                { value: 'some', label: 'Some voices', hint: 'Family, peers, culture.' },
                { value: 'heavy', label: 'Heavy pressure', hint: 'Feels obligatory.' },
              ]}
            />
            <textarea
              name="whoIsInfluencing"
              value={form.whoIsInfluencing}
              onChange={(e) => setField('whoIsInfluencing', e.target.value)}
              rows={2}
              placeholder="Optional: who or what is influencing you?"
              className="w-full rounded-xl border border-white/30 p-4 bg-white/10 focus:ring-2 focus:ring-cyan-400 outline-none"
              style={{ color: '#fff7e4' }}
            />
          </>
        )}

        {current.id === 'values' && (
          <textarea
            name="valuesThatMatter"
            value={form.valuesThatMatter}
            onChange={(e) => setField('valuesThatMatter', e.target.value)}
            rows={4}
            required
            placeholder="e.g. honesty, security, family time, growth…"
            className="w-full rounded-xl border border-white/30 p-4 bg-white/10 focus:ring-2 focus:ring-cyan-400 outline-none text-lg"
            style={{ color: '#fff7e4' }}
          />
        )}

        {current.id === 'close' && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#fff7e4' }}>
                If you choose wrong, what are you afraid might happen?
              </label>
              <textarea
                name="fearIfWrong"
                value={form.fearIfWrong}
                onChange={(e) => setField('fearIfWrong', e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-white/30 p-4 bg-white/10 focus:ring-2 focus:ring-cyan-400 outline-none"
                style={{ color: '#fff7e4' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#fff7e4' }}>
                If you choose right, what do you hope you’ll feel or gain?
              </label>
              <textarea
                name="hopeIfRight"
                value={form.hopeIfRight}
                onChange={(e) => setField('hopeIfRight', e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-white/30 p-4 bg-white/10 focus:ring-2 focus:ring-cyan-400 outline-none"
                style={{ color: '#fff7e4' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#fff7e4' }}>
                The tension in one sentence (optional)
              </label>
              <input
                name="innerConflict"
                value={form.innerConflict}
                onChange={(e) => setField('innerConflict', e.target.value)}
                className="w-full rounded-xl border border-white/30 p-4 bg-white/10 focus:ring-2 focus:ring-cyan-400 outline-none"
                style={{ color: '#fff7e4' }}
                placeholder="e.g. I want growth but fear leaving people behind"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: '#fff7e4' }}>
                Right now, your gut leans toward…
              </label>
              <ChoiceGroup
                name="gutLean"
                value={form.gutLean}
                onChange={(e) => setField('gutLean', e.target.value)}
                options={[
                  { value: 'A', label: `Option A — ${decision?.optionA?.title || 'A'}` },
                  { value: 'B', label: `Option B — ${decision?.optionB?.title || 'B'}` },
                  { value: 'unsure', label: 'Still genuinely unsure' },
                ]}
              />
            </div>
            <textarea
              name="anythingElse"
              value={form.anythingElse}
              onChange={(e) => setField('anythingElse', e.target.value)}
              rows={2}
              placeholder="Anything else? (optional)"
              className="w-full rounded-xl border border-white/30 p-4 bg-white/10 focus:ring-2 focus:ring-cyan-400 outline-none"
              style={{ color: '#fff7e4' }}
            />
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
          <button
            type="button"
            onClick={back}
            className="flex-1 py-3 rounded-xl border border-white/30 font-medium transition hover:bg-white/10"
            style={{ color: '#fff7e4' }}
          >
            {step === 0 ? (embedded ? 'Back to results' : 'Back') : 'Previous'}
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 py-3 rounded-xl font-bold transition hover:scale-[1.02] disabled:opacity-50"
            style={{ backgroundColor: '#5de7ff', color: '#1c2838' }}
          >
            {submitting
              ? 'Saving…'
              : step === STEPS.length - 1
                ? 'Update my analysis'
                : 'Continue'}
          </button>
        </div>
      </form>
    </>
  );

  if (embedded) {
    return <div className="max-w-2xl mx-auto">{formBody}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-10 md:py-16">{formBody}</div>
    </div>
  );
}
