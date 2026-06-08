import { Turnstile } from "@marsidev/react-turnstile";

interface Props {
  onSuccess: (token: string) => void;
  onExpire: () => void;
  onError: () => void;
}

export function TurnstileWidget({ onSuccess, onExpire, onError }: Props) {
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

  if (!siteKey) {
    if (import.meta.env.DEV) {
      setTimeout(() => onSuccess("dev-token"), 0);
    }
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
