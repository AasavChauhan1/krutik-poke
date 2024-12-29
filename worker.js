// Configuration
const CONFIG = {
  BOT_TOKEN: '8094662076:AAFhc2_iQqfW4bMfJ9OCzjTdYNpZVc9Mdi0', // Your actual token
  ADMIN_ID: '7012379841', // Your ID for notifications
  SPAWN_CONFIG: {
    MIN_MESSAGES: 20,
    MIN_TIME: 5 * 60 * 1000,
    DESPAWN_TIME: 5 * 60 * 1000
  },
  CATCH_RATES: {
    POKEBALL: 0.6,
    GREATBALL: 0.75,
    ULTRABALL: 0.9
  },
  BATTLE: {
    MOVES: {
      TACKLE: { power: 40, name: 'Tackle' },
      QUICK_ATTACK: { power: 45, name: 'Quick Attack' },
      SLAM: { power: 50, name: 'Slam' },
      TAKE_DOWN: { power: 55, name: 'Take Down' }
    },
    REWARDS: {
      WIN: 500,
      XP: {
        WIN: 200,
        PARTICIPATE: 50
      }
    },
    STATUS_EFFECTS: {
      PARALYSIS: { chance: 0.5, effect: 'miss_turn' },
      BURN: { multiplier: 0.5, effect: 'attack_reduction' },
      POISON: { damage: 0.1, effect: 'damage_per_turn' }
    }
  },
  DAILY: {
    BASE_AMOUNT: 100,
    STREAK_MULTIPLIER: 100,
    MAX_STREAK: 7
  },
  MARKET: {
    LISTING_DURATION: 48 * 60 * 60 * 1000, // 48 hours
    MIN_PRICE: 100,
    COMMISSION: 0.05, // 5%
    MAX_LISTINGS: 5
  },
  TRADE: {
    TIMEOUT: 5 * 60 * 1000, // 5 minutes
    COOLDOWN: 5 * 60 * 1000 // 5 minutes between trades
  },
  BREEDING: {
    DURATION: 60 * 60 * 1000, // 1 hour
    MAX_EGGS: 3,
    STATS_INHERITANCE: 0.7 // 70% chance to inherit parent stats
  },
  ACHIEVEMENTS: {
    COLLECTION: [
      { id: 'first_catch', name: 'First Catch', requirement: 1, reward: 100 },
      { id: 'catch_10', name: 'Novice Collector', requirement: 10, reward: 500 },
      { id: 'catch_rare', name: 'Rare Hunter', requirement: 1, reward: 1000 }
    ],
    BATTLE: [
      { id: 'first_win', name: 'First Victory', requirement: 1, reward: 200 },
      { id: 'win_10', name: 'Battle Expert', requirement: 10, reward: 1000 },
      { id: 'win_streak', name: 'Win Streak', requirement: 5, reward: 2000 }
    ]
  },
  ADMIN: {
    ADMINS: ['ADMIN_ID_1', 'ADMIN_ID_2'], // Add admin Telegram IDs
    COMMANDS: {
      FORCE_SPAWN: '/force_spawn',
      GIVE_POKEMON: '/give_pokemon',
      ADJUST_BALANCE: '/adjust_balance',
      BAN_USER: '/ban_user',
      VIEW_STATS: '/view_stats'
    }
  },
  ITEMS: {
    POKEBALL: { price: 100, catch_rate: 0.6 },
    GREATBALL: { price: 300, catch_rate: 0.75 },
    ULTRABALL: { price: 1000, catch_rate: 0.9 },
    POTION: { price: 100, heal: 50 },
    SUPER_POTION: { price: 300, heal: 100 },
    MAX_POTION: { price: 1000, heal: 999 },
    RARE_CANDY: { price: 5000, effect: 'level_up' }
  },
  XP: {
    CATCH: 100,
    BATTLE_WIN: 500,
    BATTLE_LOSE: 50,
    EVOLUTION: 1000,
    LEVEL_REQUIREMENTS: {
      COMMON: level => level * 1000,
      UNCOMMON: level => level * 1200,
      RARE: level => level * 1500,
      LEGENDARY: level => level * 2000
    }
  },
  EVOLUTION_CHAINS: {
    Pidgey: { level: 18, evolution: 'Pidgeotto' },
    Pidgeotto: { level: 36, evolution: 'Pidgeot' },
    Rattata: { level: 20, evolution: 'Raticate' },
    Caterpie: { level: 7, evolution: 'Metapod' },
    Metapod: { level: 10, evolution: 'Butterfree' },
    // Add more evolution chains...
  },
  CACHE: {
    DURATION: 5 * 60 * 1000, // 5 minutes
    KEYS: ['profile', 'pokemon', 'market', 'battle']
  },
  RATE_LIMITS: {
    COMMANDS: {
      catch: 5000, // 5 seconds
      trade: 300000, // 5 minutes
      market: 60000, // 1 minute
      battle: 30000 // 30 seconds
    },
    MAX_REQUESTS: 30,
    WINDOW: 60000 // 1 minute
  },
  HELP: {
    CATEGORIES: {
      BASIC: 'Basic Commands',
      POKEMON: 'Pokemon Management',
      BATTLE: 'Battle System',
      MARKET: 'Market & Trading',
      BREEDING: 'Breeding System',
      ITEMS: 'Items & Shop'
    }
  }
};

// Pokemon data store
const POKEMON_DATA = {
  common: ['Pidgey', 'Rattata', 'Caterpie', 'Weedle'],
  uncommon: ['Pikachu', 'Sandshrew', 'Vulpix', 'Oddish'],
  rare: ['Growlithe', 'Machop', 'Kadabra', 'Haunter'],
  legendary: ['Articuno', 'Zapdos', 'Moltres', 'Mewtwo']
};

// Add debugging
addEventListener('fetch', event => {
  if (!STARTUP_NOTIFICATION_SENT) {
    sendStartupNotification();
  }
  event.respondWith(handleRequest(event.request)
    .catch(err => {
      console.error('Fatal error:', err);
      return new Response(err.stack, { status: 500 });
    }));
});

let STARTUP_NOTIFICATION_SENT = false;

async function sendStartupNotification() {
  try {
    await fetch(`https://api.telegram.org/bot${CONFIG.BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CONFIG.ADMIN_ID,
        text: '🟢 Bot is now live and operational!'
      })
    });
    STARTUP_NOTIFICATION_SENT = true;
  } catch (error) {
    console.error('Failed to send startup notification:', error);
  }
}

async function handleRequest(request) {
  console.log('Request received:', {
    method: request.method,
    url: request.url,
    headers: Object.fromEntries(request.headers)
  });

  if (request.method === 'POST') {
    try {
      const payload = await request.json();
      console.log('Telegram update received:', JSON.stringify(payload, null, 2));

      if (!payload.message) {
        console.log('No message in payload');
        return new Response('OK'); // Telegram expects 200 OK
      }

      const { message } = payload;
      const chatId = message.chat.id;
      const userId = message.from.id;
      const text = message.text || '';

      console.log('Processing message:', {
        chatId,
        userId,
        text
      });

      // Add start command
      if (text === '/start') {
        const response = await sendTelegramMessage(chatId, 
          `Welcome to the Pokemon Bot!\n\n` +
          `Here are some commands to get started:\n` +
          `/help - View all commands\n` +
          `/daily - Claim daily reward\n` +
          `/catch - Catch Pokemon\n` +
          `/profile - View your profile\n\n` +
          `Good luck on your journey!`
        );
        console.log('Start command response:', response);
        return new Response('OK');
      }

      // Command handling
      if (text.startsWith('/')) {
        console.log('Processing command:', text);
        const result = await handleCommand(text, chatId, userId);
        console.log('Command result:', result);
        return new Response('OK');
      }

      // Message counting for spawn
      await handleMessageCount(chatId);
      return new Response('OK');

    } catch (error) {
      console.error('Error processing request:', error);
      // Still return OK to Telegram
      return new Response('OK');
    }
  }

  return new Response('OK');
}

async function handleCommand(text, chatId, userId) {
  const [command, ...args] = text.slice(1).split(' ');

  // Check admin commands first
  if (CONFIG.ADMIN.ADMINS.includes(userId.toString())) {
    const adminResponse = await handleAdminCommand(command, args, chatId);
    if (adminResponse) return adminResponse;
  }

  switch (command.toLowerCase()) {
    case 'catch':
      return handleCatch(chatId, userId);
    case 'profile':
      return handleProfile(chatId, userId);
    case 'battle':
      return handleBattle(chatId, userId, args[0]);
    case 'daily':
      return handleDaily(chatId, userId);
    case 'team':
      return handleTeam(chatId, userId, args);
    case 'market':
      return handleMarket(chatId, userId, args);
    case 'trade':
      return handleTrade(chatId, userId, args);
    case 'evolve':
      return handleEvolution(chatId, userId, args);
    case 'train':
      return handleTraining(chatId, userId, args);
    case 'breed':
      return handleBreeding(chatId, userId, args);
    case 'eggs':
      return showEggs(chatId, userId);
    case 'hatch':
      return handleHatch(chatId, userId, args[0]);
    case 'achievements':
      return showAchievements(chatId, userId);
    case 'shop':
      return handleShop(chatId, userId, args);
    case 'buy':
      return handleItemPurchase(chatId, userId, args);
    case 'use':
      return handleItemUse(chatId, userId, args);
    case 'inventory':
      return showInventory(chatId, userId);
    case 'heal':
      return handleHeal(chatId, userId, args);
    case 'help':
      return handleHelp(chatId, args[0]);
    case 'commands':
      return handleHelp(chatId, 'basic');
    default:
      return sendTelegramMessage(chatId, 'Unknown command');
  }
}

// Add Administrative Commands
async function handleAdminCommand(command, args, chatId) {
  switch (command) {
    case 'force_spawn':
      const rarity = args[0]?.toLowerCase() || 'common';
      return forceSpawnPokemon(chatId, rarity);
      
    case 'give_pokemon':
      if (args.length < 2) return sendTelegramMessage(chatId, 'Usage: /give_pokemon <user_id> <pokemon_name>');
      return givePokemonToUser(chatId, args[0], args[1]);
      
    case 'adjust_balance':
      if (args.length < 2) return sendTelegramMessage(chatId, 'Usage: /adjust_balance <user_id> <amount>');
      return adjustUserBalance(chatId, args[0], parseInt(args[1]));
      
    case 'ban_user':
      if (!args[0]) return sendTelegramMessage(chatId, 'Usage: /ban_user <user_id>');
      return banUser(chatId, args[0]);
      
    case 'view_stats':
      return viewBotStats(chatId);
  }
}

// Add Shop and Items System
async function handleShop(chatId, userId) {
  const shopItems = Object.entries(CONFIG.ITEMS)
    .map(([item, data]) => 
      `${item}: ${data.price} ⚡️PokeWatts\n${getItemDescription(item)}`)
    .join('\n\n');

  return sendTelegramMessage(chatId,
    `🏪 Pokemon Shop\n\n${shopItems}\n\nUse /buy <item> to purchase!`);
}

async function handleItemPurchase(chatId, userId, args) {
  if (!args.length) return sendTelegramMessage(chatId, 'Usage: /buy <item> [quantity]');
  
  const item = args[0].toUpperCase();
  const quantity = parseInt(args[1]) || 1;
  const itemData = CONFIG.ITEMS[item];

  if (!itemData) return sendTelegramMessage(chatId, 'Invalid item!');

  const profile = await getUserProfile(userId);
  const totalCost = itemData.price * quantity;

  if (profile.balance < totalCost) {
    return sendTelegramMessage(chatId, 
      `You need ${totalCost - profile.balance} more ⚡️PokeWatts!`);
  }

  profile.balance -= totalCost;
  profile.items = profile.items || {};
  profile.items[item] = (profile.items[item] || 0) + quantity;

  await updateUserProfile(userId, profile);
  return sendTelegramMessage(chatId, 
    `Successfully bought ${quantity}x ${item} for ${totalCost} ⚡️PokeWatts!`);
}

// Add XP and Leveling System
async function addExperience(userId, pokemon, amount) {
  const profile = await getUserProfile(userId);
  const targetPokemon = profile.pokemon.find(p => p.name === pokemon.name);
  
  if (!targetPokemon) return;

  targetPokemon.xp = (targetPokemon.xp || 0) + amount;
  const requiredXP = CONFIG.XP.LEVEL_REQUIREMENTS[targetPokemon.rarity](targetPokemon.level);

  if (targetPokemon.xp >= requiredXP) {
    targetPokemon.level++;
    targetPokemon.xp -= requiredXP;
    
    // Check for evolution
    const evolution = checkEvolutionEligibility(targetPokemon);
    if (evolution) {
      targetPokemon.name = evolution;
      await sendTelegramMessage(userId, 
        `🎊 Congratulations! Your ${pokemon.name} evolved into ${evolution}!`);
    }

    await sendTelegramMessage(userId,
      `🆙 ${targetPokemon.name} reached level ${targetPokemon.level}!`);
  }

  await updateUserProfile(userId, profile);
}

// Helper Functions
function getItemDescription(item) {
  const data = CONFIG.ITEMS[item];
  switch (item) {
    case 'POKEBALL':
    case 'GREATBALL':
    case 'ULTRABALL':
      return `Catch rate: ${data.catch_rate * 100}%`;
    case 'POTION':
    case 'SUPER_POTION':
    case 'MAX_POTION':
      return `Heals ${data.heal} HP`;
    case 'RARE_CANDY':
      return 'Instantly levels up a Pokemon';
    default:
      return '';
  }
}

async function viewBotStats(chatId) {
  const stats = {
    totalUsers: await POKEMON_KV.get('stats:total_users'),
    totalPokemon: await POKEMON_KV.get('stats:total_pokemon'),
    totalBattles: await POKEMON_KV.get('stats:total_battles'),
    totalTrades: await POKEMON_KV.get('stats:total_trades')
  };

  return sendTelegramMessage(chatId,
    `📊 Bot Statistics\n\n` +
    `Total Users: ${stats.totalUsers || 0}\n` +
    `Pokemon Caught: ${stats.totalPokemon || 0}\n` +
    `Battles Fought: ${stats.totalBattles || 0}\n` +
    `Trades Completed: ${stats.totalTrades || 0}`);
}

async function handleMessageCount(chatId) {
  const key = `msgcount:${chatId}`;
  let count = parseInt(await POKEMON_KV.get(key) || '0');
  count++;

  // Check spawn conditions
  if (shouldSpawnPokemon(count)) {
    await spawnPokemon(chatId);
    count = 0;
  }

  await POKEMON_KV.put(key, count.toString());
}

async function spawnPokemon(chatId) {
  const rarity = determineRarity();
  const pokemon = selectPokemon(rarity);
  
  await POKEMON_KV.put(`spawn:${chatId}`, JSON.stringify({
    pokemon,
    timestamp: Date.now()
  }));

  return sendTelegramMessage(chatId, 
    `A wild ${pokemon.name} appeared!\nUse /catch to catch it!`);
}

function determineRarity() {
  const rand = Math.random() * 100;
  if (rand < 70) return 'common';
  if (rand < 90) return 'uncommon';
  if (rand < 98) return 'rare';
  return 'legendary';
}

function selectPokemon(rarity) {
  const pokemonList = POKEMON_DATA[rarity];
  const pokemon = pokemonList[Math.floor(Math.random() * pokemonList.length)];
  return {
    name: pokemon,
    level: Math.floor(Math.random() * 30) + 1,
    hp: 100,
    rarity: rarity
  };
}

async function handleCatch(chatId, userId) {
  const spawnData = await POKEMON_KV.get(`spawn:${chatId}`, 'json');
  
  if (!spawnData || 
      Date.now() - spawnData.timestamp > CONFIG.SPAWN_CONFIG.DESPAWN_TIME) {
    return sendTelegramMessage(chatId, 'No Pokemon available to catch!');
  }

  const success = Math.random() < CONFIG.CATCH_RATES.POKEBALL;
  
  if (success) {
    await addToUserInventory(userId, spawnData.pokemon);
    await POKEMON_KV.delete(`spawn:${chatId}`);
    return sendTelegramMessage(chatId, 
      `Congratulations! You caught ${spawnData.pokemon.name}!`);
  }

  return sendTelegramMessage(chatId, 
    `Oh no! ${spawnData.pokemon.name} broke free!`);
}

// Enhance sendTelegramMessage with error logging
async function sendTelegramMessage(chatId, text) {
  console.log('Sending message:', {
    chatId,
    text: text.substring(0, 100) + '...' // Log first 100 chars
  });

  try {
    const response = await fetch(`https://api.telegram.org/bot${CONFIG.BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'MarkdownV2' // Changed from HTML to MarkdownV2
      })
    });

    const responseData = await response.json();
    console.log('Telegram API response:', responseData);

    if (!responseData.ok) {
      throw new Error(`Telegram API error: ${JSON.stringify(responseData)}`);
    }

    return responseData;
  } catch (error) {
    // Try sending without parse_mode if first attempt fails
    try {
      const response = await fetch(`https://api.telegram.org/bot${CONFIG.BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: text
        })
      });
      return response.json();
    } catch (retryError) {
      console.error('Error sending message:', retryError);
      // Notify admin of errors
      await fetch(`https://api.telegram.org/bot${CONFIG.BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CONFIG.ADMIN_ID,
          text: `Error sending message: ${error.message}`
        })
      });
      throw retryError;
    }
  }
}

// Helper functions for user data management
async function addToUserInventory(userId, pokemon) {
  const profile = await getUserProfile(userId);
  profile.pokemon.push(pokemon);
  await POKEMON_KV.put(`profile:${userId}`, JSON.stringify(profile));
}

// Enhanced getUserProfile with initialization
async function getUserProfile(userId) {
  try {
    let profile = await POKEMON_KV.get(`profile:${userId}`, 'json');
    
    if (!profile) {
      profile = {
        userId,
        balance: 1000,
        pokemon: [],
        team: [],
        items: {
          POKEBALL: 5  // Start with 5 Pokeballs
        },
        wins: 0,
        losses: 0,
        streak: 0,
        lastDaily: null,
        created: Date.now()
      };
      
      await POKEMON_KV.put(`profile:${userId}`, JSON.stringify(profile));
      
      // Update total users count
      const totalUsers = parseInt(await POKEMON_KV.get('stats:total_users') || '0');
      await POKEMON_KV.put('stats:total_users', (totalUsers + 1).toString());
    }
    
    return profile;
  } catch (error) {
    console.error('Error getting profile:', error);
    throw error;
  }
}

// Add new battle handling functions
async function handleBattle(chatId, userId, targetId) {
  await checkRateLimit(userId, 'battle');
  
  if (!targetId) {
    return sendTelegramMessage(chatId, 'Usage: /battle <opponent_id>');
  }

  const initiator = await getUserProfile(userId);
  const opponent = await getUserProfile(targetId);

  if (!initiator.pokemon.length || !opponent.pokemon.length) {
    return sendTelegramMessage(chatId, 'Both trainers need Pokemon to battle!');
  }

  const battleData = {
    initiatorId: userId,
    opponentId: targetId,
    initiatorPokemon: initiator.pokemon[0],
    opponentPokemon: opponent.pokemon[0],
    currentTurn: userId,
    status: 'waiting',
    status_effects: {
      initiator: [],
      opponent: []
    }
  };

  // Add speed check for first turn
  if (initiator.pokemon[0].speed > opponent.pokemon[0].speed) {
    battleData.currentTurn = userId;
  } else {
    battleData.currentTurn = targetId;
  }

  await POKEMON_KV.put(`battle:${chatId}`, JSON.stringify(battleData));

  return sendTelegramMessage(chatId, 
    `⚔️ Battle Started!\n` +
    `🔵 ${battleData.initiatorPokemon.name} vs 🔴 ${battleData.opponentPokemon.name}\n` +
    `HP: ${battleData.initiatorPokemon.hp}/100 | HP: ${battleData.opponentPokemon.hp}/100\n\n` +
    `Available Moves:\n${Object.values(CONFIG.BATTLE.MOVES)
      .map(move => `${move.name} (${move.power} power)`)
      .join('\n')}`
  );
}

// Enhance Move Handler with Status Effects
async function handleMove(chatId, userId, moveName) {
  const battle = await POKEMON_KV.get(`battle:${chatId}`, 'json');
  if (!battle || battle.currentTurn !== userId) {
    return sendTelegramMessage(chatId, "It's not your turn or no active battle!");
  }

  const move = CONFIG.BATTLE.MOVES[moveName.toUpperCase()];
  if (!move) return sendTelegramMessage(chatId, 'Invalid move!');

  // Apply status effects
  const updatedBattle = await applyStatusEffects(battle);
  
  // Calculate damage with status effect modifications
  let damage = calculateDamage(move.power);
  const isInitiatorsTurn = userId === battle.initiatorId;
  if (updatedBattle.status_effects[isInitiatorsTurn ? 'initiator' : 'opponent'].includes('BURN')) {
    damage *= CONFIG.BATTLE.STATUS_EFFECTS.BURN.multiplier;
  }

  if (isInitiatorsTurn) {
    updatedBattle.opponentPokemon.hp -= damage;
  } else {
    updatedBattle.initiatorPokemon.hp -= damage;
  }

  updatedBattle.currentTurn = isInitiatorsTurn ? updatedBattle.opponentId : updatedBattle.initiatorId;

  if (updatedBattle.opponentPokemon.hp <= 0 || updatedBattle.initiatorPokemon.hp <= 0) {
    await handleBattleEnd(chatId, updatedBattle);
  } else {
    await POKEMON_KV.put(`battle:${chatId}`, JSON.stringify(updatedBattle));
    await sendBattleStatus(chatId, updatedBattle);
  }
}

// Add Evolution Chain Validation
function checkEvolutionEligibility(pokemon) {
  const evolutionData = CONFIG.EVOLUTION_CHAINS[pokemon.name];
  if (!evolutionData) return null;
  
  return pokemon.level >= evolutionData.level ? evolutionData.evolution : null;
}

// Enhance Market System
async function handleMarketView(chatId) {
  const listings = await getActiveListings();
  
  // Sort by newest first
  listings.sort((a, b) => b.timestamp - a.timestamp);
  
  const marketDisplay = listings.map(listing => 
    `ID: ${listing.id}\n` +
    `${listing.pokemon.name} (Lvl ${listing.pokemon.level})\n` +
    `Price: ${listing.price} ⚡️PokeWatts\n` +
    `Seller: @${listing.sellerId}`
  ).join('\n\n');

  return sendTelegramMessage(chatId,
    `🏪 Market Listings:\n\n${marketDisplay || "No active listings"}`);
}

// Add Caching System
const cache = new Map();

async function getCachedData(key, fetchFunction) {
  if (cache.has(key)) {
    const { data, timestamp } = cache.get(key);
    if (Date.now() - timestamp < CONFIG.CACHE.DURATION) {
      return data;
    }
  }
  
  const data = await fetchFunction();
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
  
  return data;
}

// Add Rate Limiting Middleware
async function checkRateLimit(userId, command) {
  const key = `ratelimit:${userId}:${command}`;
  const lastUse = await POKEMON_KV.get(key);
  const now = Date.now();

  if (lastUse && (now - parseInt(lastUse)) < CONFIG.RATE_LIMITS.COMMANDS[command]) {
    throw new Error('Command on cooldown. Please wait.');
  }

  await POKEMON_KV.put(key, now.toString());
}

// Add Database Batch Operations
async function updateUserProfile(userId, profile) {
  const operations = [
    POKEMON_KV.put(`profile:${userId}`, JSON.stringify(profile)),
    POKEMON_KV.put(`stats:last_updated:${userId}`, Date.now().toString())
  ];

  if (profile.achievements) {
    operations.push(
      POKEMON_KV.put(`achievements:${userId}`, JSON.stringify(profile.achievements))
    );
  }

  await Promise.all(operations);
}

// Add Backup System
async function createBackup(type) {
  const timestamp = Date.now();
  const data = await getAllDataOfType(type);
  
  await POKEMON_KV.put(
    `backup:${type}:${timestamp}`,
    JSON.stringify(data)
  );

  return timestamp;
}

// Add daily reward handling
async function handleDaily(chatId, userId) {
  const profile = await getUserProfile(userId);
  const now = Date.now();
  const lastDaily = profile.lastDaily ? new Date(profile.lastDaily) : null;
  
  if (lastDaily && now - lastDaily < 24 * 60 * 60 * 1000) {
    const nextDaily = new Date(lastDaily.getTime() + 24 * 60 * 60 * 1000);
    return sendTelegramMessage(chatId, 
      `You already claimed your daily reward! Next claim available at: ${nextDaily.toLocaleString()}`);
  }

  const streak = calculateStreak(lastDaily);
  const reward = calculateDailyReward(streak);
  
  profile.balance += reward;
  profile.streak = streak;
  profile.lastDaily = now;

  await POKEMON_KV.put(`profile:${userId}`, JSON.stringify(profile));

  return sendTelegramMessage(chatId,
    `Daily Reward Claimed! 🎁\n` +
    `Reward: ${reward} ⚡️PokeWatts\n` +
    `Streak: ${streak} days\n` +
    `Current Balance: ${profile.balance} ⚡️PokeWatts`
  );
}

// Add Market System
async function handleMarket(chatId, userId, args) {
  if (!args.length) {
    return sendTelegramMessage(chatId, 'Usage: /market list <pokemon> <price> | view | buy <id>');
  }

  switch (args[0].toLowerCase()) {
    case 'list':
      return handleMarketListing(chatId, userId, args[1], parseInt(args[2]));
    case 'view':
      return handleMarketView(chatId);
    case 'buy':
      return handleMarketBuy(chatId, userId, args[1]);
  }
}

async function handleMarketListing(chatId, userId, pokemonName, price) {
  const profile = await getUserProfile(userId);
  const pokemon = profile.pokemon.find(p => p.name.toLowerCase() === pokemonName.toLowerCase());
  
  if (!pokemon) {
    return sendTelegramMessage(chatId, "You don't own this Pokemon!");
  }
  
  if (price < CONFIG.MARKET.MIN_PRICE) {
    return sendTelegramMessage(chatId, `Minimum price is ${CONFIG.MARKET.MIN_PRICE} ⚡️PokeWatts`);
  }

  const listing = {
    id: Date.now().toString(),
    sellerId: userId,
    pokemon,
    price,
    timestamp: Date.now()
  };

  await POKEMON_KV.put(`market:${listing.id}`, JSON.stringify(listing));
  return sendTelegramMessage(chatId, `Listed ${pokemon.name} for ${price} ⚡️PokeWatts!`);
}

// Add Trading System
async function handleTrade(chatId, userId, args) {
  await checkRateLimit(userId, 'trade');
  
  if (!args.length) {
    return sendTelegramMessage(chatId, 'Usage: /trade <user_id> <pokemon_name>');
  }

  const [targetId, pokemonName] = args;
  const profile = await getUserProfile(userId);
  const pokemon = profile.pokemon.find(p => p.name.toLowerCase() === pokemonName.toLowerCase());

  if (!pokemon) {
    return sendTelegramMessage(chatId, "You don't own this Pokemon!");
  }

  const tradeData = {
    initiatorId: userId,
    targetId,
    pokemon,
    timestamp: Date.now()
  };

  await POKEMON_KV.put(`trade:${chatId}`, JSON.stringify(tradeData));
  return sendTelegramMessage(chatId, 
    `Trade offer sent! Waiting for @${targetId} to accept...\n` +
    `They can accept with: /trade accept ${userId}`);
}

// Add Team Management
async function handleTeam(chatId, userId, args) {
  if (!args.length) {
    return showTeam(chatId, userId);
  }

  switch (args[0].toLowerCase()) {
    case 'add':
      return addToTeam(chatId, userId, args[1]);
    case 'remove':
      return removeFromTeam(chatId, userId, args[1]);
    case 'switch':
      return switchTeamPosition(chatId, userId, args[1], args[2]);
  }
}

async function showTeam(chatId, userId) {
  const profile = await getUserProfile(userId);
  const team = profile.team || [];

  if (!team.length) {
    return sendTelegramMessage(chatId, "You haven't set up your team yet!");
  }

  const teamDisplay = team.map((pokemon, i) => 
    `${i + 1}. ${pokemon.name} (Lvl ${pokemon.level}) HP: ${pokemon.hp}`
  ).join('\n');

  return sendTelegramMessage(chatId, 
    `🎮 Your Team:\n${teamDisplay}\n\nUse /team add <pokemon> to add Pokemon`);
}

// Add Evolution System
async function handleEvolution(chatId, userId, args) {
  if (!args.length) {
    return sendTelegramMessage(chatId, 'Usage: /evolve <pokemon_name>');
  }

  const profile = await getUserProfile(userId);
  const pokemon = profile.pokemon.find(p => p.name.toLowerCase() === args[0].toLowerCase());

  if (!pokemon) {
    return sendTelegramMessage(chatId, "You don't own this Pokemon!");
  }

  const evolution = checkEvolutionEligibility(pokemon);
  if (!evolution) {
    return sendTelegramMessage(chatId, 
      `${pokemon.name} cannot evolve yet! Check level requirements.`);
  }

  // Perform evolution
  pokemon.name = evolution;
  pokemon.level += 1;
  await updateUserProfile(userId, profile);

  return sendTelegramMessage(chatId, 
    `Congratulations! Your ${args[0]} evolved into ${evolution}!`);
}

// Add Training System
async function handleTraining(chatId, userId, args) {
  if (!args.length) {
    return sendTelegramMessage(chatId, 'Usage: /train <pokemon_name> <stat>');
  }

  const [pokemonName, stat] = args;
  const profile = await getUserProfile(userId);
  
  if (profile.balance < 100) {
    return sendTelegramMessage(chatId, 'Training costs 100 ⚡️PokeWatts!');
  }

  const pokemon = profile.pokemon.find(p => p.name.toLowerCase() === pokemonName.toLowerCase());
  if (!pokemon) {
    return sendTelegramMessage(chatId, "You don't own this Pokemon!");
  }

  // Apply training
  switch (stat.toLowerCase()) {
    case 'hp':
      pokemon.hp += 5;
      break;
    case 'attack':
      pokemon.attack = (pokemon.attack || 0) + 5;
      break;
    case 'defense':
      pokemon.defense = (pokemon.defense || 0) + 5;
      break;
    case 'speed':
      pokemon.speed = (pokemon.speed || 0) + 5;
      break;
    default:
      return sendTelegramMessage(chatId, 'Invalid stat! Use: hp, attack, defense, or speed');
  }

  profile.balance -= 100;
  await updateUserProfile(userId, profile);

  return sendTelegramMessage(chatId, 
    `Training complete! ${pokemon.name}'s ${stat} increased by 5!`);
}

// Add Breeding System
async function handleBreeding(chatId, userId, args) {
  if (args.length < 2) {
    return sendTelegramMessage(chatId, 'Usage: /breed <pokemon1> <pokemon2>');
  }

  const profile = await getUserProfile(userId);
  const [pokemon1Name, pokemon2Name] = args;
  
  const pokemon1 = profile.pokemon.find(p => p.name.toLowerCase() === pokemon1Name.toLowerCase());
  const pokemon2 = profile.pokemon.find(p => p.name.toLowerCase() === pokemon2Name.toLowerCase());

  if (!pokemon1 || !pokemon2) {
    return sendTelegramMessage(chatId, "You don't own one of these Pokemon!");
  }

  const eggs = await getEggs(userId);
  if (eggs.length >= CONFIG.BREEDING.MAX_EGGS) {
    return sendTelegramMessage(chatId, "Your incubator is full! (3/3 eggs)");
  }

  const egg = {
    id: Date.now().toString(),
    parents: [pokemon1, pokemon2],
    startTime: Date.now(),
    readyTime: Date.now() + CONFIG.BREEDING.DURATION
  };

  await POKEMON_KV.put(`egg:${userId}:${egg.id}`, JSON.stringify(egg));
  return sendTelegramMessage(chatId, 
    `Breeding started! The egg will hatch in 1 hour.\nUse /eggs to check status.`);
}

async function showEggs(chatId, userId) {
  const eggs = await getEggs(userId);
  
  if (!eggs.length) {
    return sendTelegramMessage(chatId, "You don't have any eggs!");
  }

  const eggStatus = eggs.map(egg => {
    const timeLeft = Math.max(0, egg.readyTime - Date.now());
    const minutes = Math.floor(timeLeft / 60000);
    return `🥚 Egg from ${egg.parents[0].name} & ${egg.parents[1].name}\n` +
           `Time remaining: ${minutes} minutes`;
  }).join('\n\n');

  return sendTelegramMessage(chatId, eggStatus);
}

async function handleHatch(chatId, userId, eggId) {
  const egg = await POKEMON_KV.get(`egg:${userId}:${eggId}`, 'json');
  
  if (!egg) {
    return sendTelegramMessage(chatId, "Egg not found!");
  }

  if (Date.now() < egg.readyTime) {
    const minutes = Math.floor((egg.readyTime - Date.now()) / 60000);
    return sendTelegramMessage(chatId, 
      `This egg needs ${minutes} more minutes to hatch!`);
  }

  const babyPokemon = createBabyPokemon(egg.parents);
  await addToUserInventory(userId, babyPokemon);
  await POKEMON_KV.delete(`egg:${userId}:${eggId}`);
  
  await checkAchievement(userId, 'BREEDING', 'first_hatch');
  
  return sendTelegramMessage(chatId,
    `🎉 Your egg hatched into ${babyPokemon.name}!\n` +
    `Level: ${babyPokemon.level}\n` +
    `HP: ${babyPokemon.hp}\n` +
    `Attack: ${babyPokemon.attack}`);
}

// Add Achievement System
async function checkAchievement(userId, category, action) {
  const profile = await getUserProfile(userId);
  const achievements = profile.achievements || {};
  
  const achievement = CONFIG.ACHIEVEMENTS[category]
    .find(a => a.id === action && !achievements[a.id]);
    
  if (achievement) {
    achievements[achievement.id] = true;
    profile.balance += achievement.reward;
    profile.achievements = achievements;
    
    await updateUserProfile(userId, profile);
    return sendTelegramMessage(userId,
      `🏆 Achievement Unlocked: ${achievement.name}!\n` +
      `Reward: ${achievement.reward} ⚡️PokeWatts`);
  }
}

async function showAchievements(chatId, userId) {
  const profile = await getUserProfile(userId);
  const achievements = profile.achievements || {};
  
  const achievementList = Object.entries(CONFIG.ACHIEVEMENTS)
    .map(([category, catAchievements]) => {
      const categoryAchievements = catAchievements
        .map(a => `${achievements[a.id] ? '✅' : '❌'} ${a.name} (${a.reward} ⚡️)`)
        .join('\n');
      return `${category}:\n${categoryAchievements}`;
    }).join('\n\n');

  return sendTelegramMessage(chatId,
    `🏆 Your Achievements:\n\n${achievementList}`);
}

// Add helper functions
function createBabyPokemon(parents) {
  const inheritedStats = calculateInheritedStats(parents);
  return {
    name: parents[0].name,
    level: 1,
    ...inheritedStats,
    rarity: parents[0].rarity
  };
}

function calculateInheritedStats(parents) {
  const stats = {};
  ['hp', 'attack', 'defense', 'speed'].forEach(stat => {
    const parentValues = parents.map(p => p[stat] || 0);
    const inheritFromFirst = Math.random() < CONFIG.BREEDING.STATS_INHERITANCE;
    stats[stat] = parentValues[inheritFromFirst ? 0 : 1];
  });
  return stats;
}

async function getEggs(userId) {
  const eggs = [];
  const eggKeys = await POKEMON_KV.list({ prefix: `egg:${userId}:` });
  
  for (const key of eggKeys.keys) {
    const egg = await POKEMON_KV.get(key.name, 'json');
    if (egg) eggs.push(egg);
  }
  
  return eggs;
}

function calculateDamage(power) {
  const baseDamage = power;
  const variation = Math.random() * 0.2 + 0.9; // 0.9-1.1 multiplier
  const critical = Math.random() < 0.0625 ? 2 : 1; // 6.25% crit chance
  return Math.floor(baseDamage * variation * critical);
}

function calculateStreak(lastDaily) {
  if (!lastDaily) return 1;
  
  const daysSinceLastClaim = (Date.now() - lastDaily) / (24 * 60 * 60 * 1000);
  if (daysSinceLastClaim > 48) return 1; // Reset streak if more than 48 hours
  return Math.min(7, daysSinceLastClaim <= 24 ? 1 : lastDaily + 1);
}

function calculateDailyReward(streak) {
  return CONFIG.DAILY.BASE_AMOUNT + (streak - 1) * CONFIG.DAILY.STREAK_MULTIPLIER;
}

// Add Help System
async function handleHelp(chatId, category = '') {
  switch (category.toLowerCase()) {
    case 'basic':
      return sendTelegramMessage(chatId, getBasicHelp());
    case 'pokemon':
      return sendTelegramMessage(chatId, getPokemonHelp());
    case 'battle':
      return sendTelegramMessage(chatId, getBattleHelp());
    case 'market':
      return sendTelegramMessage(chatId, getMarketHelp());
    case 'breeding':
      return sendTelegramMessage(chatId, getBreedingHelp());
    case 'items':
      return sendTelegramMessage(chatId, getItemsHelp());
    default:
      return sendTelegramMessage(chatId, getMainHelp());
  }
}

function getMainHelp() {
  return `Pokemon Bot Help Menu

Available Categories:
1. basic - Basic commands and getting started
2. pokemon - Pokemon management and training
3. battle - Battle system and commands
4. market - Market and trading system
5. breeding - Breeding mechanics
6. items - Shop and items usage

Use /help <category> for detailed information
Example: /help basic

Quick start: Use /commands for basic command list`;
}

function getBasicHelp() {
  return `📚 Basic Commands

/start - Start the bot
/profile - View your trainer profile
/daily - Claim daily reward
/catch - Catch a spawned Pokemon
/team - View your Pokemon team
/inventory - Check your items
/shop - Visit the Pokemon shop

💡 Getting Started:
1. Use /daily to get starting ⚡️PokeWatts
2. Wait for Pokemon to spawn or use /shop
3. Use /catch when a Pokemon appears
4. Build your team with /team commands`;
}

function getPokemonHelp() {
  return `🐾 Pokemon Management

/team add <pokemon> - Add to team
/team remove <pokemon> - Remove from team
/team switch <pos1> <pos2> - Reorder team
/train <pokemon> <stat> - Train a stat
/evolve <pokemon> - Evolve eligible Pokemon

📊 Stats Training:
• hp - Increase HP (+5)
• attack - Increase Attack (+5)
• defense - Increase Defense (+5)
• speed - Increase Speed (+5)

💰 Training cost: 100 ⚡️PokeWatts per stat`;
}

function getBattleHelp() {
  return `⚔️ Battle System

/battle <user_id> - Challenge a trainer
Available moves during battle:
• Tackle (40 power)
• Quick Attack (45 power)
• Slam (50 power)
• Take Down (55 power)

🏆 Rewards:
• Winner: 500 ⚡️PokeWatts
• Battle XP: 50-200 XP
• Achievement progress

⚡️ Battle Tips:
• Speed determines first move
• Status effects can change battle
• Higher level = better stats`;
}

function getMarketHelp() {
  return `🏪 Market System

/market list <pokemon> <price> - List Pokemon
/market view - View listings
/market buy <id> - Buy listed Pokemon
/trade <user_id> <pokemon> - Trade with user

💰 Market Info:
• Minimum price: 100 ⚡️PokeWatts
• Market fee: 5%
• Listings expire: 48 hours
• Max active listings: 5

⚖️ Trading:
• 5 minute timeout
• Both parties must confirm
• No fee for direct trades`;
}

function getBreedingHelp() {
  return `🥚 Breeding System

/breed <pokemon1> <pokemon2> - Start breeding
/eggs - Check your eggs
/hatch <egg_id> - Hatch ready egg

📝 Breeding Info:
• Maximum 3 eggs at once
• 1 hour incubation time
• Inherited stats from parents
• 70% parent stat inheritance
• Level 1 on hatch`;
}

function getItemsHelp() {
  return `🎒 Items & Shop

/shop - View available items
/buy <item> [quantity] - Purchase items
/use <item> <pokemon> - Use item on Pokemon

📦 Available Items:
• Pokeball (60% catch rate)
• Greatball (75% catch rate)
• Ultraball (90% catch rate)
• Potion (Heal 50 HP)
• Super Potion (Heal 100 HP)
• Max Potion (Full heal)
• Rare Candy (Level up)`;
}

// Profile System
async function handleProfile(chatId, userId) {
  try {
    const profile = await getUserProfile(userId);
    const pokemonCount = profile.pokemon ? profile.pokemon.length : 0;
    const activeTeam = profile.team ? profile.team.length : 0;

    const profileText = 
      `👤 Trainer Profile\n\n` +
      `ID: ${userId}\n` +
      `Balance: ${profile.balance} ⚡️PokeWatts\n` +
      `Pokemon Owned: ${pokemonCount}\n` +
      `Active Team: ${activeTeam}/6\n` +
      `Battle Record: ${profile.wins}W/${profile.losses}L\n` +
      `Daily Streak: ${profile.streak || 0} days\n\n` +
      `Use /inventory to see your items\n` +
      `Use /team to manage your Pokemon`;

    return await sendTelegramMessage(chatId, profileText);
  } catch (error) {
    console.error('Profile error:', error);
    return sendTelegramMessage(chatId, 'Error fetching profile. Please try again.');
  }
}

// Inventory System
async function showInventory(chatId, userId) {
  try {
    const profile = await getUserProfile(userId);
    const items = profile.items || {};
    
    const itemList = Object.entries(items)
      .map(([item, quantity]) => `${item}: ${quantity}`)
      .join('\n');

    const inventoryText = 
      `🎒 Your Inventory\n\n` +
      `${itemList || 'No items'}\n\n` +
      `Balance: ${profile.balance} ⚡️PokeWatts\n\n` +
      `Use /shop to buy items`;

    return await sendTelegramMessage(chatId, inventoryText);
  } catch (error) {
    console.error('Inventory error:', error);
    return sendTelegramMessage(chatId, 'Error fetching inventory. Please try again.');
  }
}

// Enhanced spawn system with proper error handling
async function shouldSpawnPokemon(count) {
  try {
    if (count < CONFIG.SPAWN_CONFIG.MIN_MESSAGES) {
      return false;
    }

    const lastSpawn = parseInt(await POKEMON_KV.get('lastSpawn') || '0');
    const timeSinceLastSpawn = Date.now() - lastSpawn;
    
    return timeSinceLastSpawn >= CONFIG.SPAWN_CONFIG.MIN_TIME;
  } catch (error) {
    console.error('Spawn check error:', error);
    return false;
  }
}

// Add error tracking
async function logError(error, context) {
  try {
    const errorLog = {
      timestamp: Date.now(),
      error: error.message,
      stack: error.stack,
      context
    };
    
    await POKEMON_KV.put(`error:${Date.now()}`, JSON.stringify(errorLog));
    
    // Notify admin of critical errors
    if (context.critical) {
      await sendTelegramMessage(CONFIG.ADMIN_ID, 
        `⚠️ Critical Error:\n${error.message}\n\nContext: ${JSON.stringify(context)}`);
    }
  } catch (e) {
    console.error('Error logging failed:', e);
  }
}

// Add performance monitoring
async function trackPerformance(action, duration) {
  try {
    const stats = {
      timestamp: Date.now(),
      action,
      duration
    };
    
    await POKEMON_KV.put(`perf:${action}:${Date.now()}`, JSON.stringify(stats));
  } catch (error) {
    console.error('Performance tracking error:', error);
  }
}

// ... rest of existing code ...