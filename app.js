<!DOCTYPE html>
<html>
<head>
  <title>Test App</title>
  <style>
    button { display:block; margin:6px; padding:8px 12px; }
  </style>
</head>
<body>
  <div id="app"></div>

  <script>
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
    app.innerHTML = ""; // clear

    let title = document.createElement("h1");
    title.textContent = `${levelName} – ${topic.name}`;
    app.appendChild(title);

    // Group tests dynamically
    const groups = {};
    topic.tests.forEach(t => {
      if (!groups[t.type]) groups[t.type] = [];
      groups[t.type].push(t);
    });

    // Render each group
    Object.keys(groups).forEach(type => {
      let sectionTitle = document.createElement("h2");
      if (type === "mini") sectionTitle.textContent = "Mini Tests";
      if (type === "short") sectionTitle.textContent = "Short Tests";
      if (type === "full") sectionTitle.textContent = "Full Tests";
      app.appendChild(sectionTitle);

      groups[type].forEach(test => {
        let btn = document.createElement("button");
        btn.textContent = test.title;
        btn.onclick = () => showTestPage(levelName, topic.name, test);
        app.appendChild(btn);
      });
    });

    // Back button
    let back = document.createElement("button");
    back.textContent = "⬅ Back";
    back.onclick = () => {
      let level = DATA.find(l => l.level === levelName);
      showTopics(level);
    };
    app.appendChild(back);
  }

  function showTestPage(levelName, topicName, test) {
    app.innerHTML = ""; // clear

    let title = document.createElement("h1");
    title.textContent = test.title;
    app.appendChild(title);

    if (test.audio) {
      let audio = document.createElement("audio");
      audio.controls = true;
      audio.src = test.audio;
      app.appendChild(audio);
    }

    if (test.image) {
      let img = document.createElement("img");
      img.src = test.image;
      img.style.maxWidth = "300px";
      img.style.display = "block";
      img.style.margin = "1em auto";
      app.appendChild(img);
    }

    let prompt = document.createElement("p");
    prompt.textContent = test.bigPrompt;
    app.appendChild(prompt);

    test.fields.forEach(f => {
      let label = document.createElement("label");
      label.textContent = f.label + ": ";
      let input = document.createElement("input");
      input.type = "text";
      label.appendChild(input);
      app.appendChild(label);
      app.appendChild(document.createElement("br"));
    });

    // Back button (fix: re-fetch topic fresh from DATA)
    let back = document.createElement("button");
    back.textContent = "⬅ Back";
    back.onclick = () => {
      let level = DATA.find(l => l.level === levelName);
      let realTopic = level.topics.find(t => t.name === topicName);
      showTests(levelName, realTopic);
    };
    app.appendChild(back);
  }

  // ===== START APP =====
  showLevels();
  </script>
</body>
</html>
