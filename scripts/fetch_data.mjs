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
  return lines.slice(1).map((line) => {
    const values = splitCsvLine(line);
    return Object.fromEntries(headers.map((h, i) => [h.trim(), (values[i] ?? "").trim()]));
  }).filter((row) => Object.values(row).some((v) => v !== ""));
}

function splitCsvLine(line) {
  // Gestisce virgolette e valori con virgola
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { inQuotes = !inQuotes; continue; }
    if (ch === "," && !inQuotes) { result.push(current); current = ""; continue; }
    current += ch;
  }
  result.push(current);
  return result;
}

function num(val, fallback = null) {
  if (val === undefined || val === null || val === "") return fallback;
  const n = parseFloat(String(val).replace("%", "").replace(",", ".").trim());
  return isNaN(n) ? fallback : n;
}

function mergeSheets(sheets) {
  const byPlayer = {};
  for (const [, rows] of Object.entries(sheets)) {
    for (const row of rows) {
      const name = (row["Player"] ?? "").trim();
      if (!name) continue;
      byPlayer[name] = { ...(byPlayer[name] ?? {}), ...row };
    }
  }

  return Object.entries(byPlayer)
    .map(([name, row]) => ({
      rank:       Math.round(num(row["Rk"] ?? row["Rank"], 999)),
      full:       name,
      nat:        (row["IOC"] ?? row["Nat"] ?? "").trim(),
      // Serve
      spw:        num(row["SPW"]),
      s1:         num(row["1stIn"]),
      s1w:        num(row["1stWon"]),
      s2w:        num(row["2ndWon"]),
      hold:       num(row["Hold"]),
      ace:        num(row["Ace"]),
      df:         num(row["DF"]),
      // Return
      r1w:        num(row["1stRet"]),
      r2w:        num(row["2ndRet"]),
      ret:        num(row["Ret"]),
      brk:        num(row["Brk"]),
      // Breaks
      bpsaved:    num(row["BPS"]),
      bpconv:     num(row["BPW"]),
      bpfaced:    num(row["BPF"]),
      bpcreated:  num(row["BPC"]),
      // More (esclusi M, M W-L, M%)
      setwon:     num(row["Set%"]),
      tie:        num(row["TB%"]),
      decset:     num(row["Dec%"]),
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
    console.log(`\nEsempio #${p.rank} ${p.full}: s1=${p.s1} hold=${p.hold} ace=${p.ace}`);
  }
}

main().catch((err) => { console.error("Errore:", err.message); process.exit(1); });
