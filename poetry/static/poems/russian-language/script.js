document.addEventListener('DOMContentLoaded', function () {

    const backgroundContainer = document.getElementById('backgroundContainer');
    const backgroundsList = ["bg1.jpg", "bg2.jpg", "bg3.jpg", "bg4.jpg"];

    backgroundsList.forEach((name, index) => {
        const img = document.createElement("img");
        img.src = "/static/poems/russian-language/images/" + name;
        img.className = index === 0 ? "background active" : "background";
        backgroundContainer.appendChild(img);
    });

    const startBtn = document.getElementById('startBtn');
    const repeatBtn = document.getElementById('repeatBtn');
    const authorBtn = document.getElementById('authorBtn');
    const backgrounds = document.querySelectorAll('.background');
    const textDisplay = document.getElementById('textDisplay');
    const poemAudio = document.getElementById('poemAudio');

    if (!startBtn || !repeatBtn || !textDisplay) return;

    const poemLines = [
        "Мы все - славянское сословие ,",
        "И в понимании моём",
        "Инослова , как сквернословие ,",
        "Растут в сознаньях сорняком !",
        "",
        "Да ! Современность побуждает ,",
        "Метаморфоз не перечесть ,",
        "Но сердце русское желает",
        "Лелеять Корни , Кровь и Честь !",
        "",
        "И если это не от ' Gucci '",
        "То почему б не поддержать",
        "РОДНОЙ , ВЕЛИКИЙ И МОГУЧИЙ !",
        "Чтоб никому не подражать !"
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

    function changeBackground(index) {
        backgrounds.forEach(bg => bg.classList.remove('active'));
        if (backgrounds[index]) {
            backgrounds[index].classList.add('active');
        }
        if (index === 3) {
            textDisplay.style.opacity = '0';
        }
    }

    function typeLine(lineText) {
        return new Promise(async (resolve) => {
            const lineElement = document.createElement('div');
            const isSpecial = lineText.includes("РОДНОЙ") && lineText.includes("МОГУЧИЙ");
            lineElement.className = isSpecial ? 'poem-line special-line' : 'poem-line';
            textDisplay.appendChild(lineElement);

            const highlightWord = "Gucci";
            let i = 0;
            while (i < lineText.length) {
                if (lineText.slice(i, i + highlightWord.length) === highlightWord) {
                    for (let j = 0; j < highlightWord.length; j++) {
                        const span = document.createElement('span');
                        span.className = 'highlight-word';
                        span.textContent = highlightWord[j];
                        lineElement.appendChild(span);
                        await sleep(config.charSpeed);
                    }
                    i += highlightWord.length;
                } else {
                    const char = lineText[i];
                    const span = document.createElement('span');
                    span.textContent = char;
                    lineElement.appendChild(span);
                    const isPause = [",", "!", ".", "—", ":"].includes(char);
                    await sleep(isPause ? config.lineDelay : config.charSpeed);
                    i++;
                }
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
        changeBackground(0);
        if (poemAudio) {
            poemAudio.currentTime = 0;
            poemAudio.play().catch(() => {});
        }
        await sleep(300);
        let couplet = 0;
        for (let i = 0; i < poemLines.length; i++) {
            if (poemLines[i] === '') {
                await createEmptyLine();
                if (couplet === 0) changeBackground(1);
                else if (couplet === 1) changeBackground(2);
                couplet++;
            } else {
                await typeLine(poemLines[i]);
            }
        }
        await sleep(config.finalImageDelay);
        changeBackground(3);
        isPlaying = false;
        startBtn.disabled = false;
        repeatBtn.disabled = false;
    }

    startBtn.addEventListener('click', startPrinting);
    repeatBtn.addEventListener('click', () => !isPlaying && startPrinting());

    const modal = document.getElementById('author-modal');
    const closeModal = document.getElementById('close-modal');
    authorBtn?.addEventListener('click', () => modal.classList.add('show'));
    closeModal?.addEventListener('click', () => modal.classList.remove('show'));
    modal?.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('show'); });

    clearScreen();
    changeBackground(0);
});