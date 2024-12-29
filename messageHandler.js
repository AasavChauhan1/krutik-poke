const PokemonSpawner = require('./PokemonSpawner');
const Database = require('./database');

class MessageHandler {
  constructor() {
    this.spawner = new PokemonSpawner();
    this.db = new Database();
    this.messageCount = new Map();
  }

  async handleMessage(message) {
    try {
      const chatId = message.chat.id;
      const userId = message.from.id;
      const text = message.text || '';

      // Handle commands
      if (text.startsWith('/')) {
        return await this.handleCommand(text, chatId, userId);
      }

      // Update message count
      await this.updateMessageCount(chatId);
      return { success: true };
    } catch (error) {
      console.error('Message handling error:', error);
      return { success: false, error: error.message };
    }
  }

  async updateMessageCount(chatId) {
    const count = (this.messageCount.get(chatId) || 0) + 1;
    this.messageCount.set(chatId, count);

    if (count >= CONFIG.SPAWN_CONFIG.MIN_MESSAGES) {
      await this.trySpawnPokemon(chatId);
      this.messageCount.set(chatId, 0);
    }
  }

  async trySpawnPokemon(chatId) {
    try {
      const pokemon = await this.spawner.spawnPokemon(chatId);
      await this.sendSpawnMessage(chatId, pokemon);
    } catch (error) {
      console.error('Spawn error:', error);
    }
  }

  async sendSpawnMessage(chatId, pokemon) {
    const message = `A wild ${pokemon.name} appeared! (Level ${pokemon.level})\nUse /catch to catch it!`;
    await this.sendTelegramMessage(chatId, message);
  }

  async handleCommand(text, chatId, userId) {
    const [command, ...args] = text.slice(1).split(' ');

    switch (command.toLowerCase()) {
      case 'catch':
        return await this.handleCatch(chatId, userId);
      case 'profile':
        return await this.handleProfile(chatId, userId);
      case 'help':
        return await this.handleHelp(chatId);
      default:
        return await this.sendTelegramMessage(chatId, 'Unknown command');
    }
  }

  async sendTelegramMessage(chatId, text) {
    // Implementation from worker.js
    // ...existing code...
  }
}

module.exports = MessageHandler;
