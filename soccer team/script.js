// スライダーの制御
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    // スライドの背景画像を設定
    slides[0].style.backgroundImage = 'url("images/slide1.jpg")';
    slides[1].style.backgroundImage = 'url("images/slide2.jpg")';
    slides[2].style.backgroundImage = 'url("images/slide3.jpg")';

    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    // 3秒ごとにスライドを切り替え
    setInterval(nextSlide, 3000);

    // 選手のスクロール実装
    const playerScroll = document.querySelector('.player-scroll');
    const players = [
        { name: '選手1', image: 'player1.jpg' },
        { name: '選手2', image: 'player2.jpg' },
        { name: '選手3', image: 'player3.jpg' },
        { name: '選手4', image: 'player4.jpg' },
        { name: '選手5', image: 'player5.jpg' },
        { name: '選手6', image: 'player6.jpg' },
        { name: '選手7', image: 'player7.jpg' },
        { name: '選手8', image: 'player8.jpg' },
        { name: '選手9', image: 'player9.jpg' },
        { name: '選手10', image: 'player10.jpg' },
        { name: '選手11', image: 'player11.jpg' }
    ];

    // 選手の要素を生成
    players.forEach(player => {
        const playerElement = document.createElement('div');
        playerElement.className = 'player';
        playerElement.innerHTML = `
            <img src="images/${player.image}" alt="${player.name}">
            <p>${player.name}</p>
        `;
        playerScroll.appendChild(playerElement);
    });

    // プレイヤーの複製を作成して無限スクロールを実現
    const playerElements = document.querySelectorAll('.player');
    playerElements.forEach(player => {
        const clone = player.cloneNode(true);
        playerScroll.appendChild(clone);
    });
}); 