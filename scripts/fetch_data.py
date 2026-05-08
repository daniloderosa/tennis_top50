#!/usr/bin/env python3
"""
Scarica i dati ATP Top 50 dal foglio Google e li salva in src/data/players.json.

METODO 1 — Google Sheets API (consigliato):
  1. Vai su https://console.cloud.google.com → API & Servizi → Credenziali
  2. Crea una API Key (gratis, 2 min)
  3. Attiva "Google Sheets API" nel progetto
  4. Inserisci la chiave sotto oppure impostala come variabile d'ambiente:
       export GOOGLE_API_KEY="AIza..."

METODO 2 — Pubblica sul web:
  1. Nel foglio: File → Condividi → Pubblica sul web
  2. Per ogni tab (Serve, Return, Breaks, More) scegli CSV e pubblica
  3. Copia i 4 URL e incollali nella dict PUBLISHED_URLS sotto

Esecuzione:
    cd /path/to/tennis_top50
    python3 scripts/fetch_data.py
"""

import os
import sys
import json
import csv
import io
import requests

# ── Configurazione ──────────────────────────────────────────────────────────

SHEET_ID = "1WFLz-aEK5N99hnW7k4u1jZhoYs8JKa8sV4xLSaP4zX0"

GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY", "")  # oppure inserisci qui: "AIza..."

# Nomi esatti dei tab nel foglio Google
TAB_NAMES = ["Serve", "Return", "Breaks", "More"]

# Metodo 2: URL "Pubblica sul web" (lascia vuoto se usi la API key)
PUBLISHED_URLS = {
    "Serve":  "",
    "Return": "",
    "Breaks": "",
    "More":   "",
}

OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "..", "src", "data", "players.json")

# ── Fetch ────────────────────────────────────────────────────────────────────

def fetch_via_api(tab_name: str) -> list[dict]:
    """Scarica un tab via Google Sheets API v4."""
    url = (
        f"https://sheets.googleapis.com/v4/spreadsheets/{SHEET_ID}"
        f"/values/{requests.utils.quote(tab_name)}?key={GOOGLE_API_KEY}"
    )
    r = requests.get(url, timeout=20)
    r.raise_for_status()
    data = r.json()
    rows = data.get("values", [])
    if not rows:
        return []
    headers = rows[0]
    return [dict(zip(headers, row)) for row in rows[1:] if any(row)]


def fetch_via_published_url(tab_name: str) -> list[dict]:
    """Scarica un tab da URL 'Pubblica sul web'."""
    url = PUBLISHED_URLS[tab_name]
    r = requests.get(url, timeout=20)
    r.raise_for_status()
    reader = csv.DictReader(io.StringIO(r.text))
    return [row for row in reader if any(row.values())]


def fetch_tab(tab_name: str) -> list[dict]:
    if GOOGLE_API_KEY:
        print(f"  API key → {tab_name}")
        return fetch_via_api(tab_name)
    elif PUBLISHED_URLS.get(tab_name):
        print(f"  Published URL → {tab_name}")
        return fetch_via_published_url(tab_name)
    else:
        raise RuntimeError(
            "Nessun metodo configurato.\n"
            "Imposta GOOGLE_API_KEY oppure inserisci gli URL in PUBLISHED_URLS."
        )


# ── Parsing e merge ──────────────────────────────────────────────────────────

def safe_float(val: str, default=None):
    try:
        return float(str(val).replace(",", ".").replace("%", "").strip())
    except (ValueError, TypeError):
        return default


def safe_int(val: str, default=None):
    f = safe_float(val)
    return round(f) if f is not None else default


def parse_tabs(tabs: dict[str, list[dict]]) -> list[dict]:
    """
    Unisce i 4 tab per giocatore (join su colonna 'Player').
    Converte tutti i valori numerici.
    Restituisce la lista ordinata per ranking.
    """
    # Trova i giocatori dal tab Serve (che ha il ranking)
    serve_rows = tabs.get("Serve", [])

    # Mappa player_name → merged dict
    merged: dict[str, dict] = {}

    for tab_name, rows in tabs.items():
        for row in rows:
            # Cerca la colonna con il nome del giocatore
            player = (
                row.get("Player") or row.get("player") or
                row.get("Name") or row.get("name") or ""
            ).strip()
            if not player:
                continue
            if player not in merged:
                merged[player] = {"full": player}
            merged[player].update(row)

    players = []
    for player, row in merged.items():
        rank = safe_int(row.get("Rk") or row.get("Rank") or row.get("rank") or row.get("RK") or "999")
        nat = (row.get("IOC") or row.get("Nat") or row.get("nat") or row.get("Country") or "").strip()

        p = {
            "rank": rank,
            "full": player,
            "nat": nat,
            # ── Serve ──────────────────────────────────────────
            # SPW: serve points won %
            "spw":  safe_float(row.get("SPW")  or row.get("spw")  or row.get("SPW%")),
            # 1st serve in %
            "s1":   safe_float(row.get("1stIn") or row.get("1st In") or row.get("s1") or row.get("1stIn%")),
            # 1st serve won %
            "s1w":  safe_float(row.get("1stWon") or row.get("1st Won") or row.get("s1w") or row.get("1stWon%")),
            # 2nd serve won %
            "s2w":  safe_float(row.get("2ndWon") or row.get("2nd Won") or row.get("s2w") or row.get("2ndWon%")),
            # Hold %
            "hold": safe_float(row.get("Hold") or row.get("Hld") or row.get("hold") or row.get("Hold%")),
            # Ace per game
            "ace":  safe_float(row.get("Ace") or row.get("ace") or row.get("Ace/g")),
            # DF per game
            "df":   safe_float(row.get("DF")  or row.get("df")  or row.get("DF/g")),
            # ── Return ─────────────────────────────────────────
            # Return points won %
            "ret":  safe_float(row.get("RPW")  or row.get("Ret") or row.get("ret") or row.get("RPW%") or row.get("Ret%")),
            # 1st return won %
            "r1w":  safe_float(row.get("1stRet") or row.get("1st Ret") or row.get("r1w") or row.get("1stRet%")),
            # 2nd return won %
            "r2w":  safe_float(row.get("2ndRet") or row.get("2nd Ret") or row.get("r2w") or row.get("2ndRet%")),
            # Break conversion %
            "brk":  safe_float(row.get("Brk") or row.get("Brk%") or row.get("brk") or row.get("Break%") or row.get("Break")),
            # ── Breaks ─────────────────────────────────────────
            # Break points saved %
            "bpsaved":   safe_float(row.get("BPS") or row.get("BPS%") or row.get("bpsaved") or row.get("BP Saved")),
            # Break points converted %
            "bpconv":    safe_float(row.get("BPW") or row.get("BPC%") or row.get("bpconv") or row.get("BP Conv") or row.get("BPWon")),
            # Break points faced per service game
            "bpfaced":   safe_float(row.get("BPF") or row.get("bpfaced") or row.get("BP Faced") or row.get("BPF/g")),
            # Break points created per return game
            "bpcreated": safe_float(row.get("BPC") or row.get("bpcreated") or row.get("BP Created") or row.get("BPC/g")),
            # ── More ───────────────────────────────────────────
            # Set won %
            "setwon": safe_float(row.get("Set%") or row.get("setwon") or row.get("Sets%") or row.get("Set Won")),
            # Tiebreak won %
            "tie":    safe_float(row.get("TB%")  or row.get("tie") or row.get("Tie%") or row.get("Tiebreak%")),
            # Deciding set won %
            "decset": safe_float(row.get("Dec%") or row.get("decset") or row.get("Dec Set%") or row.get("Deciding%")),
        }
        players.append(p)

    # Ordina per ranking
    players.sort(key=lambda p: p["rank"] if p["rank"] else 999)
    return players


# ── Main ─────────────────────────────────────────────────────────────────────

def main():
    print("Scaricamento dati ATP Top 50...")

    tabs = {}
    for tab in TAB_NAMES:
        try:
            rows = fetch_tab(tab)
            tabs[tab] = rows
            print(f"  ✓ {tab}: {len(rows)} righe")
        except Exception as e:
            print(f"  ✗ {tab}: {e}")
            sys.exit(1)

    players = parse_tabs(tabs)
    print(f"\nGiocatori trovati: {len(players)}")

    # Salva JSON
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(players, f, ensure_ascii=False, indent=2)

    print(f"Salvato: {OUTPUT_PATH}")
    if players:
        print(f"\nPrimi 3 giocatori:")
        for p in players[:3]:
            print(f"  #{p['rank']} {p['full']} ({p['nat']}) — s1:{p['s1']} hold:{p['hold']} ace:{p['ace']}")


if __name__ == "__main__":
    main()
