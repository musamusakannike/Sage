/**
 * Seed script — inserts fake employees into MongoDB for demo/hackathon.
 * Run: npx ts-node -r tsconfig-paths/register src/scripts/seed-employees.ts
 *
 * Requires MONGODB_URI in server/.env (already set).
 * Seeds employees under the first hr_admin org found in the database.
 */

import mongoose, { Types } from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGODB_URI;
if (!MONGO_URI) {
  console.error('MONGODB_URI not set in .env');
  process.exit(1);
}

const LAGOS_LOCATIONS = [
  'Mushin, Lagos', 'Ikeja, Lagos', 'Surulere, Lagos',
  'Victoria Island, Lagos', 'Lekki, Lagos', 'Yaba, Lagos',
  'Apapa, Lagos', 'Agege, Lagos',
];

function randomLocation() {
  return LAGOS_LOCATIONS[Math.floor(Math.random() * LAGOS_LOCATIONS.length)];
}

function statusFromScore(score: number): string {
  if (score < 40) return 'FROZEN';
  if (score < 70) return 'REVIEW';
  return 'CLEAR';
}

const FAKE_EMPLOYEES = [
  // ── FROZEN (dnaScore < 40) ────────────────────────────────────────────────
  { name: 'Chukwuemeka Obi',    roleTitle: 'Senior Accountant',     dnaScore: 12, accountNumber: '3041234567', phone: '+2348011110001', email: 'c.obi@gov.ng'        },
  { name: 'Fatimah Al-Hassan',  roleTitle: 'Records Officer',       dnaScore: 17, accountNumber: '3041234568', phone: '+2348011110002', email: null                   },
  { name: 'Emmanuel Kalu',      roleTitle: 'Data Entry Clerk',      dnaScore: 22, accountNumber: '3041234569', phone: '+2348011110003', email: null                   },
  { name: 'Liam Anderson',      roleTitle: 'Records Officer',       dnaScore: 28, accountNumber: '3041234570', phone: '+2348011110004', email: null                   },
  { name: 'Maya Thompson',      roleTitle: 'Data Analyst',          dnaScore: 28, accountNumber: '3041234571', phone: '+2348011110005', email: null                   },
  { name: 'Kevin Adams',        roleTitle: 'Project Manager',       dnaScore: 28, accountNumber: '3041234572', phone: '+2348011110006', email: null                   },
  { name: 'Ngozi Adeyemi',      roleTitle: 'Administrative Officer', dnaScore: 34, accountNumber: '3041234573', phone: '+2348011110007', email: null                  },
  { name: 'Bashir Musa',        roleTitle: 'Revenue Collector',     dnaScore: 38, accountNumber: '3041234574', phone: '+2348011110008', email: null                   },
  // ── REVIEW (40 ≤ dnaScore < 70) ──────────────────────────────────────────
  { name: 'Jessica Allen',      roleTitle: 'UX Designer',           dnaScore: 44, accountNumber: '3041234575', phone: '+2348011110009', email: null                   },
  { name: 'Ravi Kumar',         roleTitle: 'Software Engineer',     dnaScore: 52, accountNumber: '3041234576', phone: '+2348011110010', email: null                   },
  { name: 'Amaka Eze',          roleTitle: 'Budget Analyst',        dnaScore: 55, accountNumber: '3041234577', phone: '+2348011110011', email: 'a.eze@gov.ng'         },
  { name: 'Tunde Bakare',       roleTitle: 'Supply Chain Officer',  dnaScore: 60, accountNumber: '3041234578', phone: '+2348011110012', email: null                   },
  { name: 'Ijeoma Nwosu',       roleTitle: 'Human Resources',       dnaScore: 63, accountNumber: '3041234579', phone: '+2348011110013', email: null                   },
  { name: 'Samuel Adebayo',     roleTitle: 'Audit Officer',         dnaScore: 67, accountNumber: '3041234580', phone: '+2348011110014', email: null                   },
  // ── CLEAR (70 ≤ dnaScore < 80) ───────────────────────────────────────────
  { name: 'Nina Patel',         roleTitle: 'Marketing Specialist',  dnaScore: 71, accountNumber: '3041234581', phone: '+2348011110015', email: null                   },
  { name: 'Samuel Lee',         roleTitle: 'Sales Associate',       dnaScore: 74, accountNumber: '3041234582', phone: '+2348011110016', email: null                   },
  { name: 'Tina Chen',          roleTitle: 'Customer Support',      dnaScore: 76, accountNumber: '3041234583', phone: '+2348011110017', email: null                   },
  { name: 'Peter Brown',        roleTitle: 'Financial Analyst',     dnaScore: 77, accountNumber: '3041234584', phone: '+2348011110018', email: null                   },
  { name: 'Chiamaka Okafor',    roleTitle: 'IT Officer',            dnaScore: 79, accountNumber: '3041234585', phone: '+2348011110019', email: 'c.okafor@gov.ng'      },
  { name: 'Hakeem Lawal',       roleTitle: 'Procurement Officer',   dnaScore: 79, accountNumber: '3041234586', phone: '+2348011110020', email: null                   },
];

async function seed() {
  await mongoose.connect(MONGO_URI as string);
  console.log('Connected to MongoDB');

  const usersCol = mongoose.connection.collection('users');
  const admin = await usersCol.findOne({ role: { $in: ['hr_admin', 'HR_ADMIN'] } });

  if (!admin) {
    console.error('No hr_admin found. Create one first:\n  POST /auth/seed-admin\n  { name, email, password, orgName, role: "hr_admin" }');
    await mongoose.disconnect();
    process.exit(1);
  }

  const orgId = admin.orgId ?? admin._id;
  console.log(`Seeding for org: ${orgId}  (admin: ${admin.name as string})`);

  const employeesCol = mongoose.connection.collection('employees');
  const now = new Date();

  let inserted = 0;
  let skipped = 0;

  for (const emp of FAKE_EMPLOYEES) {
    const exists = await employeesCol.findOne({ phone: emp.phone });
    if (exists) {
      console.log(`  skip (duplicate phone): ${emp.name}`);
      skipped++;
      continue;
    }

    await employeesCol.insertOne({
      orgId:          new Types.ObjectId(orgId as string),
      name:           emp.name,
      roleTitle:      emp.roleTitle,
      accountNumber:  emp.accountNumber,
      phone:          emp.phone,
      email:          emp.email,
      dnaScore:       emp.dnaScore,
      status:         statusFromScore(emp.dnaScore),
      pushToken:      null,
      lastVerifiedAt: now,
      deletedAt:      false,
      createdAt:      now,
      updatedAt:      now,
      _location:      randomLocation(),
    });
    console.log(`  inserted: ${emp.name}  (DNA ${emp.dnaScore} → ${statusFromScore(emp.dnaScore)})`);
    inserted++;
  }

  console.log(`\nDone. Inserted: ${inserted}  Skipped: ${skipped}`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
