// To run this script, use: npm run seed
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, getDocs, query, doc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { config } from 'dotenv';
import { TEST_ACCOUNTS } from '../src/lib/constants';

config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const checklistTemplates = [
  {
    id: 'ladder_v1',
    workType: '사다리 작업',
    version: 1,
    items: [
      { id: 'item1', text: '사다리가 안정적인 표면에 설치되었습니까?', required: true },
      { id: 'item2', text: '사다리에 손상이나 결함이 없습니까?', required: true },
      { id: 'item3', text: '작업 반경 내에 전선 등 위험요소가 없습니까?', required: true },
      { id: 'item4', text: '미끄럼 방지 조치(아웃트리거, 고정장치)가 되어 있습니까?', required: true },
    ],
  },
  {
    id: 'platform_v1',
    workType: '고소작업대 작업',
    version: 1,
    items: [
      { id: 'item1', text: '작업 전 장비 점검을 실시했습니까?', required: true },
      { id: 'item2', text: '안전대, 안전모 등 개인보호구를 착용했습니까?', required: true },
      { id: 'item3', text: '작업 구역에 접근 통제 조치가 되어 있습니까?', required: true },
      { id: 'item4', text: '작업대의 최대 하중을 준수합니까?', required: true },
    ],
  },
  {
    id: 'confined_space_v1',
    workType: '밀폐공간 작업',
    version: 1,
    items: [
      { id: 'item1', text: '작업 전 산소 및 유해가스 농도를 측정했습니까?', required: true },
      { id: 'item2', text: '환기 장치가 정상적으로 작동합니까?', required: true },
      { id: 'item3', text: '감시인 및 비상 연락 체계가 마련되었습니까?', required: true },
      { id: 'item4', text: '작업자는 관련 안전 교육을 이수했습니까?', required: true },
    ],
  },
];

async function seedChecklistTemplates() {
  const templatesCollection = collection(db, 'checklist_templates');
  const existingTemplates = await getDocs(query(templatesCollection));

  if (!existingTemplates.empty) {
    console.log('Checklist templates already exist. Deleting old ones.');
    const deleteBatch = writeBatch(db);
    existingTemplates.docs.forEach(doc => deleteBatch.delete(doc.ref));
    await deleteBatch.commit();
    console.log('Old templates deleted.');
  }
  
  const batch = writeBatch(db);
  checklistTemplates.forEach(template => {
    const docRef = doc(db, 'checklist_templates', template.id);
    batch.set(docRef, template);
  });
  await batch.commit();
  console.log('Successfully seeded checklist templates.');
}

async function seedUsers() {
    const usersCollection = collection(db, 'users');
    const batch = writeBatch(db);
  
    for (const role in TEST_ACCOUNTS) {
      const account = TEST_ACCOUNTS[role as keyof typeof TEST_ACCOUNTS];
      console.log(`Processing user: ${account.email}`);
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, account.email, account.password);
        const user = userCredential.user;
        console.log(`Created auth user: ${user.uid}`);
        
        const userDocRef = doc(db, 'users', user.uid);
        batch.set(userDocRef, {
            id: user.uid,
            name: account.name,
            email: account.email,
            role: role,
        });
        console.log(`Added user ${account.name} to Firestore batch.`);
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          console.log(`User ${account.email} already exists in Auth. Skipping auth creation.`);
        } else {
          console.error(`Error creating user ${account.email}:`, error.message);
        }
      }
    }
  
    try {
      await batch.commit();
      console.log('Successfully seeded user profiles in Firestore.');
    } catch (error) {
      console.error('Error committing user profiles to Firestore:', error);
    }
}
  

async function main() {
  console.log('Starting database seeding...');
  await seedChecklistTemplates();
  console.log('---');
  console.log('Seeding test users. NOTE: This will create users in Firebase Auth.');
  console.log('If users already exist, only their Firestore profiles will be updated.');
  await seedUsers();
  console.log('---');
  console.log('Seeding complete.');
  // Force exit because the Firebase connection keeps the script alive.
  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
