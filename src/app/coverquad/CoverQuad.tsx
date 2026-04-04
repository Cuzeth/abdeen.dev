'use client';

import { useState, useRef, useCallback, type DragEvent, type ChangeEvent, type KeyboardEvent } from 'react';
import styles from './coverquad.module.css';

// --- Types ---

interface SlotData {
  img: HTMLImageElement;
  objectUrl: string;
  label: string;
}

type SlotState = SlotData | null;

type ModalState = 'none' | 'choice' | 'search';

interface AlbumResult {
  id: string;
  title: string;
  artist: string;
  year: string;
  thumb: string;
  fullArt: string;
}

type ExportSize = 3000 | 2000 | 1000;

// --- Component ---

export default function CoverQuad() {
  const [slots, setSlots] = useState<[SlotState, SlotState, SlotState, SlotState]>([null, null, null, null]);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [modal, setModal] = useState<ModalState>('none');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<AlbumResult[]>([]);
  const [failedThumbs, setFailedThumbs] = useState<Set<string>>(new Set());
  const [searchError, setSearchError] = useState('');
  const [searching, setSearching] = useState(false);
  const [loadingSlot, setLoadingSlot] = useState<number | null>(null);
  const [exportSize, setExportSize] = useState<ExportSize>(3000);

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([null, null, null, null]);

  const allFilled = slots.every(Boolean);

  const closeAllModals = useCallback(() => {
    setModal('none');
    setSearchQuery('');
    setSearchResults([]);
    setSearchError('');
    setSearching(false);
  }, []);

  const loadImageFromUrl = useCallback((url: string): Promise<{ img: HTMLImageElement; objectUrl: string }> => {
    return fetch(url)
      .then((res) => res.blob())
      .then((blob) => {
        const objectUrl = URL.createObjectURL(blob);
        return new Promise<{ img: HTMLImageElement; objectUrl: string }>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve({ img, objectUrl });
          img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error('Failed to load image'));
          };
          img.src = objectUrl;
        });
      });
  }, []);

  const loadImageFromFile = useCallback((file: File): Promise<{ img: HTMLImageElement; objectUrl: string }> => {
    return new Promise((resolve, reject) => {
      const objectUrl = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => resolve({ img, objectUrl });
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Failed to load image'));
      };
      img.src = objectUrl;
    });
  }, []);

  const setSlot = useCallback((index: number, data: SlotData | null) => {
    setSlots((prev) => {
      const next = [...prev] as [SlotState, SlotState, SlotState, SlotState];
      const old = prev[index];
      if (old) URL.revokeObjectURL(old.objectUrl);
      next[index] = data;
      return next;
    });
  }, []);

  const handleSlotClick = (index: number) => {
    setActiveSlot(index);
    setModal('choice');
  };

  const handleClear = (index: number) => {
    setSlot(index, null);
  };

  const handleUploadChoice = () => {
    setModal('none');
    if (activeSlot !== null) {
      fileInputRefs.current[activeSlot]?.click();
    }
  };

  const handleSearchChoice = () => {
    setModal('search');
    setSearchQuery('');
    setSearchResults([]);
    setSearchError('');
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { img, objectUrl } = await loadImageFromFile(file);
      setSlot(index, { img, objectUrl, label: file.name });
    } catch {
      // silently fail
    }
    e.target.value = '';
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    try {
      const { img, objectUrl } = await loadImageFromFile(file);
      setSlot(index, { img, objectUrl, label: file.name });
    } catch {
      // silently fail
    }
  };

  const performSearch = async () => {
    const term = searchQuery.trim();
    if (!term) return;

    setSearchResults([]);
    setFailedThumbs(new Set());
    setSearchError('');
    setSearching(true);

    try {
      const mbUrl = `https://musicbrainz.org/ws/2/release-group?query=${encodeURIComponent(term)}&fmt=json&limit=16`;
      const res = await fetch(mbUrl, {
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) throw new Error('Search failed');

      const data = await res.json() as {
        'release-groups': {
          id: string;
          title: string;
          'primary-type'?: string;
          'first-release-date'?: string;
          'artist-credit'?: { name: string }[];
        }[];
      };

      const groups = data['release-groups'] || [];
      const results: AlbumResult[] = groups
        .filter((g) => g.title && g['artist-credit']?.length)
        .map((g) => {
          const artist = g['artist-credit']!.map((a) => a.name).join(', ');
          const year = g['first-release-date']?.slice(0, 4) || '';
          return {
            id: g.id,
            title: g.title,
            artist,
            year,
            thumb: `https://coverartarchive.org/release-group/${g.id}/front-250`,
            fullArt: `https://coverartarchive.org/release-group/${g.id}/front-1200`,
          };
        });

      setSearching(false);

      if (results.length === 0) {
        setSearchError('No results found.');
        return;
      }

      setSearchResults(results);
    } catch {
      setSearching(false);
      setSearchError('Search failed. Try again.');
    }
  };

  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') performSearch();
  };

  const selectAlbumArt = async (album: AlbumResult) => {
    if (activeSlot === null) return;
    const slotIndex = activeSlot;

    closeAllModals();
    setLoadingSlot(slotIndex);

    try {
      const proxyUrl = `/api/cover-proxy?url=${encodeURIComponent(album.fullArt)}`;
      const { img, objectUrl } = await loadImageFromUrl(proxyUrl);
      setSlot(slotIndex, { img, objectUrl, label: `${album.title} \u2014 ${album.artist}` });
    } catch {
      // silently fail
    } finally {
      setLoadingSlot(null);
    }
  };

  const handleExport = () => {
    if (!allFilled) return;

    const size = exportSize;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const half = size / 2;
    const positions: [number, number][] = [
      [0, 0],
      [half, 0],
      [0, half],
      [half, half],
    ];

    positions.forEach(([dx, dy], i) => {
      const slotData = slots[i];
      if (!slotData) return;
      const { img } = slotData;
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const side = Math.min(w, h);
      const sx = (w - side) / 2;
      const sy = (h - side) / 2;
      ctx.drawImage(img, sx, sy, side, side, dx, dy, half, half);
    });

    canvas.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'coverquad.png';
      a.click();
      URL.revokeObjectURL(a.href);
    }, 'image/png');
  };

  const handleOverlayKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') closeAllModals();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        {slots.map((slot, i) => (
          <div
            key={i}
            className={`${styles.slot} ${slot ? styles.filled : ''}`}
            onClick={() => handleSlotClick(i)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, i)}
          >
            <div className={styles.slotEmpty}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
            {slot && (
              // eslint-disable-next-line @next/next/no-img-element
              <img className={styles.slotImg} src={slot.img.src} alt={slot.label} />
            )}
            {slot && (
              <button
                className={styles.slotClear}
                title="Clear"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear(i);
                }}
              >
                &times;
              </button>
            )}
            {loadingSlot === i && (
              <div className={styles.slotLoading}>
                <div className={styles.spinner} />
              </div>
            )}
            <input
              ref={(el) => { fileInputRefs.current[i] = el; }}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => handleFileChange(e, i)}
            />
          </div>
        ))}
      </div>

      <div className={styles.controls}>
        <select
          className={styles.select}
          value={exportSize}
          onChange={(e) => setExportSize(Number(e.target.value) as ExportSize)}
        >
          <option value={3000}>3000px (Full)</option>
          <option value={2000}>2000px (Medium)</option>
          <option value={1000}>1000px (Small)</option>
        </select>
        <button
          className={styles.btnExport}
          disabled={!allFilled}
          onClick={handleExport}
        >
          Export PNG
        </button>
      </div>

      {modal === 'choice' && (
        <div className={styles.overlay} onClick={closeAllModals} onKeyDown={handleOverlayKeyDown} tabIndex={-1}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={closeAllModals}>&times;</button>
            <div className={styles.modalTitle}>Add Cover Art</div>
            <div className={styles.choiceButtons}>
              <button className={styles.choiceBtn} onClick={handleUploadChoice}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Upload Image
              </button>
              <button className={styles.choiceBtn} onClick={handleSearchChoice}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                Search Album Art
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === 'search' && (
        <div className={styles.overlay} onClick={closeAllModals} onKeyDown={handleOverlayKeyDown} tabIndex={-1}>
          <div className={`${styles.modal} ${styles.searchModal}`} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={closeAllModals}>&times;</button>
            <div className={styles.modalTitle}>Search Album Art</div>
            <div className={styles.searchBar}>
              <input
                className={styles.searchInput}
                type="text"
                placeholder="Artist or album name…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                autoFocus
              />
              <button className={styles.btnSearch} onClick={performSearch} disabled={searching}>
                Search
              </button>
            </div>

            {searching && (
              <div className={styles.searchSpinner}>
                <div className={styles.spinner} />
              </div>
            )}

            {searchError && <div className={styles.searchMessage}>{searchError}</div>}

            {searchResults.length > 0 && failedThumbs.size === searchResults.length && (
              <div className={styles.searchMessage}>No cover art available for these results.</div>
            )}

            {searchResults.length > 0 && (
              <div className={styles.searchResultsGrid}>
                {searchResults
                  .filter((album) => !failedThumbs.has(album.id))
                  .map((album) => (
                  <button
                    key={album.id}
                    className={styles.searchResult}
                    onClick={() => selectAlbumArt(album)}
                    title={`${album.title} \u2014 ${album.artist}${album.year ? ` (${album.year})` : ''}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/api/cover-proxy?url=${encodeURIComponent(album.thumb)}`}
                      alt={`${album.title} by ${album.artist}`}
                      loading="lazy"
                      onError={() => setFailedThumbs((prev) => new Set(prev).add(album.id))}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
