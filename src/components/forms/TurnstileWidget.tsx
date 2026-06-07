import { Turnstile } from "@marsidev/react-turnstile";

interface Props {
  onSuccess: (token: string) => void;
  onExpire: () => void;
  onError: () => void;
}

export function TurnstileWidget({ onSuccess, onExpire, onError }: Props) {
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

  if (!siteKey) {
    // Turnstile not configured in this environment — auto-grant a placeholder
    // token so forms remain usable during local development.
    // The Edge Function skips verification when TURNSTILE_SECRET_KEY is unset.
    setTimeout(() => onSuccess("dev-token"), 0);
    return null;
  }

  return (
    <Turnstile
      siteKey={siteKey}
      onSuccess={onSuccess}
      onExpire={onExpire}
      onError={onError}
      options={{
        theme: "dark",
        size: "invisible",
      }}
    />
  );
}
