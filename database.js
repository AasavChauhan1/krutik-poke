class Database {
  async get(key) {
    try {
      const value = await POKEMON_KV.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Database get error:', error);
      return null;
    }
  }

  async set(key, value) {
    try {
      await POKEMON_KV.put(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Database set error:', error);
      return false;
    }
  }

  async delete(key) {
    try {
      await POKEMON_KV.delete(key);
      return true;
    } catch (error) {
      console.error('Database delete error:', error);
      return false;
    }
  }

  async getUserProfile(userId) {
    const profile = await this.get(`profile:${userId}`);
    if (!profile) {
      return this.createNewProfile(userId);
    }
    return profile;
  }

  async createNewProfile(userId) {
    const profile = {
      userId,
      balance: 1000,
      pokemon: [],
      items: {
        POKEBALL: 5
      },
      created: Date.now()
    };

    await this.set(`profile:${userId}`, profile);
    return profile;
  }

  async updateProfile(userId, updates) {
    const profile = await this.getUserProfile(userId);
    Object.assign(profile, updates);
    await this.set(`profile:${userId}`, profile);
    return profile;
  }
}

module.exports = Database;
