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
    *   Input: Context (Time, History, Mode) + Candidate Track.
    *   Output: Score modification + Log (Explanation).
3.  **Engine**: Coordinator.
    *   Applies all rules to all candidates.
    *   Ranks by final score.
    *   Returns top recommendation with explanation trace.
4.  **Interface**: Visualizes tracks, current context, and the "Why" behind recommendations.

## Completed Tasks
- [x] Define Music Data Model & Basic Rules
- [x] Represent a YouTube video as a playable music track (Data update)

## Current Task: Implement Playback & Advanced Rules
**Status**: In Progress
**Objective**: Enable music playback and implement "Discovery Mode".

### Specification 1: Data Model (Frozen)
A `Track` consists of:
*   `id`: string (YouTube Video ID)
*   `title`, `channel`: string
*   `tags`: string[]
*   `duration`: number (seconds)
*   `derived`: `genre`, `energy`, `tempo`

### Specification 2: Attribute Derivation Rules (Frozen)
*   **Genre**: Keyword match (Lofi, Rock, Pop, etc.)
*   **Energy**: Low (chill/sleep), High (rock/workout), else Medium.
*   **Tempo**: Derived from Energy + Duration.

### Specification 3: Standard Recommendation Rules (Frozen)
*   **Time of Day**: Morning (Medium +10, High -5), Work (High +10, Med +5), Evening (Low +10, High -10).
*   **Anti-Repetition**: IF track.id == last_played.id -> -999 pts.
*   **Genre Continuity**: IF track.genre == last_played.genre -> +5 pts.

### Specification 4: Discovery Mode (New)
*   **Definition**: A user-toggled mode to encourage artist variety.
*   **Rule**:
    *   IF `Discovery Mode` is ON
    *   AND `track.channel` == `last_played.channel`
    *   THEN Penalize (-30 pts).
    *   Log: "Penalty: Artist repetition in Discovery Mode".

### Specification 5: Playback Interface (New)
*   **Mechanism**: Use YouTube IFrame Embed API.
*   **Behavior**:
    *   When a track is selected, replace the "Now Playing" card with an embedded video player.
    *   Auto-play should be enabled (`autoplay=1`).
    *   The player must be sanitized for security.

## Planned Tasks
- [ ] Add "Mood Match" feature where user selects current mood (Happy, Sad, Focused).
- [ ] Visualize the rule weights dynamically.
