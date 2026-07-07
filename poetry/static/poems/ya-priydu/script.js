document.addEventListener('DOMContentLoaded', function () {

    // ===== DOM =====
    const backgroundContainer = document.getElementById('backgroundContainer');
    if (backgroundContainer) {
        const img = document.createElement('img');
        const slug = document.body.dataset.slug;

        img.src = `/static/poems/${slug}/images/bg1.jpg`;
        img.className = "background";
        img.style.position = "absolute";
        img.style.top = "0";
        img.style.left = "0";
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "cover";
        img.style.zIndex = "0";
        backgroundContainer.appendChild(img);
    }

    const startBtn = document.getElementById('startBtn');
    const repeatBtn = document.getElementById('repeatBtn');
    const authorBtn = document.getElementById('authorBtn');
    const textDisplay = document.getElementById('textDisplay');

    if (!startBtn || !repeatBtn || !textDisplay) return;

    // ===== СТИХ (БЕЗ НАЗВАНИЯ!) =====
    const poemLines = [
        "Я прийду к тебе днём или ночью,",
        "В снегопад... или в дождь... всё равно...",
        "Постучусь в твою дверь, и точно",
        "Свежим ветром влечу в окно...",
        "",
        "Ты заваришь мне чашку чая,",
        "И увидишь в моих глазах -",
        "Как же я по тебе скучала!",
        "Угасая в чужих полях...",
        "",
        "Я прийду в четверг или в среду,",
        "Прокрадусь, словно мышь, в тишине...",
        "Может к ужину, может к обеду...",
        "Если ты... не забыл... обо мне..."
    ];

    const config = {
        charSpeed: 50,
        lineDelay: 450,
        coupletDelay: 600,
        finalImageDelay: 4000
    };

    let isPlaying = false;
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    function clearScreen() {
        textDisplay.innerHTML = '';
        textDisplay.style.opacity = '1';
    }

    function typeLine(lineText) {
        return new Promise(async (resolve) => {
            const lineElement = document.createElement('div');
            lineElement.className = 'poem-line';
            textDisplay.appendChild(lineElement);

            let i = 0;
            while (i < lineText.length) {
                const char = lineText[i];
                const span = document.createElement('span');
                span.textContent = char;
                lineElement.appendChild(span);
                const isPause = [",", "!", ".", "—", ":"].includes(char);
                await sleep(isPause ? config.lineDelay : config.charSpeed);
                i++;
            }
            await sleep(config.charSpeed * 2);
            resolve();
        });
    }

    function createEmptyLine() {
        const empty = document.createElement('div');
        empty.className = 'empty-line';
        textDisplay.appendChild(empty);
        return sleep(config.coupletDelay);
    }

    async function startPrinting() {
        if (isPlaying) return;
        isPlaying = true;
        startBtn.disabled = true;
        repeatBtn.disabled = true;
        clearScreen();
        await sleep(300);

        const poemAudio = document.getElementById('poemAudio');

if (poemAudio) {
    poemAudio.pause();
    poemAudio.currentTime = 0;

    poemAudio.play().catch(err => {
        console.log('Ошибка аудио:', err);
    });
}

        for (let i = 0; i < poemLines.length; i++) {
            if (poemLines[i] === '') {
                await createEmptyLine();
            } else {
                await typeLine(poemLines[i]);
            }
        }

        isPlaying = false;
        startBtn.disabled = false;
        repeatBtn.disabled = false;
    }

    startBtn.addEventListener('click', startPrinting);
    repeatBtn.addEventListener('click', () => !isPlaying && startPrinting());

    const modal = document.getElementById('author-modal');
    const closeModal = document.getElementById('close-modal');

    authorBtn?.addEventListener('click', () => {
        modal.classList.add('show');
    });

    closeModal?.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    modal?.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });

    clearScreen();
});