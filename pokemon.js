class Pokemon {
  constructor(data) {
    this.name = data.name;
    this.level = data.level;
    this.hp = data.hp;
    this.maxHp = data.hp;
    this.rarity = data.rarity;
    this.moves = data.moves;
    this.stats = data.stats;
    this.xp = 0;
    this.evolution = null;
  }

  takeDamage(amount) {
    this.hp = Math.max(0, this.hp - amount);
    return this.hp > 0;
  }

  heal(amount) {
    this.hp = Math.min(this.maxHp, this.hp + amount);
  }

  addXP(amount) {
    this.xp += amount;
    if (this.canLevelUp()) {
      this.levelUp();
      return true;
    }
    return false;
  }

  canLevelUp() {
    return this.xp >= this.getRequiredXP();
  }

  getRequiredXP() {
    return Math.floor(Math.pow(this.level, 1.5) * 100);
  }

  levelUp() {
    this.level++;
    this.xp = 0;
    this.maxHp += 5;
    this.hp = this.maxHp;
    this.stats.attack += 2;
    this.stats.defense += 2;
    this.stats.speed += 2;
  }

  toJSON() {
    return {
      name: this.name,
      level: this.level,
      hp: this.hp,
      maxHp: this.maxHp,
      rarity: this.rarity,
      moves: this.moves,
      stats: this.stats,
      xp: this.xp
    };
  }
}

module.exports = Pokemon;
