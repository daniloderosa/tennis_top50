#!/usr/bin/env python3
"""
Scarica i dati ATP Top 50 dal foglio Google e aggiorna src/data/players.json.

Esegui dalla root del progetto:
    python3 scripts/fetch_data.py

Requisiti: pip install requests
"""

import requests
import csv
import json
import io
import os

SHEET_ID = "1WFLz-aEK5N99hnW7k4u1jZhoYs8JKa8sV4xLSaP4zX0"
SHEETS = ["Serve", "Return", "Breaks", "More"]

OUTPUT = os.path.join(os.path.dirname(__file__), "..", "src", "data", "players.json")


def fetch_sheet(sheet_name):
    url = f"https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:csv&sheet={sheet_name}"
    response = requests.get(url)
    response.raise_for_status()
    reader = csv.DictReader(io.StringIO(response.text))
    return list(reader)


def merge_sheets(sheets: dict) -> list:
    """Unisce i 4 tab per giocatore (join su 'Player'), converte i tipi."""

    # Raccoglie tutte le righe indicizzate per nome giocatore
    by_player = {}
    for sheet_name, rows in sheets.items():
        for row in rows:
            name = row.get("Player", "").strip()
            if not name:
                continue
            if name not in by_player:
                by_player[name] = {}
            by_player[name].update(row)

    def num(val, default=None):
        try:
            return float(str(val).replace("%", "").replace(",", ".").strip())
        except (ValueError, TypeError):
            return default

    players = []
    for name, row in by_player.items():
        p = {
            "rank":       int(num(row.get("Rk") or row.get("Rank") or 999)),
            "full":       name,
            "nat":        row.get("IOC", row.get("Nat", "")).strip(),
            # Serve
            "spw":        num(row.get("SPW")),
            "s1":         num(row.get("1stIn")),
            "s1w":        num(row.get("1stWon")),
            "s2w":        num(row.get("2ndWon")),
            "hold":       num(row.get("Hold")),
            "ace":        num(row.get("Ace")),
            "df":         num(row.get("DF")),
            # Return
            "r1w":        num(row.get("1stRet")),
            "r2w":        num(row.get("2ndRet")),
            "ret":        num(row.get("Ret")),
            "brk":        num(row.get("Brk")),
            # Breaks
            "bpsaved":    num(row.get("BPS")),
            "bpconv":     num(row.get("BPW")),
            "bpfaced":    num(row.get("BPF")),
            "bpcreated":  num(row.get("BPC")),
            # More (esclusi M, M W-L, M%)
            "setwon":     num(row.get("Set%")),
            "tie":        num(row.get("TB%")),
            "decset":     num(row.get("Dec%")),
        }
        players.append(p)

    players.sort(key=lambda p: p["rank"])
    return players


def main():
    print("Scaricamento dati ATP Top 50...")
    sheets = {}
    for sheet in SHEETS:
        rows = fetch_sheet(sheet)
        sheets[sheet] = rows
        print(f"  {sheet}: {len(rows)} righe")

    players = merge_sheets(sheets)
    print(f"\nGiocatori: {len(players)}")

    os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)
    with open(OUTPUT, "w", encoding="utf-8") as f:
        json.dump(players, f, ensure_ascii=False, indent=2)

    print(f"Scritto: {OUTPUT}")
    if players:
        p = players[0]
        print(f"\nEsempio #{p['rank']} {p['full']}: s1={p['s1']} hold={p['hold']} ace={p['ace']}")


if __name__ == "__main__":
    main()
