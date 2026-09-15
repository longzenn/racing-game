/**
 * In-Game HUD Controller (Kids Edition)
 */
class HUDManager {
  constructor() {
    this.hudLayer = document.getElementById('hud-layer');
    this.coinVal = document.getElementById('coin-val');
    this.timeVal = document.getElementById('time-val');
    this.scoreVal = document.getElementById('score-val');
    this.speedVal = document.getElementById('speed-digital-val');
    this.comboBanner = document.getElementById('combo-banner');
    this.powerupsContainer = document.getElementById('active-powerups');

    this.comboTimeout = null;
  }

  show() {
    if (this.hudLayer) this.hudLayer.style.display = 'flex';
  }

  hide() {
    if (this.hudLayer) this.hudLayer.style.display = 'none';
  }

  update(score, coins, timeLeft, speed, speedTier, activePowerups) {
    if (this.scoreVal) this.scoreVal.innerText = score.toLocaleString();
    if (this.coinVal) this.coinVal.innerText = coins;
    if (this.timeVal) this.timeVal.innerText = `${Math.ceil(timeLeft)}s`;

    const kmh = Math.round(speed * speedTier.displayKmHMultiplier);
    if (this.speedVal) this.speedVal.innerText = kmh;

    this.renderPowerups(activePowerups);
  }

  showCombo(comboCount) {
    if (!this.comboBanner || comboCount <= 1) return;
    this.comboBanner.innerText = `⭐ ${comboCount}X COMBO XU! ⭐`;
    this.comboBanner.classList.add('show');

    if (this.comboTimeout) clearTimeout(this.comboTimeout);
    this.comboTimeout = setTimeout(() => {
      this.comboBanner.classList.remove('show');
    }, 1200);
  }

  showNearMiss() {
    if (!this.comboBanner) return;
    this.comboBanner.innerText = `✨ TAY LÁI SIÊU ĐẲNG! +50 ✨`;
    this.comboBanner.classList.add('show');

    if (this.comboTimeout) clearTimeout(this.comboTimeout);
    this.comboTimeout = setTimeout(() => {
      this.comboBanner.classList.remove('show');
    }, 900);
  }

  renderPowerups(activePowerups) {
    if (!this.powerupsContainer) return;
    this.powerupsContainer.innerHTML = '';

    for (let key in activePowerups) {
      const p = activePowerups[key];
      if (p && p.remaining > 0) {
        const badge = document.createElement('div');
        badge.className = 'powerup-badge';
        badge.style.borderColor = p.color || '#ff3366';
        badge.innerHTML = `<span>${p.icon || '🚀'}</span> <span>${p.name}: ${p.remaining.toFixed(1)}s</span>`;
        this.powerupsContainer.appendChild(badge);
      }
    }
  }
}
