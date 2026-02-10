import Database from "better-sqlite3";
import { app } from "electron";
import path from "node:path";

// ─── Inicialização do banco ─────────────────────────────────
// Salva o .db na pasta de dados do usuario:
// Linux:   ~/.config/game-tracker/games.db
// Windows: %APPDATA%/game-tracker/games.db
// macOS:   ~/Library/Application Support/game-tracker/games.db

const dbPath = path.join(app.getPath("userData"), "games.db");
const db = new Database(dbPath);

// WAL mode — melhor performance para leitura/escrita concorrente
db.pragma("journal_mode = WAL");

// Cria a tabela se não existir
db.exec(`
  CREATE TABLE IF NOT EXISTS games (
    id            TEXT PRIMARY KEY,
    name          TEXT NOT NULL,
    image         TEXT,
    bannerImage   TEXT,
    rating        REAL DEFAULT 0,
    dateFinished  TEXT
  )
`);

// ─── Tipos ──────────────────────────────────────────────────

interface GameRow {
  id: string;
  name: string;
  image: string | null;
  bannerImage: string | null;
  rating: number;
  dateFinished: string | null;
}

// ─── CRUD ───────────────────────────────────────────────────

export const getAllGames = (): GameRow[] => {
  return db.prepare("SELECT * FROM games").all() as GameRow[];
};

export const addGame = (game: GameRow): GameRow => {
  db.prepare(`
    INSERT INTO games (id, name, image, bannerImage, rating, dateFinished)
    VALUES (@id, @name, @image, @bannerImage, @rating, @dateFinished)
  `).run(game);
  return game;
};

export const deleteGame = (id: string): void => {
  db.prepare("DELETE FROM games WHERE id = ?").run(id);
};

export const updateGame = (game: GameRow): void => {
  db.prepare(`
    UPDATE games SET
      name = @name,
      image = @image,
      bannerImage = @bannerImage,
      rating = @rating,
      dateFinished = @dateFinished
    WHERE id = @id
  `).run(game);
};
