// Statistikk-håndtering for MindMatrix
const MindMatrixStats = {
    storageKey: 'mindMatrixStats',
    
    init() {
        if (!this.getStats()) {
            this.resetStats();
        }
    },

    getStats() {
        const stats = localStorage.getItem(this.storageKey);
        return stats ? JSON.parse(stats) : null;
    },

    saveStats(stats) {
        localStorage.setItem(this.storageKey, JSON.stringify(stats));
    },

    resetStats() {
        const defaultStats = {
            totalGames: 0,
            highScore: 0,
            averageLevel: 0,
            currentStreak: 0,
            lastPlayed: null,
            games: {}
        };
        this.saveStats(defaultStats);
        return defaultStats;
    },

    updateGameStats(gameId, score, level) {
        let stats = this.getStats();
        if (!stats) stats = this.resetStats();

        // Oppdater totale spill
        stats.totalGames++;

        // Oppdater high score
        if (score > stats.highScore) {
            stats.highScore = score;
        }

        // Oppdater gjennomsnittlig nivå
        const totalGames = stats.totalGames;
        stats.averageLevel = ((stats.averageLevel * (totalGames - 1)) + level) / totalGames;

        // Oppdater streak (forenklet logikk)
        const today = new Date().toDateString();
        if (stats.lastPlayed === today) {
            // Samme dag, ikke øk streak
        } else if (stats.lastPlayed === this.getYesterday()) {
            // Spilte i går, øk streak
            stats.currentStreak++;
        } else {
            // Brutt streak
            stats.currentStreak = 1;
        }
        stats.lastPlayed = today;

        // Spesifikk spillstatistikk
        if (!stats.games[gameId]) {
            stats.games[gameId] = {
                plays: 0,
                bestScore: 0,
                bestLevel: 0
            };
        }

        stats.games[gameId].plays++;
        if (score > stats.games[gameId].bestScore) {
            stats.games[gameId].bestScore = score;
        }
        if (level > stats.games[gameId].bestLevel) {
            stats.games[gameId].bestLevel = level;
        }

        this.saveStats(stats);
        return stats;
    },

    getYesterday() {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toDateString();
    },

    getGameStats(gameId) {
        const stats = this.getStats();
        return stats ? stats.games[gameId] || null : null;
    }
};

// Initialiser statistikk når scriptet lastes
MindMatrixStats.init();