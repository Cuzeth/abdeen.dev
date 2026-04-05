"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import styles from "./lofi-atc.module.css";

interface LofiStation {
  name: string;
  url: string;
  credit: string;
  creditUrl: string;
}

const LOFI_STATIONS: LofiStation[] = [
  {
    name: "Lofi",
    url: "https://play.streamafrica.net/lofiradio",
    credit: "Stream Africa",
    creditUrl: "https://streamafrica.net",
  },
  {
    name: "Chill",
    url: "https://streams.ilovemusic.de/iloveradio17.mp3",
    credit: "iLoveRadio",
    creditUrl: "https://ilovemusic.de",
  },
  {
    name: "Ambient",
    url: "https://phoebe.streamerr.co:1140/ambient.mp3",
    credit: "Ambient FM",
    creditUrl: "https://ambient.fm",
  },
];

const ATC_SOURCE = {
  url: "http://d.liveatc.net/kjfk9_s",
  credit: "LiveATC.net",
  creditUrl: "https://www.liveatc.net",
  label: "JFK Gnd/Twr",
};

const BARS = 11;

type StreamStatus = "idle" | "connecting" | "live" | "error";

// Module-level set so cleanup can always find and kill active audio,
// even if React refs have been cleared by the time cleanup runs.
const activeAudios = new Set<HTMLAudioElement>();

function killAllAudio() {
  activeAudios.forEach((a) => {
    a.pause();
    a.src = "";
    a.load();
  });
  activeAudios.clear();
}

export default function LofiAtcRadio() {
  const lofiRef = useRef<HTMLAudioElement | null>(null);
  const atcRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mergerRef = useRef<ChannelMergerNode | null>(null);
  const rafRef = useRef<number>(0);
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [playing, setPlaying] = useState(false);
  const [stationIdx, setStationIdx] = useState(0);
  const [lofiVol, setLofiVol] = useState(0.35);
  const [atcVol, setAtcVol] = useState(0.5);
  const [lofiStatus, setLofiStatus] = useState<StreamStatus>("idle");
  const [atcStatus, setAtcStatus] = useState<StreamStatus>("idle");

  const station = LOFI_STATIONS[stationIdx];

  // stop everything on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      killAllAudio();
      ctxRef.current?.close();
      ctxRef.current = null;
      analyserRef.current = null;
      mergerRef.current = null;
      lofiRef.current = null;
      atcRef.current = null;
    };
  }, []);

  const getAudioContext = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const startVisualizer = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const tick = () => {
      analyser.getByteFrequencyData(dataArray);

      const len = dataArray.length;
      for (let i = 0; i < BARS; i++) {
        const bar = barsRef.current[i];
        if (!bar) continue;
        // sample from lower-mid frequencies where lofi energy lives
        const idx = Math.floor((i / BARS) * len * 0.4);
        const val = dataArray[idx] / 255;
        const h = 4 + val * 28;
        const o = 0.3 + val * 0.7;
        bar.style.height = `${h}px`;
        bar.style.opacity = `${o}`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    tick();
  }, []);

  const stopVisualizer = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    for (let i = 0; i < BARS; i++) {
      const bar = barsRef.current[i];
      if (!bar) continue;
      bar.style.height = "4px";
      bar.style.opacity = "0.25";
    }
  }, []);

  const ensureAnalyserGraph = useCallback(() => {
    const ctx = getAudioContext();
    if (!analyserRef.current) {
      const merger = ctx.createGain();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.8;
      merger.connect(analyser);
      analyser.connect(ctx.destination);
      mergerRef.current = merger;
      analyserRef.current = analyser;
    }
    return { ctx, merger: mergerRef.current! };
  }, [getAudioContext]);

  const connectToGraph = useCallback(
    (audio: HTMLAudioElement) => {
      const { ctx, merger } = ensureAnalyserGraph();
      const source = ctx.createMediaElementSource(audio);
      source.connect(merger);
    },
    [ensureAnalyserGraph],
  );

  const createAudio = useCallback(
    (
      url: string,
      volume: number,
      setStatus: (s: StreamStatus) => void,
    ): HTMLAudioElement => {
      const audio = new Audio(url);
      audio.crossOrigin = "anonymous";
      audio.volume = volume;
      setStatus("connecting");
      activeAudios.add(audio);

      audio.addEventListener("playing", () => setStatus("live"));
      audio.addEventListener("error", () => setStatus("error"));
      audio.addEventListener("stalled", () => setStatus("connecting"));
      audio.addEventListener("waiting", () => setStatus("connecting"));

      connectToGraph(audio);

      return audio;
    },
    [connectToGraph],
  );

  const startStreams = useCallback(
    (lofiUrl: string) => {
      const lofi = createAudio(lofiUrl, lofiVol, setLofiStatus);
      const atc = createAudio(ATC_SOURCE.url, atcVol, setAtcStatus);
      lofiRef.current = lofi;
      atcRef.current = atc;
      lofi.play().catch(() => setLofiStatus("error"));
      atc.play().catch(() => setAtcStatus("error"));
      setPlaying(true);
      startVisualizer();
    },
    [lofiVol, atcVol, createAudio, startVisualizer],
  );

  const stopStreams = useCallback(() => {
    killAllAudio();
    lofiRef.current = null;
    atcRef.current = null;
    setPlaying(false);
    setLofiStatus("idle");
    setAtcStatus("idle");
    stopVisualizer();
  }, [stopVisualizer]);

  const handlePlay = useCallback(() => {
    if (playing) {
      stopStreams();
      return;
    }
    startStreams(station.url);
  }, [playing, station.url, startStreams, stopStreams]);

  const handleStationChange = useCallback(
    (idx: number) => {
      setStationIdx(idx);
      if (playing) {
        const old = lofiRef.current;
        if (old) {
          old.pause();
          old.src = "";
          old.load();
          activeAudios.delete(old);
        }
        lofiRef.current = null;
        stopVisualizer();
        setLofiStatus("connecting");
        const lofi = createAudio(
          LOFI_STATIONS[idx].url,
          lofiVol,
          setLofiStatus,
        );
        lofiRef.current = lofi;
        lofi.play().catch(() => setLofiStatus("error"));
        startVisualizer();
      }
    },
    [playing, lofiVol, createAudio, startVisualizer, stopVisualizer],
  );

  const handleLofiVol = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = parseFloat(e.target.value);
      setLofiVol(v);
      if (lofiRef.current) lofiRef.current.volume = v;
    },
    [],
  );

  const handleAtcVol = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = parseFloat(e.target.value);
      setAtcVol(v);
      if (atcRef.current) atcRef.current.volume = v;
    },
    [],
  );

  const statusLabel = (s: StreamStatus) => {
    if (s === "idle") return "Offline";
    if (s === "connecting") return "Connecting";
    if (s === "live") return "Live";
    return "Error";
  };

  return (
    <div className={styles.container}>
      {/* soundwave */}
      <div className={styles.waveWrap} aria-hidden="true">
        {Array.from({ length: BARS }).map((_, i) => (
          <div
            key={i}
            ref={(el) => { barsRef.current[i] = el; }}
            className={styles.bar}
          />
        ))}
      </div>

      {/* play / pause */}
      <button
        className={`${styles.playBtn} ${playing ? styles.playBtnPlaying : ""}`}
        onClick={handlePlay}
        aria-label={playing ? "Stop radio" : "Play radio"}
      >
        {playing && <span className={styles.pulse} />}
        {playing ? (
          <svg className={styles.playIcon} viewBox="0 0 24 24">
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg className={styles.playIcon} viewBox="0 0 24 24">
            <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11.04-6.86a1 1 0 0 0 0-1.72L9.5 4.28A1 1 0 0 0 8 5.14z" />
          </svg>
        )}
      </button>

      {/* status badges */}
      <div className={styles.statusRow}>
        <span className={styles.statusBadge}>
          <span
            className={`${styles.dot} ${lofiStatus === "live" ? styles.dotLive : ""} ${lofiStatus === "error" ? styles.dotError : ""}`}
          />
          Lo-fi &middot; {statusLabel(lofiStatus)}
        </span>
        <span className={styles.statusBadge}>
          <span
            className={`${styles.dot} ${atcStatus === "live" ? styles.dotLive : ""} ${atcStatus === "error" ? styles.dotError : ""}`}
          />
          ATC &middot; {statusLabel(atcStatus)}
        </span>
      </div>

      {/* station switcher */}
      <div className={styles.stationPicker} role="radiogroup" aria-label="Lo-fi station">
        {LOFI_STATIONS.map((s, i) => (
          <button
            key={s.url}
            className={`${styles.stationBtn} ${i === stationIdx ? styles.stationBtnActive : ""}`}
            onClick={() => handleStationChange(i)}
            role="radio"
            aria-checked={i === stationIdx}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* volume sliders */}
      <div className={styles.sliders}>
        <div className={styles.sliderGroup}>
          <label className={styles.sliderLabel} htmlFor="lofi-vol">
            Lo-fi
          </label>
          <input
            id="lofi-vol"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={lofiVol}
            onChange={handleLofiVol}
            className={styles.slider}
            aria-label="Lo-fi music volume"
          />
          <span className={styles.sliderValue}>
            {Math.round(lofiVol * 100)}%
          </span>
        </div>

        <div className={styles.sliderGroup}>
          <label className={styles.sliderLabel} htmlFor="atc-vol">
            ATC
          </label>
          <input
            id="atc-vol"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={atcVol}
            onChange={handleAtcVol}
            className={styles.slider}
            aria-label="ATC radio volume"
          />
          <span className={styles.sliderValue}>
            {Math.round(atcVol * 100)}%
          </span>
        </div>
      </div>

      {/* credits */}
      <div className={styles.credits}>
        <span className={styles.creditItem}>
          Music:{" "}
          <a
            href={station.creditUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.creditLink}
          >
            {station.credit}
          </a>
        </span>
        <span className={styles.creditSep} aria-hidden="true">/</span>
        <span className={styles.creditItem}>
          ATC:{" "}
          <a
            href={ATC_SOURCE.creditUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.creditLink}
          >
            {ATC_SOURCE.credit}
          </a>{" "}
          ({ATC_SOURCE.label})
        </span>
      </div>
    </div>
  );
}
