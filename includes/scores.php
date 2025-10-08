<?php
require_once 'config/database.php';

class ScoreManager {
    private $conn;

    public function getAllGames() {
    $query = "SELECT * FROM games ORDER BY name";
    $stmt = $this->conn->prepare($query);
    $stmt->execute();
    
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function saveScore($user_id, $game_slug, $score, $level_reached, $time_taken = null) {
        // Get game ID
        $game_id = $this->getGameIdBySlug($game_slug);
        if(!$game_id) return false;

        $query = "INSERT INTO scores 
                 SET user_id=:user_id, game_id=:game_id, score=:score, 
                     level_reached=:level_reached, time_taken=:time_taken";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':game_id', $game_id);
        $stmt->bindParam(':score', $score);
        $stmt->bindParam(':level_reached', $level_reached);
        $stmt->bindParam(':time_taken', $time_taken);

        if($stmt->execute()) {
            $this->updateUserStatistics($user_id);
            return true;
        }
        return false;
    }

    public function getUserScores($user_id, $game_slug = null) {
        $query = "SELECT s.*, g.name as game_name, g.slug as game_slug 
                 FROM scores s 
                 JOIN games g ON s.game_id = g.id 
                 WHERE s.user_id = :user_id";
        
        if($game_slug) {
            $query .= " AND g.slug = :game_slug";
        }
        
        $query .= " ORDER BY s.played_at DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        if($game_slug) {
            $stmt->bindParam(':game_slug', $game_slug);
        }
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function deleteScore($score_id, $user_id) {
        $query = "DELETE FROM scores WHERE id = :score_id AND user_id = :user_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':score_id', $score_id);
        $stmt->bindParam(':user_id', $user_id);
        
        if($stmt->execute()) {
            $this->updateUserStatistics($user_id);
            return true;
        }
        return false;
    }

    public function getLeaderboard($game_slug, $limit = 100) {
        $query = "SELECT u.username, u.profile_picture, s.score, s.level_reached, s.time_taken, s.played_at
                 FROM scores s
                 JOIN users u ON s.user_id = u.id
                 JOIN games g ON s.game_id = g.id
                 WHERE g.slug = :game_slug AND u.is_active = 1
                 ORDER BY s.score DESC, s.time_taken ASC
                 LIMIT :limit";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':game_slug', $game_slug);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getUserRanking($user_id, $game_slug) {
        $query = "SELECT COUNT(*) + 1 as rank
                 FROM scores s
                 JOIN users u ON s.user_id = u.id
                 JOIN games g ON s.game_id = g.id
                 WHERE g.slug = :game_slug AND u.is_active = 1 AND s.score > (
                     SELECT COALESCE(MAX(score), 0) 
                     FROM scores 
                     WHERE user_id = :user_id AND game_id = (SELECT id FROM games WHERE slug = :game_slug2)
                 )";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':game_slug', $game_slug);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':game_slug2', $game_slug);
        $stmt->execute();
        
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['rank'];
    }

    private function getGameIdBySlug($slug) {
        $query = "SELECT id FROM games WHERE slug = :slug";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':slug', $slug);
        $stmt->execute();
        
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result ? $result['id'] : null;
    }

    private function updateUserStatistics($user_id) {
        // This would update the user_statistics table
        // Implementation depends on your specific needs
    }
}
?>