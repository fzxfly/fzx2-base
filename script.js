const patterns = [
  {
    name: "莲花纹",
    type: "植物纹样",
    period: "唐代",
    place: "敦煌",
    cls: "pattern-lotus",
    text: "以盛开的莲花为中心，花瓣层层舒展，常与卷草、火焰和宝珠组合，象征纯净、吉祥与精神升华。"
  },
  {
    name: "忍冬纹",
    type: "植物纹样",
    period: "北朝至唐",
    place: "龟兹",
    cls: "pattern-vine",
    text: "曲线连续伸展，枝蔓相互缠绕，体现生命延续与流动之美，是石窟边饰与织物纹样中的经典母题。"
  },
  {
    name: "宝相花纹",
    type: "植物纹样",
    period: "盛唐",
    place: "长安",
    cls: "pattern-baoxiang",
    text: "融合莲花、牡丹与想象花形，结构饱满华丽，常见于金银器、织锦和佛教装饰中。"
  },
  {
    name: "联珠团花纹",
    type: "几何纹样",
    period: "隋唐",
    place: "中亚至长安",
    cls: "pattern-geo",
    text: "以连续圆珠组织边框，内部配置动物、花叶或人物，呈现中亚织物影响下的秩序感。"
  },
  {
    name: "飞天纹",
    type: "人物纹样",
    period: "唐代",
    place: "敦煌",
    cls: "pattern-arch",
    text: "飞天形象衣带飘举，姿态轻盈，结合云气和花雨，体现音乐、舞蹈与宗教想象的融合。"
  },
  {
    name: "骆驼纹",
    type: "动物纹样",
    period: "汉唐",
    place: "河西走廊",
    cls: "pattern-camel",
    text: "骆驼是商队与远行的象征，常与胡人、货包和沙漠场景共同出现，记录贸易路线的真实生活。"
  },
  {
    name: "塔门纹",
    type: "建筑纹样",
    period: "唐宋",
    place: "敦煌",
    cls: "pattern-arch",
    text: "取自楼阁、塔刹、门洞与斗拱形制，用对称结构表达佛国空间与城市建筑意象。"
  },
  {
    name: "菱格花纹",
    type: "几何纹样",
    period: "唐代",
    place: "吐鲁番",
    cls: "pattern-geo",
    text: "菱形骨架适合连续铺排，内部嵌入花叶或宝珠，常用于织物、壁画边饰和器物表面。"
  }
];

const courses = [
  {
    title: "丝路纹样的历史演变",
    tab: "推荐",
    art: "pattern-lotus",
    text: "了解丝绸之路纹样的起源、传播与再创造。"
  },
  {
    title: "几何纹样设计方法",
    tab: "设计技巧",
    art: "pattern-geo",
    text: "从骨架、对称、重复和节奏入手，完成可复用纹样。"
  },
  {
    title: "如何提取纹样元素",
    tab: "基础知识",
    art: "pattern-vine",
    text: "学习从壁画、器物与织锦中提炼核心图形语言。"
  },
  {
    title: "敦煌色彩与现代应用",
    tab: "文化解读",
    art: "route-art",
    text: "把石绿、赭石、泥金与暖纸色转化为现代界面配色。"
  }
];

const patternGrid = document.querySelector("#patternGrid");
const searchInput = document.querySelector("#patternSearch");
const categories = document.querySelectorAll(".category");
const dialog = document.querySelector("#patternDialog");
const dialogArt = document.querySelector("#dialogArt");
const dialogTitle = document.querySelector("#dialogTitle");
const dialogMeta = document.querySelector("#dialogMeta");
const dialogText = document.querySelector("#dialogText");
const courseList = document.querySelector("#courseList");
const tabs = document.querySelectorAll(".tab");
const favoriteCount = document.querySelector("#favoriteCount");
const myFavorites = document.querySelector("#myFavorites");
const recentFavorites = document.querySelector("#recentFavorites");
const FAVORITES_KEY = "silkroad_favorites";
let activeFilter = "全部";
let activeTab = "推荐";
let currentPattern = null;

function getFavorites() {
  try {
    const value = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function saveFavorites(items) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(items));
}

function isFavorite(name) {
  return getFavorites().some((item) => item.name === name);
}

function toggleFavorite(pattern) {
  const favorites = getFavorites();
  const exists = favorites.some((item) => item.name === pattern.name);
  const next = exists
    ? favorites.filter((item) => item.name !== pattern.name)
    : [{ ...pattern, savedAt: Date.now() }, ...favorites];

  saveFavorites(next);
  return !exists;
}

globalThis.getFavorites = getFavorites;
globalThis.toggleFavorite = toggleFavorite;

function renderPatterns() {
  if (!patternGrid || !searchInput) return;
  const keyword = searchInput.value.trim();
  const result = patterns.filter((item) => {
    const matchesFilter = activeFilter === "全部" || item.type === activeFilter;
    const haystack = `${item.name}${item.type}${item.period}${item.place}${item.text}`;
    return matchesFilter && haystack.includes(keyword);
  });

  patternGrid.innerHTML = result
    .map(
      (item) => `
        <button class="pattern-card reveal visible ${isFavorite(item.name) ? "saved" : ""}" data-index="${patterns.indexOf(item)}">
          <div class="thumb ${item.cls}"></div>
          ${isFavorite(item.name) ? '<span class="favorite-badge">已收藏</span>' : ""}
          <h3>${item.name}</h3>
          <p class="meta">${item.type} · ${item.period}</p>
          <p>${item.place}</p>
        </button>
      `
    )
    .join("");

  if (!result.length) {
    patternGrid.innerHTML = '<p class="empty-state">没有找到对应纹样，可以换一个关键词试试。</p>';
  }
}

function openPattern(index) {
  if (!dialog || !dialogArt || !dialogTitle || !dialogMeta || !dialogText) return;
  const item = patterns[index];
  currentPattern = item;
  dialogArt.className = `dialog-art ${item.cls}`;
  dialogTitle.textContent = item.name;
  dialogMeta.textContent = `${item.type} · ${item.period} · ${item.place}`;
  dialogText.textContent = item.text;
  dialog.querySelectorAll(".favorite-toggle").forEach((button) => {
    const saved = isFavorite(item.name);
    button.classList.toggle("saved", saved);
    button.textContent = saved ? "已收藏" : "加入收藏";
  });
  dialog.showModal();
}

function renderCourses() {
  if (!courseList) return;
  const result = courses.filter((item) => activeTab === "推荐" || item.tab === activeTab);
  courseList.innerHTML = result
    .map(
      (item) => `
        <article class="course-card reveal visible">
          <div class="course-art ${item.art}" aria-hidden="true"></div>
          <h3>${item.title}</h3>
          <p>${item.text}</p>
        </article>
      `
    )
    .join("");
}

function renderFavorites() {
  const favorites = getFavorites();

  if (favoriteCount) {
    favoriteCount.textContent = favorites.length;
  }

  if (myFavorites) {
    myFavorites.innerHTML = favorites.length
      ? favorites
          .map(
            (item) => `
              <article class="pattern-card saved">
                <div class="thumb ${item.cls}"></div>
                <span class="favorite-badge">已收藏</span>
                <h3>${item.name}</h3>
                <p class="meta">${item.type} · ${item.period}</p>
                <p>${item.place}</p>
              </article>
            `
          )
          .join("")
      : '<p class="empty-state">还没有收藏纹样。去纹样库打开任意纹样详情，点击“加入收藏”即可收录到这里。</p>';
  }

  if (recentFavorites) {
    recentFavorites.innerHTML = favorites.length
      ? favorites
          .slice(0, 4)
          .map(
            (item) => `
              <button class="mini-favorite ${item.cls}" aria-label="${item.name}">
                <span>${item.name}</span>
              </button>
            `
          )
          .join("")
      : '<p class="empty-state">暂无最近收藏。</p>';
  }
}

document.addEventListener("click", (event) => {
  const scrollButton = event.target.closest("[data-scroll-target]");
  if (scrollButton) {
    const target = document.querySelector(scrollButton.dataset.scrollTarget);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  }

  const card = event.target.closest(".pattern-card");
  if (card) {
    openPattern(Number(card.dataset.index));
  }

  if (event.target.closest(".dialog-close")) {
    dialog?.close();
  }

  const favorite = event.target.closest(".favorite-toggle");
  if (favorite) {
    if (currentPattern) {
      const saved = toggleFavorite(currentPattern);
      document.querySelectorAll(".favorite-toggle").forEach((button) => {
        button.classList.toggle("saved", saved);
        button.textContent = saved ? "已收藏" : "加入收藏";
      });
      renderPatterns();
      renderFavorites();
    }
  }
});

categories.forEach((button) => {
  button.addEventListener("click", () => {
    categories.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    activeFilter = button.dataset.filter;
    renderPatterns();
  });
});

tabs.forEach((button) => {
  button.addEventListener("click", () => {
    tabs.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    activeTab = button.dataset.tab;
    renderCourses();
  });
});

if (searchInput) {
  searchInput.addEventListener("input", renderPatterns);
}

document.querySelectorAll(".map-pin").forEach((pin) => {
  pin.addEventListener("click", () => {
    document.querySelectorAll(".map-pin").forEach((item) => item.classList.remove("active"));
    pin.classList.add("active");
    document.querySelector("#mapInfo").innerHTML = `
      <p class="city-label">${pin.dataset.sub}</p>
      <h3>${pin.dataset.city}</h3>
      <p>${pin.dataset.text}</p>
      <a class="primary-btn nav-button small" href="./patterns.html">查看相关纹样</a>
    `;
  });
});

const sections = [...document.querySelectorAll("main section[id], #top")];
const mobileLinks = document.querySelectorAll(".mobile-nav a");
const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id || "top";
      mobileLinks.forEach((link) => {
        const href = link.getAttribute("href");
        if (href && href.startsWith("#")) {
          link.classList.toggle("active", href === `#${id}`);
        }
      });
    });
  },
  { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
);

sections.forEach((section) => navObserver.observe(section));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

renderPatterns();
renderCourses();
renderFavorites();
