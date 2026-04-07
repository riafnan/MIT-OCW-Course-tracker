const QUOTES = [
  "Every hour you invest in learning now compounds into millions later.",
  "At 19, you're building the foundation that most people spend their 30s searching for.",
  "The gap between where you are and where you want to be is closed by the work you do when nobody's watching.",
  "Rich people don't work harder, they work smarter. Knowledge is your unfair advantage.",
  "You're not just studying. You're building the mental models that will run your future empire.",
  "While others scroll, you study. That's why you'll win.",
  "The MIT brain you're building today is the asset that prints money tomorrow.",
  "Success at 19 isn't about luck. It's about showing up when everyone else is sleeping.",
  "Every concept you master now is a tool you'll use to build wealth later.",
  "The discipline you build here will be the same discipline that closes million-dollar deals.",
  "You're 19. You have time on your side. Don't waste it.",
  "The person who studies while others party is the person who buys the building they party in.",
  "Compound interest applies to knowledge too. Start early, win big.",
  "Your future self is begging you to lock in right now.",
  "Greatness isn't born. It's built, one lecture at a time.",
  "The difference between a dream and a plan is called execution. You're executing.",
  "At 19, every hour of study is worth 10x what it'll be worth at 30.",
  "You're not behind. You're building. Keep going.",
  "The richest people in the room are always the ones who never stopped learning.",
  "MIT didn't become MIT by accident. You won't become great by accident either.",
  "Consistency beats talent. Talent beats nothing. You're building consistency.",
  "The late nights studying now buy the early mornings of freedom later.",
  "Don't compare your chapter 1 to someone else's chapter 20. Just keep writing.",
  "You're investing in the only asset that can never be taken from you: your mind.",
  "The 19-year-old who studies today becomes the 25-year-old who doesn't have to ask for permission.",
  "Success is rented, not owned. And the rent is due every single day.",
  "Every page you read is a page closer to the life you want.",
  "The world rewards those who can do what others won't. Keep showing up.",
  "Your competition isn't other students. It's the version of you from yesterday.",
  "Knowledge is the one investment with guaranteed returns.",
  "The grind you put in at 19 sets the trajectory for the rest of your life.",
  "Billionaires read 60+ books a year. You're already ahead just by being here.",
  "The smartest investment you can make at 19 is in your own education.",
  "Freedom costs knowledge. You're paying the price now so you can afford it later.",
  "The person who controls their education controls their income.",
  "You're not studying to pass a test. You're studying to build a life.",
  "The habits you form now will either make you rich or keep you average. Choose.",
  "Every expert was once a beginner who refused to quit. You're still here. That counts.",
  "The 4 years you spend building your mind will pay dividends for the next 40.",
  "Rich is not a number. Rich is a mindset. You're building it right now.",
  "While they're watching Netflix, you're watching lectures. The results will show.",
  "The most dangerous person in the room is the one who never stops learning.",
  "You don't need motivation. You need discipline. But today, take the motivation too.",
  "The life you want costs the effort you're avoiding. Put in the work.",
  "At 19, your greatest superpower is that nobody expects you to be great yet. Surprise them.",
  "The gap between average and exceptional is just one more hour of focus.",
  "You're building a brain that solves expensive problems. That's how wealth is created.",
  "The best time to start was yesterday. The second best time is right now. You're here. Good.",
  "Success leaves clues. Study the greats, become one.",
  "The tuition you pay in effort now is cheaper than the regret you'd pay later.",
  "Every lecture is a brick in the foundation of your future empire.",
  "You're not wasting time if you're learning. Everything else is negotiable.",
  "The 19-year-old who takes education seriously becomes the person everyone wants to hire, fund, or follow.",
  "Don't wait for the perfect moment. This moment, right here, is the one that matters.",
  "The mind is like a muscle. You're in the gym right now. Keep lifting.",
  "Your future net worth is directly tied to your current self-investment.",
  "The people who change the world don't wait for inspiration. They show up and do the work.",
  "You're 19. You're hungry. You're learning. That's a dangerous combination in the best way.",
  "The cost of education is measured in hours. The cost of ignorance is measured in lifetimes.",
  "Every time you choose to study over distraction, you're choosing your future over your comfort.",
  "The student who tracks their progress is the student who finishes. You're tracking. You'll finish.",
  "Greatness is a habit, not an event. This is one of those habits.",
  "The world doesn't pay you for what you know. It pays you for what you do with what you know. Keep learning.",
  "You're building the operating system for your future success. Install the right programs.",
  "The 10,000 hour rule starts with hour one. You're already counting.",
  "Don't study to be seen studying. Study to be the person who doesn't need to be seen.",
  "The difference between who you are and who you want to be is what you do today.",
  "You're not just learning calculus or physics. You're learning how to think. That's priceless.",
  "The richest minds are the ones that never graduated from learning.",
  "At 19, you have the energy of youth and the wisdom to use it. That's rare. Protect it.",
  "Every page you visit on OCW is a page away from mediocrity.",
  "The person who invests in themselves has the highest ROI. Period.",
  "You're not behind schedule. You're on your own timeline. And your timeline is aggressive.",
  "The discipline to sit and learn when you could be doing anything else is the discipline that builds empires.",
  "Success is the sum of small efforts repeated day in and day out. This is one of those efforts.",
  "The brain you're building today will negotiate your salary, pitch your ideas, and close your deals tomorrow.",
  "You're 19. You're building the version of yourself that your 30-year-old self will thank you for.",
  "The most profitable skill in the world is the ability to learn quickly. You're practicing it right now.",
  "Don't just consume knowledge. Apply it. That's where the money is.",
  "The student who returns to their notes is the student who remembers. The student who remembers is the one who wins.",
  "Your education is the one thing nobody can tax, steal, or take away. Keep filling it up.",
  "The 19-year-old who takes learning seriously becomes the 25-year-old who writes their own rules.",
  "You're not studying because you have to. You're studying because you want to win. That's the difference.",
  "The path to financial freedom starts with intellectual freedom. You're on it.",
  "Every concept you understand deeply is a concept that can make you money later.",
  "The world is full of people who started but didn't finish. Be the one who finishes.",
  "At 19, you're playing a long game. Every study session is a move on the board.",
  "The person who can teach what they've learned is the person who gets paid the most. Learn, then teach.",
  "You're building a track record of showing up. That track record becomes your reputation. Your reputation becomes your net worth.",
  "The difference between a hobby and a career is consistency. You're being consistent.",
  "The mind that can focus on a hard problem for 2 hours is the mind that can run a company.",
  "You're not just passing a course. You're proving to yourself that you can do hard things.",
  "The 19-year-old who invests in knowledge becomes the person who doesn't have to invest in excuses.",
  "Wealth is a byproduct of value. Value is a byproduct of knowledge. Knowledge is a byproduct of study. Study.",
  "The life you want is on the other side of the work you're avoiding. Do the work.",
  "You're building the kind of mind that sees opportunities where others see obstacles.",
  "The student who tracks their learning is the student who takes it seriously. Take it seriously.",
  "Every hour spent learning is an hour invested in the only business that's guaranteed to succeed: you.",
  "At 19, your ambition is your greatest asset. Feed it with action, not just dreams.",
  "The person who shows up to learn every day is the person who eventually doesn't have to show up to work.",
  "You're not just building a resume. You're building a mind that can't be replaced.",
  "The gap between where you are and where you want to be is bridged by pages like these.",
  "Success isn't about being the smartest. It's about being the most relentless. Keep going.",
  "The 19-year-old who studies with purpose becomes the person who lives with freedom.",
  "The secret of getting ahead is getting started.",
  "Your time is limited, don't waste it living someone else's life.",
  "The only way to do great work is to love what you do.",
  "Stay hungry, stay foolish.",
  "The best way to predict the future is to invent it.",
  "Everything you've ever wanted is on the other side of fear.",
  "Success is walking from failure to failure with no loss of enthusiasm.",
  "Opportunities don't happen. You create them.",
  "Don't be afraid to give up the good to go for the great.",
  "I find that the harder I work, the more luck I seem to have.",
  "Success usually comes to those who are too busy to be looking for it.",
  "The way to get started is to quit talking and begin doing.",
  "There are no secrets to success. It is the result of preparation, hard work, and learning from failure.",
  "The only limit to our realization of tomorrow will be our doubts of today.",
  "It's not whether you get knocked down, it's whether you get up.",
  "If you are working on something that you really care about, you don't have to be pushed. The vision pulls you.",
  "People who are crazy enough to think they can change the world, are the ones who do.",
  "Failure will never overtake me if my determination to succeed is strong enough.",
  "We may encounter many defeats but we must not be defeated.",
  "Knowing is not enough; we must apply. Wishing is not enough; we must do.",
  "Imagine your life is perfect in every respect; what would it look like?",
  "We generate fears while we sit. We overcome them by action.",
  "Whether you think you can or think you can't, you're right.",
  "Security is mostly a superstition. Life is either a daring adventure or nothing.",
  "The man who has confidence in himself gains the confidence of others.",
  "The only thing standing between you and your goal is the story you keep telling yourself as to why you can't achieve it.",
  "Action is the foundational key to all success.",
  "The distance between insanity and genius is measured only by success.",
  "Don't stop when you're tired. Stop when you're done.",
  "Your talent determines what you can do. Your motivation determines how much you are willing to do. Your attitude determines how well you do it.",
  "Discipline is doing what needs to be done, even if you don't want to do it.",
  "Working hard for something we don't care about is called stress; working hard for something we love is called passion.",
  "The future depends on what you do today.",
  "Don't wait. The time will never be just right.",
  "It always seems impossible until it's done.",
  "Do what you can, with what you have, where you are.",
  "Hardships often prepare ordinary people for an extraordinary destiny.",
  "The only person you are destined to become is the person you decide to be.",
  "Go confidently in the direction of your dreams. Live the life you have imagined.",
  "Believe you can and you're halfway there.",
  "A journey of a thousand miles begins with a single step.",
  "Small deeds done are better than great deeds planned.",
  "The best revenge is massive success.",
  "The secret to success is to know something nobody else knows.",
  "Don't stay in bed, unless you can make money in bed.",
  "I'm a greater believer in luck, and I find the harder I work the more I have of it.",
  "I never dreamed about success, I worked for it.",
  "Success is not final; failure is not fatal: it is the courage to continue that counts.",
  "If you want to achieve greatness stop asking for permission.",
];

const HISTORY_KEY = "ocw_history";
const LAST_KEY = "ocw_last";

/**
 * Returns a random motivational quote from the pool.
 */
function getRandomQuote() {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

/**
 * Returns a human-readable relative time string.
 */
function formatTime(timestamp) {
  const d = new Date(timestamp);
  const now = new Date();
  const diffMs = now - d;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return d.toLocaleDateString();
}

/**
 * Heuristic to extract a meaningful course/page name from OCW URLs.
 * Example: 'ocw.mit.edu/courses/18-01-calculus/...' -> '18 01 CALCULUS'
 */
function extractCourseName(url) {
  const match = url.match(/ocw\.mit\.edu\/courses\/([^/]+)/);
  if (match) return match[1].replace(/-/g, " ").toUpperCase();
  try {
    return new URL(url).hostname + new URL(url).pathname.split("/").slice(0, 3).join("/");
  } catch {
    return url.substring(0, 50);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const quoteText = document.getElementById("quoteText");
  const quoteBox = document.getElementById("quoteBox");
  const resumeBtn = document.getElementById("resumeBtn");
  const btnText = document.getElementById("btnText");
  const historyList = document.getElementById("historyList");
  const emptyState = document.getElementById("emptyState");
  const clearBtn = document.getElementById("clearBtn");

  // Set a random quote
  const quote = getRandomQuote();
  quoteText.textContent = `"${quote}"`;

  // Clear history button logic
  clearBtn.addEventListener("click", () => {
    if (confirm("Clear your OCW study history?")) {
      chrome.storage.local.clear(() => {
        window.location.reload();
      });
    }
  });

  // Entrance animation for the quote box
  quoteBox.style.opacity = "0";
  quoteBox.style.transform = "translateY(8px)";
  requestAnimationFrame(() => {
    quoteBox.style.transition = "opacity 0.25s ease, transform 0.25s ease";
    quoteBox.style.opacity = "1";
    quoteBox.style.transform = "translateY(0)";
  });

  // Load data from storage and render the UI
  chrome.storage.local.get([LAST_KEY, HISTORY_KEY], (result) => {
    const last = result[LAST_KEY];
    const history = result[HISTORY_KEY] || [];

    // If no history exists, show the empty state
    if (!last || history.length === 0) {
      emptyState.style.display = "block";
      resumeBtn.style.display = "none";
      document.querySelector(".history-section").style.display = "none";
      return;
    }

    // Resume button: opens the last visited OCW page in a new tab
    resumeBtn.addEventListener("click", () => {
      chrome.tabs.create({ url: last.url });
    });

    btnText.textContent = "Resume: " + (last.title || extractCourseName(last.url));

    // Render the most recent 7 items with a staggered entrance animation
    const items = history.slice(0, 7);
    items.forEach((entry, i) => {
      const el = document.createElement("a");
      el.className = "history-item";
      el.href = "#";
      el.style.opacity = "0";
      el.style.transform = "translateX(-8px)";
      el.innerHTML = `
        <span class="history-url">${extractCourseName(entry.url)}</span>
        <span class="history-time">${formatTime(entry.timestamp)}</span>
      `;
      el.addEventListener("click", (e) => {
        e.preventDefault();
        chrome.tabs.create({ url: entry.url });
      });
      historyList.appendChild(el);

      // Staggered delay based on index for a premium "pop-in" feel
      requestAnimationFrame(() => {
        setTimeout(() => {
          el.style.transition = "opacity 0.2s ease, transform 0.2s ease";
          el.style.opacity = "1";
          el.style.transform = "translateX(0)";
        }, i * 60);
      });
    });
  });
});
