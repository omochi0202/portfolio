class MemoryGame {
    constructor() {
        this.currentLevel = 1;
        this.selectedCharacter = '';
        this.gameData = {
            1: { pairs: 2, cards: 4, mode: 'easy', name: 'イージーモード' },
            2: { pairs: 3, cards: 6, mode: 'normal', name: 'ふつうモード' },
            3: { pairs: 4, cards: 8, mode: 'hard', name: 'ハードモード' }
        };
        this.cardImages = {
            cat: ['img/cat/cat1.jpg', 'img/cat/cat2.jpg', 'img/cat/cat3.jpg', 'img/cat/cat4.jpg'],
            rabbit: {
                easy: ['img/rabbit/rabbit1.png', 'img/rabbit/rabbit2.png'],
                normal: ['img/rabbit/rabbit3.png', 'img/rabbit/rabbit4.png', 'img/rabbit/rabbit5.png'],
                hard: ['img/rabbit/rabbit6.png', 'img/rabbit/rabbit7.png', 'img/rabbit/rabbit8.png', 'img/rabbit/rabbit9.png']
            },
            sky: {
                easy: ['img/sky/sky1..png', 'img/sky/sky2..png', 'img/sky/sky3..png', 'img/sky/sky4..png'],
                hard: ['img/sky/sky4..png', 'img/sky/sky5..png', 'img/sky/sky6..png', 'img/sky/sky7..png']
            }
        };
        this.cardFrontImages = ['img/card/card1.png', 'img/card/card2.png', 'img/card/card3.png'];
        this.currentFrontImage = '';
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.canFlip = true;
        this.sparkleEffect = new SparkleEffect();
        this.attempts = 0;
        this.startTime = 0;
        this.timerInterval = null;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupCanvas();
    }

    bindEvents() {
        // キャラクターボタンのイベント
        document.querySelectorAll('.character-button').forEach(button => {
            button.addEventListener('click', (e) => {
                this.selectedCharacter = e.target.dataset.character;
                this.startGame();
            });
        });

        // 戻るボタンのイベント
        document.getElementById('back-button').addEventListener('click', () => {
            this.goToStart();
        });

        // もう一度プレイボタンのイベント
        document.getElementById('restart-button').addEventListener('click', () => {
            this.resetGame();
            this.goToStart();
        });
    }

    setupCanvas() {
        const canvas = document.getElementById('sparkle-canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    startGame() {
        // ゲーム開始時にランダムに表面画像を選択
        this.currentFrontImage = this.cardFrontImages[Math.floor(Math.random() * this.cardFrontImages.length)];
        
        this.showScreen('game-screen');
        this.setupLevel();
        this.createGameBoard();
        this.startTimer();
    }

    setupLevel() {
        const levelData = this.gameData[this.currentLevel];
        document.getElementById('current-mode').textContent = levelData.name;
        document.getElementById('score').textContent = `ペア数: 0/${levelData.pairs}`;
        
        this.matchedPairs = 0;
        this.flippedCards = [];
        this.canFlip = true;
        this.attempts = 0;
        this.updateAttempts();
    }

    startTimer() {
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            document.getElementById('timer').textContent = 
                `時間: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateAttempts() {
        document.getElementById('attempts').textContent = `試行回数: ${this.attempts}`;
    }

    createGameBoard() {
        const gameBoard = document.getElementById('game-board');
        const levelData = this.gameData[this.currentLevel];
        
        gameBoard.innerHTML = '';
        gameBoard.className = `game-board ${levelData.mode}`;
        
        // カードデータを作成（テキストベース）
        const cardTypes = this.getCardTypes();
        const cards = this.shuffleArray([...cardTypes, ...cardTypes]);
        
        cards.forEach((cardType, index) => {
            const card = this.createCard(cardType, index);
            gameBoard.appendChild(card);
        });
    }

    getCardTypes() {
        const levelData = this.gameData[this.currentLevel];
        const types = [];
        
        if (this.selectedCharacter === 'cat') {
            // 利用可能な画像からランダムに必要な数を選択
            const availableImages = [...this.cardImages.cat];
            // ハードモードの場合は全ての画像を使用
            const imagesToUse = this.currentLevel === 3 ? availableImages : availableImages.sort(() => Math.random() - 0.5).slice(0, levelData.pairs);
            types.push(...imagesToUse);
        } else if (this.selectedCharacter === 'rabbit') {
            // うさぎの画像を使用
            let availableImages;
            if (this.currentLevel === 1) {
                // イージーモード：rabbit1-2.pngを使用
                availableImages = [...this.cardImages.rabbit.easy];
            } else if (this.currentLevel === 2) {
                // ふつうモード：rabbit3-5.pngを使用
                availableImages = [...this.cardImages.rabbit.normal];
            } else {
                // ハードモード：rabbit6-9.pngを使用
                availableImages = [...this.cardImages.rabbit.hard];
            }
            
            // 必要なペア数だけ画像を選択（すでに適切な数になっているのでそのまま使用）
            const imagesToUse = availableImages.slice(0, levelData.pairs);
            types.push(...imagesToUse);
        } else if (this.selectedCharacter === 'sky') {
            // skyの画像を使用
            let availableImages;
            if (this.currentLevel === 3) {
                // ハードモード：sky4-7.pngを使用
                availableImages = [...this.cardImages.sky.hard];
            } else {
                // イージー・ふつうモード：sky1-4.pngからランダム選択
                availableImages = [...this.cardImages.sky.easy];
            }
            
            // ハードモードの場合は全ての画像を使用、それ以外はランダム選択
            const imagesToUse = this.currentLevel === 3 ? availableImages : availableImages.sort(() => Math.random() - 0.5).slice(0, levelData.pairs);
            types.push(...imagesToUse);
        } else {
            // 他のキャラクター用のプレースホルダー
            const symbols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
            for (let i = 0; i < levelData.pairs; i++) {
                types.push(symbols[i]);
            }
        }
        
        return types;
    }

    createCard(cardType, index) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.type = cardType;
        card.dataset.index = index;
        
        if (this.selectedCharacter === 'cat' || this.selectedCharacter === 'sky' || this.selectedCharacter === 'rabbit') {
            // 猫・空・うさぎの画像カード
            card.innerHTML = `
                <div class="card-front" style="background-image: url('${this.currentFrontImage}');"></div>
                <div class="card-back" style="background-image: url('${cardType}');"></div>
            `;
        } else {
            // テキストベースのカード
            card.innerHTML = `
                <div class="card-front" style="background-image: url('${this.currentFrontImage}');"></div>
                <div class="card-back">${cardType}</div>
            `;
        }
        
        // タッチイベントとクリックイベントの両方を設定
        card.addEventListener('click', (e) => this.handleCardClick(e));
        card.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.handleCardClick(e);
        });
        
        return card;
    }

    handleCardClick(e) {
        if (!this.canFlip) return;
        
        const card = e.currentTarget;
        if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
        
        this.flipCard(card);
        this.flippedCards.push(card);
        
        if (this.flippedCards.length === 2) {
            this.canFlip = false;
            this.attempts++;
            this.updateAttempts();
            setTimeout(() => this.checkMatch(), 1000);
        }
    }

    flipCard(card) {
        card.classList.add('flipped');
    }

    checkMatch() {
        const [card1, card2] = this.flippedCards;
        const type1 = card1.dataset.type;
        const type2 = card2.dataset.type;
        
        if (type1 === type2) {
            // マッチした場合 - カードを表向きのまま残す
            card1.classList.add('matched');
            card2.classList.add('matched');
            // flippedクラスは残してカードが表向きのままになるようにする
            this.matchedPairs++;
            
            // キラキラエフェクト
            const rect1 = card1.getBoundingClientRect();
            const rect2 = card2.getBoundingClientRect();
            this.sparkleEffect.create(rect1.left + rect1.width/2, rect1.top + rect1.height/2);
            this.sparkleEffect.create(rect2.left + rect2.width/2, rect2.top + rect2.height/2);
            
            this.updateScore();
            this.checkLevelComplete();
        } else {
            // マッチしなかった場合
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
            }, 500);
        }
        
        this.flippedCards = [];
        this.canFlip = true;
    }

    updateScore() {
        const levelData = this.gameData[this.currentLevel];
        document.getElementById('score').textContent = `ペア数: ${this.matchedPairs}/${levelData.pairs}`;
    }

    checkLevelComplete() {
        const levelData = this.gameData[this.currentLevel];
        
        if (this.matchedPairs === levelData.pairs) {
            this.stopTimer();
            
            if (this.currentLevel < 3) {
                // 次のレベルに進む
                setTimeout(() => {
                    this.showCongratulations();
                    setTimeout(() => {
                        this.currentLevel++;
                        this.hideCongratulations();
                        this.setupLevel();
                        this.createGameBoard();
                        this.startTimer();
                    }, 2000);
                }, 500);
            } else {
                // 全レベルクリア - 華やかな祝福アニメーションを開始
                setTimeout(() => {
                    this.showScreen('clear-screen');
                    this.startCelebrationAnimation();
                }, 1000);
            }
        }
    }

    showCongratulations() {
        const congratsDiv = document.getElementById('congratulations');
        const textElement = document.getElementById('next-level-text');
        
        if (this.currentLevel < 3) {
            const nextLevelData = this.gameData[this.currentLevel + 1];
            textElement.textContent = `次は${nextLevelData.name}です！`;
        }
        
        congratsDiv.classList.remove('hidden');
    }

    hideCongratulations() {
        document.getElementById('congratulations').classList.add('hidden');
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    goToStart() {
        this.resetGame();
        this.showScreen('start-screen');
    }

    resetGame() {
        this.currentLevel = 1;
        this.selectedCharacter = '';
        this.matchedPairs = 0;
        this.flippedCards = [];
        this.canFlip = true;
        this.attempts = 0;
        this.stopTimer();
        this.hideCongratulations();
        
        // 祝福アニメーションもクリア
        if (this.celebrationInterval) {
            clearInterval(this.celebrationInterval);
        }
        
        // 画面上の星エフェクトを削除
        document.querySelectorAll('.celebration-star').forEach(element => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });
    }

    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    // 華やかな祝福アニメーション
    startCelebrationAnimation() {
        // 既存のキラキラエフェクトも追加
        this.sparkleEffect.create(window.innerWidth / 2, window.innerHeight / 2);
        
        // 星とハートを定期的に生成
        this.celebrationInterval = setInterval(() => {
            this.createCelebrationEffect();
        }, 300);
        
        // 10秒後にアニメーションを停止
        setTimeout(() => {
            if (this.celebrationInterval) {
                clearInterval(this.celebrationInterval);
            }
        }, 10000);
    }

    createCelebrationEffect() {
        // 星のエフェクト
        for (let i = 0; i < 3; i++) {
            const star = document.createElement('div');
            star.className = 'celebration-star';
            star.innerHTML = '⭐';
            star.style.left = Math.random() * window.innerWidth + 'px';
            star.style.animationDelay = Math.random() * 2 + 's';
            document.body.appendChild(star);
            
            // 5秒後に削除
            setTimeout(() => {
                if (star.parentNode) {
                    star.parentNode.removeChild(star);
                }
            }, 5000);
        }
    }
}

class SparkleEffect {
    constructor() {
        this.canvas = document.getElementById('sparkle-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.animate();
    }

    create(x, y) {
        for (let i = 0; i < 15; i++) {
            this.particles.push({
                x: x + (Math.random() - 0.5) * 100,
                y: y + (Math.random() - 0.5) * 100,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 1,
                decay: Math.random() * 0.02 + 0.02,
                size: Math.random() * 6 + 2,
                color: `hsl(${Math.random() * 60 + 40}, 100%, 70%)`
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.1; // 重力
            particle.life -= particle.decay;
            
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }
            
            this.ctx.save();
            this.ctx.globalAlpha = particle.life;
            this.ctx.fillStyle = particle.color;
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = particle.color;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2);
            this.ctx.fill();
            
            // 星の形を追加
            this.drawStar(particle.x, particle.y, particle.size * particle.life);
            
            this.ctx.restore();
        }
        
        requestAnimationFrame(() => this.animate());
    }

    drawStar(x, y, size) {
        const spikes = 5;
        const outerRadius = size;
        const innerRadius = size * 0.5;
        
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - outerRadius);
        
        for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i * Math.PI) / spikes;
            const sx = x + Math.cos(angle - Math.PI / 2) * radius;
            const sy = y + Math.sin(angle - Math.PI / 2) * radius;
            this.ctx.lineTo(sx, sy);
        }
        
        this.ctx.closePath();
        this.ctx.fill();
    }
}

// タッチデバイス対応の追加設定
document.addEventListener('DOMContentLoaded', () => {
    // タッチスクロールを無効化
    document.body.addEventListener('touchmove', (e) => {
        e.preventDefault();
    }, { passive: false });
    
    // ピンチズームを無効化
    document.addEventListener('gesturestart', (e) => {
        e.preventDefault();
    });
    
    // ダブルタップズームを無効化
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
});

// ゲーム開始
const game = new MemoryGame(); 