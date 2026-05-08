// Scarica i dati ATP Top 50 dal foglio Google e aggiorna src/data/players.json.
// Esegui dalla root del progetto: npm run fetch-data

import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SHEET_ID = "1WFLz-aEK5N99hnW7k4u1jZhoYs8JKa8sV4xLSaP4zX0";
const SHEETS = ["Serve", "Return", "Breaks", "More"];
const OUTPUT = join(__dirname, "..", "src", "data", "players.json");

async function fetchSheet(sheetName) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} per tab "${sheetName}"`);
  return parseCsv(await res.text());
}

function parseCsv(text) {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const headers = splitCsvLine(lines[0]);
  return lines.slice(1)
    .map((line) => Object.fromEntries(headers.map((h, i) => [h.trim(), (splitCsvLine(line)[i] ?? "").trim()])))
    .filter((row) => Object.values(row).some((v) => v !== ""));
}

function splitCsvLine(line) {
  const result = [];
  let current = "", inQuotes = false;
  for (const ch of line) {
    if (ch === '"') { inQuotes = !inQuotes; continue; }
    if (ch === "," && !inQuotes) { result.push(current); current = ""; continue; }
    current += ch;
  }
  result.push(current);
  return result;
}

function num(val) {
  if (val === undefined || val === null || val === "") return null;
  const n = parseFloat(String(val).replace("%", "").replace(",", ".").trim());
  return isNaN(n) ? null : n;
}

function mergeSheets(sheets) {
  const byPlayer = {};
  for (const rows of Object.values(sheets)) {
    for (const row of rows) {
      const name = (row["Player"] ?? "").trim();
      if (!name) continue;
      byPlayer[name] = { ...(byPlayer[name] ?? {}), ...row };
    }
  }

  return Object.entries(byPlayer)
    .map(([name, r]) => ({
      rank: Math.round(num(r["Rk"] ?? r["Rank"]) ?? 999),
      full: name,
      nat:  (r["Country"] ?? r["IOC"] ?? r["Nat"] ?? "").trim(),

      // ── Serve ──────────────────────────────────────────────────
      spw:      num(r["SPW"]),       // Serve Points Won %
      spw_inp:  num(r["SPW-InP"]),   // SPW in pressure points
      s1:       num(r["1stIn"]),     // 1st Serve In %
      s1w:      num(r["1st%"]),      // 1st Serve Won %
      s2w:      num(r["2nd%"]),      // 2nd Serve Won %
      s2w_inp:  num(r["2%-InP"]),    // 2nd Serve Won % in pressure
      hold:     num(r["Hld%"]),      // Hold %
      ace:      num(r["Ace%"]),      // Ace %
      df:       num(r["DF%"]),       // DF %
      df2s:     num(r["DF/2s"]),     // DF % on 2nd serve
      pts_sg:   num(r["Pts/SG"]),    // Points per service game
      ptsl_sg:  num(r["PtsL/SG"]),   // Points lost per service game

      // ── Return ─────────────────────────────────────────────────
      ret:          num(r["RPW"]),          // Return Points Won %
      ret_inp:      num(r["RPW-InP"]),      // RPW in pressure
      vace:         num(r["vAce%"]),        // Ace% faced
      vdf:          num(r["vDF%"]),         // DF% forced
      r1w:          num(r["v1st%"]),        // 1st Return Won %
      r2w:          num(r["v2nd%"]),        // 2nd Return Won %
      brk:          num(r["Brk%"]),         // Break %
      pts_rg:       num(r["Pts/RG"]),       // Points per return game
      ptsw_rg:      num(r["PtsW/RG"]),      // Points won per return game
      opp_rnk_med:  num(r["Opp Rnk Med"] ?? r["OppRnkMed"] ?? r["oRkMed"]),  // Median opp rank
      opp_rnk_avg:  num(r["Opp Rnk Avg"] ?? r["OppRnkAvg"] ?? r["oRkAvg"]),  // Avg opp rank

      // ── Breaks ─────────────────────────────────────────────────
      bpconv:   num(r["BPConv%"]),   // BP Converted %
      bp_g:     num(r["BP/G"]),      // BP created per return game
      bp_s:     num(r["BP/S"]),      // BP created per set
      bp_m:     num(r["BP/M"]),      // BP created per match
      bks_s:    num(r["Bks/S"]),     // Breaks per set (as returner)
      bks_m:    num(r["Bks/M"]),     // Breaks per match (as returner)
      bpsaved:  num(r["BPSvd%"]),    // BP Saved %
      bpfaced:  num(r["BPvs/G"]),    // BP faced per service game
      bpvs_s:   num(r["BPvs/S"]),    // BP faced per set (as server)
      bpvs_m:   num(r["BPvs/M"]),    // BP faced per match (as server)
      bkn_s:    num(r["Bkn/S"]),     // Broken per set
      bkn_m:    num(r["Bkn/M"]),     // Broken per match

      // ── More ───────────────────────────────────────────────────
      dr:       num(r["DR"]),                                          // Dominance Ratio
      tpw:      num(r["TPW%"]),                                        // Total Points Won %
      tie:      num(r["TB W%"]),                                       // Tiebreak Won %
      setwon:   num(r["S W%"]),                                        // Set Won %
      gwon:     num(r["G W%"]),                                        // Games Won %
      dur_m:    num(r["Min/M"]  ?? r["Mins/M"] ?? r["Dur/M"]),        // Match duration (min)
      dur_s:    num(r["Min/S"]  ?? r["Mins/S"] ?? r["Dur/S"]),        // Set duration (min)
      dur_pt:   num(r["Sec/Pt"] ?? r["Secs/Pt"] ?? r["Dur/Pt"]),     // Point duration (sec)
    }))
    .sort((a, b) => a.rank - b.rank);
}

async function main() {
  console.log("Scaricamento dati ATP Top 50...");
  const sheets = {};
  for (const sheet of SHEETS) {
    const rows = await fetchSheet(sheet);
    sheets[sheet] = rows;
    console.log(`  ✓ ${sheet}: ${rows.length} righe`);
  }

  const players = mergeSheets(sheets);
  console.log(`\nGiocatori: ${players.length}`);

  mkdirSync(dirname(OUTPUT), { recursive: true });
  writeFileSync(OUTPUT, JSON.stringify(players, null, 2), "utf-8");
  console.log(`✓ Scritto: ${OUTPUT}`);

  if (players[0]) {
    const p = players[0];
    console.log(`\nEsempio #${p.rank} ${p.full}: spw=${p.spw} hold=${p.hold} ace=${p.ace}`);
  }
}

main().catch((err) => { console.error("Errore:", err.message); process.exit(1); });
