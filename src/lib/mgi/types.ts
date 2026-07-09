export type Role = "system" | "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
  reasoning?: string;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
  error?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
  systemPromptOverride?: string;
}

export type RoutingMode = "balanced" | "cheapest" | "fastest";
export type ReasoningEffort = "high" | "xhigh";
export type HistoryMode = "full" | "recent" | "trim";
export type ThemeMode = "light" | "dark" | "system";
export type AccentName =
  | "yellow"
  | "hotOrange"
  | "cobalt"
  | "purple"
  | "red"
  | "emerald"
  | "lime";

export interface ModelParameters {
  temperature: number;
  top_p: number;
  top_k: number;
  frequency_penalty: number;
  presence_penalty: number;
  repetition_penalty: number;
  reasoning_effort: ReasoningEffort;
  include_reasoning: boolean;
  max_output_tokens: number | "max"; // "max" = dynamic max possible
}

export interface AppSettings {
  apiKey: string;
  model: string;
  routingMode: RoutingMode;
  systemPrompt: string;
  historyMode: HistoryMode;
  recentCount: number;
  params: ModelParameters;
  themeMode: ThemeMode;
  accent: AccentName;
  keyStatus: "unknown" | "valid" | "invalid";
}

export const MODEL_PRESETS: { id: string; label: string }[] = [
  { id: "z-ai/glm-5.2", label: "GLM-5.2" },
  { id: "z-ai/glm-5.2:floor", label: "GLM-5.2 Cheapest" },
  { id: "z-ai/glm-5.1", label: "GLM-5.1" },
  { id: "z-ai/glm-4.6", label: "GLM-4.6" },
];

export const MAX_OUTPUT_PRESETS: { label: string; value: number | "max" }[] = [
  { label: "Short", value: 1024 },
  { label: "Normal", value: 4096 },
  { label: "Long", value: 16384 },
  { label: "Huge", value: 65536 },
  { label: "Extreme", value: 131072 },
  { label: "Max Possible", value: "max" },
];

export const CONTEXT_WINDOW_TOKENS = 1_048_576;
export const MAX_OUTPUT_TOKENS_CAP = 1_048_576;
export const SAFETY_BUFFER = 1024;

export const DEFAULT_SETTINGS: AppSettings = {
  apiKey: "",
  model: "z-ai/glm-5.2",
  routingMode: "balanced",
  systemPrompt: "",
  historyMode: "full",
  recentCount: 10,
  params: {
    temperature: 1.0,
    top_p: 0.95,
    top_k: 0,
    frequency_penalty: 0,
    presence_penalty: 0,
    repetition_penalty: 1,
    reasoning_effort: "high",
    include_reasoning: false,
    max_output_tokens: 4096,
  },
  themeMode: "system",
  accent: "cobalt",
  keyStatus: "unknown",
};
