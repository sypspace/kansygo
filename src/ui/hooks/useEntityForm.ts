import { useCallback, useState } from "react";

import { toUserMessage, ValidationError, type FieldErrors } from "@/domain/errors";

type Validate<TValues> = (values: TValues) => { ok: true } | { ok: false; errors: FieldErrors };

export interface SaveOptions<TValues> {
  validate?: Validate<TValues>;
  run: (values: TValues) => Promise<void>;
}

export interface EntityForm<TValues> {
  values: TValues;
  errors: FieldErrors;
  message: string | null;
  saving: boolean;
  setField: <K extends keyof TValues>(key: K, value: TValues[K]) => void;
  replaceValues: (values: TValues) => void;
  clearFeedback: () => void;
  /** Mengembalikan true bila penyimpanan berhasil. */
  save: (options: SaveOptions<TValues>) => Promise<boolean>;
}

/**
 * State form master data.
 *
 * Validasi dijalankan di UI untuk umpan balik cepat, sedangkan aturan yang sama
 * tetap diverifikasi ulang oleh lapisan application sebelum disimpan
 * (AGENTS.md §14). Error domain diterjemahkan menjadi pesan yang dapat dibaca
 * pengguna.
 */
export function useEntityForm<TValues>(initialValues: TValues): EntityForm<TValues> {
  const [values, setValues] = useState<TValues>(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const setField = useCallback(<K extends keyof TValues>(key: K, value: TValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
  }, []);

  const clearFeedback = useCallback(() => {
    setErrors({});
    setMessage(null);
  }, []);

  const save = useCallback(
    async ({ validate, run }: SaveOptions<TValues>): Promise<boolean> => {
      if (validate !== undefined) {
        const result = validate(values);

        if (!result.ok) {
          setErrors(result.errors);
          setMessage(null);
          return false;
        }
      }

      setErrors({});
      setMessage(null);
      setSaving(true);

      try {
        await run(values);
        return true;
      } catch (caught) {
        if (caught instanceof ValidationError) {
          setErrors(caught.errors);
        } else {
          setMessage(toUserMessage(caught));
        }

        return false;
      } finally {
        setSaving(false);
      }
    },
    [values],
  );

  return { values, errors, message, saving, setField, replaceValues: setValues, clearFeedback, save };
}
