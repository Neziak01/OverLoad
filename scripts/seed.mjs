import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Parse .env.local
const envContent = readFileSync(resolve(__dirname, '../.env.local'), 'utf-8');
const match = envContent.match(/MONGODB_URI\s*=\s*"?([^"\n]+)"?/);
if (!match) { console.error('❌ MONGODB_URI non trouvé dans .env.local'); process.exit(1); }
const MONGODB_URI = match[1].trim().replace(/^"(.*)"$/, '$1');

const client = new MongoClient(MONGODB_URI);
const d = (y, m, day) => new Date(y, m - 1, day);

// ── Musculation ──────────────────────────────────────────────────────────────
const muscu = [
  { date: d(2026,4,1),  exercices: [{ nom: 'Développé couché', series: [{repetitions:10,poids:80},{repetitions:8,poids:85},{repetitions:6,poids:87.5}] }, { nom: 'Squat barre', series: [{repetitions:10,poids:100},{repetitions:8,poids:110},{repetitions:6,poids:115}] }], notes: 'Push day — bonne séance' },
  { date: d(2026,4,3),  exercices: [{ nom: 'Tractions', series: [{repetitions:8},{repetitions:7},{repetitions:6}] }, { nom: 'Rowing barre', series: [{repetitions:10,poids:70},{repetitions:10,poids:70}] }], notes: 'Pull day' },
  { date: d(2026,4,7),  exercices: [{ nom: 'Développé militaire', series: [{repetitions:10,poids:55},{repetitions:8,poids:60},{repetitions:6,poids:62.5}] }, { nom: 'Curl biceps', series: [{repetitions:12,poids:20},{repetitions:10,poids:22}] }] },
  { date: d(2026,4,10), exercices: [{ nom: 'Développé couché', series: [{repetitions:10,poids:82.5},{repetitions:8,poids:87.5},{repetitions:6,poids:90}] }, { nom: 'Pec Deck', series: [{repetitions:12,poids:60},{repetitions:12,poids:60}] }], notes: 'Chest focus' },
  { date: d(2026,4,14), exercices: [{ nom: 'Deadlift', series: [{repetitions:5,poids:140},{repetitions:5,poids:150},{repetitions:3,poids:160}] }], notes: 'PR attempt — 160 kg !' },
  { date: d(2026,4,17), exercices: [{ nom: 'Squat barre', series: [{repetitions:10,poids:100},{repetitions:8,poids:112.5}] }, { nom: 'Leg press', series: [{repetitions:12,poids:200},{repetitions:10,poids:220}] }] },
  { date: d(2026,4,21), exercices: [{ nom: 'Développé couché', series: [{repetitions:10,poids:82.5},{repetitions:8,poids:87.5}] }, { nom: 'Dips', series: [{repetitions:12},{repetitions:10},{repetitions:8}] }] },
  { date: d(2026,4,24), exercices: [{ nom: 'Tractions', series: [{repetitions:10},{repetitions:8},{repetitions:7}] }, { nom: 'Tirage vertical', series: [{repetitions:12,poids:70},{repetitions:10,poids:75}] }], notes: 'Bon volume' },
  { date: d(2026,4,28), exercices: [{ nom: 'Développé militaire', series: [{repetitions:10,poids:57.5},{repetitions:8,poids:62.5},{repetitions:6,poids:65}] }] },
  { date: d(2026,5,2),  exercices: [{ nom: 'Développé couché', series: [{repetitions:10,poids:85},{repetitions:8,poids:90},{repetitions:5,poids:95}] }, { nom: 'Squat barre', series: [{repetitions:10,poids:105},{repetitions:8,poids:115}] }], notes: 'Belle progression' },
  { date: d(2026,5,5),  exercices: [{ nom: 'Deadlift', series: [{repetitions:5,poids:145},{repetitions:5,poids:155}] }, { nom: 'Tractions', series: [{repetitions:10},{repetitions:8}] }] },
  { date: d(2026,5,8),  exercices: [{ nom: 'Développé militaire', series: [{repetitions:10,poids:60},{repetitions:8,poids:65}] }, { nom: 'Curl biceps', series: [{repetitions:12,poids:22},{repetitions:10,poids:24}] }], notes: 'Bras & épaules' },
  { date: d(2026,5,12), exercices: [{ nom: 'Développé couché', series: [{repetitions:10,poids:85},{repetitions:8,poids:92.5}] }, { nom: 'Dips', series: [{repetitions:15},{repetitions:12},{repetitions:10}] }] },
];

// ── Padel ────────────────────────────────────────────────────────────────────
const padel = [
  { type: 'training',    date: d(2026,4,2),  duration: 90,  location: 'Club Padel Paris 15',    level: 'Intermédiaire', score: '6-3, 6-4',      notes: 'Bon match, belle défense' },
  { type: 'training',    date: d(2026,4,6),  duration: 120, location: 'Padel Indoor Montrouge', level: 'Intermédiaire', score: '4-6, 7-5, 6-3' },
  { type: 'tournament',  date: d(2026,4,13), duration: 240, location: 'Club Sport 75',           tournamentLevel: 'P100', result: '1/4 de finale', notes: 'Bonne performance en tournoi' },
  { type: 'training',    date: d(2026,4,16), duration: 90,  location: 'Padel Indoor Montrouge', level: 'Intermédiaire', score: '6-1, 6-2',      notes: 'Domination totale' },
  { type: 'training',    date: d(2026,4,22), duration: 90,  location: 'Club Padel Paris 15',    level: 'Avancé',        score: '3-6, 6-4, 6-6' },
  { type: 'training',    date: d(2026,4,27), duration: 90,  location: 'Padel Indoor Montrouge', level: 'Intermédiaire', score: '6-4, 6-3' },
  { type: 'tournament',  date: d(2026,5,4),  duration: 300, location: 'Roland Garros Padel',    tournamentLevel: 'P250', result: 'Demi-finale',  notes: 'Super tournoi !' },
  { type: 'training',    date: d(2026,5,9),  duration: 90,  location: 'Club Padel Paris 15',    level: 'Avancé',        score: '5-7, 6-4, 7-5', notes: 'Match serré' },
  { type: 'training',    date: d(2026,5,11), duration: 60,  location: 'Padel Indoor Montrouge', level: 'Intermédiaire', score: '6-2, 6-1' },
];

// ── Course ───────────────────────────────────────────────────────────────────
const course = [
  { date: d(2026,4,4),  distance: 8.2,  duree: 42, notes: 'Footing matinal' },
  { date: d(2026,4,9),  distance: 12.5, duree: 65, notes: 'Sortie longue du dimanche' },
  { date: d(2026,4,15), distance: 5,    duree: 25, notes: 'Fractionné 5×1 km' },
  { date: d(2026,4,19), distance: 10,   duree: 52, notes: 'Tempo run' },
  { date: d(2026,4,26), distance: 15,   duree: 82, notes: 'Longue sortie pré-compétition' },
  { date: d(2026,5,1),  distance: 6,    duree: 30, notes: 'Récupération active' },
  { date: d(2026,5,6),  distance: 10.1, duree: 51, notes: 'Course sous la pluie !' },
  { date: d(2026,5,10), distance: 8,    duree: 40, notes: 'Sortie tranquille' },
];

// ── Natation ─────────────────────────────────────────────────────────────────
const natation = [
  { date: d(2026,4,5),  nages: [{type:'crawl',distance:1000},{type:'brasse',distance:400}],  notes: '1400 m total' },
  { date: d(2026,4,11), nages: [{type:'crawl',distance:1500}],                               notes: 'Focus crawl' },
  { date: d(2026,4,18), nages: [{type:'crawl',distance:800},{type:'dos',distance:400},{type:'brasse',distance:400}], notes: '1600 m varié' },
  { date: d(2026,4,25), nages: [{type:'4nages',distance:400},{type:'crawl',distance:1000}],  notes: 'Technique 4 nages' },
  { date: d(2026,5,3),  nages: [{type:'crawl',distance:2000}],                               notes: 'Effort continu 2 km' },
  { date: d(2026,5,7),  nages: [{type:'crawl',distance:1000},{type:'papillon',distance:200},{type:'brasse',distance:400}], notes: 'Travail papillon' },
  { date: d(2026,5,11), nages: [{type:'crawl',distance:1200},{type:'dos',distance:600}],     notes: 'Bonne séance dos' },
];

async function main() {
  try {
    await client.connect();
    console.log('✅ Connecté à MongoDB Atlas');
    const db = client.db();

    // Clear collections
    await Promise.all([
      db.collection('musculationactivities').deleteMany({}),
      db.collection('padelactivities').deleteMany({}),
      db.collection('courseactivities').deleteMany({}),
      db.collection('natationactivities').deleteMany({}),
    ]);
    console.log('🗑️  Collections vidées');

    // Insert
    await db.collection('musculationactivities').insertMany(muscu);
    await db.collection('padelactivities').insertMany(padel);
    await db.collection('courseactivities').insertMany(course);
    await db.collection('natationactivities').insertMany(natation);

    console.log(`✅ ${muscu.length} séances muscu`);
    console.log(`✅ ${padel.length} sessions padel`);
    console.log(`✅ ${course.length} sorties course`);
    console.log(`✅ ${natation.length} séances natation`);
    console.log('🎉 Seed terminé !');
  } catch (err) {
    console.error('❌ Erreur:', err.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
