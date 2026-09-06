(() => {
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  const boot = document.getElementById("boot");
  const hud = document.getElementById("hud");
  const end = document.getElementById("end");
  const startBtn = document.getElementById("start-btn");
  const retryBtn = document.getElementById("retry-btn");
  const bleedBar = document.getElementById("bleed-bar");
  const alertBar = document.getElementById("alert-bar");
  const hpBar = document.getElementById("hp-bar");
  const bossBar = document.getElementById("boss-bar");
  const bossHud = document.getElementById("boss-hud");
  const bossNameEl = document.getElementById("boss-name");
  const levelTag = document.getElementById("level-tag");
  const ammoReadout = document.getElementById("ammo-readout");
  const objectiveEl = document.getElementById("objective");
  const radioEl = document.getElementById("radio");
  const toastEl = document.getElementById("toast");
  const endTitle = document.getElementById("end-title");
  const endText = document.getElementById("end-text");

  const TILE = 40;
  const W = 24;
  const H = 15;

  const LEVELS = [
    {
      id: 1,
      tag: "SECTOR 1 · OUTER PERIMETER",
      objectiveStart: "Recover biometric key — north storage",
      objectiveExfil: "Reach northwest courtyard exfil",
      radio: "TX: Outer Perimeter. Soldiers path the corridors — stay off their routes.",
      map: [
        "111111111111111111111111",
        "100000000011000000000001",
        "102222000061000033300001",
        "100000000000000033300001",
        "100000111111100000000001",
        "100000100000100055500001",
        "111100160000100000000001",
        "100000600440100000011111",
        "100000100440160000000001",
        "100000111111111110000001",
        "100000000000000010022001",
        "103330000000000010000001",
        "103330000011100000000001",
        "100000000061100000000001",
        "111111111111111111111111",
      ],
      spawn: [2.5, 12.5],
      intel: [18.5, 2.5],
      extract: [2.5, 2.5],
      // Door opened at (6,7) into the crate room; pistol sits on the open floor inside
      pickups: [{ type: "pistol", x: 8.5, y: 7.5, ammo: 8 }],
      guards: [
        { x: 6.5, y: 3.5, path: [[6.5, 3.5], [10.5, 3.5], [10.5, 5.5], [6.5, 5.5]] },
        { x: 15.5, y: 5.5, path: [[15.5, 5.5], [20.5, 5.5], [20.5, 8.5], [15.5, 8.5]] },
        { x: 12.5, y: 11.5, path: [[8.5, 11.5], [16.5, 11.5], [16.5, 13.5], [8.5, 13.5]] },
        { x: 19.5, y: 12.5, path: [[19.5, 10.5], [21.5, 10.5], [21.5, 13.5], [19.5, 13.5]] },
      ],
      boss: null,
      lights: [[4, 4], [12, 7], [19, 4], [8, 12], [20, 12]],
      requireKey: true,
      win: "extract",
    },
    {
      id: 2,
      tag: "SECTOR 2 · ARMORY WING",
      objectiveStart: "Seize the rifle cache, then reach the east lift",
      objectiveExfil: "Enter the east lift",
      radio: "TX: Armory wing. Grab the rifle near insert, then ghost east to the lift.",
      map: [
        "111111111111111111111111",
        "100000111000011100000001",
        "100000100000000100033001",
        "100000160000006100000001",
        "100000111000011100000001",
        "100000000000000000000001",
        "100440000222000044000001",
        "100440000000000044060001",
        "111111111061111111100001",
        "100000000000000000000001",
        "100033300000000000220001",
        "100033300000000000000001",
        "100000000000000055500001",
        "100000000000000000000001",
        "111111111111111111111111",
      ],
      spawn: [2.5, 12.5],
      intel: null,
      extract: [21.5, 7.5],
      pickups: [
        { type: "rifle", x: 3.5, y: 11.5, ammo: 18 },
        { type: "pistol", x: 12.5, y: 2.5, ammo: 10 },
        { type: "med", x: 18.5, y: 12.5, ammo: 0 },
      ],
      // Two spaced patrols — south is mostly clear for a quiet east push
      guards: [
        { x: 10.5, y: 5.5, path: [[6.5, 5.5], [14.5, 5.5]] },
        { x: 17.5, y: 3.5, path: [[15.5, 2.5], [19.5, 2.5], [19.5, 4.5], [15.5, 4.5]] },
      ],
      boss: null,
      lights: [[6, 6], [16, 3], [12, 11], [20, 7]],
      requireKey: false,
      autoCompleteOnExtract: true,
      win: "extract",
    },
    {
      id: 3,
      tag: "SECTOR 3 · COMMAND DECK",
      objectiveStart: "Eliminate Commander Hale — or die trying",
      objectiveExfil: "Exfil through the north blast door",
      radio: "TX: Hale holds the biometric chain. He will not talk. End it.",
      map: [
        "111111111111111111111111",
        "100000000006000000000001",
        "100222000000000000222001",
        "100000010000000100000001",
        "100000010000000100000001",
        "100440010000000100440001",
        "100440010000000100440001",
        "100000010000000100000001",
        "111111160000000611111111",
        "100000000000000000000001",
        "100033000222000033000001",
        "100033000000000033000001",
        "100000001111111000000001",
        "100000000000000000000001",
        "111111111111111111111111",
      ],
      spawn: [12.5, 13.5],
      intel: null,
      extract: [11.5, 1.5],
      pickups: [
        { type: "rifle", x: 3.5, y: 10.5, ammo: 20 },
        { type: "rifle", x: 20.5, y: 10.5, ammo: 20 },
        { type: "med", x: 12.5, y: 10.5, ammo: 0 },
      ],
      guards: [
        { x: 4.5, y: 9.5, path: [[3.5, 9.5], [6.5, 9.5]] },
        { x: 19.5, y: 9.5, path: [[17.5, 9.5], [20.5, 9.5]] },
      ],
      boss: {
        name: "COMMANDER HALE",
        x: 12.5,
        y: 5.5,
        hp: 12,
        speed: 58,
        fireCd: 0.85,
        color: "#6a3a28",
      },
      lights: [[12, 5], [5, 10], [19, 10], [12, 12]],
      requireKey: false,
      win: "boss_then_extract",
      noAlertFail: true,
    },
  ];

  const KEYS = Object.create(null);
  const mouse = { x: 0, y: 0, down: false };
  const state = {
    running: false,
    levelIndex: 0,
    time: 0,
    bleed: 0,
    alert: 0,
    hasKey: false,
    bossDown: false,
    radioUntil: 0,
    toastUntil: 0,
    flashCd: 0,
    fireCd: 0,
    weapon: null,
    ammo: 0,
  };

  let map = [];
  let player;
  let guards;
  let boss;
  let intel;
  let extract;
  let pickups;
  let bullets;
  let level;

  const PAL = {
    playerFatigue: "#2f3a28",
    playerFatigueDark: "#232b1e",
    playerSkin: "#c4a882",
    guardFatigue: "#5a6b3e",
    guardFatigueDark: "#465432",
    guardSkin: "#b89a72",
    guardHelmet: "#3d4a30",
    rifle: "#2a2a28",
    boot: "#1c1814",
  };

  function parseMap(rows) {
    return rows.map((row) => row.split("").map(Number));
  }

  function tileAt(x, y) {
    const tx = Math.floor(x / TILE);
    const ty = Math.floor(y / TILE);
    if (tx < 0 || ty < 0 || tx >= W || ty >= H) return 1;
    return map[ty][tx];
  }

  function solidTile(t) {
    return t === 1;
  }

  function solid(x, y) {
    return solidTile(tileAt(x, y));
  }

  function walkableCell(tx, ty) {
    if (tx < 0 || ty < 0 || tx >= W || ty >= H) return false;
    return !solidTile(map[ty][tx]);
  }

  function inVent(x, y) {
    return tileAt(x, y) === 3;
  }

  function inShadow(x, y) {
    const t = tileAt(x, y);
    return t === 2 || t === 3 || t === 4;
  }

  function blocked(x, y, r) {
    const pads = [
      [x - r, y],
      [x + r, y],
      [x, y - r],
      [x, y + r],
      [x - r * 0.7, y - r * 0.7],
      [x + r * 0.7, y - r * 0.7],
      [x - r * 0.7, y + r * 0.7],
      [x + r * 0.7, y + r * 0.7],
    ];
    return pads.some(([px, py]) => solid(px, py));
  }

  function tryMove(ent, dx, dy) {
    const ox = ent.x;
    const oy = ent.y;
    const r = ent.r - 1;
    if (!blocked(ox + dx, oy + dy, r)) {
      ent.x = ox + dx;
      ent.y = oy + dy;
      return true;
    }
    if (dx !== 0 && !blocked(ox + dx, oy, r)) {
      ent.x = ox + dx;
      return true;
    }
    if (dy !== 0 && !blocked(ox, oy + dy, r)) {
      ent.y = oy + dy;
      return true;
    }
    return false;
  }

  function cellCenter(tx, ty) {
    return { x: (tx + 0.5) * TILE, y: (ty + 0.5) * TILE };
  }

  function toCell(x, y) {
    return { tx: Math.floor(x / TILE), ty: Math.floor(y / TILE) };
  }

  // BFS pathfinding — keeps soldiers out of walls
  function findPath(sx, sy, gx, gy) {
    let start = toCell(sx, sy);
    let goal = toCell(gx, gy);

    // If entity center is slightly in a wall, snap to nearest walkable cell
    if (!walkableCell(start.tx, start.ty)) {
      let found = null;
      for (let r = 1; r <= 2 && !found; r++) {
        for (let dy = -r; dy <= r && !found; dy++) {
          for (let dx = -r; dx <= r && !found; dx++) {
            if (walkableCell(start.tx + dx, start.ty + dy)) {
              found = { tx: start.tx + dx, ty: start.ty + dy };
            }
          }
        }
      }
      if (!found) return [];
      start = found;
    }

    if (!walkableCell(goal.tx, goal.ty)) {
      let found = null;
      for (let r = 1; r <= 3 && !found; r++) {
        for (let dy = -r; dy <= r && !found; dy++) {
          for (let dx = -r; dx <= r && !found; dx++) {
            if (walkableCell(goal.tx + dx, goal.ty + dy)) {
              found = { tx: goal.tx + dx, ty: goal.ty + dy };
            }
          }
        }
      }
      if (!found) return [];
      goal = found;
    }

    if (start.tx === goal.tx && start.ty === goal.ty) return [];

    const key = (tx, ty) => tx + "," + ty;
    const queue = [[start.tx, start.ty]];
    const came = new Map();
    came.set(key(start.tx, start.ty), null);
    const dirs = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];

    let reached = false;
    let steps = 0;
    const maxSteps = W * H + 4;
    while (queue.length && steps++ < maxSteps) {
      const [cx, cy] = queue.shift();
      if (cx === goal.tx && cy === goal.ty) {
        reached = true;
        break;
      }
      for (const [dx, dy] of dirs) {
        const nx = cx + dx;
        const ny = cy + dy;
        const k = key(nx, ny);
        if (came.has(k) || !walkableCell(nx, ny)) continue;
        came.set(k, [cx, cy]);
        queue.push([nx, ny]);
      }
    }
    if (!reached) return [];

    const path = [];
    let cur = [goal.tx, goal.ty];
    let guard = 0;
    while (cur && guard++ < maxSteps) {
      path.push(cellCenter(cur[0], cur[1]));
      cur = came.get(key(cur[0], cur[1]));
    }
    path.reverse();
    if (path.length && dist({ x: sx, y: sy }, path[0]) < 8) path.shift();
    return path;
  }

  function dist(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function angleTo(from, to) {
    return Math.atan2(to.y - from.y, to.x - from.x);
  }

  function normAngle(a) {
    while (a > Math.PI) a -= Math.PI * 2;
    while (a < -Math.PI) a += Math.PI * 2;
    return a;
  }

  function los(ax, ay, bx, by) {
    const steps = Math.ceil(Math.hypot(bx - ax, by - ay) / 6);
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      if (solid(ax + (bx - ax) * t, ay + (by - ay) * t)) return false;
    }
    return true;
  }

  function say(msg) {
    radioEl.textContent = msg;
    state.radioUntil = state.time + 4.8;
  }

  function toast(msg) {
    toastEl.textContent = msg;
    state.toastUntil = msg ? state.time + 2.2 : 0;
  }

  function setObjective(text) {
    objectiveEl.textContent = text;
  }

  function loadLevel(index, keepGear) {
    level = LEVELS[index];
    state.levelIndex = index;
    map = parseMap(level.map);
    state.time = 0;
    state.bleed = keepGear ? Math.min(state.bleed, 0.25) : 0;
    state.alert = 0;
    state.hasKey = false;
    state.bossDown = false;
    state.flashCd = 0;
    state.fireCd = 0;
    if (!keepGear) {
      state.weapon = null;
      state.ammo = 0;
    }

    player = {
      x: level.spawn[0] * TILE,
      y: level.spawn[1] * TILE,
      r: 11,
      crouch: false,
      facing: -Math.PI / 2,
      moving: false,
      walk: 0,
      hp: keepGear && player ? Math.max(player.hp, 60) : 100,
      maxHp: 100,
      invuln: 0.6,
    };

    intel = level.intel
      ? { x: level.intel[0] * TILE, y: level.intel[1] * TILE, taken: false }
      : null;
    extract = {
      x: level.extract[0] * TILE,
      y: level.extract[1] * TILE,
      r: 36,
      open: !level.requireKey && level.win !== "boss_then_extract",
    };

    pickups = level.pickups.map((p) => ({
      ...p,
      x: p.x * TILE,
      y: p.y * TILE,
      taken: false,
    }));

    guards = level.guards.map((g) => makeGuard(g.x, g.y, g.path));
    boss = level.boss
      ? {
          x: level.boss.x * TILE,
          y: level.boss.y * TILE,
          r: 12,
          facing: Math.PI / 2,
          state: "patrol",
          suspicion: 0,
          walk: 0,
          moving: false,
          speed: level.boss.speed,
          hp: level.boss.hp,
          maxHp: level.boss.hp,
          fireTimer: 0.8,
          nav: [],
          navIndex: 0,
          repath: 0.5,
          stuck: 0,
          name: level.boss.name,
          color: level.boss.color,
          fireCd: level.boss.fireCd,
          isBoss: true,
        }
      : null;

    bullets = [];
    levelTag.textContent = level.tag;
    bossHud.hidden = !boss;
    if (boss) {
      bossNameEl.textContent = boss.name;
      bossBar.style.width = "100%";
    }
    setObjective(level.objectiveStart);
    say(level.radio);
    toast("");
    updateHudGear();
  }

  function makeGuard(tx, ty, path) {
    return {
      x: tx * TILE,
      y: ty * TILE,
      r: 12,
      path: path.map(([x, y]) => ({ x: x * TILE, y: y * TILE })),
      pathIndex: 0,
      nav: [],
      navIndex: 0,
      repath: 0.2,
      stuck: 0,
      facing: 0,
      state: "patrol",
      suspicion: 0,
      walk: 0,
      moving: false,
      speed: 48,
      fireTimer: 0.8 + Math.random(),
      isBoss: false,
      hp: 2,
    };
  }

  function raiseBleed(amount, reason) {
    const before = state.bleed;
    state.bleed = Math.min(1, state.bleed + amount);
    if (reason && state.bleed > before + 0.01) toast(reason);
  }

  function updateHudGear() {
    if (!state.weapon) ammoReadout.textContent = "UNARMED";
    else ammoReadout.textContent = `${state.weapon.toUpperCase()} · ${state.ammo}`;
    hpBar.style.width = `${Math.round((player.hp / player.maxHp) * 100)}%`;
  }

  function hurtPlayer(dmg, reason) {
    if (player.invuln > 0) return;
    player.hp -= dmg;
    player.invuln = 0.55;
    raiseBleed(0.06, "");
    state.alert = Math.min(1, state.alert + 0.08);
    updateHudGear();
    if (player.hp <= 0) lose(reason || "You were cut down in the compound.");
  }

  function canSeePlayer(g) {
    if (g.state === "down" || g.hp <= 0) return false;
    if (player.invuln > 0.4 && g.state !== "chase") return false;
    if (inVent(player.x, player.y) && player.crouch) return false;

    const d = dist(g, player);
    const bleedBoost = 1 + state.bleed * 0.85;
    let range = (g.isBoss ? 240 : g.state === "chase" ? 200 : 145) * bleedBoost;
    if (player.crouch) range *= 0.7;
    if (inShadow(player.x, player.y)) range *= 0.55;
    if (d > range) return false;

    const fov = (g.isBoss || g.state === "chase" ? 1.4 : 0.9) + state.bleed * 0.3;
    if (Math.abs(normAngle(angleTo(g, player) - g.facing)) > fov) return false;
    return los(g.x, g.y, player.x, player.y);
  }

  function fireBullet(from, angle, team, speed, damage, life) {
    bullets.push({
      x: from.x + Math.cos(angle) * 14,
      y: from.y + Math.sin(angle) * 14,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      team,
      damage,
      life: life || 0.9,
      r: 3,
    });
  }

  function playerAimAngle() {
    return Math.atan2(mouse.y - player.y, mouse.x - player.x);
  }

  function tryPlayerFire() {
    if (!state.weapon || state.ammo <= 0 || state.fireCd > 0) return;
    const ang = playerAimAngle();
    player.facing = ang;
    const isRifle = state.weapon === "rifle";
    fireBullet(player, ang, "fox", isRifle ? 520 : 440, isRifle ? 2 : 1, 1.0);
    state.ammo -= 1;
    state.fireCd = isRifle ? 0.18 : 0.28;
    raiseBleed(0.05, "");
    // Boss arena: don't spike alert-to-fail from gunfire
    if (!level.noAlertFail) {
      raiseBleed(0.05, "Weapon fire — signature spike");
      state.alert = Math.min(1, state.alert + 0.08);
    }
    updateHudGear();
  }

  function updatePlayer(dt) {
    player.crouch = !!(KEYS.ShiftLeft || KEYS.ShiftRight);
    if (inVent(player.x, player.y)) player.crouch = true;

    let speed = player.crouch ? 62 : 118;
    if (KEYS.KeyF && state.flashCd <= 0) {
      speed = 230;
      raiseBleed(0.12, "Sprint burst — signature spike");
      state.flashCd = 0.55;
      state.alert = Math.min(1, state.alert + 0.04);
    }

    let mx = 0;
    let my = 0;
    if (KEYS.KeyW || KEYS.ArrowUp) my -= 1;
    if (KEYS.KeyS || KEYS.ArrowDown) my += 1;
    if (KEYS.KeyA || KEYS.ArrowLeft) mx -= 1;
    if (KEYS.KeyD || KEYS.ArrowRight) mx += 1;

    player.moving = !!(mx || my);
    if (player.moving) {
      const len = Math.hypot(mx, my) || 1;
      mx = (mx / len) * speed * dt;
      my = (my / len) * speed * dt;
      tryMove(player, mx, my);
      if (!(state.weapon && (mouse.down || KEYS.KeyR))) {
        player.facing = Math.atan2(my, mx);
      }
      player.walk += dt * (player.crouch ? 7 : 11);
      if (!player.crouch) raiseBleed(0.012 * dt, "");
    }

    if (state.weapon) player.facing = playerAimAngle();

    if (state.flashCd > 0) state.flashCd -= dt;
    if (state.fireCd > 0) state.fireCd -= dt;
    if (player.invuln > 0) player.invuln -= dt;

    if (player.crouch && !player.moving) state.bleed = Math.max(0, state.bleed - 0.05 * dt);
    else if (player.crouch) state.bleed = Math.max(0, state.bleed - 0.02 * dt);

    if (KEYS.KeyE) {
      KEYS.KeyE = false;
      for (const p of pickups) {
        if (p.taken || dist(player, p) > 28) continue;
        p.taken = true;
        if (p.type === "med") {
          player.hp = Math.min(player.maxHp, player.hp + 40);
          toast("Field kit — wounds patched");
          say("TX: Stay standing. Hale still owns this deck.");
        } else {
          state.weapon = p.type;
          state.ammo += p.ammo;
          toast(`${p.type.toUpperCase()} acquired (+${p.ammo})`);
          say("TX: Live steel. Aim before you advertise yourself.");
        }
        updateHudGear();
      }
      if (intel && !intel.taken && dist(player, intel) < 28) {
        intel.taken = true;
        state.hasKey = true;
        extract.open = true;
        setObjective(level.objectiveExfil);
        say("TX: Key secured. Courtyard exit is live.");
        raiseBleed(0.08, "Biometric alarm ping");
      }
      if (extract.open && dist(player, extract) < extract.r) {
        advanceOrWin();
      }
    }

    if (KEYS.Space) {
      KEYS.Space = false;
      const targets = [...guards, ...(boss && boss.hp > 0 ? [boss] : [])];
      const target = targets.find((g) => {
        if (g.state === "down" || g.hp <= 0) return false;
        if (dist(g, player) > 30) return false;
        if (g.isBoss) return false;
        const behind = Math.abs(normAngle(g.facing - angleTo(g, player))) > 1.8;
        return behind || player.crouch;
      });
      if (target) {
        target.hp = 0;
        target.state = "down";
        raiseBleed(0.18, "Takedown logged");
        say("TX: Clean CQC.");
      }
    }

    if ((mouse.down || KEYS.KeyR) && state.weapon) tryPlayerFire();
  }

  function steerAlongNav(ent, dt, speed) {
    if (!ent.nav || ent.navIndex >= ent.nav.length) {
      ent.moving = false;
      return false;
    }
    const node = ent.nav[ent.navIndex];
    const d = dist(ent, node);
    if (d < 12) {
      ent.navIndex += 1;
      ent.stuck = 0;
      return true;
    }
    const ang = angleTo(ent, node);
    ent.facing = ang;
    const step = Math.min(speed * dt, d);
    const moved = tryMove(ent, Math.cos(ang) * step, Math.sin(ang) * step);
    ent.moving = moved;
    if (moved) {
      ent.walk += dt * 10;
      ent.stuck = 0;
    } else {
      ent.stuck = (ent.stuck || 0) + dt;
      // Back off before repathing — prevents per-frame BFS thrash / hitch freezes
      if (ent.stuck > 0.25) {
        ent.repath = 0.4;
        ent.nav = [];
        ent.navIndex = 0;
        ent.stuck = 0;
      }
    }
    return moved;
  }

  function requestPath(g, tx, ty, cooldown) {
    if (g.repath > 0 && g.nav && g.nav.length) return;
    if (g.repath > 0 && (!g.nav || !g.nav.length)) {
      // still cooling down after a failed / cleared path
      return;
    }
    g.nav = findPath(g.x, g.y, tx, ty);
    g.navIndex = 0;
    g.repath = cooldown;
    if (!g.nav.length) g.repath = Math.max(cooldown, 0.5);
  }

  function updateSoldier(g, dt) {
    if (g.state === "down" || g.hp <= 0) {
      g.state = "down";
      return;
    }

    const spotted = canSeePlayer(g);
    if (spotted) {
      g.suspicion = Math.min(1, g.suspicion + dt * (0.9 + state.bleed));
      g.state = g.suspicion > 0.45 || g.isBoss ? "chase" : "suspicious";
      g.facing = angleTo(g, player);
      if (!level.noAlertFail) {
        state.alert = Math.min(1, state.alert + dt * (0.2 + state.bleed * 0.35));
      }
      if (!g.isBoss && dist(g, player) < 18) {
        hurtPlayer(25, "A soldier closed distance and dropped you.");
      }
    } else if (g.state === "chase") {
      g.suspicion = Math.max(0, g.suspicion - dt * 0.12);
      if (g.suspicion <= 0.08) {
        g.state = "patrol";
        g.nav = [];
        g.repath = 0.2;
        say("TX: Visual lost. Break pattern.");
      }
    } else {
      g.suspicion = Math.max(0, g.suspicion - dt * 0.25);
      if (g.suspicion < 0.2 && !g.isBoss) g.state = "patrol";
    }

    let speed = g.speed * (1 + state.bleed * 0.35);
    if (g.state === "chase") speed *= g.isBoss ? 1.15 : 1.3;
    if (g.state === "suspicious") speed *= 0.75;

    g.repath = Math.max(0, g.repath - dt);

    if (g.state === "chase" || g.state === "suspicious") {
      // Boss keeps distance and strafes instead of path-thrashing into the player
      if (g.isBoss && spotted && dist(g, player) < 120) {
        const ang = angleTo(player, g);
        const strafe = ang + Math.PI / 2;
        tryMove(g, Math.cos(strafe) * speed * dt * 0.7, Math.sin(strafe) * speed * dt * 0.7);
        g.facing = angleTo(g, player);
        g.moving = true;
        g.walk += dt * 10;
      } else {
        if (g.repath <= 0) requestPath(g, player.x, player.y, g.isBoss ? 0.55 : 0.5);
        steerAlongNav(g, dt, speed);
      }
    } else if (g.isBoss) {
      if (g.repath <= 0 && (!g.nav.length || g.navIndex >= g.nav.length)) {
        const targets = [
          [9.5, 5.5],
          [15.5, 5.5],
          [12.5, 4.5],
          [12.5, 7.5],
        ];
        const t = targets[Math.floor(Math.random() * targets.length)];
        requestPath(g, t[0] * TILE, t[1] * TILE, 0.6);
      }
      steerAlongNav(g, dt, speed * 0.85);
    } else {
      const node = g.path[g.pathIndex];
      if (g.repath <= 0 && (!g.nav.length || g.navIndex >= g.nav.length)) {
        requestPath(g, node.x, node.y, 0.7);
      }
      steerAlongNav(g, dt, speed);
      if (dist(g, node) < 14) {
        g.pathIndex = (g.pathIndex + 1) % g.path.length;
        g.nav = [];
        g.repath = 0.15;
      }
    }

    g.fireTimer -= dt;
    const armed = g.isBoss || g.state === "chase";
    if (armed && spotted && g.fireTimer <= 0 && los(g.x, g.y, player.x, player.y)) {
      const ang = angleTo(g, player) + (Math.random() - 0.5) * (g.isBoss ? 0.12 : 0.2);
      g.facing = ang;
      fireBullet(g, ang, "outer", g.isBoss ? 420 : 380, g.isBoss ? 14 : 12, 1.0);
      g.fireTimer = g.isBoss ? g.fireCd : 0.9 + Math.random() * 0.4;
    }
  }

  function updateBullets(dt) {
    for (const b of bullets) {
      b.life -= dt;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      if (solid(b.x, b.y)) {
        b.life = 0;
        continue;
      }
      if (b.team === "outer") {
        if (dist(b, player) < player.r + 4) {
          b.life = 0;
          hurtPlayer(b.damage, "Caught in live fire.");
        }
      } else {
        for (const g of guards) {
          if (g.hp <= 0) continue;
          if (dist(b, g) < g.r + 3) {
            b.life = 0;
            g.hp -= b.damage;
            if (g.hp <= 0) {
              g.state = "down";
              toast("Hostile down");
            } else {
              g.state = "chase";
              g.suspicion = 1;
            }
            break;
          }
        }
        if (b.life > 0 && boss && boss.hp > 0 && dist(b, boss) < boss.r + 4) {
          b.life = 0;
          boss.hp -= b.damage;
          boss.state = "chase";
          boss.suspicion = 1;
          bossBar.style.width = `${Math.round((boss.hp / boss.maxHp) * 100)}%`;
          if (boss.hp <= 0) {
            boss.state = "down";
            state.bossDown = true;
            extract.open = true;
            setObjective(level.objectiveExfil);
            say("TX: Hale is down. North blast door unlocked — move.");
            toast("Commander eliminated");
            bossHud.hidden = true;
          }
        }
      }
    }
    bullets = bullets.filter((b) => b.life > 0);
  }

  function advanceOrWin() {
    if (!state.running) return;
    if (state.levelIndex < LEVELS.length - 1) {
      say("TX: Sector clear. Pushing you deeper.");
      loadLevel(state.levelIndex + 1, true);
      return;
    }
    win();
  }

  function update(dt) {
    if (!state.running) return;
    state.time += dt;
    updatePlayer(dt);
    for (const g of guards) updateSoldier(g, dt);
    if (boss && boss.hp > 0) updateSoldier(boss, dt);
    updateBullets(dt);

    // Sector 2: reaching extract without key still advances
    if (
      level.win === "extract" &&
      !level.requireKey &&
      extract.open &&
      dist(player, extract) < extract.r &&
      KEYS.KeyE
    ) {
      // handled in interact
    }

    if (level.id === 2 && !state.hasKey) extract.open = true;
    if (level.win === "boss_then_extract") {
      extract.open = state.bossDown;
    }

    const anyChase =
      guards.some((g) => g.state === "chase") || (boss && boss.state === "chase");
    if (!anyChase) state.alert = Math.max(0, state.alert - dt * 0.08);
    // Alert fail is disabled on the boss sector — firefights were auto-failing mid-fight
    if (!level.noAlertFail && state.alert >= 1) {
      lose("Compound-wide pattern lock. Your signature is burned.");
    }

    if (state.time > state.radioUntil) radioEl.textContent = "";
    if (state.time > state.toastUntil) toastEl.textContent = "";

    bleedBar.style.width = `${Math.round(state.bleed * 100)}%`;
    alertBar.style.width = `${Math.round(state.alert * 100)}%`;
    hpBar.style.width = `${Math.round((player.hp / player.maxHp) * 100)}%`;
  }

  function win() {
    state.running = false;
    end.hidden = false;
    endTitle.textContent = "FORTRESS BROKEN";
    endText.textContent =
      "Three sectors cleared. Commander Hale is gone and the biometric chain is yours. Prototype campaign complete.";
  }

  function lose(reason) {
    state.running = false;
    end.hidden = false;
    endTitle.textContent = "COMPROMISED";
    endText.textContent = reason;
  }

  function drawFloorTile(x, y, t) {
    const px = x * TILE;
    const py = y * TILE;
    if (t === 1) {
      ctx.fillStyle = "#3a4034";
      ctx.fillRect(px, py, TILE, TILE);
      ctx.fillStyle = "#4a5244";
      ctx.fillRect(px + 1, py + 1, TILE - 2, 3);
      ctx.fillStyle = "#2c3228";
      ctx.fillRect(px + 1, py + TILE - 4, TILE - 2, 3);
      ctx.fillStyle = "#555c4c";
      ctx.fillRect(px + 8, py + 14, TILE - 16, 2);
      ctx.fillRect(px + 8, py + 24, TILE - 16, 2);
      return;
    }
    ctx.fillStyle = (x + y) % 2 === 0 ? "#6a6e5e" : "#64685a";
    ctx.fillRect(px, py, TILE, TILE);
    ctx.strokeStyle = "rgba(40,44,34,0.25)";
    ctx.strokeRect(px + 0.5, py + 0.5, TILE - 1, TILE - 1);
    if (t === 2) {
      ctx.fillStyle = "rgba(15,18,12,0.45)";
      ctx.fillRect(px, py, TILE, TILE);
    } else if (t === 3) {
      ctx.fillStyle = "#3a3e36";
      ctx.fillRect(px + 4, py + 4, TILE - 8, TILE - 8);
      ctx.strokeStyle = "#2a2e26";
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(px + 6, py + 10 + i * 6);
        ctx.lineTo(px + TILE - 6, py + 10 + i * 6);
        ctx.stroke();
      }
    } else if (t === 4) {
      ctx.fillStyle = "#6b5234";
      ctx.fillRect(px + 6, py + 6, TILE - 12, TILE - 12);
      ctx.strokeStyle = "#3e2e1c";
      ctx.strokeRect(px + 6.5, py + 6.5, TILE - 13, TILE - 13);
      ctx.beginPath();
      ctx.moveTo(px + 6, py + TILE / 2);
      ctx.lineTo(px + TILE - 6, py + TILE / 2);
      ctx.moveTo(px + TILE / 2, py + 6);
      ctx.lineTo(px + TILE / 2, py + TILE - 6);
      ctx.stroke();
    } else if (t === 5) {
      ctx.fillStyle = "#505448";
      ctx.fillRect(px, py, TILE, TILE);
      ctx.strokeStyle = "#2e3228";
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          ctx.strokeRect(px + 4 + i * 8, py + 4 + j * 8, 7, 7);
        }
      }
    } else if (t === 6) {
      ctx.fillStyle = "#4a4e42";
      ctx.fillRect(px, py, TILE, TILE);
      ctx.fillStyle = "#2a2e26";
      ctx.fillRect(px + 2, py + TILE / 2 - 3, TILE - 4, 6);
      ctx.fillStyle = "#8a9070";
      ctx.fillRect(px + TILE / 2 - 2, py + TILE / 2 - 2, 4, 4);
    }
  }

  function drawMap() {
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) drawFloorTile(x, y, map[y][x]);
    }
    for (const [lx, ly] of level.lights) {
      const g = ctx.createRadialGradient(
        lx * TILE,
        ly * TILE,
        10,
        lx * TILE,
        ly * TILE,
        110
      );
      g.addColorStop(0, "rgba(220, 210, 160, 0.07)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(lx * TILE - 110, ly * TILE - 110, 220, 220);
    }
  }

  function drawVision(g) {
    if (g.state === "down" || g.hp <= 0) return;
    const range = (g.isBoss ? 240 : g.state === "chase" ? 200 : 145) * (1 + state.bleed * 0.85);
    const fov = (g.isBoss || g.state === "chase" ? 1.4 : 0.9) + state.bleed * 0.3;
    ctx.beginPath();
    ctx.moveTo(g.x, g.y);
    ctx.arc(g.x, g.y, range, g.facing - fov, g.facing + fov);
    ctx.closePath();
    ctx.fillStyle =
      g.state === "chase"
        ? "rgba(180, 60, 40, 0.14)"
        : g.state === "suspicious"
          ? "rgba(180, 140, 40, 0.11)"
          : "rgba(90, 110, 50, 0.08)";
    ctx.fill();
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawHumanoid(ent, opts) {
    const { fatigue, fatigueDark, skin, helmet, hasRifle, down, crouch, scaleMul } = opts;
    const swing = ent.moving ? Math.sin(ent.walk) * (crouch ? 0.25 : 0.45) : 0;
    const leg = ent.moving ? Math.sin(ent.walk) * (crouch ? 3 : 5) : 0;
    const scale = (crouch ? 0.82 : 1) * (scaleMul || 1);

    ctx.save();
    ctx.translate(ent.x, ent.y);
    ctx.rotate(ent.facing + Math.PI / 2);
    if (down) {
      ctx.rotate(Math.PI / 2);
      ctx.globalAlpha = 0.55;
    }
    ctx.scale(scale, scale);

    ctx.fillStyle = "rgba(0,0,0,0.28)";
    ctx.beginPath();
    ctx.ellipse(0, 6, 11, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = fatigueDark;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-3, 2);
    ctx.lineTo(-3 - leg * 0.3, crouch ? 9 : 12 + leg);
    ctx.moveTo(3, 2);
    ctx.lineTo(3 + leg * 0.3, crouch ? 9 : 12 - leg);
    ctx.stroke();

    ctx.fillStyle = PAL.boot;
    ctx.beginPath();
    ctx.arc(-3 - leg * 0.3, crouch ? 10 : 13 + leg, 2.2, 0, Math.PI * 2);
    ctx.arc(3 + leg * 0.3, crouch ? 10 : 13 - leg, 2.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = fatigue;
    roundRect(-7, -8, 14, crouch ? 12 : 14, 3);
    ctx.fill();
    ctx.fillStyle = fatigueDark;
    ctx.fillRect(-7, -1, 14, 3);

    ctx.strokeStyle = fatigue;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(-7, -5);
    ctx.lineTo(-11, crouch ? 2 : 4 + swing * 4);
    ctx.moveTo(7, -5);
    ctx.lineTo(11, crouch ? 2 : 4 - swing * 4);
    ctx.stroke();

    ctx.fillStyle = skin;
    ctx.beginPath();
    ctx.arc(-11, crouch ? 2 : 4 + swing * 4, 2, 0, Math.PI * 2);
    ctx.arc(11, crouch ? 2 : 4 - swing * 4, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = skin;
    ctx.beginPath();
    ctx.arc(0, crouch ? -11 : -12, 5.2, 0, Math.PI * 2);
    ctx.fill();

    if (helmet) {
      ctx.fillStyle = helmet;
      ctx.beginPath();
      ctx.arc(0, crouch ? -12 : -13, 5.4, Math.PI, 0);
      ctx.fill();
      ctx.fillRect(-5.4, crouch ? -12 : -13, 10.8, 2.5);
    } else {
      ctx.fillStyle = "#1e2818";
      ctx.fillRect(-5, crouch ? -13 : -14, 10, 2.5);
    }

    ctx.strokeStyle = "#1a1e14";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-4, -6);
    ctx.lineTo(4, 2);
    ctx.moveTo(4, -6);
    ctx.lineTo(-4, 2);
    ctx.stroke();

    if (hasRifle && !down) {
      ctx.save();
      ctx.translate(10, -2);
      ctx.rotate(-0.15);
      ctx.fillStyle = PAL.rifle;
      ctx.fillRect(-2, -10, 3.5, 18);
      ctx.fillRect(-3, -12, 6, 3);
      ctx.fillStyle = "#3a3a36";
      ctx.fillRect(-1, 4, 2.5, 5);
      ctx.restore();
    }

    ctx.restore();
  }

  function drawPickups() {
    for (const p of pickups) {
      if (p.taken) continue;
      if (p.type === "med") {
        ctx.fillStyle = "#8a3a3a";
        ctx.fillRect(p.x - 7, p.y - 5, 14, 10);
        ctx.fillStyle = "#e8e8e0";
        ctx.fillRect(p.x - 2, p.y - 7, 4, 14);
        ctx.fillRect(p.x - 7, p.y - 2, 14, 4);
      } else {
        ctx.fillStyle = "#2a2a28";
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(-0.4);
        ctx.fillRect(-10, -3, 20, 6);
        ctx.fillRect(6, -5, 6, 4);
        ctx.restore();
        ctx.fillStyle = "#d4d8c4";
        ctx.font = "9px Share Tech Mono";
        ctx.fillText(p.type === "rifle" ? "RIFLE" : "PISTOL", p.x - 14, p.y - 12);
      }
    }
  }

  function drawMarkers() {
    if (intel && !intel.taken) {
      ctx.fillStyle = "#2a2e26";
      ctx.fillRect(intel.x - 8, intel.y - 4, 16, 10);
      ctx.fillStyle = "#8a9a4a";
      ctx.fillRect(intel.x - 5, intel.y - 8, 10, 7);
      ctx.fillStyle = "#c8d878";
      ctx.beginPath();
      ctx.arc(intel.x, intel.y - 5, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#d4d8c4";
      ctx.font = "10px Share Tech Mono";
      ctx.fillText("KEY", intel.x - 10, intel.y - 14);
    }

    ctx.strokeStyle = extract.open ? "#9aaf5a" : "#5a6048";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.arc(extract.x, extract.y, extract.r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = extract.open ? "#9aaf5a" : "#5a6048";
    ctx.font = "10px Share Tech Mono";
    ctx.fillText(extract.open ? "EXFIL" : "LOCKED", extract.x - 18, extract.y - extract.r - 6);
  }

  function drawBullets() {
    for (const b of bullets) {
      ctx.fillStyle = b.team === "fox" ? "#c8d878" : "#c45a3a";
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function draw() {
    if (!level) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    drawMarkers();
    drawPickups();

    for (const g of guards) drawVision(g);
    if (boss && boss.hp > 0) drawVision(boss);

    const actors = [
      ...guards.map((g) => ({ kind: "guard", ent: g })),
      ...(boss ? [{ kind: "boss", ent: boss }] : []),
      { kind: "player", ent: player },
    ].sort((a, b) => a.ent.y - b.ent.y);

    for (const a of actors) {
      if (a.kind === "player") {
        drawHumanoid(player, {
          fatigue: PAL.playerFatigue,
          fatigueDark: PAL.playerFatigueDark,
          skin: PAL.playerSkin,
          helmet: null,
          hasRifle: !!state.weapon,
          down: false,
          crouch: player.crouch,
        });
      } else if (a.kind === "boss") {
        const g = a.ent;
        drawHumanoid(g, {
          fatigue: g.color || "#6a3a28",
          fatigueDark: "#3a2218",
          skin: PAL.guardSkin,
          helmet: "#2a1810",
          hasRifle: true,
          down: g.hp <= 0,
          crouch: false,
          scaleMul: 1.25,
        });
      } else {
        const g = a.ent;
        drawHumanoid(g, {
          fatigue: g.state === "chase" ? "#6a4a32" : PAL.guardFatigue,
          fatigueDark: PAL.guardFatigueDark,
          skin: PAL.guardSkin,
          helmet: PAL.guardHelmet,
          hasRifle: true,
          down: g.state === "down" || g.hp <= 0,
          crouch: false,
        });
      }
    }

    drawBullets();

    // Aim reticle
    if (state.weapon && state.running) {
      ctx.strokeStyle = "rgba(200, 216, 120, 0.7)";
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 8, 0, Math.PI * 2);
      ctx.moveTo(mouse.x - 12, mouse.y);
      ctx.lineTo(mouse.x + 12, mouse.y);
      ctx.moveTo(mouse.x, mouse.y - 12);
      ctx.lineTo(mouse.x, mouse.y + 12);
      ctx.stroke();
    }

    const wash = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      160,
      canvas.width / 2,
      canvas.height / 2,
      540
    );
    wash.addColorStop(0, "rgba(0,0,0,0)");
    wash.addColorStop(1, "rgba(12,14,8,0.4)");
    ctx.fillStyle = wash;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0,0,0,0.04)";
    for (let y = 0; y < canvas.height; y += 3) ctx.fillRect(0, y, canvas.width, 1);
  }

  let last = 0;
  function frame(ts) {
    const dt = Math.min(0.033, (ts - last) / 1000 || 0.016);
    last = ts;
    if (state.running) update(dt);
    if (!canvas.hidden) draw();
    requestAnimationFrame(frame);
  }

  function startGame() {
    boot.hidden = true;
    end.hidden = true;
    hud.hidden = false;
    canvas.hidden = false;
    state.running = true;
    state.weapon = null;
    state.ammo = 0;
    loadLevel(0, false);
  }

  function canvasPos(e) {
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / rect.width;
    const sy = canvas.height / rect.height;
    mouse.x = (e.clientX - rect.left) * sx;
    mouse.y = (e.clientY - rect.top) * sy;
  }

  startBtn.addEventListener("click", startGame);
  retryBtn.addEventListener("click", startGame);

  canvas.addEventListener("mousemove", canvasPos);
  canvas.addEventListener("mousedown", (e) => {
    canvasPos(e);
    mouse.down = true;
    e.preventDefault();
  });
  window.addEventListener("mouseup", () => {
    mouse.down = false;
  });

  window.addEventListener("keydown", (e) => {
    KEYS[e.code] = true;
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
      e.preventDefault();
    }
  });
  window.addEventListener("keyup", (e) => {
    KEYS[e.code] = false;
  });

  requestAnimationFrame(frame);
})();
