import express from "express";
const router = express.Router();
export default router;

import { getTracks, getTrackById } from "#db/queries/tracks";
import db from "#db/client";
import requireUser from "#middleware/requireUser";

router.get("/", async (req, res) => {
  const tracks = await getTracks();
  res.send(tracks);
});

router.get("/:id", async (req, res) => {
  const track = await getTrackById(req.params.id);
  if (!track) return res.status(404).send("Track not found.");
  res.send(track);
});

router.get("/:id/playlists", requireUser, async (req, res) => {
  const sql = `
SELECT playlists.* FROM playlists
JOIN playlists_tracks ON playlists.id = playlists_tracks.playlist_id
WHERE playlists.user_id = $1 AND playlists_tracks.track_id = $2
`;
  const { rows } = await db.query(sql, [req.user.id, req.params.id]);
  if (rows.length === 0) return res.status(404).send("Not found");
  res.status(200).send(rows);
});
