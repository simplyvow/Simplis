// ===== DATA GENERATOR =====
function generateTests(level) {
  let tests = [];
  if (level === "A1" || level === "A2") {
    for (let i=1; i<=10; i++) {
      tests.push({
        title: `Mini Test ${i}`,
        type: "mini",
        index: i,
        audio: "",
        image: "",
        bigPrompt: "Listen and answer the questions.",
        fields: Array.from({length:5}, (_,j)=>({
          label: `Question ${j+1}`,
          key: `q${j+1}`,
          answers: []
        }))
      });
    }
    for (let i=1; i<=10; i++) {
      tests.push({
        title: `Short Test ${i}`,
        type: "short",
        index: i,
        audio: "",
        image: "",
        bigPrompt: "Listen and answer the questions.",
        fields: Array.from({length:10}, (_,j)=>({
          label: `Question ${j+1}`,
          key: `q${j+1}`,
          answers: []
        }))
      });
    }
  } else if (level === "B1" || level === "B2") {
    for (let i=1; i<=15; i++) {
      tests.push({
        title: `Short Test ${i}`,
        type: "short",
        index: i,
        audio: "",
        image: "",
        bigPrompt: "Listen and answer the questions.",
        fields: Array.from({length:10}, (_,j)=>({
          label: `Question ${j+1}`,
          key: `q${j+1}`,
          answers: []
        }))
      });
    }
    for (let i=1; i<=10; i++) {
      tests.push({
        title: `Full Test ${i}`,
        type: "full",
        index: i,
        audio: "",
        image: "",
        bigPrompt: "Listen and answer the questions.",
        fields: Array.from({length:20}, (_,j)=>({
          label: `Question ${j+1}`,
          key: `q${j+1}`,
          answers: []
        }))
      });
    }
  }
  return tests;
}

// ===== TOPIC LISTS =====
const TOPICS = {
  A1: [
    "Daily routines", "Family & friends", "Food & drinks", "Numbers & time",
    "School", "Weather & seasons", "Hobbies & free time",
    "Shopping", "Travel", "At the park"
  ],
  A2: [
    "Holidays & festivals", "Health", "Sports",
    "Houses & homes", "Work & jobs", "Directions", "Nature",
    "Weekend plans", "Fashion", "Ordering"
  ],
  B1: [
    "Technology", "Culture", "Education",
    "Travel", "Environment", "Communication",
    "Entertainment", "Future plans", "City & countryside",
    "Volunteering & charity"
  ],
  B2: [
    "Global problems", "Science & innovation", "Fitness trends",
    "News & current affairs", "Cultural diversity", "Professional life",
    "Urban life", "Technology & privacy", "Space exploration",
    "The future of work"
  ]
};

// ===== MAIN DATA =====
const DATA = Object.keys(TOPICS).map(level => ({
  level,
  topics: TOPICS[level].map(name => ({
    name,
    tests: generateTests(level)
  }))
}));

// ===== PAGE RENDERING =====
const app = document.getElementById("app");

function showLevels() {
  app.innerHTML = "<h1>Select Level</h1>";
  DATA.forEach(level => {
    let btn = document.createElement("button");
    btn.textContent = level.level;
    btn.onclick = () => showTopics(level);
    app.appendChild(btn);
  });
}

function showTopics(level) {
  app.innerHTML = `<h1>${level.level} Topics</h1>`;
  level.topics.forEach(topic => {
    let btn = document.createElement("button");
    btn.textContent = topic.name;
    btn.onclick = () => showTests(level.level, topic);
    app.appendChild(btn);
  });
  let back = document.createElement("button");
  back.textContent = "⬅ Back";
  back.onclick = showLevels;
  app.appendChild(back);
}

function showTests(levelName, topic) {
  app.innerHTML = `<h1>${levelName} – ${topic.name}</h1>`;

  // Group tests
  const groups = { mini: [], short: [], full: [] };
  topic.tests.forEach(t => groups[t.type].push(t));

  if (groups.mini.length) {
    app.innerHTML += "<h2>Mini Tests</h2>";
    groups.mini.forEach(test => {
      let btn = document.createElement("button");
      btn.textContent = test.title;
      btn.onclick = () => showTestPage(levelName, topic, test);
      app.appendChild(btn);
    });
  }

  if (groups.short.length) {
    app.innerHTML += "<h2>Short Tests</h2>";
    groups.short.forEach(test => {
      let btn = document.createElement("button");
      btn.textContent = test.title;
      btn.onclick = () => showTestPage(levelName, topic, test);
      app.appendChild(btn);
    });
  }

  if (groups.full.length) {
    app.innerHTML += "<h2>Full Tests</h2>";
    groups.full.forEach(test => {
      let btn = document.createElement("button");
      btn.textContent = test.title;
      btn.onclick = () => showTestPage(levelName, topic, test);
      app.appendChild(btn);
    });
  }

  let back = document.createElement("button");
  back.textContent = "⬅ Back";
  back.onclick = () => showTopics(DATA.find(l=>l.level===levelName));
  app.appendChild(back);
}

function showTestPage(levelName, topic, test) {
  app.innerHTML = `<h1>${test.title}</h1>`;
  if (test.audio) {
    app.innerHTML += `<audio controls src="${test.audio}"></audio>`;
  }
  if (test.image) {
    app.innerHTML += `<img src="${test.image}" style="max-width:300px;display:block;margin:1em auto;">`;
  }
  app.innerHTML += `<p>${test.bigPrompt}</p>`;
  test.fields.forEach(f => {
    app.innerHTML += `<label>${f.label}: <input type="text"></label><br>`;
  });

  let back = document.createElement("button");
  back.textContent = "⬅ Back";
  back.onclick = () => showTests(levelName, topic);
  app.appendChild(back);
}

// ===== START APP =====
showLevels();
