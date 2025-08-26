// ==========================
//  Listening Website (v2) – grouped tests + auto filenames
// ==========================

// Topic lists per level
const TOPICS = {
  A1: [
    "Daily routines", "Family & friends", "Food & drinks", "Numbers & time",
    "School", "Weather & seasons", "Hobbies & free time",
    "Shopping", "Travel", "At the Park"
  ],
  A2: [
    "Holidays & festivals", "Health", "Sports",
    "Houses & homes", "Work & jobs", "DirectionS", "Nature",
    "Weekend plans", "Fashion", "Ordering"
  ],
  B1: [
    "Technology", "cClture", "Education",
    "Travel", "Environment", "Communication",
    "Entertainment", "Future plans", "City & countryside",
    "Volunteering & charity"
  ],
  B2: [
    "Global problems", "Science & innovations", "Fitness trends",
    "News & current affairs", "Cultural diversity", "Professional life",
    "Urban life", "Technology & privacy", "Space exploration",
    "The future of work"
  ]
};

// Turn text like "Family & friends" into "family_friends"
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function audioPath(level, topicName, type, index) {
  return `audio/${level}/${slugify(topicName)}/${type}_${index}.mp3`;
}

function imagePath(level, topicName, type, index) {
  return `images/${level}/${slugify(topicName)}/${type}_${index}.jpg`;
}

function makeTest({ level, topicName, type, index, questions, titlePrefix }) {
  const test = {
    level,
    topic: topicName,
    type,            // 'mini' | 'short' | 'full'
    index,           // 1..N within its type
    title: `${titlePrefix} ${index}`,
    audio: audioPath(level, topicName, type, index),
    image: imagePath(level, topicName, type, index),
    bigPrompt: "Listen and answer the questions.",
    fields: Array.from({ length: questions }, (_, j) => ({
      label: `Question ${j + 1}`,
      key: `q${j + 1}`,
      answers: [] // fill later if you want auto-checking
    }))
  };

  // Example: keep your original sample for A1 → Daily routines → Mini Test 1
  if (level === "A1" && topicName === "Daily routines" && type === "mini" && index === 1) {
    test.title = "Mini Test 1 - Daily Routines";
    test.bigPrompt = "Listen to the audio and complete the 5 blanks below.";
    test.audio = audioPath(level, topicName, type, index); // you can rename your file to match this path
    test.image = imagePath(level, topicName, type, index);
    test.fields = [
      { label: "Wake up time", key: "q1", answers: ["7 am", "seven"] },
      { label: "Breakfast food", key: "q2", answers: ["bread", "toast"] },
      { label: "Leaves home at", key: "q3", answers: ["8 am", "eight"] },
      { label: "Goes to school by", key: "q4", answers: ["bus", "by bus"] },
      { label: "First lesson", key: "q5", answers: ["english"] }
    ];
  }

  return test;
}

function generateTests(level, topicName) {
  const tests = [];
  if (level === "A1" || level === "A2") {
    for (let i = 1; i <= 10; i++) tests.push(makeTest({ level, topicName, type: "mini", index: i, questions: 5, titlePrefix: "Mini Test" }));
    for (let i = 1; i <= 10; i++) tests.push(makeTest({ level, topicName, type: "short", index: i, questions: 10, titlePrefix: "Short Test" }));
  } else { // B1/B2
    for (let i = 1; i <= 15; i++) tests.push(makeTest({ level, topicName, type: "short", index: i, questions: 10, titlePrefix: "Short Test" }));
    for (let i = 1; i <= 10; i++) tests.push(makeTest({ level, topicName, type: "full", index: i, questions: 20, titlePrefix: "Full Test" }));
  }
  return tests;
}

// Build DATA programmatically
const DATA = Object.entries(TOPICS).map(([level, topicNames]) => ({
  level,
  topics: topicNames.map(name => ({ name, tests: generateTests(level, name) }))
}));

// ==================================
// Page rendering
// ==================================
const app = document.getElementById("app");

function breadcrumb(html) {
  const div = document.createElement("div");
  div.className = "breadcrumb";
  div.innerHTML = html;
  app.appendChild(div);
}

// Show levels
function showLevels() {
  app.innerHTML = "<h2>Select your level</h2>";
  Object.values(DATA).forEach(lvl => {
    const btn = document.createElement("button");
    btn.textContent = lvl.level;
    btn.onclick = () => showTopics(lvl);
    app.appendChild(btn);
  });
}

// Show topics
function showTopics(levelObj) {
  app.innerHTML = `<h2>${levelObj.level} Topics</h2>`;
  breadcrumb(`<span>${levelObj.level}</span>`);
  levelObj.topics.forEach(topic => {
    const btn = document.createElement("button");
    btn.textContent = topic.name;
    btn.onclick = () => showTests(topic, levelObj.level);
    app.appendChild(btn);
  });
  backButton(showLevels);
}

// Show tests (grouped by type)
function showTests(topic, levelName) {
  app.innerHTML = `<h2>${levelName} · ${topic.name}</h2>`;
  breadcrumb(`<span>${levelName}</span> › <span>${topic.name}</span>`);

  const groups = [
    { label: "Mini Tests", type: "mini" },
    { label: "Short Tests", type: "short" },
    { label: "Full Tests", type: "full" }
  ];

  groups.forEach(group => {
    const list = topic.tests.filter(t => t.type === group.type);
    if (!list.length) return;

    const section = document.createElement("section");
    section.className = "group";
    section.innerHTML = `<h3>${group.label}</h3>`;

    const grid = document.createElement("div");
    grid.className = "grid";

    list.forEach(test => {
      const btn = document.createElement("button");
      btn.className = "test-card";
      btn.textContent = test.title;
      btn.onclick = () => showQuiz(test, topic, levelName);
      grid.appendChild(btn);
    });

    section.appendChild(grid);
    app.appendChild(section);
  });

  backButton(() => showTopics(DATA.find(l => l.level === levelName)));
}

// Show quiz
function showQuiz(test, topic, levelName) {
  app.innerHTML = `
    <div class="quiz">
      <h2>${test.title}</h2>
      <div class="breadcrumb">${levelName} › ${topic.name} › ${test.title}</div>
      <p>${test.bigPrompt}</p>
      <audio controls src="${test.audio}"></audio>
      ${test.image ? `<img src="${test.image}" alt="quiz image">` : ""}
      <form id="quizForm">
        ${test.fields.map((f,i)=>`
          <label>${i+1}. ${f.label}</label>
          <input type="text" name="${f.key}">
        `).join("")}
        <button type="submit">Check Answers</button>
      </form>
      <div id="result"></div>
    </div>
  `;

  const form = document.getElementById("quizForm");
  form.onsubmit = (e) => {
    e.preventDefault();
    let score = 0;
    test.fields.forEach(f => {
      const userAns = (form[f.key].value || "").trim().toLowerCase();
      const accepted = (f.answers || []).map
