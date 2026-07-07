document.addEventListener('DOMContentLoaded', function () {

    const startBtn = document.getElementById('startBtn');
    const repeatBtn = document.getElementById('repeatBtn');
    const authorBtn = document.getElementById('authorBtn');
    const textDisplay = document.getElementById('textDisplay');

    if (!startBtn || !repeatBtn || !textDisplay) return;



    // ===== ФОН =====
    const container = document.getElementById('backgroundContainer');

if (container) {
    const img = document.createElement('img');
    img.src = `/static/poems/${document.body.dataset.slug}/images/bg1.jpg`;
    img.className = 'background';
    container.appendChild(img);
}


    const leftLines = [
        "Мы все живём в эпоху мракобесия,",
        "Проветривать приходится мозги...",
        "Судить о людях только по профессии",
        "Способны лишь отпетые ханжи.",
        "",
        "Мы утром в магазин за свежей выпечкой",
        "Бежим не замечая чистых урн,",
        "Пальто несём со шва торчащей ниточкой",
        "Не в итальянский офис от кутюр."
    ];

    const rightLines = [
        "Как жаль, что не заложено с рождения",
        "Ко всем вокруг, не только к нам самим",
        "Хоть чуточку, немного уважения!",
        "Мы все под небом... кстати, под одним..."
    ];

    let isAnimating = false;
    const config = {
    charSpeed: 90,
    pauseChar: 90,
    lineGap: 60,
    audioOffset: 800
};

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    function clearPoem() {
        textDisplay.innerHTML = '';
    }

    function createWrapper() {
        const wrapper = document.createElement('div');
        wrapper.style.display = 'grid';
        wrapper.style.gridTemplateColumns = '1fr 1fr';
        wrapper.style.gap = '40px';
        wrapper.style.width = '100%';
        wrapper.style.alignItems = 'start';
        return wrapper;
    }

    function createCol() {
        const col = document.createElement('div');
        col.style.display = 'flex';
        col.style.flexDirection = 'column';
        col.style.gap = '12px';
        return col;
    }

    function createLine() {
        const el = document.createElement('div');
        el.className = 'poem-line';
        el.textContent = '';
        return el;
    }

    function typeText(el, text) {
        return new Promise(async (resolve) => {

            let i = 0;
            el.textContent = '';

            while (i < text.length) {
                const char = text[i];

                const span = document.createElement('span');
                span.textContent = char;
                el.appendChild(span);

                const pause = [",", "!", ".", "—", ":"].includes(char);
                await sleep(pause ? config.pauseChar : config.charSpeed);

                i++;
            }

            resolve();
        });
    }

    async function showPoem() {

        if (isAnimating) return;
        isAnimating = true;
        // ===== АУДИО СТАРТ =====
const audio = document.getElementById('poemAudio');

if (audio) {
    audio.pause();
    audio.currentTime = 0;

    const playPromise = audio.play();

    if (playPromise !== undefined) {
        playPromise.catch(err => {
            console.log('Audio play blocked:', err);
        });
    }
}
    await sleep(config.audioOffset);

        clearPoem();

        const wrapper = createWrapper();
        const leftCol = createCol();
        const rightCol = createCol();

        wrapper.appendChild(leftCol);
        wrapper.appendChild(rightCol);
        textDisplay.appendChild(wrapper);

        const leftEls = leftLines.map(() => {
            const el = createLine();
            leftCol.appendChild(el);
            return el;
        });

        const rightEls = rightLines.map(() => {
            const el = createLine();
            rightCol.appendChild(el);
            return el;
        });

        for (let i = 0; i < leftEls.length; i++) {
            if (leftLines[i] !== "") {
                await typeText(leftEls[i], leftLines[i]);
                await sleep(config.lineGap);
            } else {
                await sleep(200);
            }
        }

        for (let i = 0; i < rightEls.length; i++) {
            await typeText(rightEls[i], rightLines[i]);
            await sleep(80);
        }

        isAnimating = false;
    }

    startBtn.addEventListener('click', showPoem);
    repeatBtn.addEventListener('click', showPoem);
    const modal = document.getElementById('author-modal');
const closeModal = document.getElementById('close-modal');

authorBtn?.addEventListener('click', () => {
    modal?.classList.add('show');
});

closeModal?.addEventListener('click', () => {
    modal?.classList.remove('show');
});

modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('show');
    }
});



});