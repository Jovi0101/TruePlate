export type SaveOutcome = { ok: true } | { ok: false; reason: 'unavailable' | 'declined' | 'error' };

export async function saveFileViaClaude(filename: string, data: Blob): Promise<SaveOutcome> {
  try {
    const w = window as any;
    if (!w.claude?.use) return { ok: false, reason: 'unavailable' };
    const downloads = await w.claude.use('downloads');
    if (!downloads) return { ok: false, reason: 'unavailable' };
    await downloads.save({ filename, data });
    return { ok: true };
  } catch (e: any) {
    if (e?.code === 'declined') return { ok: false, reason: 'declined' };
    return { ok: false, reason: 'error' };
  }
}
