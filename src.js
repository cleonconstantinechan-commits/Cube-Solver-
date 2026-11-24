
import Cube from 'cubejs';
import './style.css';

const app = document.getElementById('app');

const FACE_ORDER = ['U', 'R', 'F', 'D', 'L', 'B'];

const COLORS = {
  U: { name: 'Putih', hex: '#f8fafc' },
  R: { name: 'Merah', hex: '#ef4444' },
  F: { name: 'Hijau', hex: '#22c55e' },
  D: { name: 'Kuning', hex: '#facc15' },
  L: { name: 'Oranye', hex: '#f97316' },
  B: { name: 'Biru', hex: '#3b82f6' }
};

const faceNames = {
  U: 'Atas',
  R: 'Kanan',
  F: 'Depan',
  D: 'Bawah',
  L: 'Kiri',
  B: 'Belakang'
};

let stickers = {};
FACE_ORDER.forEach(face => {
  stickers[face] = Array(9).fill(face);
});

let timerRunning = false;
let timerStart = 0;
let timerElapsed = 0;
let timerFrame = null;

app.innerHTML = `
<header>
  <div class="logo">🧊<span>★</span></div>
  <h1>Cube Solver★</h1>
  <p>Scramble · Timer · Solver 3×3</p>
</header>

<nav>
  <button class="tab active" data-tab="home">Beranda</button>
  <button class="tab" data-tab="solver">Solver 3×3</button>
</nav>

<section id="home" class="page active">
  <div class="panel">
    <h2>Scramble Rubik</h2>
    <label>Panjang langkah</label>
    <select id="scrambleLength">
      <option>20</option>
      <option selected>30</option>
      <option>40</option>
      <option>60</option>
      <option>100</option>
    </select>
    <button id="scrambleBtn">Buat Scramble</button>
    <div id="scrambleText" class="moves">
      Tekan tombol untuk membuat scramble.
    </div>
  </div>

  <div class="panel timerpanel">
    <div id="timer">00:00.00</div>
    <button id="timerToggle">Mulai Timer</button>
    <button class="secondary" id="timerReset">Reset Timer</button>
  </div>

  <div class="panel">
    <h3>Info</h3>
    <p>Timer dan scramble dapat digunakan offline.
    Solver menerima input warna Rubik 3×3.</p>
  </div>
</section>

<section id="solver" class="page">
  <div class="panel">
    <h2>Solver Rubik 3×3</h2>
    <p class="small">
      Ketuk stiker untuk mengganti warna.
      Bagian tengah setiap sisi terkunci.
    </p>

    <div id="faces" class="faces"></div>

    <div class="actions">
      <button class="secondary" id="solvedBtn">
        Reset ke solved
      </button>
      <button id="solveBtn">Cari solusi</button>
    </div>

    <div id="solverOutput" class="output">
      Masukkan warna cube, lalu tekan Cari solusi.
    </div>
  </div>
</section>

<footer>Cube Solver★ · berjalan offline</footer>
`;

const facesEl = document.getElementById('faces');

FACE_ORDER.forEach(face => {
  const section = document.createElement('div');
  section.className = 'face';

  section.innerHTML = `
    <h3>${faceNames[face]} (${face})</h3>
    <div class="grid" data-face="${face}"></div>
  `;

  const grid = section.querySelector('.grid');

  stickers[face].forEach((color, i) => {
    const cell = document.createElement('button');

    cell.className = 'sticker';
    cell.dataset.face = face;
    cell.dataset.index = i;
    cell.title = 'Ketuk untuk mengganti warna';
    cell.style.background = COLORS[color].hex;

    if (i === 4) {
      cell.classList.add('center');
      cell.disabled = true;
    }

    cell.onclick = () => {
      const index = FACE_ORDER.indexOf(stickers[face][i]);
      const next = FACE_ORDER[(index + 1) % 6];

      stickers[face][i] = next;
      cell.style.background = COLORS[next].hex;
      cell.title = COLORS[next].name;
    };

    grid.appendChild(cell);
  });

  facesEl.appendChild(section);
});

function renderFaces() {
  document.querySelectorAll('.sticker').forEach(cell => {
    const face = cell.dataset.face;
    const index = Number(cell.dataset.index);
    const color = stickers[face][index];

    cell.style.background = COLORS[color].hex;
    cell.title = COLORS[color].name;
  });
}

function scramble() {
  const moves = ['R', 'L', 'U', 'D', 'F', 'B'];

  // Perbaikan sintaks: tiga jenis akhiran gerakan
  const mods = ['', "'", '2'];

  const list = [];
  let previous = '';

  const length = Number(
    document.getElementById('scrambleLength').value
  );

  for (let i = 0; i < length; i++) {
    let move;

    do {
      move = moves[Math.random() * moves.length | 0];
    } while (move === previous);

    previous = move;

    const modifier = mods[Math.random() * mods.length | 0];
    list.push(move + modifier);
  }

  document.getElementById('scrambleText').textContent =
    list.join(' ');
}

function timeFmt(ms) {
  const seconds = ms / 1000;
  const minutes = Math.floor(seconds / 60);
  const sec = (seconds % 60).toFixed(2);

  return String(minutes).padStart(2, '0') +
    ':' + sec.padStart(5, '0');
}

function timerTick() {
  timerElapsed = performance.now() - timerStart;

  document.getElementById('timer').textContent =
    timeFmt(timerElapsed);

  if (timerRunning) {
    timerFrame = requestAnimationFrame(timerTick);
  }
}

function stopTimer() {
  timerRunning = false;
  cancelAnimationFrame(timerFrame);

  document.getElementById('timerToggle').textContent =
    'Mulai Timer';
}

document.getElementById('scrambleBtn').onclick = scramble;

document.getElementById('timerToggle').onclick = () => {
  timerRunning = !timerRunning;

  const button = document.getElementById('timerToggle');

  if (timerRunning) {
    timerStart = performance.now() - timerElapsed;
    button.textContent = 'Stop Timer';
    timerFrame = requestAnimationFrame(timerTick);
  } else {
    stopTimer();
  }
};

document.getElementById('timerReset').onclick = () => {
  stopTimer();
  timerElapsed = 0;

  document.getElementById('timer').textContent = '00:00.00';
};

document.querySelectorAll('.tab').forEach(button => {
  button.onclick = () => {
    document.querySelectorAll('.tab').forEach(item => {
      item.classList.remove('active');
    });

    document.querySelectorAll('.page').forEach(page => {
      page.classList.remove('active');
    });

    button.classList.add('active');

    document.getElementById(button.dataset.tab)
      .classList.add('active');
  };
});

document.getElementById('solvedBtn').onclick = () => {
  FACE_ORDER.forEach(face => {
    stickers[face] = Array(9).fill(face);
  });

  renderFaces();

  document.getElementById('solverOutput').textContent =
    'Cube direset ke keadaan solved.';
};

document.getElementById('solveBtn').onclick = () => {
  const counts = {
    U: 0,
    R: 0,
    F: 0,
    D: 0,
    L: 0,
    B: 0
  };

  FACE_ORDER.forEach(face => {
    stickers[face].forEach(color => {
      counts[color]++;
    });
  });

  const invalid =
    FACE_ORDER.some(face => stickers[face][4] !== face) ||
    FACE_ORDER.some(color => counts[color] !== 9);

  const output = document.getElementById('solverOutput');

  if (invalid) {
    output.textContent =
      'Input tidak valid: pastikan center tetap dan setiap warna muncul tepat 9 kali.';
    return;
  }

  const facelets = FACE_ORDER
    .map(face => stickers[face].join(''))
    .join('');

  output.textContent = 'Menyiapkan solver…';

  setTimeout(() => {
    try {
      Cube.initSolver();

      const cube = Cube.fromString(facelets);
      const solution = cube.solve();

      if (solution) {
        const count = solution.trim()
          ? solution.trim().split(/\s+/).length
          : 0;

        output.innerHTML = `
          <strong>Solusi ditemukan!</strong>
          <p class="moves">${solution}</p>
          <p class="small">
            ${count} langkah · Ikuti gerakan dari kiri ke kanan.
          </p>
        `;
      } else {
        output.textContent = 'Cube sudah solved!';
      }
    } catch (error) {
      output.textContent =
        'Solver gagal memproses input. Periksa kembali warna dan posisi stiker.';
      console.error(error);
    }
  }, 50);
};
