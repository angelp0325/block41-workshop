import db from "#db/client";
import bcrypt from "bcrypt";
import { createUser } from "#db/queries/users";
import { createPlaylist } from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { createTrack } from "#db/queries/tracks";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const passwordHash = await bcrypt.hash("password123", 10);
  const user1 = await createUser("alice", passwordHash);
  const user2 = await createUser("bob", passwordHash);

  for (let i = 1; i <= 10; i++) {
    await createTrack(`Track ${i}`, i * 50000);
  }

  const playlist1 = await createPlaylist(
    "Alice's Playlist",
    "Chill beats",
    user1.id
  );
  const playlist2 = await createPlaylist(
    "Bob's Playlist",
    "Workout mix",
    user2.id
  );

  for (let i = 1; i <= 5; i++) {
    await createPlaylistTrack(playlist1.id, i);
    await createPlaylistTrack(playlist2.id, i + 5);
  }
}
