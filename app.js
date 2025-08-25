// ==========================
//  Listening Website Skeleton
// ==========================

// Data structure: levels -> topics -> tests
const DATA = [
  {
    level: "A1",
    topics: [
      { name: "Daily routines", tests: [ {
  title: "Mini Test 1 - Daily Routines",
  audio: "audio/a1_daily_1.mp3",   // your audio file path
  image: "images/sample.jpg",       // optional clue image
  bigPrompt: "Listen to the audio and complete the 5 blanks below.",
  fields: [
    { label: "Wake up time", key: "q1", answers: ["7 am","seven"] },
    { label: "Breakfast food", key: "q2", answers: ["bread","toast"] },
    { label: "Leaves home at", key: "q3", answers: ["8 am","eight"] },
    { label: "Goes to school by", key: "q4", answers: ["bus","by bus"] },
    { label: "First lesson", key: "q5", answers: ["english"] }
  ]
}
 ] },
      { name: "Family & friends", tests: [ { title: "Talking about family", audio: "audio/a1_family.mp3", image: "", bigPrompt: "Listen and fill in the blanks.", fields: [] } ] },
      { name: "Food & drinks", tests: [] },
      { name: "Numbers & time", tests: [] },
      { name: "School & classroom", tests: [] },
      { name: "Weather & seasons", tests: [] },
      { name: "Hobbies & free time", tests: [] },
      { name: "Shopping & prices", tests: [] },
      { name: "Travel basics", tests: [] },
      { name: "At the park", tests: [] }
    ]
  },
  {
    level: "A2",
    topics: [
      { name: "Holidays & festivals", tests: [] },
      { name: "Health & body", tests: [] },
      { name: "Sports & activities", tests: [] },
      { name: "House & home", tests: [] },
      { name: "Work & jobs", tests: [] },
      { name: "Directions & town", tests: [] },
      { name: "Animals & nature", tests: [] },
      { name: "Weekend plans", tests: [] },
      { name: "Clothes & fashion", tests: [] },
      { name: "Restaurant & ordering", tests: [] }
    ]
  },
  {
    level: "B1",
    topics: [
      { name: "Technology in daily life", tests: [] },
      { name: "Music & culture", tests: [] },
      { name: "Education & studying abroad", tests: [] },
      { name: "Travel experiences", tests: [] },
      { name: "Environmental issues", tests: [] },
      { name: "Social media & communication", tests: [] },
      { name: "Art & entertainment", tests: [] },
      { name: "Future plans & ambitions", tests: [] },
      { name: "City vs countryside", tests: [] },
      { name: "Volunteering & charity", tests: [] }
    ]
  },
  {
    level: "B2",
    topics: [
      { name: "Global problems", tests: [] },
      { name: "Science & innovation", tests: [] },
      { name: "Health & fitness trends", tests: [] },
      { name: "News & current affairs", tests: [] },
      { name: "Cultural diversity", tests: [] },
      { name: "Careers & professional life", tests: [] },
      { name: "Transport & urban life", tests: [] },
      { name: "Technology & privacy", tests: [] },
      { name: "Space exploration", tests: [] },
      { name: "The future of work", tests: [] }
    ]
  }
];

// ==================================
// Page rendering
// ==================================
const app = document.getElementById("app");

// Show levels
function showLevels() {
  app.innerHTML = "<h2>Select your level</h2>";
  DATA.forEach(lvl => {
    let btn = document.createElement("button");
    btn.textContent = lvl.level;
    btn.onclick = () => showTopics(lvl);
    app.appendChild(btn);
  });
}

// Show topics
function showTopics(levelObj) {
  app.innerHTML = `<h2>${levelObj.level} Topics</h2>`;
  levelObj.topics.forEach(topic => {
    let btn = document.createElement("button");
    btn.textContent = topic.name;
    btn.onclick = () => showTests(topic, levelObj.level);
    app.appendChild(btn);
  });
  backButton(showLevels);
}

// Show tests
function showTests(topic, levelName) {
  app.innerHTML = `<h2>${levelName} · ${topic.name}</h2>`;
  topic.tests.forEach(test => {
    let btn = document.createElement("button");
    btn.textContent = test.title;
    btn.onclick = () => showQuiz(test);
    app.appendChild(btn);
  });
  backButton(() => showTopics(DATA.find(l => l.level === levelName)));
}

// Show quiz
function showQuiz(test) {
  app.innerHTML = `
    <div class="quiz">
      <h2>${test.title}</h2>
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
      let userAns = form[f.key].value.trim().toLowerCase();
      if (f.answers.map(a=>a.toLowerCase()).includes(userAns)) score++;
    });
    document.getElementById("result").innerHTML =
      `You got <b>${score}/${test.fields.length}</b> correct!`;
  };
  backButton(() => showTests(
    DATA.find(l => l.level === test.level)
      .topics.find(t => t.tests.includes(test)),
    test.level
  ));
}

// Back button helper
function backButton(fn) {
  let btn = document.createElement("button");
  btn.textContent = "⬅ Back";
  btn.onclick = fn;
  app.appendChild(btn);
}

// Start
showLevels();

