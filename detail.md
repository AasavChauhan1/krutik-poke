# Pokemon Bot Detailed Documentation

## Core Systems & Mechanics

### Pokemon Spawning System
- Random spawns based on message activity
- Rarity system:
  - Common: 70% chance
  - Uncommon: 20% chance
  - Rare: 8% chance
  - Legendary: 2% chance
- Spawn Requirements:
  - 20+ messages since last spawn
  - Minimum 5 minutes between spawns
- Despawn timer: 5 minutes

### Catching System
- Success rates:
  - Pokeball: 60%
  - Greatball: 75%
  - Ultraball: 90%
- Responses:
  - Success: "Congratulations! You caught {pokemon}!"
  - Failure: "Oh no! {pokemon} broke free!"
  - No Pokemon: "No Pokemon available to catch!"

### Battle System
- Turn-based combat
- Stats influence:
  - Attack
  - Defense
  - Speed
  - HP
- Battle Flow:
1. Challenge sent
2. Opponent accepts
3. Alternating turns
4. Victory on KO
- Rewards:
  - Winner: 500 ⚡️PokeWatts
  - Battle XP for Pokemon

### Training System
- Trainable Stats:
  - HP (+5 per training)
  - Attack (+5 per training)
  - Defense (+5 per training)
  - Speed (+5 per training)
- Cost: 100 ⚡️PokeWatts per training
- Level System:
  - XP gained from battles
  - Evolution at specific levels

### Breeding System
- Requirements:
  - Compatible Pokemon
  - Different genders
- Process:
1. Start breeding (1 hour)
2. Egg creation
3. Incubation period
4. Hatching
- Limits:
  - 3 eggs maximum
  - Inherited stats from parents

### Market System
- Features:
  - List Pokemon for sale
  - Set custom prices
  - Browse listings
  - Purchase Pokemon
- Listing Duration: 48 hours
- Transaction Process:
1. Seller lists Pokemon + price
2. Buyer purchases
3. Automatic transfer
4. Commission: 5%

### Daily Rewards System
- Base Reward: 100 ⚡️PokeWatts
- Streak Bonuses:
  - Day 2: 200 ⚡️PokeWatts
  - Day 3: 300 ⚡️PokeWatts
  - Day 4+: 400 ⚡️PokeWatts
- Max Streak: 7 days
- Reset if missed

### Achievement System
Categories:
1. Collection
   - Catch first Pokemon
   - Catch 10 Pokemon
   - Catch rare Pokemon
2. Battle
   - Win first battle
   - Win 10 battles
   - Win streak
3. Trading
   - First trade
   - 10 trades
   - Market sales
4. Breeding
   - First egg
   - Hatch 10 eggs
   - Rare breeding

### Team Management
- Max 6 Pokemon per team
- Commands:
  - View team
  - Set team
  - Remove Pokemon
  - Reorder team

## Command Response Examples

### Profile Command
    👤 Trainer Profile Username: @trainer 
    Balance: 1500 ⚡️PokeWatts 
    Pokemon: 12 
    Battle Record: 5W/2L 
    Daily Streak: 3 days


### Battle Command
-⚔️ Battle Started! 🔵 Charizard vs 🔴 Blastoise HP: 100/100 | HP: 100/100

    Available Moves:

    Tackle (40 power)
    Quick Attack (45 power)
    Slam (50 power)
    Take Down (55 power)


### Evolution System
- Requirements:
  - Minimum level requirement
  - Some Pokemon require special items
- Evolution chains follow original Pokemon games
- Success message shows old and new form
- Stats increase upon evolution
- Moves can be learned during evolution

### Level System
- Experience points (XP) gained from:
  - Battles: 50-100 XP
  - Training: 25 XP
  - Victories: 200 XP bonus
- Level up requirements:
  - Level 1-10: 1000 XP per level
  - Level 11-30: 2000 XP per level
  - Level 31+: 3000 XP per level

### Trade System Details
- Trade requirements:
  - Both users must be registered
  - Pokemon must be owned
  - Cannot trade Pokemon in active team
- Trade process:
  1. Initiator selects Pokemon and target user
  2. Target receives notification
  3. Target selects Pokemon to trade
  4. Both confirm trade
  5. Pokemon are swapped instantly

### Market Features
- Listing requirements:
  - Pokemon must be fully healed
  - Cannot list Pokemon in team
  - Minimum price: 100 ⚡️PokeWatts
- Market functions:
  - Search by Pokemon name
  - Filter by price range
  - Sort by newest/price
  - View seller history

### Battle Mechanics
1. Speed determines first move
2. Damage calculation:
   - Base damage = Move Power × (Attack/Defense)
   - Random factor: 0.85-1.00
   - Critical hits: 2x damage, 6.25% chance
3. Status effects:
   - Paralysis: 50% chance to miss turn
   - Burn: -50% attack power
   - Poison: -10% HP per turn

### Administrative Commands
- For bot administrators only:
1. `/force_spawn <rarity>` - Force spawn Pokemon
2. `/give_pokemon <user> <pokemon>` - Give Pokemon to user
3. `/adjust_balance <user> <amount>` - Modify user balance
4. `/ban_user <user>` - Ban user from bot
5. `/view_stats` - View bot statistics

### Error Messages
❌ Common Errors:

    "Insufficient funds!"
    "Pokemon not found in your inventory"
    "You don't own this Pokemon"
    "Battle already in progress"
    "Trade request expired"
    "Market listing not found"
    "Cannot evolve this Pokemon yet"
    "Item not found in inventory"


### Event Messages
🎉 Special Events:

"A legendary Pokemon has appeared!"
"Double XP weekend active!"
"Market fee waived for next 24 hours"
"Increased spawn rates active"
"Special breeding bonus active"


### Currency System
- ⚡️PokeWatts earning methods:
  1. Daily rewards: 100-400
  2. Battle victories: 500
  3. Selling Pokemon: Varies
  4. Achievement rewards: 100-2000
  5. Special events: Various amounts

### Item Usage
- Pokeballs:
  1. Regular: 60% catch rate
  2. Great: 75% catch rate
  3. Ultra: 90% catch rate
- Healing items:
  1. Potion: +50 HP
  2. Super Potion: +100 HP
  3. Max Potion: Full heal
- Evolution items:
  1. Fire Stone
  2. Water Stone
  3. Thunder Stone
  4. Leaf Stone

### Performance Optimizations
1. Database:
   - Prepared statements
   - Connection pooling
   - Batch operations
2. Caching:
   - Pokemon data
   - User profiles
   - Market listings
3. Rate limiting:
   - Spawn frequency
   - Command usage
   - Trade requests

### Security Features
1. User verification
2. Command rate limiting
3. Trade confirmation
4. Admin authentication
5. Input validation

### Backup System
- Automatic backups:
  1. Daily database backup
  2. User inventory backup
  3. Market listing backup
  4. Battle history backup


## Error Messages & Responses

### Common Errors
    ❌ Insufficient funds: "You need {amount} more ⚡️PokeWatts for this purchase!"

    ❌ Invalid Pokemon: "Pokemon #{number} not found in your inventory!"

    ❌ Battle Error: "Cannot start battle - you're already in one!"

    ❌ Trading Error: "Trade failed - other trainer doesn't have this Pokemon!"

    ❌ Breeding Error: "Cannot breed - incubator is full! (3/3 eggs)"


### Success Messages    
    ✅ Purchase Success: "Successfully bought {item} for {amount} ⚡️PokeWatts!"

    ✅ Pokemon Caught: "Congratulations! You caught a Level {level} {pokemon}!"

    ✅ Battle Victory: "Victory! You won {amount} ⚡️PokeWatts!"

    ✅ Trade Complete: "Trade successful! Received {pokemon} from @{trainer}!"


## Technical Details

### Database Tables

1. users
```sql
- user_id (BIGINT PRIMARY KEY)
- username (VARCHAR)
- balance (INTEGER)
- inventory (JSONB)
- last_daily_claim (TIMESTAMP)
- streak_count (INTEGER)
- active_team (JSONB)    

pokemon_stats
- pokemon_id (INTEGER PRIMARY KEY)
- name (VARCHAR)
- base_hp (INTEGER)
- base_attack (INTEGER)
- base_defense (INTEGER)
- moves (JSONB)

battles
- battle_id (SERIAL PRIMARY KEY)
- player1_id (BIGINT)
- player2_id (BIGINT)
- winner_id (BIGINT)
- battle_data (JSONB)

Rate Limiting
    Catching: 1 attempt per active Pokemon
    Trading: 5 minute cooldown
    Breeding: 3 concurrent eggs maximum
    Daily Claim: 24 hour cooldown
    Market Listings: 5 active maximum

Pokemon Stats Calculation

    Base Stats:
    HP = base_hp + (level * 2)
    Attack = base_attack + (level * 1.5)
    Defense = base_defense + (level * 1.5)
    Speed = base_speed + (level * 1.8)

Battle Damage:
    damage = (attack * move_power / defense) * random(0.85, 1.0)

Experience System
XP Gains:

    Catching: 100 XP
    Battle Victory: 500 XP
    Training: 50 XP
    Evolution: 1000 XP
Level Requirements:

    Level 1-10: 1000 XP per level
    Level 11-30: 2000 XP per level
    Level 31+: 3000 XP per level
    
Evolution Requirements

Standard Evolution:

Level requirement met
Correct evolution item (if needed)
Not in team/market/trade
Trade Evolution:

Must be traded
Level requirement met
Specific item held (if needed)
Administrative Functions
Spawn Control:

    /force_spawn <rarity>
    /set_rates <common> <uncommon> <rare> <legendary>

Economy Management:
    /give_watts <user> <amount>
    /set_price <item> <amount>

User Management:
    /ban_user <user>
    /reset_user <user>
    /view_stats <user>