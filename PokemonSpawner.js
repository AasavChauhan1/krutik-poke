const CONFIG = require('./worker');

class PokemonSpawner {
  constructor() {
    this.spawned = new Map();
  }

  async spawnPokemon(chatId) {
    try {
      const rarity = this.determineRarity();
      const pokemon = await this.generatePokemon(rarity);
      
      this.spawned.set(chatId, {
        pokemon,
        timestamp: Date.now()
      });

      return pokemon;
    } catch (error) {
      console.error('Spawn error:', error);
      throw new Error('Failed to spawn Pokemon');
    }
  }

  determineRarity() {
    const roll = Math.random() * 100;
    if (roll < 70) return 'common';
    if (roll < 90) return 'uncommon';
    if (roll < 98) return 'rare';
    return 'legendary';
  }

  async generatePokemon(rarity) {
    const pokemonList = CONFIG.POKEMON_DATA[rarity];
    const selected = pokemonList[Math.floor(Math.random() * pokemonList.length)];
    
    return {
      name: selected,
      level: Math.floor(Math.random() * 30) + 1,
      hp: 100,
      rarity,
      moves: this.generateMoves(),
      stats: this.generateStats(rarity)
    };
  }

  generateMoves() {
    return Object.values(CONFIG.BATTLE.MOVES)
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
  }

  generateStats(rarity) {
    const multiplier = {
      common: 1,
      uncommon: 1.2,
      rare: 1.5,
      legendary: 2
    }[rarity];

    return {
      attack: Math.floor((Math.random() * 30 + 20) * multiplier),
      defense: Math.floor((Math.random() * 30 + 20) * multiplier),
      speed: Math.floor((Math.random() * 30 + 20) * multiplier)
    };
  }

  async despawnPokemon(chatId) {
    this.spawned.delete(chatId);
  }

  getSpawnedPokemon(chatId) {
    return this.spawned.get(chatId);
  }
}

module.exports = PokemonSpawner;
