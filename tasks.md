# Project: Transparent Tunes (Rule-Based Recommendation Engine)

## Project Goal
Design a music recommendation engine based exclusively on explicit, deterministic rules. No machine learning. The system must explain *why* a track is recommended based on:
1.  Last listened track
2.  Dominant music style
3.  Time of day

## Architecture
1.  **Data Layer**: Stores `Track` objects.
    *   *Raw Metadata*: Title, Channel, Duration, Tags.
    *   *Derived Attributes*: Computed via explicit keyword rules (e.g., tag "chill" -> Energy: Low).
2.  **Rules Layer**: A collection of scoring functions.
    *   Input: Context (Time, History) + Candidate Track.
    *   Output: Score modification + Log (Explanation).
3.  **Engine**: Coordinator.
    *   Applies all rules to all candidates.
    *   Ranks by final score.
    *   Returns top recommendation with explanation trace.
4.  **Interface**: Visualizes tracks, current context, and the "Why" behind recommendations.

## Current Task: Define Music Data Model & Basic Rules
**Status**: In Progress
**Objective**: Define the `Track` interface and the rules to derive attributes from raw YouTube-like metadata.

### Specification 1: Data Model
A `Track` consists of:
*   `id`: string (unique)
*   `title`: string
*   `channel`: string
*   `tags`: string[]
*   `duration`: number (seconds)
*   `derived`:
    *   `genre`: string (Enforced set: 'Lofi', 'Rock', 'Pop', 'Jazz', 'Electronic', 'Classical', 'Unknown')
    *   `energy`: 'Low' | 'Medium' | 'High'
    *   `tempo`: 'Slow' | 'Medium' | 'Fast'

### Specification 2: Attribute Derivation Rules (V1)
These rules convert raw metadata into derived attributes.
*   **Genre**: First match in `tags` against known genres. Default 'Unknown'.
*   **Energy**:
    *   IF tags contain ['chill', 'relax', 'sleep', 'ambient', 'lofi'] -> 'Low'
    *   IF tags contain ['metal', 'rock', 'workout', 'upbeat', 'dance'] -> 'High'
    *   ELSE -> 'Medium'
*   **Tempo**:
    *   IF Energy is 'Low' -> 'Slow'
    *   IF Energy is 'High' AND Duration < 180 -> 'Fast'
    *   ELSE -> 'Medium'

### Specification 3: Recommendation Rules (V1)
*   **Time of Day Rule**:
    *   Morning (05:00 - 11:59) -> Prefer 'Medium' Energy (+10 pts)
    *   Work (12:00 - 17:59) -> Prefer 'High' Energy (+10 pts)
    *   Evening (18:00 - 04:59) -> Prefer 'Low' Energy (+10 pts)
*   **Anti-Repetition Rule**:
    *   IF track.id == last_played.id -> Disqualify (-999 pts)
*   **Genre Continuity Rule**:
    *   IF track.genre == last_played.genre -> Bonus (+5 pts)

## Future Tasks
- [ ] Refine "Genre Continuity" to include compatible genres (e.g., Lofi -> Jazz).
- [ ] Add "Discovery Mode" rule to penalize recently played artists.
