const app = document.getElementById('app');

// State
let currentState = {
    view: 'home', // home, list, detail
    filterTheme: null,
    filterRegion: null
};

// Router (Simple)
function route(view, params = {}) {
    currentState.view = view;
    window.scrollTo(0, 0);

    if (view === 'home') renderHome();
    else if (view === 'list') renderList(params);
    else if (view === 'detail') renderDetail(params.id);
}

// 1. Home View
function renderHome() {
    app.innerHTML = `
        <section class="hero">
            <h2>이번 여름, 당신에게 필요한 계곡은?</h2>
            <p>70개의 엄선된 계곡 데이터로 찾는 완벽한 피서지</p>
        </section>

        <section class="container">
            <h3 style="text-align:center; margin-bottom:20px;">테마별 추천</h3>
            <div class="theme-grid">
                <div class="theme-card" onclick="route('list', {theme: '아이와 함께'})">
                    <span class="theme-icon">👶</span>
                    <h3>아이와 함께</h3>
                    <p>안전하고 얕은 수심</p>
                </div>
                <div class="theme-card" onclick="route('list', {theme: '다이빙 명소'})">
                    <span class="theme-icon">🏊‍♂️</span>
                    <h3>다이빙 명소</h3>
                    <p>짜릿한 깊은 물</p>
                </div>
                <div class="theme-card" onclick="route('list', {theme: '조용한 힐링'})">
                    <span class="theme-icon">🧘</span>
                    <h3>조용한 힐링</h3>
                    <p>사람 없는 시크릿 스팟</p>
                </div>
                <div class="theme-card" onclick="route('list', {theme: '캠핑/차박'})">
                    <span class="theme-icon">⛺</span>
                    <h3>캠핑/차박</h3>
                    <p>자연 속 하룻밤</p>
                </div>
            </div>
        </section>

        <!-- Home Ad -->
        <div class="ad-container">
             <p class="ad-label">Sponsored</p>
             <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-format="fluid"
                 data-ad-layout-key="-fb+5w+4e-db+86"
                 data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                 data-ad-slot="9876543210"></ins>
             <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </div>
    `;
}

// 2. List View
function renderList(params) {
    let filtered = valleys;

    // Apply filters
    if (params.theme) {
        filtered = filtered.filter(v => v.theme === params.theme);
        currentState.filterTheme = params.theme;
    }

    const title = params.theme ? `#${params.theme} 계곡` : '전체 계곡 리스트';

    app.innerHTML = `
        <div class="btn-back" onclick="route('home')">← 홈으로 돌아가기</div>
        <h2 style="margin-bottom: 20px;">${title} <span style="font-size:1rem; color:#888;">(${filtered.length}곳)</span></h2>

        <div class="filters">
            <button class="filter-btn ${!currentState.filterTheme ? 'active' : ''}" onclick="route('list', {})">전체</button>
            <button class="filter-btn ${currentState.filterTheme === '아이와 함께' ? 'active' : ''}" onclick="route('list', {theme: '아이와 함께'})">아이와 함께</button>
            <button class="filter-btn ${currentState.filterTheme === '다이빙 명소' ? 'active' : ''}" onclick="route('list', {theme: '다이빙 명소'})">다이빙 명소</button>
            <button class="filter-btn ${currentState.filterTheme === '캠핑/차박' ? 'active' : ''}" onclick="route('list', {theme: '캠핑/차박'})">캠핑/차박</button>
        </div>

        <div class="valley-grid">
            ${filtered.map(v => `
                <div class="valley-card" onclick="route('detail', {id: ${v.id}})">
                    <div class="card-img-placeholder">
                        <span class="material-icons" style="font-size:48px;">landscape</span>
                    </div>
                    <div class="card-body">
                        <div class="card-tags">
                            <span class="tag">${v.city}</span>
                            <span class="tag" style="background:#e8f5e9; color:#2e7d32;">${v.depth}</span>
                        </div>
                        <h3>${v.name}</h3>
                        <p style="color:#666; font-size:0.9rem; margin-top:5px;">⭐ ${v.rating} (${v.review_count}명)</p>
                    </div>
                </div>
            `).join('')}
        </div>

        <!-- List Ad -->
        <div class="ad-container">
             <p class="ad-label">Sponsored</p>
             <div style="color:#aaa;">인피드 광고 영역</div>
        </div>
    `;
}

// 3. Detail View
function renderDetail(id) {
    const valley = valleys.find(v => v.id === id);
    if (!valley) return route('list');

    // Visual Depth Logic (Height percentage based on level 1-5)
    // 1: 20%, 2: 40%, 3: 60%, 4: 80%, 5: 100% (Head)
    const waterHeight = valley.depth_level * 18 + 10;

    // Mock Essay Generator based on theme
    const essayContent = getEssayContent(valley);

    app.innerHTML = `
        <div class="btn-back" onclick="route('list', {theme: currentState.filterTheme})">← 목록으로</div>

        <div class="detail-header">
            <h1 class="detail-title">${valley.name}</h1>
            <div class="detail-meta">
                <span>📍 ${valley.city}</span>
                <span>⭐ ${valley.rating}</span>
                <span>💧 ${valley.depth}</span>
            </div>
        </div>

        <!-- Visual Depth Meter Component -->
        <div class="depth-visual-container">
            <h3 class="depth-title">수심 정보 시각화</h3>
            <div class="depth-meter">
                <div class="human-silhouette"></div>
                <div class="water-level" style="height: ${waterHeight}px;"></div>
                <div style="position: absolute; bottom: ${waterHeight}px; left: 50%; transform: translate(-50%, -120%); font-weight:bold; color:#0288d1; background:rgba(255,255,255,0.8); padding:2px 8px; border-radius:4px;">
                    ${valley.depth}
                </div>
            </div>
            <p style="margin-top:15px; color:#666;">※ 강수량에 따라 수심은 변동될 수 있습니다.</p>
        </div>

        <!-- Ad Block -->
        <div class="ad-container">
            <p class="ad-label">관련 상품 추천</p>
            <p style="color:#555;">${valley.theme === '다이빙 명소' ? '구명조끼/스노클링 장비 최저가 보기' : '감성 캠핑의자 특가전'}</p>
        </div>

        <!-- Essay Section -->
        <section class="essay-section">
            <div class="essay-quote">"자연이 주는 가장 솔직한 위로"</div>
            <div class="essay-content">
                ${essayContent}
            </div>
        </section>

        <!-- Info Table -->
        <table class="info-table">
            <tr><th>주소</th><td>${valley.address}</td></tr>
            <tr><th>운영시간</th><td>${valley.hours}</td></tr>
            <tr><th>휴무일</th><td>${valley.closed}</td></tr>
            <tr><th>주차</th><td>${valley.parking}</td></tr>
            <tr><th>문의</th><td>${valley.phone}</td></tr>
            <tr><th>주변 명소</th><td>${valley.attractions}</td></tr>
        </table>
    `;
}

function getEssayContent(valley) {
    const intro = `${valley.name}의 물소리는 다른 곳보다 유난히 맑게 들립니다. 도시의 소음이 닿지 않는 깊은 산골, ${valley.city}의 품에 안겨 흐르는 이 계곡은 그저 바라보는 것만으로도 마음의 짐을 덜어줍니다.<br><br>`;

    let mid = "";
    if (valley.theme === "조용한 힐링") {
        mid = "나무 그늘 아래 앉아 발을 담그면, 차가운 계곡물이 온몸의 감각을 깨웁니다. 복잡한 생각은 물살에 흘려보내고, 오롯이 나 자신에게 집중할 수 있는 시간이 이곳에 있습니다.<br><br>";
    } else if (valley.theme === "다이빙 명소") {
        mid = "깊고 푸른 물은 모험심을 자극합니다. 투명하게 비치는 물속 세상을 들여다보면 마치 시간이 멈춘 듯한 신비로움을 느낄 수 있습니다. 친구들과 함께 웃고 떠들며 여름날의 잊지 못할 추억을 새겨보세요.<br><br>";
    } else {
        mid = "가족이 함께 웃을 수 있는 공간, 아이들의 웃음소리가 계곡 물소리와 화음을 이룹니다. 얕은 물가에서 돌멩이를 줍고 물장구를 치는 소박한 행복이 이곳에 가득합니다.<br><br>";
    }

    const end = `이번 주말, ${valley.name}에서 진정한 쉼표를 찍어보는 건 어떨까요? 자연은 언제나 그 자리에서 우리를 기다리고 있습니다.`;

    return intro + mid + end;
}

// Init
route('home');
