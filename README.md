# ASSET ZERO — Prototype

Classic top-down Metal Gear–style infiltration across **3 sectors**, with humanoid soldiers, weapons, and a boss fight.

Repo: https://github.com/jays223/asset-zero

## How to play

1. Clone or download the repo:
   ```bash
   git clone https://github.com/jays223/asset-zero.git
   cd asset-zero
   ```
2. Start a local server:
   ```bash
   python3 -m http.server 8765
   ```
3. Open **http://localhost:8765** in your browser.

You can also open `index.html` directly in a browser, but a local server is more reliable.

## Controls

| Key | Action |
|-----|--------|
| WASD | Move |
| Shift | Crouch / crawl ducts |
| Space | CQC takedown |
| E | Pick up / interact / exfil |
| F | Sprint burst |
| Mouse + Click / R | Aim & fire |

## Campaign

1. **Outer Perimeter** — steal biometric key, optional pistol, exfil NW  
2. **Armory Wing** — grab rifles, reach the east lift  
3. **Command Deck** — fight **Commander Hale**, then blast-door exfil  

## Systems

- Grid **pathfinding** so soldiers route around walls
- **Weapons** — pistol / rifle pickups, mouse aim, click or `R` to fire
- **Boss** — Hale has a health bar, shoots, and unlocks exfil when downed
- Signature bleed + alert still punish loud play
