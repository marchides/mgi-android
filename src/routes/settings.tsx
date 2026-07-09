import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, Eye, EyeOff, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { MgiLogo } from "@/components/mgi/MgiLogo";
import { useSettings } from "@/lib/mgi/store";
import { verifyApiKey } from "@/lib/mgi/openrouter";
import { ACCENTS } from "@/lib/mgi/themes";
import type {
  AccentName,
  HistoryMode,
  ReasoningEffort,
  RoutingMode,
  ThemeMode,
} from "@/lib/mgi/types";
import { MAX_OUTPUT_PRESETS, MODEL_PRESETS } from "@/lib/mgi/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [{ title: "Settings — MGI" }],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { settings, update, updateParams } = useSettings();
  const [showKey, setShowKey] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [customModel, setCustomModel] = useState("");

  async function onVerify() {
    setVerifying(true);
    const res = await verifyApiKey(settings.apiKey);
    setVerifying(false);
    update({ keyStatus: res.ok ? "valid" : "invalid" });
    if (res.ok) toast.success(res.message);
    else toast.error(res.message);
  }

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-2xl flex-col bg-background text-foreground">
      <header className="sticky top-0 z-10 flex items-center gap-2 border-b border-border bg-background/85 backdrop-blur px-3 py-2.5">
        <Link
          to="/"
          className="grid h-9 w-9 place-items-center rounded-lg hover:bg-muted"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <MgiLogo size={26} />
        <h1 className="text-base font-semibold">Settings</h1>
      </header>

      <div className="mgi-scroll flex-1 overflow-y-auto px-3 py-4 space-y-4">
        {/* API Key */}
        <Card title="OpenRouter API Key" description="Stored locally on this device only. Never logged or shared.">
          <div className="flex items-center gap-2">
            <input
              type={showKey ? "text" : "password"}
              autoComplete="off"
              spellCheck={false}
              value={settings.apiKey}
              onChange={(e) => update({ apiKey: e.target.value, keyStatus: "unknown" })}
              placeholder="sk-or-v1-..."
              className="flex-1 rounded-lg border border-border bg-input/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={() => setShowKey((s) => !s)}
              className="grid h-9 w-9 place-items-center rounded-lg hover:bg-muted"
              aria-label={showKey ? "Hide" : "Show"}
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <StatusPill status={settings.keyStatus} hasKey={settings.apiKey.trim().length > 0} />
            <div className="flex-1" />
            <button
              onClick={onVerify}
              disabled={verifying || !settings.apiKey.trim()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs hover:bg-muted disabled:opacity-50"
            >
              {verifying ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
              Verify
            </button>
            <button
              onClick={() => {
                if (!confirm("Clear the saved API key?")) return;
                update({ apiKey: "", keyStatus: "unknown" });
                toast.success("API key cleared.");
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-destructive hover:bg-muted"
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear
            </button>
          </div>
          <p className="pt-1 text-[11px] text-muted-foreground">
            Get a key at openrouter.ai/keys
          </p>
        </Card>

        {/* Model */}
        <Card title="Model" description="Pick a preset or enter any OpenRouter model ID.">
          <div className="grid grid-cols-2 gap-2">
            {MODEL_PRESETS.map((m) => (
              <PillButton
                key={m.id}
                selected={settings.model === m.id}
                onClick={() => update({ model: m.id })}
              >
                {m.label}
              </PillButton>
            ))}
          </div>
          <div className="flex items-center gap-2 pt-3">
            <input
              value={customModel}
              onChange={(e) => setCustomModel(e.target.value)}
              placeholder="Custom model ID (e.g. z-ai/glm-6.0)"
              className="flex-1 rounded-lg border border-border bg-input/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={() => {
                if (!customModel.trim()) return;
                update({ model: customModel.trim() });
                toast.success(`Model set to ${customModel.trim()}`);
                setCustomModel("");
              }}
              className="rounded-lg border border-border bg-card px-3 py-2 text-xs hover:bg-muted"
            >
              Use
            </button>
          </div>
          <p className="pt-2 text-[11px] text-muted-foreground">
            Current: <span className="font-mono">{settings.model}</span>
          </p>
        </Card>

        {/* Routing */}
        <Card title="Routing mode" description="How OpenRouter picks the provider.">
          <div className="grid grid-cols-3 gap-2">
            {(["balanced", "cheapest", "fastest"] as RoutingMode[]).map((r) => (
              <PillButton
                key={r}
                selected={settings.routingMode === r}
                onClick={() => update({ routingMode: r })}
              >
                {r[0].toUpperCase() + r.slice(1)}
              </PillButton>
            ))}
          </div>
        </Card>

        {/* System prompt */}
        <Card title="System prompt" description="Optional. Sent as the system message.">
          <textarea
            value={settings.systemPrompt}
            onChange={(e) => update({ systemPrompt: e.target.value })}
            rows={4}
            placeholder="You are a helpful assistant..."
            className="mgi-scroll w-full resize-none rounded-lg border border-border bg-input/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </Card>

        {/* History */}
        <Card title="History mode" description="Control what gets sent each turn.">
          <div className="grid grid-cols-3 gap-2">
            {([
              ["full", "Full"],
              ["recent", "Recent"],
              ["trim", "Auto-trim"],
            ] as [HistoryMode, string][]).map(([v, l]) => (
              <PillButton
                key={v}
                selected={settings.historyMode === v}
                onClick={() => update({ historyMode: v })}
              >
                {l}
              </PillButton>
            ))}
          </div>
          {settings.historyMode === "recent" && (
            <div className="pt-3">
              <NumberField
                label={`Recent messages: ${settings.recentCount}`}
                value={settings.recentCount}
                min={2}
                max={100}
                step={1}
                onChange={(v) => update({ recentCount: v })}
              />
            </div>
          )}
        </Card>

        {/* Model parameters */}
        <Card title="Model parameters" description="Fine-tune GLM behavior.">
          <SliderField
            label="Temperature"
            value={settings.params.temperature}
            min={0}
            max={2}
            step={0.05}
            onChange={(v) => updateParams({ temperature: v })}
          />
          <SliderField
            label="Top P"
            value={settings.params.top_p}
            min={0}
            max={1}
            step={0.01}
            onChange={(v) => updateParams({ top_p: v })}
          />
          <NumberField
            label="Top K (0 = disabled)"
            value={settings.params.top_k}
            min={0}
            max={500}
            step={1}
            onChange={(v) => updateParams({ top_k: v })}
          />
          <SliderField
            label="Frequency penalty"
            value={settings.params.frequency_penalty}
            min={-2}
            max={2}
            step={0.05}
            onChange={(v) => updateParams({ frequency_penalty: v })}
          />
          <SliderField
            label="Presence penalty"
            value={settings.params.presence_penalty}
            min={-2}
            max={2}
            step={0.05}
            onChange={(v) => updateParams({ presence_penalty: v })}
          />
          <SliderField
            label="Repetition penalty"
            value={settings.params.repetition_penalty}
            min={0}
            max={2}
            step={0.05}
            onChange={(v) => updateParams({ repetition_penalty: v })}
          />

          <div className="pt-2">
            <div className="mb-1.5 text-xs font-medium text-muted-foreground">Reasoning effort</div>
            <div className="grid grid-cols-2 gap-2">
              {(["high", "xhigh"] as ReasoningEffort[]).map((r) => (
                <PillButton
                  key={r}
                  selected={settings.params.reasoning_effort === r}
                  onClick={() => updateParams({ reasoning_effort: r })}
                >
                  {r === "high" ? "High" : "X-High"}
                </PillButton>
              ))}
            </div>
          </div>

          <label className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2 text-sm">
            <span>Include reasoning in stream</span>
            <input
              type="checkbox"
              checked={settings.params.include_reasoning}
              onChange={(e) => updateParams({ include_reasoning: e.target.checked })}
              className="h-4 w-4 accent-primary"
            />
          </label>

          <div className="pt-3">
            <div className="mb-1.5 text-xs font-medium text-muted-foreground">
              Max output tokens
            </div>
            <div className="grid grid-cols-3 gap-2">
              {MAX_OUTPUT_PRESETS.map((p) => (
                <PillButton
                  key={p.label}
                  selected={settings.params.max_output_tokens === p.value}
                  onClick={() => updateParams({ max_output_tokens: p.value })}
                >
                  <div className="flex flex-col leading-tight">
                    <span>{p.label}</span>
                    <span className="text-[10px] opacity-70">
                      {p.value === "max" ? "dynamic" : formatTokens(p.value)}
                    </span>
                  </div>
                </PillButton>
              ))}
            </div>
          </div>
        </Card>

        {/* Theme */}
        <Card title="Appearance" description="Theme mode and accent color.">
          <div className="grid grid-cols-3 gap-2">
            {(["light", "dark", "system"] as ThemeMode[]).map((t) => (
              <PillButton
                key={t}
                selected={settings.themeMode === t}
                onClick={() => update({ themeMode: t })}
              >
                {t[0].toUpperCase() + t.slice(1)}
              </PillButton>
            ))}
          </div>
          <div className="pt-3">
            <div className="mb-2 text-xs font-medium text-muted-foreground">
              Accent color
            </div>
            <div className="grid grid-cols-4 gap-2">
              {ACCENTS.map((a) => (
                <AccentSwatch
                  key={a.name}
                  name={a.name}
                  oklchLight={a.light}
                  oklchDark={a.dark}
                  label={a.label}
                  selected={settings.accent === a.name}
                  onClick={() => update({ accent: a.name })}
                />
              ))}
            </div>
          </div>
        </Card>

        <div className="py-6 text-center text-[11px] text-muted-foreground">
          Monty's GLM Interface · MGI v1.0
        </div>
      </div>
    </div>
  );
}

// ---- Reusable UI bits ----

function Card({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <h2 className="font-display text-sm font-semibold">{title}</h2>
      {description && (
        <p className="mt-0.5 text-[11px] text-muted-foreground">{description}</p>
      )}
      <div className="mt-3 space-y-2">{children}</div>
    </section>
  );
}

function PillButton({
  selected,
  onClick,
  children,
}: {
  selected?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-lg border px-3 py-2 text-xs font-medium transition",
        selected
          ? "border-transparent bg-primary text-primary-foreground shadow"
          : "border-border bg-card hover:bg-muted",
      )}
    >
      {children}
    </button>
  );
}

function SliderField({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-muted-foreground">{label}</span>
        <span className="font-mono">{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="mt-1 w-full accent-primary"
      />
    </div>
  );
}

function NumberField({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-1 text-xs font-medium text-muted-foreground">{label}</div>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="w-full rounded-lg border border-border bg-input/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}

function StatusPill({
  status,
  hasKey,
}: {
  status: "unknown" | "valid" | "invalid";
  hasKey: boolean;
}) {
  if (!hasKey)
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
        Missing key
      </span>
    );
  const cfg = {
    unknown: { color: "bg-muted-foreground", label: "Unverified" },
    valid: { color: "bg-emerald-500", label: "Valid" },
    invalid: { color: "bg-destructive", label: "Invalid" },
  }[status];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">
      <span className={cn("h-1.5 w-1.5 rounded-full", cfg.color)} />
      {cfg.label}
    </span>
  );
}

function AccentSwatch({
  name,
  oklchLight,
  oklchDark,
  label,
  selected,
  onClick,
}: {
  name: AccentName;
  oklchLight: string;
  oklchDark: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex flex-col items-center gap-1 rounded-lg border px-2 py-2 transition",
        selected ? "border-primary bg-accent" : "border-border hover:bg-muted",
      )}
      aria-label={label}
      title={label}
    >
      <span
        className="h-8 w-8 rounded-full shadow-inner"
        style={{
          background: `linear-gradient(135deg, oklch(${oklchLight}), oklch(${oklchDark}))`,
        }}
      />
      <span className="text-[10px] text-muted-foreground group-hover:text-foreground">
        {label}
      </span>
      {selected && <span className="sr-only">Selected {name}</span>}
    </button>
  );
}

function formatTokens(n: number): string {
  if (n >= 1000) return `${Math.round(n / 1000)}k`;
  return String(n);
}
