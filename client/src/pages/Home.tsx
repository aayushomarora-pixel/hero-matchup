/*
 * Ink & Impact style reminder: neo-pulp editorial composition, signal red issue bars,
 * ink navy evidence panels, warm paper surfaces, halftone texture, and tactile motion.
 */
import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowRight,
  Check,
  ChevronDown,
  Crosshair,
  Loader2,
  Search,
  Shield,
  Sparkles,
  Swords,
  Target,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type StatKey = "intelligence" | "strength" | "speed" | "durability" | "power" | "combat";
type Slot = "left" | "right";

type Powerstats = Record<StatKey, number | string>;

type Hero = {
  id: number;
  name: string;
  slug: string;
  powerstats: Powerstats;
  images: { xs: string; sm: string; md: string; lg: string };
  biography?: {
    fullName?: string;
    publisher?: string;
    alignment?: string;
  };
  appearance?: { gender?: string; race?: string };
};

const API_URL = "https://akabab.github.io/superhero-api/api/all.json";
const statKeys: StatKey[] = ["intelligence", "strength", "speed", "durability", "power", "combat"];
const statLabels: Record<StatKey, string> = {
  intelligence: "INT",
  strength: "STR",
  speed: "SPD",
  durability: "DUR",
  power: "PWR",
  combat: "CBT",
};
const statNames: Record<StatKey, string> = {
  intelligence: "Intelligence",
  strength: "Strength",
  speed: "Speed",
  durability: "Durability",
  power: "Power",
  combat: "Combat",
};
const preferredHeroes = [
  "Superman",
  "Batman",
  "Wonder Woman",
  "Spider-Man",
  "Iron Man",
  "Captain America",
  "Hulk",
  "Thor",
  "Wolverine",
  "Black Panther",
  "Captain Marvel",
];

const emptyQuizStats: Record<StatKey, number> = {
  intelligence: 74,
  strength: 68,
  speed: 62,
  durability: 58,
  power: 72,
  combat: 81,
};

function numericStat(value: number | string | undefined) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function displayIdentity(hero: Hero) {
  return hero.biography?.fullName && hero.biography.fullName !== "-"
    ? hero.biography.fullName
    : hero.biography?.publisher || "Unknown file";
}

function HeroPortrait({ hero, size = "md" }: { hero: Hero; size?: "sm" | "md" | "lg" }) {
  return (
    <div className={cn("hero-portrait", `hero-portrait-${size}`)}>
      <img src={hero.images.md || hero.images.sm} alt={`${hero.name} portrait`} />
      <div className="portrait-label">#{String(hero.id).padStart(3, "0")}</div>
    </div>
  );
}

function StatBar({ label, value, accent = "red" }: { label: string; value: number; accent?: "red" | "blue" | "gold" }) {
  const safeValue = Math.max(0, Math.min(100, value));
  return (
    <div className="stat-row">
      <div className="stat-row-label">
        <span>{label}</span>
        <strong>{safeValue}</strong>
      </div>
      <div className="stat-track" aria-label={`${label}: ${safeValue} out of 100`}>
        <div className={cn("stat-fill", `stat-fill-${accent}`)} style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}

function SectionTag({ children, tone = "red" }: { children: ReactNode; tone?: "red" | "blue" | "gold" }) {
  return <span className={cn("section-tag", `section-tag-${tone}`)}>{children}</span>;
}

export default function Home() {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [query, setQuery] = useState("");
  const [activeSlot, setActiveSlot] = useState<Slot>("left");
  const [leftHero, setLeftHero] = useState<Hero | null>(null);
  const [rightHero, setRightHero] = useState<Hero | null>(null);
  const [quizStats, setQuizStats] = useState(emptyQuizStats);
  const [quizResult, setQuizResult] = useState<{ hero: Hero; score: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    fetch(API_URL)
      .then((response) => {
        if (!response.ok) throw new Error("The archive did not respond.");
        return response.json();
      })
      .then((data: Hero[]) => {
        if (!isMounted) return;
        setHeroes(data);
        const superman = data.find((hero) => hero.name.toLowerCase() === "superman");
        const batman = data.find((hero) => hero.name.toLowerCase() === "batman");
        if (superman) setLeftHero(superman);
        if (batman) setRightHero(batman);
      })
      .catch(() => {
        if (isMounted) setError("The archive is offline. Check your connection and try the scan again.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const featuredHeroes = useMemo(() => {
    const preferred = preferredHeroes
      .map((name) => heroes.find((hero) => hero.name.toLowerCase() === name.toLowerCase()))
      .filter(Boolean) as Hero[];
    return preferred.length >= 4 ? preferred : heroes.slice(0, 8);
  }, [heroes]);

  const searchResults = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return featuredHeroes.slice(0, 6);
    return heroes
      .filter((hero) => hero.name.toLowerCase().includes(trimmed) || hero.biography?.publisher?.toLowerCase().includes(trimmed))
      .slice(0, 8);
  }, [featuredHeroes, heroes, query]);

  const calculateMatch = () => {
    if (!heroes.length) return;
    const ranked = heroes
      .map((hero) => {
        const totalDifference = statKeys.reduce((sum, key) => {
          return sum + Math.abs(numericStat(hero.powerstats[key]) - quizStats[key]);
        }, 0);
        const score = Math.max(0, Math.round((1 - totalDifference / (statKeys.length * 100)) * 100));
        return { hero, score };
      })
      .sort((a, b) => b.score - a.score);
    setQuizResult(ranked[0] ?? null);
    document.getElementById("match-result")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const selectHero = (hero: Hero, slot?: Slot) => {
    const destination = slot || activeSlot;
    if (destination === "left") setLeftHero(hero);
    else setRightHero(hero);
    setQuery("");
    toast(`${hero.name} filed to ${destination === "left" ? "SLOT A" : "SLOT B"}.`);
  };

  const clearSlot = (slot: Slot) => {
    if (slot === "left") setLeftHero(null);
    else setRightHero(null);
  };

  return (
    <main className="app-shell">
      <aside className="site-rail">
        <a className="brand-lockup" href="#top" aria-label="Hero Matchup home">
          <img src="/manus-storage/hero-matchup-mark_acafb8ae.png" alt="" className="brand-mark" />
          <span className="brand-name"><b>HERO</b><b>MATCHUP</b></span>
        </a>
        <div className="rail-rule" />
        <nav className="rail-nav" aria-label="Primary navigation">
          <a className="rail-link rail-link-active" href="#search"><span>01</span>Find a hero</a>
          <a className="rail-link" href="#compare"><span>02</span>Compare files</a>
          <a className="rail-link" href="#quiz"><span>03</span>Match yourself</a>
        </nav>
        <div className="rail-bottom">
          <SectionTag tone="blue">LIVE ARCHIVE</SectionTag>
          <p>731 hero files<br />indexed &amp; ready.</p>
          <span className="rail-version">v1.0 / FIELD GUIDE</span>
        </div>
      </aside>

      <div className="content-canvas" id="top">
        <header className="topbar">
          <div className="topbar-kicker"><span className="pulse-dot" /> DATASET / OPEN-SOURCE SUPERHERO API</div>
          <div className="topbar-status">CASE FILE 001 <span>/</span> ACTIVE</div>
        </header>

        <section className="hero-section" aria-labelledby="hero-heading">
          <div className="hero-art" aria-hidden="true" />
          <div className="hero-copy">
            <SectionTag>HERO MATCHUP / FIELD GUIDE</SectionTag>
            <h1 id="hero-heading">Find the<br /><em>right</em> hero.</h1>
            <p className="hero-deck">Search the archive, put two legends head-to-head, or run your own stats through the match index.</p>
            <a className="text-link" href="#search"><span>Start the scan</span><ArrowDown size={17} /></a>
          </div>
          <div className="hero-index-card">
            <div className="index-card-top"><span>INDEX / 001</span><Crosshair size={17} /></div>
            <div className="index-number">731</div>
            <div className="index-label">FILES IN THE<br />ACTIVE ARCHIVE</div>
            <div className="index-card-footer"><span>POWERSTATS</span><span>BIOGRAPHY</span><span>IMAGES</span></div>
          </div>
        </section>

        <section className="search-section section-pad" id="search" aria-labelledby="search-heading">
          <div className="section-intro">
            <SectionTag>01 / SEARCH THE ARCHIVE</SectionTag>
            <h2 id="search-heading">Who’s<br /><em>on file?</em></h2>
            <p>Start with a name, a publisher, or a hunch. Select a file to add it to your matchup.</p>
          </div>
          <div className="search-workbench">
            <div className="slot-picker" role="group" aria-label="Choose comparison slot">
              <button className={cn("slot-button", activeSlot === "left" && "slot-button-active")} onClick={() => setActiveSlot("left")}>
                <span className="slot-letter">A</span><span>{leftHero?.name || "Choose hero"}</span><ChevronDown size={15} />
              </button>
              <button className={cn("slot-button", activeSlot === "right" && "slot-button-active slot-button-blue")} onClick={() => setActiveSlot("right")}>
                <span className="slot-letter slot-letter-blue">B</span><span>{rightHero?.name || "Choose hero"}</span><ChevronDown size={15} />
              </button>
            </div>
            <label className="search-box">
              <Search size={21} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search hero or publisher..." aria-label="Search hero or publisher" />
              <kbd>⌘ K</kbd>
            </label>
            <div className="search-results" aria-live="polite">
              {isLoading ? (
                <div className="loading-state"><Loader2 className="spin" size={20} /> Loading the archive...</div>
              ) : error ? (
                <div className="error-state"><span>{error}</span><button onClick={() => window.location.reload()}>Retry scan</button></div>
              ) : searchResults.length ? (
                searchResults.map((hero, index) => (
                  <div className="search-result" key={hero.id} style={{ "--item-delay": `${index * 35}ms` } as CSSProperties}>
                    <HeroPortrait hero={hero} size="sm" />
                    <div className="result-copy"><strong>{hero.name}</strong><span>{hero.biography?.publisher || "Unknown publisher"} <i>/</i> {displayIdentity(hero)}</span></div>
                    <div className="result-actions">
                      <button className="mini-slot mini-slot-red" onClick={() => selectHero(hero, "left")} aria-label={`Add ${hero.name} to slot A`}>A</button>
                      <button className="mini-slot mini-slot-blue" onClick={() => selectHero(hero, "right")} aria-label={`Add ${hero.name} to slot B`}>B</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">No files match that scan. Try another name.</div>
              )}
            </div>
          </div>
        </section>

        <section className="compare-section section-pad" id="compare" aria-labelledby="compare-heading">
          <div className="compare-heading-row">
            <div>
              <SectionTag tone="blue">02 / SIDE-BY-SIDE</SectionTag>
              <h2 id="compare-heading">Put them<br /><em>to the test.</em></h2>
            </div>
            <p className="compare-note">A clean read on the numbers that make a legend. Choose Slot A or B in the archive above, then watch the evidence stack up.</p>
          </div>
          <div className="compare-board">
            <article className="compare-card compare-card-red">
              <div className="compare-card-header"><span className="slot-badge">A</span><span>PRIMARY FILE</span><button onClick={() => clearSlot("left")} aria-label="Clear slot A">Clear</button></div>
              {leftHero ? (
                <>
                  <div className="compare-identity"><HeroPortrait hero={leftHero} size="lg" /><div><h3>{leftHero.name}</h3><p>{leftHero.biography?.publisher || "Unknown publisher"}</p><span className="identity-line">{displayIdentity(leftHero)}</span></div></div>
                  <div className="compare-stats">{statKeys.map((key) => <StatBar key={key} label={statNames[key]} value={numericStat(leftHero.powerstats[key])} accent="red" />)}</div>
                </>
              ) : <div className="slot-empty"><Shield size={34} /><strong>Slot A is open</strong><span>Choose a file above to start the matchup.</span></div>}
            </article>

            <div className="versus-mark"><span>VS</span><div className="versus-line" /></div>

            <article className="compare-card compare-card-blue">
              <div className="compare-card-header"><span className="slot-badge slot-badge-blue">B</span><span>RIVAL FILE</span><button onClick={() => clearSlot("right")} aria-label="Clear slot B">Clear</button></div>
              {rightHero ? (
                <>
                  <div className="compare-identity"><HeroPortrait hero={rightHero} size="lg" /><div><h3>{rightHero.name}</h3><p>{rightHero.biography?.publisher || "Unknown publisher"}</p><span className="identity-line">{displayIdentity(rightHero)}</span></div></div>
                  <div className="compare-stats">{statKeys.map((key) => <StatBar key={key} label={statNames[key]} value={numericStat(rightHero.powerstats[key])} accent="blue" />)}</div>
                </>
              ) : <div className="slot-empty"><Swords size={34} /><strong>Slot B is open</strong><span>Choose a file above to start the matchup.</span></div>}
            </article>
          </div>
          {leftHero && rightHero && (
            <div className="compare-footer"><span><Check size={16} /> Both files are live</span><span>Average stat gap: {Math.round(statKeys.reduce((sum, key) => sum + Math.abs(numericStat(leftHero.powerstats[key]) - numericStat(rightHero.powerstats[key])), 0) / statKeys.length)} pts</span><a href="#quiz">Run your own match <ArrowRight size={15} /></a></div>
          )}
        </section>

        <section className="quiz-section section-pad" id="quiz" aria-labelledby="quiz-heading">
          <div className="quiz-art" aria-hidden="true" />
          <div className="quiz-copy">
            <SectionTag tone="gold">03 / MATCH INDEX</SectionTag>
            <h2 id="quiz-heading">Which hero<br /><em>matches you?</em></h2>
            <p>You bring the numbers. We’ll find the file that thinks, moves, and fights most like you. Set your stats from 0 to 100.</p>
            <div className="quiz-callout"><Sparkles size={18} /><span>No right answers. Just a suspiciously accurate result.</span></div>
          </div>
          <div className="quiz-panel">
            <div className="quiz-panel-top"><span>YOUR STAT INPUT</span><span>{Object.values(quizStats).reduce((sum, value) => sum + value, 0)} / 600</span></div>
            <div className="quiz-sliders">
              {statKeys.map((key) => (
                <label className="quiz-slider" key={key}>
                  <span><b>{statLabels[key]}</b> {statNames[key]} <strong>{quizStats[key]}</strong></span>
                  <input type="range" min="0" max="100" value={quizStats[key]} onChange={(event) => { setQuizResult(null); setQuizStats((current) => ({ ...current, [key]: Number(event.target.value) })); }} />
                </label>
              ))}
            </div>
            <Button className="match-button" onClick={calculateMatch} disabled={isLoading || !heroes.length}><Target size={18} /> Calculate my match <ArrowRight size={18} /></Button>
          </div>
        </section>

        {quizResult && (
          <section className="match-result-section section-pad" id="match-result" aria-live="polite">
            <div className="result-stamp">MATCH<br />FOUND</div>
            <div className="match-result-copy"><SectionTag>RESULT / PERSONAL FILE</SectionTag><h2>You match<br /><em>{quizResult.hero.name}.</em></h2><p>Your stat profile is a {quizResult.score}% match with this file. That’s not destiny. It’s evidence.</p><div className="match-meta"><span><Zap size={15} /> MATCH INDEX {quizResult.score}%</span><span>{quizResult.hero.biography?.publisher || "OPEN ARCHIVE"}</span></div></div>
            <div className="match-hero-card"><HeroPortrait hero={quizResult.hero} size="lg" /><div><h3>{quizResult.hero.name}</h3><p>{displayIdentity(quizResult.hero)}</p></div><div className="match-bars">{statKeys.map((key) => <StatBar key={key} label={statLabels[key]} value={numericStat(quizResult.hero.powerstats[key])} accent="red" />)}</div></div>
          </section>
        )}

        <footer className="site-footer"><span>HERO MATCHUP / FIELD GUIDE</span><span>Powered by the open-source superhero-api dataset</span><span>Keep exploring. Stay curious.</span></footer>
      </div>
    </main>
  );
}
