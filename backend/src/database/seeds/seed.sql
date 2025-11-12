-- Tournaments (300)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE participants;
TRUNCATE TABLE matches;
TRUNCATE TABLE tournaments;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

SET @base := '2025-11-12 15:00:00';

-- Create a temporary table with numbers 0-299
DROP TEMPORARY TABLE IF EXISTS temp_numbers;
CREATE TEMPORARY TABLE temp_numbers (n INT);

INSERT INTO temp_numbers (n) VALUES
(0),(1),(2),(3),(4),(5),(6),(7),(8),(9),(10),(11),(12),(13),(14),(15),(16),(17),(18),(19),
(20),(21),(22),(23),(24),(25),(26),(27),(28),(29),(30),(31),(32),(33),(34),(35),(36),(37),(38),(39),
(40),(41),(42),(43),(44),(45),(46),(47),(48),(49),(50),(51),(52),(53),(54),(55),(56),(57),(58),(59),
(60),(61),(62),(63),(64),(65),(66),(67),(68),(69),(70),(71),(72),(73),(74),(75),(76),(77),(78),(79),
(80),(81),(82),(83),(84),(85),(86),(87),(88),(89),(90),(91),(92),(93),(94),(95),(96),(97),(98),(99);

-- Insert 300 tournaments
INSERT INTO tournaments (name, startTime, maxParticipants, status)
SELECT
  CONCAT('Tournament ', (a.n + b.k * 10 + c.m * 100)),
  DATE_ADD(@base, INTERVAL (a.n + b.k * 10 + c.m * 100) HOUR),
  CASE
    WHEN ((a.n + b.k * 10 + c.m * 100) % 4) = 0 THEN 16
    WHEN ((a.n + b.k * 10 + c.m * 100) % 4) = 2 THEN 8
    ELSE 32
  END,
  CASE
    WHEN ((a.n + b.k * 10 + c.m * 100) % 10) < 6 THEN 'pending'
    WHEN ((a.n + b.k * 10 + c.m * 100) % 10) IN (6,7) THEN 'active'
    WHEN ((a.n + b.k * 10 + c.m * 100) % 10) = 8 THEN 'completed'
    ELSE 'cancelled'
  END
FROM (
  SELECT 1 AS n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5
  UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10
) a
CROSS JOIN (
  SELECT 0 AS k UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
  UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
) b
CROSS JOIN (
  SELECT 0 AS m UNION ALL SELECT 1 UNION ALL SELECT 2
) c
LIMIT 300;

-- Insert 300 users
INSERT INTO users (name, email, role, password)
SELECT 
  CONCAT('User ', (a.n + b.k * 10)),
  CONCAT('user', (a.n + b.k * 10), '@example.com'),
  CASE WHEN (a.n + b.k * 10) <= 10 THEN 'admin' ELSE 'player' END,
  CONCAT('password', (a.n + b.k * 10))
FROM (
  SELECT 1 AS n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5
  UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10
) a
CROSS JOIN (
  SELECT 0 AS k UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
  UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
  UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL SELECT 14
  UNION ALL SELECT 15 UNION ALL SELECT 16 UNION ALL SELECT 17 UNION ALL SELECT 18 UNION ALL SELECT 19
) b
LIMIT 200;

-- Insert participants for tournaments (ensuring we don't exceed maxParticipants)
-- First, let's create a more controlled approach to add participants
SET @tournament_counter = 0;
SET @user_counter = 1;

-- Create participants using a stored procedure simulation with variables
INSERT INTO participants (tournamentId, userId, joinedAt, score, status)
SELECT 
  t.id as tournamentId,
  (ROW_NUMBER() OVER (ORDER BY t.id, RAND()) % 200) + 1 as userId,
  DATE_ADD(t.startTime, INTERVAL -FLOOR(RAND() * 72) HOUR) as joinedAt,
  CASE 
    WHEN t.status = 'completed' THEN FLOOR(RAND() * 1000)
    WHEN t.status = 'active' THEN FLOOR(RAND() * 500)
    ELSE 0
  END as score,
  CASE 
    WHEN t.status = 'completed' THEN 'finished'
    WHEN t.status = 'active' THEN 'playing'
    WHEN t.status = 'cancelled' THEN 'cancelled'
    ELSE 'registered'
  END as status
FROM tournaments t
CROSS JOIN (
  SELECT n FROM temp_numbers 
  WHERE n < 32  -- Maximum possible participants for any tournament
) num
WHERE num.n < (
  CASE 
    WHEN t.maxParticipants <= 8 THEN LEAST(t.maxParticipants, 4 + (t.id % 5))
    WHEN t.maxParticipants <= 16 THEN LEAST(t.maxParticipants, 6 + (t.id % 8))
    ELSE LEAST(t.maxParticipants, 8 + (t.id % 12))
  END
)
ORDER BY t.id, num.n;

-- Insert matches based on participants in tournaments
-- Create simple pairings: participant1 vs participant2, participant3 vs participant4, etc.
INSERT INTO matches (tournamentId, participant1Id, participant2Id, status, winner)
SELECT 
  p1.tournamentId,
  p1.id as participant1Id,
  p2.id as participant2Id,
  CASE 
    WHEN t.status = 'completed' THEN 'completed'
    WHEN t.status = 'active' THEN 
      CASE WHEN (p1.id + p2.id) % 3 = 0 THEN 'in-progress' ELSE 'completed' END
    WHEN t.status = 'cancelled' THEN 'cancelled'
    ELSE 'pending'
  END as status,
  CASE 
    WHEN t.status = 'completed' THEN
      CASE WHEN p1.score > p2.score THEN p1.id ELSE p2.id END
    WHEN t.status = 'active' AND (p1.id + p2.id) % 3 != 0 THEN
      CASE WHEN p1.score > p2.score THEN p1.id ELSE p2.id END
    ELSE NULL
  END as winner
FROM participants p1
JOIN participants p2 ON p1.tournamentId = p2.tournamentId 
JOIN tournaments t ON p1.tournamentId = t.id
WHERE p1.id < p2.id  -- Ensure we don't create duplicate matches
AND (
  -- Create systematic pairings within each tournament
  (
    SELECT COUNT(*) 
    FROM participants px 
    WHERE px.tournamentId = p1.tournamentId 
    AND px.id <= p1.id
  ) % 2 = 1  -- p1 is at odd position
  AND p2.id = (
    SELECT MIN(py.id) 
    FROM participants py 
    WHERE py.tournamentId = p1.tournamentId 
    AND py.id > p1.id
  )  -- p2 is the very next participant
)
ORDER BY p1.tournamentId, p1.id;
